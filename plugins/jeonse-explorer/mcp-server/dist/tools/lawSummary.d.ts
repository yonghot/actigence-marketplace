/**
 * get_jeonse_fraud_law_summary 도구 핸들러
 *
 * 전세사기 관련 법령·제도에 대한 공식 출처 기반 요약 제공.
 * 법률 자문이 아닌 일반 정보 전달 전용.
 *
 * 카테고리:
 * - law_overview: 전세사기특별법 개요
 * - eligibility_requirements: 인정 요건 4가지
 * - recovery_options: 회수 메커니즘 (우선변제권·임차권등기·전세권·LH 매입)
 * - sentencing_guidelines: 사기죄 양형기준 5유형
 * - procedure_guide: 피해자 결정신청 절차
 */
import { z } from 'zod';
export declare const lawSummaryInputSchema: z.ZodObject<{
    category: z.ZodEnum<["law_overview", "eligibility_requirements", "recovery_options", "sentencing_guidelines", "procedure_guide"]>;
}, "strip", z.ZodTypeAny, {
    category: "sentencing_guidelines" | "law_overview" | "eligibility_requirements" | "recovery_options" | "procedure_guide";
}, {
    category: "sentencing_guidelines" | "law_overview" | "eligibility_requirements" | "recovery_options" | "procedure_guide";
}>;
export type LawSummaryInput = z.infer<typeof lawSummaryInputSchema>;
export declare const lawSummaryInputJsonSchema: import("zod-to-json-schema").JsonSchema7Type & {
    $schema?: string | undefined;
    definitions?: {
        [key: string]: import("zod-to-json-schema").JsonSchema7Type;
    } | undefined;
};
export declare function getJeonseFraudLawSummary(input: LawSummaryInput): Promise<{
    disclaimer: string;
    category: "sentencing_guidelines" | "law_overview" | "eligibility_requirements" | "recovery_options" | "procedure_guide";
    title: string;
    summary: string;
    key_points: string[];
    articles_referenced: any[];
    official_resources: ({
        name: string;
        url: string;
        phone?: undefined;
    } | {
        name: string;
        url: string;
        phone: string;
    })[];
    sources: {
        name: string;
        url: string;
    }[];
    last_verified: string;
    presentation_guidelines: {
        forbidden_expressions: string[];
    };
}>;
