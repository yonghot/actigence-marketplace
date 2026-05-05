/**
 * Supabase 클라이언트 모듈
 *
 * 정적 데이터(법령 조문·양형기준·공개 판례·국토부 통계) 조회용.
 * 사용자 입력·결과는 절대 저장하지 않음 (Stateless 원칙).
 *
 * 환경변수가 없으면 fallback 모드로 작동하여 로컬 JSON 시드 데이터 사용.
 * (개발·시연 환경에서 Supabase 없이도 동작 가능)
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_SERVICE_KEY;

let client: SupabaseClient | null = null;
let fallbackMode = false;

if (SUPABASE_URL && SUPABASE_KEY) {
  client = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });
  console.log('[supabase] connected');
} else {
  fallbackMode = true;
  console.warn('[supabase] SUPABASE_URL or KEY missing — running in fallback mode (local JSON only)');
}

/**
 * 로컬 JSON 시드 데이터 캐시
 */
const dataCache: Record<string, unknown> = {};

function loadLocalData<T>(filename: string): T {
  if (dataCache[filename]) {
    return dataCache[filename] as T;
  }
  const filepath = resolve(__dirname, '../data', filename);
  const content = readFileSync(filepath, 'utf-8');
  const parsed = JSON.parse(content) as T;
  dataCache[filename] = parsed;
  return parsed;
}

/**
 * 사기죄 양형기준 조회
 */
export async function getSentencingGuidelines(crimeType: 'general' | 'organized', typeNumber: number) {
  if (client && !fallbackMode) {
    const { data, error } = await client
      .from('sentencing_guidelines')
      .select('*')
      .eq('crime_type', crimeType)
      .eq('type_number', typeNumber)
      .single();

    if (!error && data) return data;
  }

  // Fallback: 로컬 JSON
  const guidelines = loadLocalData<{ guidelines: any[] }>('sentencing-guidelines.json');
  return guidelines.guidelines.find(
    (g) => g.crime_type === crimeType && g.type_number === typeNumber
  );
}

/**
 * 전세사기특별법 조문 조회
 */
export async function getSpecialActArticles(category?: string) {
  if (client && !fallbackMode) {
    const query = client.from('law_articles').select('*').eq('law_name', '전세사기특별법');
    if (category) query.eq('category', category);
    const { data, error } = await query;
    if (!error && data) return data;
  }

  const data = loadLocalData<{ articles: any[] }>('special-act.json');
  if (category) {
    return data.articles.filter((a) => a.category === category);
  }
  return data.articles;
}

/**
 * 국토부 월간 통계 조회
 */
export async function getMolitStatistics() {
  if (client && !fallbackMode) {
    const { data, error } = await client
      .from('molit_statistics')
      .select('*')
      .order('period_end', { ascending: false })
      .limit(1)
      .single();
    if (!error && data) return data;
  }

  const data = loadLocalData<{ latest: any; cumulative: any }>('molit-statistics.json');
  return data.cumulative;
}

/**
 * 공개 판례 분포 조회 (양형 분포 계산용)
 */
export async function getPublicCases(filter: {
  crime_type: 'general' | 'organized';
  damage_min: number;
  damage_max: number;
}) {
  if (client && !fallbackMode) {
    const { data, error } = await client
      .from('public_cases')
      .select('sentence_months, is_suspended, suspension_period')
      .eq('fraud_type', filter.crime_type)
      .gte('damage_amount', filter.damage_min)
      .lte('damage_amount', filter.damage_max);
    if (!error && data) return data;
  }

  const data = loadLocalData<{ cases: any[] }>('sample-cases.json');
  return data.cases.filter(
    (c) =>
      c.fraud_type === filter.crime_type &&
      c.damage_amount >= filter.damage_min &&
      c.damage_amount <= filter.damage_max
  );
}

export function isFallbackMode(): boolean {
  return fallbackMode;
}
