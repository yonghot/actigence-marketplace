/**
 * JeonseResultCard.tsx
 *
 * Claude App UI 컴포넌트의 메인 결과 카드.
 * MCP 도구 응답을 받아 3개 차트 + 면책 + 워터마크 + 공식 기관 안내를 렌더링.
 *
 * 시각적 강제 요소:
 * - 상단 면책 배너 (sticky)
 * - 차트 배경 워터마크 (반투명)
 * - 표본 크기·출처 자동 표시
 * - 변호사·로펌 링크 0개
 * - "예상", "예측" 단어 사용 0건
 */

import React from 'react';
import { DisclaimerBanner } from './DisclaimerBanner';
import { Watermark } from './Watermark';
import { EligibilityChart } from './charts/EligibilityChart';
import { RecoveryChart } from './charts/RecoveryChart';
import { SentencingChart } from './charts/SentencingChart';

interface OfficialResource {
  name: string;
  url: string;
  phone?: string;
  description?: string;
}

interface AnalysisResult {
  disclaimer: string;
  eligibility_distribution: any;
  recovery_distribution: any;
  sentencing_distribution: any;
  official_resources: OfficialResource[];
  watermark_text: string;
  metadata?: {
    analyzed_at: string;
    operator: string;
    data_persisted: boolean;
  };
}

interface Props {
  data: AnalysisResult;
}

export const JeonseResultCard: React.FC<Props> = ({ data }) => {
  return (
    <div className="jeonse-result-card relative max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* 워터마크 — 모든 차트 영역 배경 */}
      <Watermark text={data.watermark_text} />

      {/* 1. 상단 면책 배너 (sticky) */}
      <DisclaimerBanner text={data.disclaimer} />

      {/* 2. 헤더 */}
      <header className="relative z-10 px-6 pt-6 pb-4 border-b border-slate-100">
        <h1 className="text-xl font-semibold text-slate-800">
          유사 사건군 분포 분석 결과
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          입력하신 객관적 변수에 해당하는 공개 판례·정부 통계 분포입니다.
        </p>
      </header>

      {/* 3. 분포 차트 3개 */}
      <div className="relative z-10 px-6 py-6 space-y-8">

        <section aria-labelledby="eligibility-title">
          <h2 id="eligibility-title" className="text-base font-semibold text-slate-700 mb-3">
            ① 전세사기특별법 적용 분포
          </h2>
          <EligibilityChart data={data.eligibility_distribution} />
          <SourceNote
            sampleSize={data.eligibility_distribution.sample_size}
            source={data.eligibility_distribution.source}
          />
        </section>

        <section aria-labelledby="recovery-title">
          <h2 id="recovery-title" className="text-base font-semibold text-slate-700 mb-3">
            ② 보증금 회수 가능성 분포
          </h2>
          <RecoveryChart data={data.recovery_distribution} />
          <SourceNote
            sampleSize={data.recovery_distribution.sample_size}
            source={data.recovery_distribution.source}
            confidence={data.recovery_distribution.confidence}
          />
        </section>

        <section aria-labelledby="sentencing-title">
          <h2 id="sentencing-title" className="text-base font-semibold text-slate-700 mb-3">
            ③ 가해자 양형 분포
          </h2>
          <SentencingChart data={data.sentencing_distribution} />
          <SourceNote
            sampleSize={data.sentencing_distribution.sample_size}
            source={data.sentencing_distribution.source}
          />
          {data.sentencing_distribution.low_sample && (
            <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
              {data.sentencing_distribution.low_sample_note}
            </div>
          )}
        </section>
      </div>

      {/* 4. 공식 지원 기관 안내 (변호사·로펌 0개) */}
      <footer className="relative z-10 bg-slate-50 px-6 py-5 border-t border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          📌 공식 지원 기관
        </h3>
        <ul className="space-y-2 text-sm">
          {data.official_resources.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-slate-400">·</span>
              <div>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-800 hover:text-blue-600 font-medium"
                >
                  {r.name}
                </a>
                {r.phone && <span className="text-slate-500 ml-2">📞 {r.phone}</span>}
                {r.description && <span className="text-slate-500 ml-2 text-xs">— {r.description}</span>}
              </div>
            </li>
          ))}
        </ul>

        {/* 5. 최종 면책 + 운영 정보 */}
        <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
          <p>
            ⚠️ 본 결과는 공개 판례·법령 통계 분석 결과이며, 법률 자문이나 사건 결과 예측이 아닙니다.
          </p>
          <p>
            🛡️ 모든 입력 데이터는 분석 직후 메모리에서 폐기되었습니다 (Stateless 원칙).
          </p>
          <p className="pt-1">
            운영: <strong>ACTIGENCE</strong> (변호사 미소속 데이터 분석 회사) ·
            문의: cio@actigence.ai ·
            정책:{' '}
            <a
              href="https://github.com/yonghot/actigence-marketplace/blob/main/plugins/jeonse-explorer/COMPLIANCE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-600"
            >
              COMPLIANCE.md
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

const SourceNote: React.FC<{ sampleSize: number; source: string; confidence?: string }> = ({
  sampleSize, source, confidence,
}) => (
  <p className="text-xs text-slate-500 mt-2 flex flex-wrap gap-x-3 gap-y-1">
    <span>표본: <strong>n={sampleSize.toLocaleString('ko-KR')}</strong></span>
    {confidence && <span>신뢰도: <strong>{confidence}</strong></span>}
    <span>출처: {source}</span>
  </p>
);

export default JeonseResultCard;
