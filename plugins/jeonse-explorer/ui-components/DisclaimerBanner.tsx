/**
 * DisclaimerBanner.tsx
 *
 * 모든 결과 페이지·UI 카드 상단에 강제 노출되는 면책 배너.
 * 컴플라이언스 자가 검증 스크립트가 이 컴포넌트의 사용 여부를 검사한다.
 */

import React from 'react';

interface Props {
  text?: string;
}

const DEFAULT_TEXT =
  '본 도구는 공개 판례·법령 통계 분석 도구이며, 법률 자문이나 사건 결과 예측이 아닙니다. ACTIGENCE에는 변호사가 소속되어 있지 않습니다.';

export const DisclaimerBanner: React.FC<Props> = ({ text = DEFAULT_TEXT }) => {
  return (
    <div
      role="alert"
      aria-label="법적 면책 안내"
      className="relative z-20 bg-amber-50 border-b-2 border-amber-300 px-4 py-2.5"
    >
      <div className="flex items-start gap-2 max-w-4xl mx-auto">
        <span className="text-amber-600 text-base shrink-0" aria-hidden="true">
          ⚠️
        </span>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
