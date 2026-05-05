-- ═══════════════════════════════════════════════════════════════
-- ACTIGENCE Jeonse Explorer — Initial Schema Migration
-- ═══════════════════════════════════════════════════════════════
--
-- 본 마이그레이션은 정적 데이터(법령·양형기준·공개 판례·국토부 통계)만 저장한다.
-- 사용자 입력·결과는 절대 저장하지 않는다 (Stateless 원칙).
--
-- 실행 방법:
--   1) Supabase Dashboard > SQL Editor에 본 파일 내용을 붙여넣고 실행
--   2) 또는 Supabase CLI: supabase db push
--
-- 의존성:
--   - PostgreSQL 15+
--   - pgvector 확장 (RAG용 임베딩)
-- ═══════════════════════════════════════════════════════════════

-- pgvector 확장 활성화 (RAG 임베딩용)
CREATE EXTENSION IF NOT EXISTS vector;

-- ═══════════════════════════════════════════════════════════════
-- 1. law_articles — 법령 조문 (전세사기특별법 + 관련 법)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS law_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  law_name TEXT NOT NULL,
  short_name TEXT,
  article_number TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'law_overview',
    'eligibility_requirements',
    'recovery_options',
    'sentencing_guidelines',
    'procedure_guide'
  )),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  embedding VECTOR(1536),
  source_url TEXT NOT NULL,
  effective_date DATE NOT NULL,
  expiry_date DATE,
  last_verified DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_law_articles_category ON law_articles(category);
CREATE INDEX IF NOT EXISTS idx_law_articles_law_name ON law_articles(law_name);
CREATE INDEX IF NOT EXISTS idx_law_articles_embedding
  ON law_articles USING hnsw (embedding vector_cosine_ops);

-- ═══════════════════════════════════════════════════════════════
-- 2. sentencing_guidelines — 사기죄 양형기준 5유형
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS sentencing_guidelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crime_type TEXT NOT NULL CHECK (crime_type IN ('general', 'organized')),
  type_number INT NOT NULL CHECK (type_number BETWEEN 1 AND 5),
  type_label TEXT NOT NULL,
  damage_min BIGINT NOT NULL,
  damage_max BIGINT,
  damage_label TEXT NOT NULL,
  mitigated_min_months INT NOT NULL,
  mitigated_max_months INT NOT NULL,
  base_min_months INT NOT NULL,
  base_max_months INT NOT NULL,
  aggravated_min_months INT NOT NULL,
  aggravated_max_months INT NOT NULL,
  suspension_typical BOOLEAN NOT NULL DEFAULT false,
  fine_alternative BOOLEAN NOT NULL DEFAULT false,
  applicable_law TEXT,
  source TEXT NOT NULL,
  source_url TEXT,
  last_verified DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(crime_type, type_number)
);

CREATE INDEX IF NOT EXISTS idx_sentencing_crime_type ON sentencing_guidelines(crime_type);
CREATE INDEX IF NOT EXISTS idx_sentencing_type_number ON sentencing_guidelines(type_number);
CREATE INDEX IF NOT EXISTS idx_sentencing_damage ON sentencing_guidelines(damage_min, damage_max);

-- ═══════════════════════════════════════════════════════════════
-- 3. public_cases — 공개 판례 (피고인·피해자 식별 정보 마스킹 완료)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT NOT NULL UNIQUE,
  court TEXT NOT NULL,
  date DATE NOT NULL,
  fraud_type TEXT NOT NULL CHECK (fraud_type IN ('general', 'organized')),
  damage_amount BIGINT NOT NULL,
  victim_count INT,
  sentence_months INT,
  is_suspended BOOLEAN NOT NULL DEFAULT false,
  suspension_period INT,
  applied_guideline TEXT,
  label TEXT,
  embedding VECTOR(1536),
  source_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT no_pii_in_label CHECK (
    label IS NULL OR (
      label !~ '\d{6}-\d{7}'              -- 주민번호 패턴 차단
      AND label !~ '01[016789]-?\d{4}'    -- 휴대폰 패턴 차단
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_cases_fraud_type ON public_cases(fraud_type);
CREATE INDEX IF NOT EXISTS idx_cases_damage ON public_cases(damage_amount);
CREATE INDEX IF NOT EXISTS idx_cases_date ON public_cases(date);
CREATE INDEX IF NOT EXISTS idx_cases_embedding
  ON public_cases USING hnsw (embedding vector_cosine_ops);

-- ═══════════════════════════════════════════════════════════════
-- 4. molit_statistics — 국토부 월간 통계
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS molit_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  approved_count INT NOT NULL,
  rejected_count INT NOT NULL,
  pending_count INT,
  total_applications INT,
  cumulative_total INT,
  approval_rate NUMERIC(5,4),
  source_url TEXT NOT NULL,
  is_cumulative BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(period_start, period_end, is_cumulative)
);

CREATE INDEX IF NOT EXISTS idx_molit_period ON molit_statistics(period_end DESC);

-- ═══════════════════════════════════════════════════════════════
-- 5. lh_acquisition_statistics — LH 피해주택 매입 통계
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS lh_acquisition_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period DATE NOT NULL UNIQUE,
  acquisition_count INT NOT NULL,
  cumulative_count INT NOT NULL,
  source_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lh_period ON lh_acquisition_statistics(period DESC);

-- ═══════════════════════════════════════════════════════════════
-- 6. RLS (Row Level Security) — 읽기 전용 공개 데이터
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE law_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentencing_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE molit_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lh_acquisition_statistics ENABLE ROW LEVEL SECURITY;

-- 모든 익명 사용자에게 SELECT 허용
CREATE POLICY "Public read access for law_articles"
  ON law_articles FOR SELECT TO anon USING (true);
CREATE POLICY "Public read access for sentencing_guidelines"
  ON sentencing_guidelines FOR SELECT TO anon USING (true);
CREATE POLICY "Public read access for public_cases"
  ON public_cases FOR SELECT TO anon USING (true);
CREATE POLICY "Public read access for molit_statistics"
  ON molit_statistics FOR SELECT TO anon USING (true);
CREATE POLICY "Public read access for lh_acquisition_statistics"
  ON lh_acquisition_statistics FOR SELECT TO anon USING (true);

-- service_role만 INSERT/UPDATE 가능 (관리자 적재용)
-- (anon 키로는 쓰기 불가 = 사용자 입력 저장 불가능 = Stateless 원칙 강제)

-- ═══════════════════════════════════════════════════════════════
-- 7. 사용자 입력 저장 차단 가드 (의도치 않은 테이블 생성 방지)
-- ═══════════════════════════════════════════════════════════════

-- 본 스키마에는 의도적으로 user_inputs, analysis_results, sessions 등의 테이블이 없다.
-- 누군가 나중에 이런 테이블을 추가하려 하면 코드 리뷰에서 컴플라이언스 위반으로 차단해야 한다.

COMMENT ON SCHEMA public IS
  'ACTIGENCE Jeonse Explorer — 정적 공개 데이터만 저장. 사용자 입력·결과 저장 금지 (Stateless 원칙).';
