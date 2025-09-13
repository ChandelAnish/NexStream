'use client';

import { PieChart, Pie, Cell } from 'recharts';

// types.ts
export interface StatsCard {
  title: string;
  value: number;
  subtitle: string;
  color: string; // hex color
}

interface Props {
  data: StatsCard;
  maxValue?: number;
}

export default function StatsCard({ data, maxValue = 20 }: Props) {
  const percentage = Math.min((14 / maxValue) * 100, 100);
  const chartData = [
    { name: 'progress', value: percentage },
    { name: 'rest', value: 100 - percentage },
  ];

  return (
    <div className="h-full rounded-2xl border border-[#0A8A7F] overflow-hidden shadow-sm flex flex-col items-center p-2">
      {/* Header */}
      <div className="w-full text-center text-sm font-semibold text-[#6B7280] bg-gradient-to-b from-[#F0F9F8] to-white border-b border-transparent">
        {data.title}
      </div>

      {/* Circular Graph */}
      <div className="relative mt-1">
        <PieChart width={140} height={140}>
          <Pie
            data={chartData}
            dataKey="value"
            innerRadius={40}
            outerRadius={55}
            startAngle={-270}
            endAngle={240}
            stroke="none"
          >
            <Cell fill={data.color} />
            <Cell fill="#E5E7EB" />
          </Pie>
        </PieChart>

        {/* Centered Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-bold text-md leading-tight px-2">
          {data.value} <br />
          {data.subtitle}
        </div>
      </div>
    </div>
  );
}
