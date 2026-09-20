import React, { useState } from 'react';
import { CategorySummary } from '../../context/WeddingContext';
import { formatINR, formatCompactINR } from '../../utils/formatters';

interface DonutChartProps {
  data: CategorySummary[];
  totalSpent: number;
  useCompact?: boolean;
  onSelectCategory?: (categoryId: string) => void;
  selectedCategoryId?: string | null;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  totalSpent,
  useCompact = false,
  onSelectCategory,
  selectedCategoryId,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<CategorySummary | null>(null);

  // Filter categories with spending
  const activeCategories = data.filter((c) => c.spent > 0);
  const size = 220;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute slice offsets
  let accumulatedPercent = 0;
  const slices = activeCategories.map((item) => {
    const percent = totalSpent > 0 ? (item.spent / totalSpent) * 100 : 0;
    const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += percent;

    return {
      ...item,
      percent: Math.round(percent),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeHover = hoveredCategory || (selectedCategoryId ? data.find((c) => c.category.id === selectedCategoryId) : null);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {/* Background circle if no spending */}
          {activeCategories.length === 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E5DECE"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="dark:stroke-[#2E2823]"
            />
          )}

          {slices.map((slice) => {
            const isSelected = selectedCategoryId === slice.category.id;
            const isHovered = hoveredCategory?.category.id === slice.category.id;
            return (
              <circle
                key={slice.category.id}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={slice.category.color || '#C5A059'}
                strokeWidth={isHovered || isSelected ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                fill="transparent"
                className="cursor-pointer transition-all duration-300 hover:opacity-90"
                style={{
                  filter: isHovered ? 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))' : 'none',
                }}
                onMouseEnter={() => setHoveredCategory(slice)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => onSelectCategory && onSelectCategory(slice.category.id)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
          {activeHover ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] truncate max-w-[120px]">
                {activeHover.category.name}
              </span>
              <span className="text-base font-bold text-[#2C2523] dark:text-[#F3EEEA] mt-0.5">
                {useCompact ? formatCompactINR(activeHover.spent) : formatINR(activeHover.spent)}
              </span>
              <span className="text-[11px] font-semibold text-[#80142B] dark:text-[#E2C799] mt-0.5">
                {Math.round((activeHover.spent / (totalSpent || 1)) * 100)}% of total
              </span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
                Total Spent
              </span>
              <span className="text-lg font-bold text-[#2C2523] dark:text-[#F3EEEA] mt-0.5">
                {useCompact ? formatCompactINR(totalSpent) : formatINR(totalSpent)}
              </span>
              <span className="text-[11px] text-[#7D7067] dark:text-[#A89F97]">
                {activeCategories.length} Categories
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
