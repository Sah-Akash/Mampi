import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import {
  Wallet,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Edit2,
  Plus,
  ArrowRight,
  Calculator,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { formatMoney, formatINR, formatCompactINR } from '../../utils/formatters';

export const BudgetView: React.FC = () => {
  const {
    data,
    totalBudget,
    totalSpent,
    remainingBudget,
    categorySummaries,
    updateWeddingBudget,
    updateCategory,
    addCategory,
  } = useWedding();

  const useCompact = data.settings.useCompactINR;

  // Inline editing state for total wedding budget
  const [isEditingTotalBudget, setIsEditingTotalBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(totalBudget);

  // Quick edit modal or inline for category
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [tempCatBudget, setTempCatBudget] = useState<number>(0);

  // What-If Scenario simulator state
  const [simCategory, setSimCategory] = useState(data.categories[0]?.id || '');
  const [simAdjustment, setSimAdjustment] = useState(50000);

  // Sum of all category budgets vs Total Budget
  const sumCategoryBudgets = data.categories.reduce((sum, c) => sum + c.budget, 0);
  const unallocatedBudget = totalBudget - sumCategoryBudgets;

  const handleSaveTotalBudget = () => {
    updateWeddingBudget(Number(tempBudget));
    setIsEditingTotalBudget(false);
  };

  const handleSaveCatBudget = (id: string) => {
    updateCategory(id, { budget: Number(tempCatBudget) });
    setEditingCategoryId(null);
  };

  // What-If calculation
  const targetCatSummary = categorySummaries.find((c) => c.category.id === simCategory);
  const simNewSpent = (targetCatSummary?.spent || 0) + Number(simAdjustment);
  const simNewRemaining = remainingBudget - Number(simAdjustment);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner: Total Budget & Allocation Health */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-[#C5A059]" />
              Master Wedding Budget
            </span>

            {isEditingTotalBudget ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(Number(e.target.value))}
                  className="text-2xl font-black px-3 py-1 bg-[#FAF8F5] dark:bg-[#201C18] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] w-56"
                />
                <button
                  onClick={handleSaveTotalBudget}
                  className="px-4 py-2 bg-[#80142B] text-white text-xs font-bold rounded-xl"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingTotalBudget(false)}
                  className="px-3 py-2 text-xs text-[#7D7067] hover:underline"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-black text-[#80142B] dark:text-[#E2C799] tracking-tight">
                  {formatINR(totalBudget)}
                </span>
                <button
                  onClick={() => {
                    setTempBudget(totalBudget);
                    setIsEditingTotalBudget(true);
                  }}
                  className="p-1.5 text-[#7D7067] hover:text-[#2C2523] dark:hover:text-white rounded-lg hover:bg-[#EAE3D5] dark:hover:bg-[#2B241E] transition-colors"
                  title="Edit Master Budget"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Allocation Ratio */}
          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-xs text-[#7D7067] dark:text-[#A89F97] block">
                Category Allocations
              </span>
              <span className="text-lg font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                {formatINR(sumCategoryBudgets)}
              </span>
              <span className="text-[11px] block text-[#7D7067] dark:text-[#A89F97]">
                {unallocatedBudget >= 0
                  ? `₹${unallocatedBudget.toLocaleString('en-IN')} unallocated`
                  : `₹${Math.abs(unallocatedBudget).toLocaleString('en-IN')} over-allocated!`}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar of Sum vs Total */}
        <div className="w-full bg-[#EFE9DF] dark:bg-[#25201C] h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              unallocatedBudget < 0 ? 'bg-red-600' : 'bg-[#C5A059]'
            }`}
            style={{ width: `${Math.min(100, (sumCategoryBudgets / totalBudget) * 100)}%` }}
          />
        </div>
      </div>

      {/* Category Budget Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
            Category Allocations & Status
          </h3>
          <span className="text-xs text-[#7D7067] dark:text-[#A89F97]">
            {categorySummaries.length} Wedding Categories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categorySummaries.map((cat) => {
            const isEditing = editingCategoryId === cat.category.id;
            return (
              <div
                key={cat.category.id}
                className={`p-5 rounded-2xl bg-white dark:bg-[#1A1613] border transition-all shadow-xs space-y-3 ${
                  cat.isOverBudget
                    ? 'border-red-300 dark:border-red-900/60 bg-red-50/20'
                    : 'border-[#E8DFD1] dark:border-[#28221D]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.category.color }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                        {cat.category.name}
                      </h4>
                      <span className="text-[11px] text-[#7D7067] dark:text-[#A89F97]">
                        {cat.expenseCount} expenses recorded
                      </span>
                    </div>
                  </div>

                  {cat.isOverBudget ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                      <AlertTriangle className="w-3 h-3" />
                      Over by {formatINR(cat.overAmount)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      {cat.percentageUsed}% used
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-[#EFE9DF] dark:bg-[#25201C] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, cat.percentageUsed)}%`,
                        backgroundColor: cat.isOverBudget ? '#DC2626' : cat.category.color,
                      }}
                    />
                  </div>
                </div>

                {/* Spending Numbers & Edit Budget */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[#7D7067] dark:text-[#A89F97] block text-[11px]">
                      Spent
                    </span>
                    <span className="font-bold text-[#80142B] dark:text-[#E2C799] text-sm">
                      {formatINR(cat.spent)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[#7D7067] dark:text-[#A89F97] block text-[11px]">
                      Budget Cap
                    </span>

                    {isEditing ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="number"
                          value={tempCatBudget}
                          onChange={(e) => setTempCatBudget(Number(e.target.value))}
                          className="w-24 px-2 py-0.5 text-xs font-bold bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] rounded-md"
                        />
                        <button
                          onClick={() => handleSaveCatBudget(cat.category.id)}
                          className="px-2 py-0.5 bg-[#80142B] text-white text-[11px] font-bold rounded-md"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-bold text-[#2C2523] dark:text-[#EAE5DF] text-sm">
                          {formatINR(cat.category.budget)}
                        </span>
                        <button
                          onClick={() => {
                            setEditingCategoryId(cat.category.id);
                            setTempCatBudget(cat.category.budget);
                          }}
                          className="p-1 text-[#7D7067] hover:text-[#2C2523]"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* "WHAT-IF" SCENARIO CALCULATOR */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FAF5EE] to-[#F3EBE0] dark:from-[#201C18] dark:to-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#80142B] text-white flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
              Wedding "What-If" Impact Simulator
            </h3>
            <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
              Simulate price increases or unexpected additions to see how they impact your remaining budget
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
              Select Category
            </label>
            <select
              value={simCategory}
              onChange={(e) => setSimCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-[#25201C] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
            >
              {data.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Budget: {formatCompactINR(c.budget)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
              Simulated Additional Spend (₹)
            </label>
            <input
              type="number"
              step="5000"
              value={simAdjustment}
              onChange={(e) => setSimAdjustment(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-[#25201C] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
            />
          </div>

          <div className="p-3 bg-white dark:bg-[#25201C] rounded-2xl border border-[#E0D7C7] dark:border-[#352F28] flex flex-col justify-center">
            <span className="text-[11px] font-bold text-[#7D7067] dark:text-[#A89F97] uppercase">
              Simulated Remaining Buffer
            </span>
            <span
              className={`text-base sm:text-lg font-black mt-0.5 ${
                simNewRemaining < 0 ? 'text-red-600' : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {formatINR(simNewRemaining)}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#554A43] dark:text-[#CCC4BD] flex items-center gap-1.5 pt-1">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>
            If <strong>{targetCatSummary?.category.name}</strong> increases by {formatINR(simAdjustment)}, total {targetCatSummary?.category.name} will be <strong>{formatINR(simNewSpent)}</strong>.
          </span>
        </p>
      </div>
    </div>
  );
};
