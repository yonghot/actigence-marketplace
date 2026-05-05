/**
 * PII 가드레일 모듈
 *
 * MCP 서버 input에 가해자(임대인)·사용자 본인 식별 정보가 포함되지 않도록
 * 다중 레이어 정규식 검증과 sanitize 처리를 수행한다.
 *
 * 컴플라이언스 원칙:
 * - 가해자 식별 정보(이름·주소·전화·사업자번호·주민번호) 절대 처리 X
 * - 사용자 본인 식별 정보 절대 처리 X
 * - 의심 패턴 발견 시 명시적 에러 반환 (silent strip 금지)
 */
/**
 * 한국 PII 패턴 정규식
 *
 * 각 패턴은 가능한 false positive를 최소화하면서 false negative를 0에 가깝게 유지하는 것을 목표로 한다.
 * "10년" 같은 일반 표현이 잘못 매칭되지 않도록 boundary와 컨텍스트를 좁혔다.
 */
export declare const PII_PATTERNS: Array<{
    name: string;
    pattern: RegExp;
    severity: 'critical' | 'high' | 'medium';
}>;
export interface PIIDetectionResult {
    detected: boolean;
    patterns: Array<{
        name: string;
        matches: string[];
        severity: string;
    }>;
    highest_severity: 'none' | 'medium' | 'high' | 'critical';
}
/**
 * 입력 문자열에서 PII 패턴을 검출한다.
 * critical 또는 high severity가 있으면 detected=true.
 * medium은 경고만 (예: 이메일은 도구 input에 들어올 일 거의 없지만 들어오면 경고).
 */
export declare function detectPII(input: string): PIIDetectionResult;
/**
 * 입력 객체에서 알려진 PII 필드를 sanitize한다.
 *
 * 주의: 이 함수는 detectPII와 별개로 작동한다.
 * - detectPII는 input에 PII가 포함되었는지 검사하여 거부 응답을 반환할지 결정
 * - sanitizeInput은 enum이 아닌 추가 필드(자유 텍스트 필드 등)를 강제 제거
 *
 * MCP 도구의 input은 enum만 허용하므로, 정상 호출에는 sanitize가 noop이어야 한다.
 * Claude가 실수로 자유 텍스트 필드를 추가했을 때만 작동한다.
 */
export declare function sanitizeInput(args: Record<string, unknown>): Record<string, unknown>;
/**
 * 출력 문자열에서 PII를 마스킹한다.
 * 주로 응답 직전 검증용 (현재 구조에서는 도구 응답이 정형 enum/숫자만 포함하므로 사용 빈도 낮음).
 */
export declare function maskPII(text: string): string;
