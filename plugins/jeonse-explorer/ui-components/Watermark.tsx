/**
 * Watermark.tsx
 *
 * 결과 카드 배경에 반투명 대각선 워터마크를 자동 삽입.
 * 사용자가 캡처·스크린샷·PDF 변환해도 살아남도록 SVG 패턴으로 구현.
 *
 * 컴플라이언스 핵심:
 * - 모든 분석 결과 UI에 강제 적용
 * - "법률 자문 아님" 표현 항상 포함
 * - 텍스트는 const로 강제, 사용자 입력으로 변경 불가
 */

import React from 'react';

const FORCED_WATERMARK_TEXT = '법률 자문 아님 · 데이터 분석 도구 · ACTIGENCE';

interface Props {
  text?: string;  // 무시됨. 강제 const 사용.
}

export const Watermark: React.FC<Props> = () => {
  // 사용자가 prop으로 다른 텍스트를 넘겨도 강제 const 사용 (가드레일)
  const text = FORCED_WATERMARK_TEXT;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="actigence-watermark-pattern"
            width="380"
            height="120"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-25)"
          >
            <text
              x="0"
              y="60"
              fill="rgba(100, 116, 139, 0.08)"
              fontSize="13"
              fontFamily="Pretendard, -apple-system, BlinkMacSystemFont, sans-serif"
              fontWeight="600"
              letterSpacing="1"
            >
              {text}
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#actigence-watermark-pattern)" />
      </svg>
    </div>
  );
};

export default Watermark;
