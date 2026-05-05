/**
 * 분포 계산 모듈
 *
 * 사용자 입력 7변수를 기반으로 다음 3개 분포를 산출한다:
 * 1. Eligibility Distribution — 전세사기특별법 인정 가능성 분포
 * 2. Recovery Distribution — 보증금 회수 가능성 분포
 * 3. Sentencing Distribution — 가해자 양형 분포
 *
 * 컴플라이언스 핵심:
 * - 모든 분포는 "유사 사건군의 통계 분포"로만 표현
 * - 단정적 예측 X. 표본 크기·출처 항상 명시
 * - 표본 < 30건이면 'low_sample' 플래그로 신뢰도 경고
 */
export type DepositRange = 'under_50m' | '50m_to_100m' | '100m_to_300m' | '300m_to_500m' | 'over_500m';
export type PriorityRight = 'full_protection' | 'registration_only' | 'lease_registration' | 'jeonse_right' | 'none';
export type LandlordPropertyCount = 'one' | 'two_to_ten' | 'ten_to_hundred' | 'over_hundred' | 'unknown';
export type AuctionStatus = 'in_progress' | 'decided' | 'applied' | 'not_started';
export type InvestigationStatus = 'indicted' | 'investigating' | 'complaint_filed' | 'no_complaint' | 'unknown';
export type VictimCount = 'self_only' | 'two_to_ten' | 'ten_to_hundred' | 'over_hundred' | 'unknown';
export type Region = 'seoul' | 'busan' | 'daegu' | 'incheon' | 'gwangju' | 'daejeon' | 'ulsan' | 'sejong' | 'gyeonggi' | 'gangwon' | 'chungbuk' | 'chungnam' | 'jeonbuk' | 'jeonnam' | 'gyeongbuk' | 'gyeongnam' | 'jeju';
export interface AnalysisInput {
    deposit_range: DepositRange;
    priority_right: PriorityRight;
    landlord_property_count: LandlordPropertyCount;
    auction_status: AuctionStatus;
    investigation_status: InvestigationStatus;
    victim_count: VictimCount;
    region: Region;
}
/**
 * 1. 특별법 적용 분포
 *
 * 전세사기특별법 제3조 4가지 인정 요건 충족 가능성을 분포로 산출.
 * 국토부 가결률 통계(2025.12 기준 누적 가결률 약 62.9%)를 베이스라인으로 한다.
 *
 * 4가지 요건:
 * (1) 우선변제권·임차권등기·전세권 중 하나
 * (2) 보증금 5억 이하 (지역별 7억까지 조정 가능)
 * (3) 2인 이상 피해 또는 경공매 개시 등 객관적 손실 발생
 * (4) 임대인의 이행하지 않을 의도 의심 (수사·다수 주택·기망 등)
 */
export declare function calculateEligibilityDistribution(input: AnalysisInput): Promise<{
    high_likelihood_pct: number;
    additional_review_pct: number;
    low_likelihood_pct: number;
    requirement_scores: {
        priority_right: number;
        deposit_limit: number;
        objective_loss: number;
        bad_faith_intent: number;
    };
    sample_size: any;
    source: string;
    source_url: string;
}>;
/**
 * 보증금 회수 가능성 분포
 *
 * 시나리오:
 * - 우선변제권 + 경공매 진행 중 → 배당 회수율 ~60-80%
 * - 우선변제권 없음 → 일반 채권자, 회수율 ~0-20%
 * - 빌라왕 사건 (100채+) + 후순위 → 회수율 ~15-30%
 * - LH 매입 가능 → 회수율 ~50-70%
 * - 임차권등기 + LH 미해당 → 회수율 ~30-50%
 */
export declare function calculateRecoveryDistribution(input: AnalysisInput): Promise<{
    buckets: {
        range: string;
        label: string;
        percentage: number;
    }[];
    median_recovery_pct: number;
    lh_eligibility: boolean;
    sample_size: number;
    sample_size_note: string;
    source: string;
    confidence: string;
    confidence_note: string;
}>;
/**
 * 양형 분포
 *
 * 사기죄 양형기준 5유형(이득액 기준):
 * - 1유형: 1억 미만 → 6개월~1년 6개월 (기본)
 * - 2유형: 1억~5억 → 1년~4년
 * - 3유형: 5억~50억 (특경법) → 3년 이상
 * - 4유형: 50억~300억 (특경법) → 4년~7년
 * - 5유형: 300억+ (특경법) → 6년 이상~무기
 *
 * 조직적 사기 분류: 빌라왕 등 100채+ AND 100명+ 피해자
 */
export declare function calculateSentencingDistribution(input: AnalysisInput): Promise<{
    buckets: ({
        range: string;
        label: string;
        percentage: number;
        min_months?: undefined;
        max_months?: undefined;
    } | {
        range: string;
        label: string;
        min_months: number;
        max_months: number;
        percentage: number;
    })[];
    median_sentence_months: number;
    applied_guideline: string;
    fraud_type: "general" | "organized";
    damage_estimate_range: string;
    sample_size: number;
    low_sample: boolean;
    low_sample_note: string | null;
    source: string;
    source_url: string;
}>;
