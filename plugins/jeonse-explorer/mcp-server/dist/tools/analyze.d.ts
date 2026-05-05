/**
 * analyze_jeonse_fraud_distribution 도구 핸들러
 *
 * 사용자 입력 7변수를 받아 3개 분포(특별법 적용·회수·양형)를 계산하여 반환.
 * Output에는 disclaimer와 official_resources가 const로 강제 포함됨.
 */
import { z } from 'zod';
export declare const analyzeInputSchema: z.ZodObject<{
    deposit_range: z.ZodEnum<["under_50m", "50m_to_100m", "100m_to_300m", "300m_to_500m", "over_500m"]>;
    priority_right: z.ZodEnum<["full_protection", "registration_only", "lease_registration", "jeonse_right", "none"]>;
    landlord_property_count: z.ZodEnum<["one", "two_to_ten", "ten_to_hundred", "over_hundred", "unknown"]>;
    auction_status: z.ZodEnum<["in_progress", "decided", "applied", "not_started"]>;
    investigation_status: z.ZodEnum<["indicted", "investigating", "complaint_filed", "no_complaint", "unknown"]>;
    victim_count: z.ZodEnum<["self_only", "two_to_ten", "ten_to_hundred", "over_hundred", "unknown"]>;
    region: z.ZodEnum<["seoul", "busan", "daegu", "incheon", "gwangju", "daejeon", "ulsan", "sejong", "gyeonggi", "gangwon", "chungbuk", "chungnam", "jeonbuk", "jeonnam", "gyeongbuk", "gyeongnam", "jeju"]>;
}, "strip", z.ZodTypeAny, {
    deposit_range: "under_50m" | "50m_to_100m" | "100m_to_300m" | "300m_to_500m" | "over_500m";
    priority_right: "full_protection" | "registration_only" | "lease_registration" | "jeonse_right" | "none";
    landlord_property_count: "one" | "two_to_ten" | "ten_to_hundred" | "over_hundred" | "unknown";
    auction_status: "in_progress" | "decided" | "applied" | "not_started";
    investigation_status: "unknown" | "indicted" | "investigating" | "complaint_filed" | "no_complaint";
    victim_count: "two_to_ten" | "ten_to_hundred" | "over_hundred" | "unknown" | "self_only";
    region: "seoul" | "busan" | "daegu" | "incheon" | "gwangju" | "daejeon" | "ulsan" | "sejong" | "gyeonggi" | "gangwon" | "chungbuk" | "chungnam" | "jeonbuk" | "jeonnam" | "gyeongbuk" | "gyeongnam" | "jeju";
}, {
    deposit_range: "under_50m" | "50m_to_100m" | "100m_to_300m" | "300m_to_500m" | "over_500m";
    priority_right: "full_protection" | "registration_only" | "lease_registration" | "jeonse_right" | "none";
    landlord_property_count: "one" | "two_to_ten" | "ten_to_hundred" | "over_hundred" | "unknown";
    auction_status: "in_progress" | "decided" | "applied" | "not_started";
    investigation_status: "unknown" | "indicted" | "investigating" | "complaint_filed" | "no_complaint";
    victim_count: "two_to_ten" | "ten_to_hundred" | "over_hundred" | "unknown" | "self_only";
    region: "seoul" | "busan" | "daegu" | "incheon" | "gwangju" | "daejeon" | "ulsan" | "sejong" | "gyeonggi" | "gangwon" | "chungbuk" | "chungnam" | "jeonbuk" | "jeonnam" | "gyeongbuk" | "gyeongnam" | "jeju";
}>;
export type AnalyzeInput = z.infer<typeof analyzeInputSchema>;
export declare const analyzeInputJsonSchema: import("zod-to-json-schema").JsonSchema7Type & {
    $schema?: string | undefined;
    definitions?: {
        [key: string]: import("zod-to-json-schema").JsonSchema7Type;
    } | undefined;
};
export declare function analyzeJeonseFraudDistribution(input: AnalyzeInput): Promise<{
    disclaimer: string;
    eligibility_distribution: {
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
    };
    recovery_distribution: {
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
    };
    sentencing_distribution: {
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
    };
    official_resources: ({
        name: string;
        url: string;
        description: string;
        phone?: undefined;
    } | {
        name: string;
        url: string;
        phone: string;
        description: string;
    })[];
    ui_resource_uri: string;
    watermark_text: string;
    metadata: {
        analyzed_at: string;
        analysis_version: string;
        operator: string;
        compliance_doc: string;
        data_persisted: boolean;
        data_persistence_note: string;
    };
    presentation_guidelines: {
        forbidden_expressions: string[];
        required_actions: string[];
    };
}>;
