/**
 * ACTIGENCE Jeonse Explorer MCP Server
 *
 * 공개 판례·정부 통계 기반 전세사기 분포 분석 백엔드.
 *
 * 컴플라이언스 핵심 원칙:
 * 1. Stateless - 사용자 입력·결과 영구 저장 X
 * 2. Public data only - 케이스노트·엘박스 등 유료 DB 사용 X
 * 3. No sentence prediction - 단정 결과 출력 X, 분포만 반환
 * 4. PII guardrail - 가해자·사용자 식별 정보 input에서 강제 차단
 * 5. Disclaimer enforcement - 모든 응답에 면책 문구 강제 포함
 *
 * @license MIT
 * @author ACTIGENCE <cio@actigence.ai>
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import cors from 'cors';
import { analyzeJeonseFraudDistribution, analyzeInputSchema, analyzeInputJsonSchema } from './tools/analyze.js';
import { getJeonseFraudLawSummary, lawSummaryInputSchema, lawSummaryInputJsonSchema } from './tools/lawSummary.js';
import { detectPII, sanitizeInput } from './guardrails.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';
import { z } from 'zod';

const PORT = parseInt(process.env.MCP_PORT ?? '3001', 10);
const BASE_URL = process.env.MCP_BASE_URL ?? `http://localhost:${PORT}`;

// ═══════════════════════════════════════════════════════════════
// MCP Server 인스턴스 생성
// ═══════════════════════════════════════════════════════════════

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
// 도구 목록 정의
// ═══════════════════════════════════════════════════════════════

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'analyze_jeonse_fraud_distribution',
      description: `전세사기 피해 또는 예비 임차인의 상황에 대해 공개 판례·정부 통계를 기반으로 한
유사 사건군의 분포 통계를 반환합니다.

⚠️ 본 도구는 법률 자문, 사건 결과 예측, 양형 예측 도구가 아닙니다.
이 도구는 단지 사용자가 입력한 객관적 변수와 유사한 공개 데이터의 분포를 보여줍니다.

도구 응답을 사용자에게 전달할 때 다음 규칙을 절대적으로 지켜주세요:

1. "예상", "예측", "진단", "추천" 단어 사용 금지
2. "당신은 ~입니다", "~할 것입니다" 같은 단정 표현 사용 금지
3. "유사 사건군 X% 가 ~", "표본 N건 중 ~" 형태의 분포 표현만 사용
4. 변호사·로펌 추천·매칭 절대 금지. 공공 지원 기관(국토부 전세사기피해자지원센터,
   대한법률구조공단)만 안내
5. 사용자가 자유 서술로 입력한 사건 내용은 절대 도구의 input에 그대로 넣지 말고,
   반드시 enum 값으로 매핑하여 호출
6. 도구가 반환하는 disclaimer 필드를 사용자에게 반드시 함께 표시할 것
7. 도구 결과는 Claude App UI 컴포넌트로 자동 렌더링되므로, 텍스트로 차트 데이터를
   다시 묘사하지 말 것

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
      description: `전세사기특별법, 사기죄 양형기준, 우선변제권 등 법령·제도 자체에 대한
공식 출처 기반 요약을 반환합니다.

본 도구는 일반 법령 정보 제공 전용이며, 특정 사건의 결과를 단정하지 않습니다.

응답에 항상 출처(국가법령정보센터, 대법원 양형위원회 등)와 면책 문구가 포함됩니다.`,
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
// 도구 호출 핸들러
// ═══════════════════════════════════════════════════════════════

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // 1. PII 가드레일 - 입력에 가해자/사용자 식별 정보가 포함되었는지 검사
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

  // 2. 입력 sanitize - 알려진 식별 정보 패턴 강제 제거
  const sanitized = sanitizeInput(args ?? {});

  // 3. 도구별 핸들러 디스패치
  try {
    switch (name) {
      case 'analyze_jeonse_fraud_distribution': {
        const parsed = analyzeInputSchema.parse(sanitized);
        const result = await analyzeJeonseFraudDistribution(parsed);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'get_jeonse_fraud_law_summary': {
        const parsed = lawSummaryInputSchema.parse(sanitized);
        const result = await getJeonseFraudLawSummary(parsed);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
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
              message: '입력 변수가 enum 값에 맞지 않습니다. 자유 서술 입력은 지원되지 않으며 정해진 enum 값만 허용됩니다.',
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
// HTTP 서버 (Streamable HTTP transport)
// ═══════════════════════════════════════════════════════════════

const app = express();

app.use(cors({
  origin: '*',  // Anthropic 클라우드에서 접속
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(rateLimitMiddleware);

// MCP 표준 엔드포인트
app.all('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,  // stateless - 세션 미사용
    enableJsonResponse: true,
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// 헬스체크
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'actigence-jeonse-explorer',
    version: '1.0.0',
    compliance: {
      stateless: true,
      pii_guardrail: process.env.ENABLE_PII_GUARDRAIL === 'true',
      operates_by_non_lawyers: true,
    },
  });
});

// 컴플라이언스 정책 노출 (등록 검수용)
app.get('/.well-known/compliance.json', (_req, res) => {
  res.json({
    operator: 'ACTIGENCE',
    operator_type: 'non-lawyer',
    purpose: 'Public data analysis tool — distribution statistics only',
    not_provided: [
      'Legal advice',
      'Sentence prediction',
      'Lawyer matching/recommendation',
      'Document drafting (complaint, lawsuit, etc.)',
    ],
    data_sources: [
      'Korean Supreme Court — sentencing guidelines (public PDF)',
      'Ministry of Land, Infrastructure and Transport — monthly statistics',
      'National Law Information Center — statutes',
      'Korean Supreme Court — published judgments (public)',
    ],
    pii_handling: 'Strictly blocked at input level (regex + enum enforcement)',
    contact: 'cio@actigence.ai',
    compliance_doc_url: 'https://github.com/yonghot/actigence-marketplace/blob/main/plugins/jeonse-explorer/COMPLIANCE.md',
  });
});

// 글로벌 에러 핸들러
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[MCP Server Error]', err);
  res.status(500).json({
    error: 'internal_error',
    message: 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`✅ ACTIGENCE Jeonse Explorer MCP Server`);
  console.log(`   Listening on ${BASE_URL}/mcp`);
  console.log(`   Health: ${BASE_URL}/health`);
  console.log(`   Compliance: ${BASE_URL}/.well-known/compliance.json`);
  console.log(`   Stateless: true | PII Guardrail: ${process.env.ENABLE_PII_GUARDRAIL ?? 'true'}`);
});
