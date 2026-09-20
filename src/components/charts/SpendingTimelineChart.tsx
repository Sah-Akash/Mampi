import React from 'react';
import { Expense } from '../../types';
import { formatCompactINR, formatINR } from '../../utils/formatters';

interface SpendingTimelineChartProps {
  expenses: Expense[];
  totalBudget?: number;
  useCompact?: boolean;
}

export const SpendingTimelineChart: React.FC<SpendingTimelineChartProps> = ({
  expenses,
  totalBudget,
  useCompact = true,
}) => {
  // Sort expenses chronologically
  const paidExpenses = expenses
    .filter((e) => e.paymentStatus === 'Paid' && e.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (paidExpenses.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-[#7D7067] dark:text-[#A89F97]">
        No transaction history to plot.
      </div>
    );
  }

  // Aggregate spending by date
  const dateMap = new Map<string, number>();
  paidExpenses.forEach((exp) => {
    const current = dateMap.get(exp.date) || 0;
    dateMap.set(exp.date, current + exp.amount);
  });

  const dates = Array.from(dateMap.keys());
  let runningTotal = 0;
  const dataPoints = dates.map((date) => {
    runningTotal += dateMap.get(date)!;
    return {
      date,
      daily: dateMap.get(date)!,
      cumulative: runningTotal,
    };
  });

  const maxTotal = runningTotal || 1;
  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 24;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Generate SVG path points
  const points = dataPoints.map((dp, idx) => {
    const x = paddingX + (idx / Math.max(1, dataPoints.length - 1)) * chartW;
    const y = height - paddingY - (dp.cumulative / maxTotal) * chartH;
    return { x, y, dp };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between text-xs text-[#7D7067] dark:text-[#A89F97] mb-2 px-1">
        <span>Cumulative Spend Over Time</span>
        <span className="font-semibold text-[#80142B] dark:text-[#E2C799]">
          Peak: {useCompact ? formatCompactINR(runningTotal) : formatINR(runningTotal)}
        </span>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#80142B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#C5A059" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - paddingY - ratio * chartH;
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#EAE3D5"
                strokeDasharray="4 4"
                className="dark:stroke-[#2A241F]"
              />
            );
          })}

          {/* Filled Area */}
          <path d={areaD} fill="url(#spendGradient)" />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#80142B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dark:stroke-[#C5A059]"
          />

          {/* Dots */}
          {points.map((pt, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4"
                className="fill-[#FAF8F5] dark:fill-[#12100E] stroke-[#80142B] dark:stroke-[#C5A059] stroke-2 group-hover:r-6 transition-all"
              />
              <title>{`${pt.dp.date}: ${formatINR(pt.dp.cumulative)} (Daily: ${formatINR(pt.dp.daily)})`}</title>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex justify-between text-[11px] text-[#7D7067] dark:text-[#A89F97] px-2 pt-1 border-t border-[#EFE9DE] dark:border-[#2E2823]">
        <span>{dataPoints[0]?.date}</span>
        <span>{dataPoints[Math.floor(dataPoints.length / 2)]?.date}</span>
        <span>{dataPoints[dataPoints.length - 1]?.date}</span>
      </div>
    </div>
  );
};
