/**
 * Supabase 클라이언트 모듈
 *
 * 정적 데이터(법령 조문·양형기준·공개 판례·국토부 통계) 조회용.
 * 사용자 입력·결과는 절대 저장하지 않음 (Stateless 원칙).
 *
 * 환경변수가 없으면 fallback 모드로 작동하여 로컬 JSON 시드 데이터 사용.
 * (개발·시연 환경에서 Supabase 없이도 동작 가능)
 */
/**
 * 사기죄 양형기준 조회
 */
export declare function getSentencingGuidelines(crimeType: 'general' | 'organized', typeNumber: number): Promise<any>;
/**
 * 전세사기특별법 조문 조회
 */
export declare function getSpecialActArticles(category?: string): Promise<any[]>;
/**
 * 국토부 월간 통계 조회
 */
export declare function getMolitStatistics(): Promise<any>;
/**
 * 공개 판례 분포 조회 (양형 분포 계산용)
 */
export declare function getPublicCases(filter: {
    crime_type: 'general' | 'organized';
    damage_min: number;
    damage_max: number;
}): Promise<any[]>;
export declare function isFallbackMode(): boolean;
