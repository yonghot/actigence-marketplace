/**
 * SentencingChart.tsx
 *
 * 가해자 양형 분포 가로 막대 차트.
 *
 * 컴플라이언스 핵심:
 * - "예상 형량" 등 단정 표현 0건
 * - "유사 사건군의 양형 분포" 표현만
 * - 표본 < 30건 시 'low_sample' 경고 박스 표시 (상위 컴포넌트에서)
 * - 적용 양형기준 명시
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
} from 'recharts';

interface SentencingData {
  buckets: Array<{
    range: string;
    label: string;
    percentage: number;
  }>;
  median_sentence_months: number;
  applied_guideline: string;
  fraud_type: 'general' | 'organized';
  damage_estimate_range: string;
  sample_size: number;
  low_sample: boolean;
  source: string;
}

interface Props {
  data: SentencingData;
}

const COLORS = ['#86efac', '#fde68a', '#fdba74', '#fb923c', '#dc2626'];

export const SentencingChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-3">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.buckets}
            layout="vertical"
            margin={{ top: 8, right: 32, left: 80, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="label"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              width={75}
            />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)}%`}
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
              {data.buckets.map((_, i) => (
                <Cell key={i} fill={COLORS[i] ?? COLORS[0]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50 rounded-lg p-3">
          <span className="text-slate-500">유사 사건군 형량 중앙값</span>
          <div className="text-base font-bold text-slate-800 mt-1">
            {formatMonths(data.median_sentence_months)}
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <span className="text-slate-500">사건 분류</span>
          <div className="text-base font-bold text-slate-800 mt-1">
            {data.fraud_type === 'organized' ? '조직적 사기' : '일반사기'}
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <span className="text-slate-500">적용 양형기준 유형</span>
          <div className="text-base font-bold text-slate-800 mt-1">
            {data.damage_estimate_range}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
        <p className="text-blue-900">
          <strong>적용 양형기준:</strong> {data.applied_guideline}
        </p>
        <p className="text-blue-700 mt-1">
          (대법원 양형위원회 사기범죄 양형기준 2022 개정)
        </p>
      </div>

      <p className="text-xs text-slate-500 italic">
        ※ 본 분포는 유사 조건의 공개 판례 통계이며, 실제 형량은 특별양형인자
        (자백·합의·전과·피해 회복 등)에 따라 크게 달라집니다.
      </p>
    </div>
  );
};

function formatMonths(months: number): string {
  if (months === 0) return '집행유예';
  if (months < 12) return `${months}개월`;
  const years = Math.floor(months / 12);
  const remainMonths = months % 12;
  if (remainMonths === 0) return `${years}년`;
  return `${years}년 ${remainMonths}개월`;
}

export default SentencingChart;
