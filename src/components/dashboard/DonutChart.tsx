'use client';

import React from 'react';

type Segment = {
  value: number;
  color: string;
  label: string;
};

type DonutChartProps = {
  pieData: Segment[];
};

const RADIAN = Math.PI / 180;

const getCoordinatesForAngle = (angle: number, radius: number, center = 50) => {
  const rad = (angle - 90) * RADIAN;
  return {
    x: center + radius * Math.cos(rad),
    y: center + radius * Math.sin(rad),
  };
};

const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = getCoordinatesForAngle(startAngle, radius, x);
  const end = getCoordinatesForAngle(endAngle, radius, x);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${x} ${y}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
};

const DonutChart: React.FC<DonutChartProps> = ({ pieData }) => {
  const total = pieData.reduce((sum, s) => sum + s.value, 0);
  let startAngle = 0;

  const segments = pieData.map((segment) => {
    const angle = (segment.value / total) * 360;
    const endAngle = startAngle + angle;
    const path = describeArc(50, 50, 40, startAngle, endAngle);
    const midAngle = startAngle + angle / 2;
    const labelPos = getCoordinatesForAngle(midAngle, 40); // push outside the circle
    const label = `${segment.value.toFixed(1)}%`;
    startAngle = endAngle;
    return {
      ...segment,
      path,
      label,
      labelPos,
    };
  });

  return (
    <div className="bg-white w-full max-w-sm p-4 rounded-2xl shadow-md">
      <div className="relative aspect-square w-full">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background ring */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="20" />

          {/* Segments */}
          {segments.map((seg, idx) => (
            <path
              key={idx}
              d={seg.path}
              fill={seg.color}
              stroke="white"
              strokeWidth="0.5"
            />
          ))}

          {/* Inner circle */}
          <circle cx="50" cy="50" r="22" fill="white" />
          <text
            x="50"
            y="50"
            textAnchor="middle"
            fontSize="5"
            fontWeight="600"
          >
            Your
          </text>
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="5"
            fontWeight="600"
          >
            Patients
          </text>
        </svg>

        {/* Percentage badges */}
        {segments.map((seg, idx) => (
          <div
            key={idx}
            className="absolute px-2 py-1 text-xs font-semibold rounded-full"
            style={{
              backgroundColor: seg.color,
              left: `${seg.labelPos.x}%`,
              top: `${seg.labelPos.y}%`,
              transform: 'translate(-50%, -50%)',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            }}
          >
            {seg.label}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {pieData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-6 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-800 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
