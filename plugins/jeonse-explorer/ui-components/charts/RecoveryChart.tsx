/**
 * RecoveryChart.tsx
 *
 * 보증금 회수 가능성 분포 히스토그램.
 * 우선변제권 × 경공매 × LH 매입 매트릭스로 산출된 4구간 분포 표시.
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface RecoveryData {
  buckets: Array<{
    range: string;
    label: string;
    percentage: number;
  }>;
  median_recovery_pct: number;
  lh_eligibility: boolean;
  sample_size: number;
  source: string;
  confidence: string;
}

interface Props {
  data: RecoveryData;
}

const COLORS = ['#cbd5e1', '#94a3b8', '#60a5fa', '#3b82f6'];

export const RecoveryChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-3">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.buckets}
            margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="range"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)}%`}
              labelFormatter={(label) => `회수율 ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
              {data.buckets.map((_, i) => (
                <Cell key={i} fill={COLORS[i] ?? COLORS[0]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-blue-50 rounded-lg p-3">
          <span className="text-slate-500">유사 사건군 회수율 중앙값</span>
          <div className="text-lg font-bold text-blue-700 mt-1">
            약 {data.median_recovery_pct}%
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <span className="text-slate-500">LH 매입 가능성</span>
          <div className="text-lg font-bold text-slate-700 mt-1">
            {data.lh_eligibility ? '✅ 해당 가능' : '❌ 해당 가능성 낮음'}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 italic">
        ※ 회수율은 우선변제권·경공매 진행·LH 매입·민사 추심을 모두 고려한 종합 분포입니다.
        개별 사건의 결과는 채무조정·합의 등 추가 절차에 따라 크게 달라집니다.
      </p>
    </div>
  );
};

export default RecoveryChart;
