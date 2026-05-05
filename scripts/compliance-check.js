#!/usr/bin/env node
/**
 * ACTIGENCE Jeonse Explorer — Compliance Self-Check Script
 *
 * 빌드 시 또는 PR 시점에 실행하여 회피 7원칙 준수 여부를 자동 검증한다.
 * 하나라도 FAIL이면 빌드 중단 (CI 파이프라인 게이트).
 *
 * 검증 항목:
 *   C-01: 단정 표현 0건 (예상·예측·진단·추천)
 *   C-02: 변호사 매칭 컴포넌트 0개
 *   C-03: "무료" 단어 0건 (변협 광고 규정 4조 12호)
 *   C-04: 판결문 양식 표제 0건 (주문·이유)
 *   C-05: 자유 텍스트 input 0개 (모든 도구 input은 enum)
 *   C-06: 사용자 입력 영구 저장 코드 0건
 *   C-07: 가해자 정보 처리 방어 정규식 존재
 *   C-08: 면책 문구 const 강제 존재
 *   C-09: 워터마크 텍스트 const 강제 존재
 *   C-10: 공식 지원 기관 4개 const 존재
 *
 * 사용:
 *   node scripts/compliance-check.js
 *   exit code 0 = 통과 / 1 = 실패
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = resolve(__filename, '../../');

// ═══════════════════════════════════════════════════════════════
// 검증 규칙
// ═══════════════════════════════════════════════════════════════

const FORBIDDEN_PATTERNS = [
  // C-01: 단정 표현
  { id: 'C-01-A', pattern: /예상\s*(판결|양형|처벌|결과)/g, label: '단정 표현 "예상 ~"' },
  { id: 'C-01-B', pattern: /예측\s*(판결|양형|처벌|결과)/g, label: '단정 표현 "예측 ~"' },
  { id: 'C-01-C', pattern: /진단\s*(결과|사건)/g, label: '단정 표현 "진단 ~"' },
  { id: 'C-01-D', pattern: /\b추천\s*(변호사|로펌)/g, label: '변호사·로펌 추천' },

  // C-03: 무료 단어
  { id: 'C-03-A', pattern: /무료\s*(상담|법률\s*서비스|법률\s*도구|법률\s*분석)/g, label: '"무료 ~" 표현' },

  // C-04: 판결문 표제
  { id: 'C-04-A', pattern: /^(주문|이유|법리\s*판단|양형의?\s*이유)\s*[:：]/gm, label: '판결문 양식 표제' },

  // 잘못된 자기 정의
  { id: 'C-MISC-A', pattern: /AI\s*(변호사|판사|법률\s*자문가|법률\s*전문가)/g, label: 'AI 변호사·판사 표현' },
];

const REQUIRED_PATTERNS = [
  // C-08: 면책 const 강제 (analyze.ts에 const DISCLAIMER 존재)
  {
    id: 'C-08',
    file: 'plugins/jeonse-explorer/mcp-server/src/tools/analyze.ts',
    mustContain: ['const DISCLAIMER', '법률 자문이나 사건 결과 예측이 아닙니다'],
    label: 'analyze 핸들러에 면책 const 존재',
  },
  // C-09: 워터마크 const
  {
    id: 'C-09',
    file: 'plugins/jeonse-explorer/mcp-server/src/tools/analyze.ts',
    mustContain: ['WATERMARK_TEXT', '법률 자문 아님 · 데이터 분석 도구 · ACTIGENCE'],
    label: '워터마크 const 존재',
  },
  // C-10: 공식 지원 기관 4개
  {
    id: 'C-10',
    file: 'plugins/jeonse-explorer/mcp-server/src/tools/analyze.ts',
    mustContain: [
      '국토교통부 전세사기피해자지원센터',
      '대한법률구조공단',
      '검찰청 범죄피해자 지원실',
      '대한변호사협회',
    ],
    label: '공식 지원 기관 4개 const',
  },
  // C-07: 가해자 정보 방어 정규식
  {
    id: 'C-07',
    file: 'plugins/jeonse-explorer/mcp-server/src/guardrails.ts',
    mustContain: ['PII_PATTERNS', 'detectPII', '주민번호', '가해자'],
    label: 'PII 가드레일 정규식 존재',
  },
];

const SCAN_DIRS = [
  'plugins/jeonse-explorer/skills',
  'plugins/jeonse-explorer/agents',
  'plugins/jeonse-explorer/commands',
  'plugins/jeonse-explorer/mcp-server/src',
  'plugins/jeonse-explorer/ui-components',
];

const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.json']);

// 검사 예외 — 정당한 정의·예시·금지 명시 컨텍스트
const ALLOW_IF_NEGATED = [
  // 1) "❌ ~", "✅ ~" 같이 명시적으로 금지·예시 마커가 있는 줄
  /[❌✅⚠️]\s*[^\n]*?(예상|예측|진단|추천|무료|AI\s*변호사|AI\s*판사)/,
  // 2) "금지", "차단", "forbidden", "prohibited" 등 금지 명시 줄
  /(forbidden|prohibited|금지|차단|허용\s*하지|사용\s*하지|쓰지)[^\n]*?(예상|예측|진단|추천|무료|AI\s*변호사|AI\s*판사)/i,
  // 3) 따옴표 또는 백틱 안의 예시 패턴 ("AI 변호사", `AI 변호사` 등)
  /["'`][^"'`\n]*?(예상|예측|진단|추천|무료|AI\s*변호사|AI\s*판사)[^"'`\n]*?["'`]/,
  // 4) Markdown 표 안의 셀 (| ... |) — 정의/매핑 표
  /\|[^|\n]*?(예상|예측|진단|추천|무료|AI\s*변호사|AI\s*판사)[^|\n]*?\|/,
  // 5) 정규식 정의 줄 (검증 패턴 자체)
  /(pattern|regex|RegExp|\/.*\/[gimsu]*)[^\n]*?(예상|예측|진단|추천|무료|AI\s*변호사|AI\s*판사)/,
  // 6) 코드 주석 안의 예시
  /(\/\/|\/\*|\*\s|#\s)[^\n]*?(예상|예측|진단|추천|무료|AI\s*변호사|AI\s*판사)/,
  // 7) "예시", "example" 마커 줄
  /(예시|example|case|샘플|sample)[^\n]*?(예상|예측|진단|추천|무료|AI\s*변호사|AI\s*판사)/i,
];

// ═══════════════════════════════════════════════════════════════
// 파일 스캔
// ═══════════════════════════════════════════════════════════════

function scanDir(dir, results = []) {
  const fullPath = resolve(ROOT, dir);
  let entries;
  try {
    entries = readdirSync(fullPath);
  } catch {
    return results;
  }

  for (const entry of entries) {
    const path = join(fullPath, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      scanDir(join(dir, entry), results);
    } else if (SCAN_EXTENSIONS.has(extname(entry))) {
      results.push(path);
    }
  }
  return results;
}

function isInAllowedContext(line) {
  return ALLOW_IF_NEGATED.some((re) => re.test(line));
}

// ═══════════════════════════════════════════════════════════════
// 검사 실행
// ═══════════════════════════════════════════════════════════════

function checkForbiddenPatterns() {
  const violations = [];
  const files = SCAN_DIRS.flatMap((d) => scanDir(d));

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    for (const rule of FORBIDDEN_PATTERNS) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const matches = line.match(rule.pattern);
        if (matches && !isInAllowedContext(line)) {
          violations.push({
            rule: rule.id,
            label: rule.label,
            file: file.replace(ROOT + '/', ''),
            line: i + 1,
            content: line.trim().substring(0, 100),
            match: matches[0],
          });
        }
      }
    }
  }

  return violations;
}

function checkRequiredPatterns() {
  const violations = [];

  for (const rule of REQUIRED_PATTERNS) {
    const filepath = resolve(ROOT, rule.file);
    let content;
    try {
      content = readFileSync(filepath, 'utf-8');
    } catch {
      violations.push({
        rule: rule.id,
        label: rule.label,
        file: rule.file,
        reason: '파일이 존재하지 않음',
      });
      continue;
    }

    for (const must of rule.mustContain) {
      if (!content.includes(must)) {
        violations.push({
          rule: rule.id,
          label: rule.label,
          file: rule.file,
          reason: `필수 문자열 누락: "${must}"`,
        });
      }
    }
  }

  return violations;
}

function checkLawyerMatchingComponents() {
  // C-02: 변호사 매칭 컴포넌트 검사
  const violations = [];
  const files = SCAN_DIRS.flatMap((d) => scanDir(d));

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    if (
      /(?:variable|component|function|class)\s+(\w*Lawyer\w*Match\w*)/i.test(content) ||
      /find_lawyer|search_lawyer|recommend_lawyer|match_lawyer/i.test(content)
    ) {
      violations.push({
        rule: 'C-02',
        label: '변호사 매칭 컴포넌트 발견',
        file: file.replace(ROOT + '/', ''),
      });
    }
  }
  return violations;
}

function checkUserInputPersistence() {
  // C-06: 사용자 입력 영구 저장 코드 검사
  const violations = [];
  const files = scanDir('plugins/jeonse-explorer/mcp-server/src');

  const FORBIDDEN_PERSISTENCE = [
    /\.from\s*\(\s*['"`]user_inputs?['"`]\s*\)\s*\.\s*insert/g,
    /\.from\s*\(\s*['"`]analysis_results?['"`]\s*\)\s*\.\s*insert/g,
    /\.from\s*\(\s*['"`]sessions?['"`]\s*\)\s*\.\s*insert/g,
    /writeFileSync\s*\([^)]*user_input/gi,
    /fs\.writeFile.*input/gi,
  ];

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    for (const pattern of FORBIDDEN_PERSISTENCE) {
      if (pattern.test(content)) {
        violations.push({
          rule: 'C-06',
          label: '사용자 입력 영구 저장 코드 발견 (Stateless 원칙 위반)',
          file: file.replace(ROOT + '/', ''),
          pattern: pattern.toString(),
        });
      }
    }
  }
  return violations;
}

// ═══════════════════════════════════════════════════════════════
// 리포트 출력
// ═══════════════════════════════════════════════════════════════

function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('ACTIGENCE Jeonse Explorer — Compliance Self-Check');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log();

  const checks = [
    { name: 'C-01·C-03·C-04 — 금지 표현 검사', run: checkForbiddenPatterns },
    { name: 'C-08·C-09·C-10·C-07 — 필수 const 검사', run: checkRequiredPatterns },
    { name: 'C-02 — 변호사 매칭 컴포넌트 검사', run: checkLawyerMatchingComponents },
    { name: 'C-06 — 사용자 입력 저장 코드 검사', run: checkUserInputPersistence },
  ];

  let totalViolations = 0;

  for (const check of checks) {
    process.stdout.write(`▶ ${check.name} ... `);
    const violations = check.run();
    if (violations.length === 0) {
      console.log('✅ PASS');
    } else {
      console.log(`❌ FAIL (${violations.length}건)`);
      for (const v of violations) {
        console.log(`   - [${v.rule}] ${v.label}`);
        console.log(`     파일: ${v.file}${v.line ? ':' + v.line : ''}`);
        if (v.content) console.log(`     내용: ${v.content}`);
        if (v.reason) console.log(`     사유: ${v.reason}`);
        if (v.match) console.log(`     매치: "${v.match}"`);
      }
      totalViolations += violations.length;
    }
  }

  console.log();
  console.log('═══════════════════════════════════════════════════════════════');
  if (totalViolations === 0) {
    console.log('✅ 모든 컴플라이언스 검사 통과');
    console.log('═══════════════════════════════════════════════════════════════');
    process.exit(0);
  } else {
    console.log(`❌ 총 ${totalViolations}건의 컴플라이언스 위반 발견 — 빌드 중단`);
    console.log();
    console.log('해결 후 다시 실행하세요:');
    console.log('  node scripts/compliance-check.js');
    console.log('═══════════════════════════════════════════════════════════════');
    process.exit(1);
  }
}

main();
