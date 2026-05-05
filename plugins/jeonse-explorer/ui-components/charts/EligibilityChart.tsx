/**
 * EligibilityChart.tsx
 *
 * 전세사기특별법 인정 가능성 분포 도넛 차트.
 *
 * 컴플라이언스:
 * - 라벨에 "예상", "예측" 단어 0건
 * - "유사 사건군의 분포" 표현만 사용
 * - 표본 크기·출처 자동 표시 (상위 컴포넌트에서)
 */

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface EligibilityData {
  high_likelihood_pct: number;
  additional_review_pct: number;
  low_likelihood_pct: number;
  requirement_scores: {
    priority_right: number;
    deposit_limit: number;
    objective_loss: number;
    bad_faith_intent: number;
  };
  sample_size: number;
  source: string;
}

interface Props {
  data: EligibilityData;
}

// 컬러 팔레트 — 차분한 슬레이트·블루 톤 (불안 자극 회피)
const COLORS = {
  high: '#3b82f6',        // blue-500
  additional: '#94a3b8',  // slate-400
  low: '#cbd5e1',         // slate-300
};

export const EligibilityChart: React.FC<Props> = ({ data }) => {
  const chartData = [
    {
      name: '4가지 요건 충족 가능성 높음',
      value: data.high_likelihood_pct,
      fill: COLORS.high,
    },
    {
      name: '1~2개 요건 추가 확인 필요',
      value: data.additional_review_pct,
      fill: COLORS.additional,
    },
    {
      name: '요건 미충족 가능성 높음',
      value: data.low_likelihood_pct,
      fill: COLORS.low,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 도넛 차트 */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value.toFixed(1)}%`}
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                iconType="square"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 4가지 요건 점수 */}
        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
          <h4 className="text-xs font-semibold text-slate-600 mb-2">
            4가지 요건별 점수 (입력 변수 기반)
          </h4>
          <RequirementBar
            label="① 권리관계 (전입·확정일자 등)"
            score={data.requirement_scores.priority_right}
          />
          <RequirementBar
            label="② 보증금 한도 (5억/지역별 7억 이하)"
            score={data.requirement_scores.deposit_limit}
          />
          <RequirementBar
            label="③ 객관적 손실 (경공매·다수 피해)"
            score={data.requirement_scores.objective_loss}
          />
          <RequirementBar
            label="④ 이행 의도 의심 (수사·다수 주택)"
            score={data.requirement_scores.bad_faith_intent}
          />
          <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">
            ※ 4가지 요건 점수는 입력 변수와 특별법 제3조 조문의 매핑 결과입니다.
            실제 인정은 전세사기피해자지원위원회의 심의로 결정됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

const RequirementBar: React.FC<{ label: string; score: number }> = ({ label, score }) => {
  const pct = Math.round(score * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-600 font-mono tabular-nums">{pct}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default EligibilityChart;
