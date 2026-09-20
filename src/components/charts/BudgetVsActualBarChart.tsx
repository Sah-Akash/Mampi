import React from 'react';
import { CategorySummary } from '../../context/WeddingContext';
import { formatCompactINR, formatINR } from '../../utils/formatters';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface BudgetVsActualBarChartProps {
  categories: CategorySummary[];
  useCompact?: boolean;
  onSelectCategory?: (categoryId: string) => void;
}

export const BudgetVsActualBarChart: React.FC<BudgetVsActualBarChartProps> = ({
  categories,
  useCompact = true,
  onSelectCategory,
}) => {
  // Sort by highest budget or spending
  const displayedCategories = [...categories]
    .filter((c) => c.budget > 0 || c.spent > 0)
    .sort((a, b) => Math.max(b.budget, b.spent) - Math.max(a.budget, a.spent));

  const maxVal = Math.max(...displayedCategories.map((c) => Math.max(c.budget, c.spent)), 100000);

  return (
    <div className="space-y-4 w-full">
      {displayedCategories.map((item) => {
        const budgetWidth = (item.budget / maxVal) * 100;
        const actualWidth = (item.spent / maxVal) * 100;
        const isOver = item.isOverBudget;

        return (
          <div
            key={item.category.id}
            onClick={() => onSelectCategory && onSelectCategory(item.category.id)}
            className="group p-3 rounded-xl hover:bg-[#F4EFE6] dark:hover:bg-[#1E1B17] transition-all cursor-pointer border border-transparent hover:border-[#E8DFD1] dark:hover:border-[#2D2620]"
          >
            {/* Header: Category Name & Over/Under status */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.category.color }}
                />
                <span className="text-[#2C2523] dark:text-[#EAE5DF] group-hover:text-[#80142B] dark:group-hover:text-[#E2C799] transition-colors">
                  {item.category.name}
                </span>
                {isOver ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900/50">
                    <AlertTriangle className="w-3 h-3" />
                    {useCompact ? formatCompactINR(item.overAmount) : formatINR(item.overAmount)} Over
                  </span>
                ) : item.spent > 0 && item.percentageUsed >= 85 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/50">
                    {item.percentageUsed}% used
                  </span>
                ) : item.spent > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/50">
                    <CheckCircle2 className="w-3 h-3" />
                    {useCompact ? formatCompactINR(item.remaining) : formatINR(item.remaining)} left
                  </span>
                ) : null}
              </div>

              {/* Numerical figures */}
              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#7D7067] dark:text-[#A89F97]">
                  Budget: <span className="font-semibold text-[#2C2523] dark:text-[#EAE5DF]">{useCompact ? formatCompactINR(item.budget) : formatINR(item.budget)}</span>
                </span>
                <span className="text-[#7D7067] dark:text-[#A89F97]">
                  Actual: <span className={`font-semibold ${isOver ? 'text-red-600 dark:text-red-400' : 'text-[#80142B] dark:text-[#E2C799]'}`}>
                    {useCompact ? formatCompactINR(item.spent) : formatINR(item.spent)}
                  </span>
                </span>
              </div>
            </div>

            {/* Bars: Stacked comparison */}
            <div className="space-y-1">
              {/* Budget Bar (Subtle gold / ivory bar) */}
              <div className="w-full bg-[#EFE9DF] dark:bg-[#25211D] h-2 rounded-full overflow-hidden relative">
                <div
                  className="bg-[#C5A059]/70 dark:bg-[#C5A059]/50 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, budgetWidth)}%` }}
                  title={`Budget: ${formatINR(item.budget)}`}
                />
              </div>

              {/* Actual Spending Bar */}
              <div className="w-full bg-[#EFE9DF] dark:bg-[#25211D] h-2 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOver
                      ? 'bg-red-500 dark:bg-red-400'
                      : 'bg-[#80142B] dark:bg-[#C5A059]'
                  }`}
                  style={{ width: `${Math.min(100, actualWidth)}%` }}
                  title={`Actual Spent: ${formatINR(item.spent)}`}
                />
              </div>
            </div>
          </div>
        );
      })}

      {displayedCategories.length === 0 && (
        <div className="text-center py-6 text-sm text-[#7D7067] dark:text-[#A89F97]">
          No category budgets or expenses recorded yet.
        </div>
      )}
    </div>
  );
};
