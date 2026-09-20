import React from 'react';
import { PersonSummary } from '../../context/WeddingContext';
import { formatCompactINR, formatINR } from '../../utils/formatters';

interface ContributionChartProps {
  people?: PersonSummary[];
  data?: PersonSummary[];
  totalSpent?: number;
  useCompact?: boolean;
}

export const ContributionChart: React.FC<ContributionChartProps> = ({
  people: propPeople,
  data: propData,
  useCompact = false,
}) => {
  const people = propPeople || propData || [];
  const maxPaid = Math.max(...people.map((p) => p.totalPaid), 1);

  return (
    <div className="space-y-3.5 w-full">
      {people.map((item) => {
        const barWidth = (item.totalPaid / maxPaid) * 100;
        return (
          <div key={item.person.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: item.person.avatarColor || '#80142B' }}
                >
                  {item.person.name.charAt(0)}
                </div>
                <div>
                  <span className="font-semibold text-[#2C2523] dark:text-[#EAE5DF]">
                    {item.person.name}
                  </span>
                  <span className="text-[11px] text-[#7D7067] dark:text-[#A89F97] ml-2 hidden sm:inline">
                    ({item.person.relation})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#80142B] dark:text-[#E2C799]">
                  {useCompact ? formatCompactINR(item.totalPaid) : formatINR(item.totalPaid)}
                </span>
                <span className="text-[11px] font-medium text-[#7D7067] dark:text-[#A89F97] bg-[#EFE9DE] dark:bg-[#25211D] px-1.5 py-0.5 rounded-sm">
                  {item.percentageOfTotal}%
                </span>
              </div>
            </div>

            <div className="w-full bg-[#EFE9DF] dark:bg-[#25211D] h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, barWidth)}%`,
                  backgroundColor: item.person.avatarColor || '#C5A059',
                }}
              />
            </div>
          </div>
        );
      })}

      {people.length === 0 && (
        <div className="text-center py-6 text-sm text-[#7D7067] dark:text-[#A89F97]">
          No family member payments recorded yet.
        </div>
      )}
    </div>
  );
};
