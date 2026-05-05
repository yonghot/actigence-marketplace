#!/usr/bin/env node
/**
 * ACTIGENCE Jeonse Explorer MCP Server — stdio Variant
 *
 * Claude Cowork·Claude Desktop·Claude Code가 plugin을 인스톨하면 자동으로 이 파일을
 * 실행하여 stdio transport로 연결한다.
 *
 * HTTP 변형(index.ts)과 동일한 도구·가드레일을 제공하지만, 외부 인프라(Vercel·Supabase)
 * 없이도 동작하도록 fallback 모드의 로컬 JSON 시드 데이터만 사용한다.
 *
 * @license MIT
 * @author ACTIGENCE <cio@actigence.ai>
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { analyzeJeonseFraudDistribution, analyzeInputSchema, analyzeInputJsonSchema } from './tools/analyze.js';
import { getJeonseFraudLawSummary, lawSummaryInputSchema, lawSummaryInputJsonSchema } from './tools/lawSummary.js';
import { detectPII, sanitizeInput } from './guardrails.js';
import { z } from 'zod';

const server = new Server(
  {
    name: 'actigence-jeonse-explorer',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ═══════════════════════════════════════════════════════════════
// 도구 목록
// ═══════════════════════════════════════════════════════════════

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'analyze_jeonse_fraud_distribution',
      description: `전세사기 피해 또는 예비 임차인의 상황에 대해 공개 판례·정부 통계를 기반으로 한
유사 사건군의 분포 통계를 반환합니다.

⚠️ 본 도구는 법률 자문, 사건 결과 예측, 양형 예측 도구가 아닙니다.

도구 응답을 사용자에게 전달할 때 반드시 지켜주세요:
1. "예상", "예측", "진단", "추천" 단어 사용 금지
2. "당신은 ~입니다", "~할 것입니다" 단정 표현 사용 금지
3. "유사 사건군 X% 가 ~", "표본 N건 중 ~" 형태의 분포 표현만 사용
4. 변호사·로펌 추천·매칭 절대 금지. 공공 지원 기관만 안내
5. 사용자 자유 서술은 절대 input에 그대로 넣지 말고 enum 값으로 매핑
6. 도구가 반환하는 disclaimer 필드를 사용자에게 반드시 함께 표시

이 도구는 ACTIGENCE가 운영하는 공익 데이터 분석 도구이며, ACTIGENCE에는 변호사가
소속되어 있지 않습니다.`,
      inputSchema: analyzeInputJsonSchema as any,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    {
      name: 'get_jeonse_fraud_law_summary',
      description: `전세사기특별법, 사기죄 양형기준, 우선변제권 등 법령·제도에 대한 공식 출처 기반 요약.
일반 정보 제공 전용이며, 특정 사건의 결과를 단정하지 않습니다.`,
      inputSchema: lawSummaryInputJsonSchema as any,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
  ],
}));

// ═══════════════════════════════════════════════════════════════
// 도구 호출 핸들러 (HTTP 변형과 동일한 가드레일)
// ═══════════════════════════════════════════════════════════════

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // PII 가드레일
  const piiCheck = detectPII(JSON.stringify(args ?? {}));
  if (piiCheck.detected) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'pii_detected',
            message: '입력에 식별 정보(이름·전화번호·주민번호)가 포함되었습니다. 본 도구는 이를 처리하지 않습니다. 객관적 변수(보증금·우선변제권 등)만 입력해주세요.',
            detected_patterns: piiCheck.patterns,
          }),
        },
      ],
      isError: true,
    };
  }

  const sanitized = sanitizeInput(args ?? {});

  try {
    switch (name) {
      case 'analyze_jeonse_fraud_distribution': {
        const parsed = analyzeInputSchema.parse(sanitized);
        const result = await analyzeJeonseFraudDistribution(parsed);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }

      case 'get_jeonse_fraud_law_summary': {
        const parsed = lawSummaryInputSchema.parse(sanitized);
        const result = await getJeonseFraudLawSummary(parsed);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'validation_error',
              message: '입력 변수가 enum 값에 맞지 않습니다.',
              details: error.errors,
            }),
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'internal_error',
            message: error instanceof Error ? error.message : 'Unknown error',
          }),
        },
      ],
      isError: true,
    };
  }
});

// ═══════════════════════════════════════════════════════════════
// stdio Transport 시작
// ═══════════════════════════════════════════════════════════════

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stdio 모드는 stderr로만 로그 (stdout은 MCP 프로토콜 전용)
  process.stderr.write('[ACTIGENCE Jeonse Explorer] stdio MCP server started\n');
  process.stderr.write('[ACTIGENCE Jeonse Explorer] Compliance: stateless, PII guardrail enabled\n');
}

main().catch((err) => {
  process.stderr.write(`[ACTIGENCE Jeonse Explorer] Fatal error: ${err}\n`);
  process.exit(1);
});
