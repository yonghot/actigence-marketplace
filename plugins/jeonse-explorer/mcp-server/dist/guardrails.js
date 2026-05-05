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
export const PII_PATTERNS = [
    // 주민번호 (13자리, 6-7 형태)
    {
        name: 'resident_registration_number',
        pattern: /\b\d{6}[-\s]?[1-4]\d{6}\b/g,
        severity: 'critical',
    },
    // 휴대폰 번호 (010/011/016/017/018/019)
    {
        name: 'mobile_phone',
        pattern: /\b01[016789][-\s]?\d{3,4}[-\s]?\d{4}\b/g,
        severity: 'critical',
    },
    // 유선 전화 (지역번호 02/031~064)
    {
        name: 'landline_phone',
        pattern: /\b0(?:2|[3-6][1-4])[-\s]?\d{3,4}[-\s]?\d{4}\b/g,
        severity: 'high',
    },
    // 사업자등록번호 (10자리, 3-2-5 형태)
    {
        name: 'business_registration_number',
        pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{5}\b/g,
        severity: 'high',
    },
    // 이메일 주소
    {
        name: 'email',
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
        severity: 'medium',
    },
    // 가해자 이름 패턴 ("OOO 임대인", "OOO 소유자" 등 호칭과 함께 등장)
    {
        name: 'landlord_name_with_title',
        pattern: /[가-힣]{2,4}\s+(?:임대인|소유자|피고인|가해자|집주인)/g,
        severity: 'high',
    },
    // 부동산 상세 주소 (도로명·지번 형태)
    {
        name: 'detailed_address',
        pattern: /[가-힣]+(?:로|길|동)\s*\d+(?:-\d+)?(?:번지)?/g,
        severity: 'medium',
    },
    // 계좌번호 (다양한 형태, 5자리 이상 연속 숫자 + 하이픈)
    {
        name: 'bank_account',
        pattern: /\b\d{3,6}[-\s]\d{2,6}[-\s]\d{6,}\b/g,
        severity: 'high',
    },
];
/**
 * 입력 문자열에서 PII 패턴을 검출한다.
 * critical 또는 high severity가 있으면 detected=true.
 * medium은 경고만 (예: 이메일은 도구 input에 들어올 일 거의 없지만 들어오면 경고).
 */
export function detectPII(input) {
    const result = {
        detected: false,
        patterns: [],
        highest_severity: 'none',
    };
    if (!input || typeof input !== 'string') {
        return result;
    }
    const severityRank = { none: 0, medium: 1, high: 2, critical: 3 };
    for (const { name, pattern, severity } of PII_PATTERNS) {
        const matches = input.match(pattern);
        if (matches && matches.length > 0) {
            result.patterns.push({ name, matches: [...new Set(matches)], severity });
            if (severityRank[severity] > severityRank[result.highest_severity]) {
                result.highest_severity = severity;
            }
            // critical 또는 high면 detected
            if (severity === 'critical' || severity === 'high') {
                result.detected = true;
            }
        }
    }
    return result;
}
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
export function sanitizeInput(args) {
    // 허용된 input 키 목록 (analyze + lawSummary 통합)
    const ALLOWED_KEYS = new Set([
        // analyze_jeonse_fraud_distribution
        'deposit_range',
        'priority_right',
        'landlord_property_count',
        'auction_status',
        'investigation_status',
        'victim_count',
        'region',
        // get_jeonse_fraud_law_summary
        'category',
    ]);
    // 알려진 PII 키 (Claude가 잘못 넣을 수 있는 필드)
    const FORBIDDEN_KEYS = new Set([
        'landlord_name',
        'landlord_address',
        'landlord_phone',
        'landlord_business_number',
        'tenant_name',
        'tenant_phone',
        'tenant_email',
        'name',
        'address',
        'phone',
        'description',
        'notes',
        'detail',
        'context',
        'free_text',
    ]);
    const sanitized = {};
    for (const [key, value] of Object.entries(args)) {
        if (FORBIDDEN_KEYS.has(key)) {
            // 알려진 PII 필드는 silent drop. 단, detectPII가 먼저 잡아야 정상 흐름.
            console.warn(`[guardrails] forbidden key dropped: ${key}`);
            continue;
        }
        if (!ALLOWED_KEYS.has(key)) {
            // 정의되지 않은 필드도 drop. enum-only 원칙.
            console.warn(`[guardrails] unknown key dropped: ${key}`);
            continue;
        }
        sanitized[key] = value;
    }
    return sanitized;
}
/**
 * 출력 문자열에서 PII를 마스킹한다.
 * 주로 응답 직전 검증용 (현재 구조에서는 도구 응답이 정형 enum/숫자만 포함하므로 사용 빈도 낮음).
 */
export function maskPII(text) {
    let masked = text;
    for (const { pattern } of PII_PATTERNS) {
        masked = masked.replace(pattern, '[REDACTED]');
    }
    return masked;
}
//# sourceMappingURL=guardrails.js.map