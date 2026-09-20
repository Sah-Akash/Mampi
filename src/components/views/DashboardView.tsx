import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import {
  Wallet,
  TrendingDown,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Plus,
  ArrowRight,
  Receipt,
  Store,
  PieChart,
  HelpCircle,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import { formatMoney, formatINR, formatCompactINR, formatFriendlyDate } from '../../utils/formatters';
import { ProgressRing } from '../charts/ProgressRing';
import { DonutChart } from '../charts/DonutChart';
import { BudgetVsActualBarChart } from '../charts/BudgetVsActualBarChart';

export const DashboardView: React.FC = () => {
  const {
    data,
    totalBudget,
    totalSpent,
    remainingBudget,
    committedAmount,
    availableAmount,
    budgetUtilization,
    categorySummaries,
    upcomingPayments,
    dynamicInsights,
    setIsAddExpenseOpen,
    setActiveTab,
    setExpenseToEdit,
    openVendorDetail,
  } = useWedding();

  const useCompact = data.settings.useCompactINR;

  // Top 5 recent expenses
  const recentExpenses = [...data.expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Filter urgent payments
  const nextPayments = upcomingPayments.slice(0, 4);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Welcome & Demo Notice Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#FAF3E7] to-[#F5EBE1] dark:from-[#201B17] dark:to-[#1C1814] border border-[#E9DFD1] dark:border-[#302821]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#80142B] text-[#E2C799] flex items-center justify-center font-serif-royal text-lg font-bold shadow-xs">
            ॐ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                {data.name}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#80142B]/10 text-[#80142B] dark:bg-[#E2C799]/15 dark:text-[#E2C799] rounded-full">
                Demo Data Active
              </span>
            </div>
            <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
              {data.city ? `${data.city} • ` : ''}Main Wedding:{' '}
              {data.date ? new Date(data.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'December 2026'}
            </p>
          </div>
        </div>

        {/* Quick Actions row */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#80142B] hover:bg-[#6A1124] text-white rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            + Add Expense
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-[#25201C] hover:bg-[#EAE3D5] text-[#2C2523] dark:text-[#EAE5DF] border border-[#E4DAC9] dark:border-[#352E27] rounded-xl transition-colors"
          >
            <PieChart className="w-3.5 h-3.5 text-[#C5A059]" />
            Manage Budget
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-[#25201C] hover:bg-[#EAE3D5] text-[#2C2523] dark:text-[#EAE5DF] border border-[#E4DAC9] dark:border-[#352E27] rounded-xl transition-colors"
          >
            Reports
          </button>
        </div>
      </div>

      {/* 4 Major Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
              Total Budget
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2C2523] dark:text-[#EAE5DF] tracking-tight">
              {formatMoney(totalBudget, useCompact)}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#7D7067] dark:text-[#A89F97]">
              <span>Allocated for {data.events.length} celebrations</span>
            </div>
          </div>
        </div>

        {/* Spent */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
              Spent So Far
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#80142B]/10 text-[#80142B] dark:text-[#E2C799] flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#80142B] dark:text-[#E2C799] tracking-tight">
              {formatMoney(totalSpent, useCompact)}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#7D7067] dark:text-[#A89F97]">
              <span className="font-semibold text-[#80142B] dark:text-[#E2C799]">
                {budgetUtilization}%
              </span>
              <span>of total budget used</span>
            </div>
          </div>
        </div>

        {/* Remaining (Prominent Highlight Card) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FAF5EE] to-[#F1E7D7] dark:from-[#241F1A] dark:to-[#1C1814] border-2 border-[#C5A059]/40 dark:border-[#C5A059]/30 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#80142B] dark:text-[#E2C799] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Remaining Budget
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              Unspent
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-black text-[#80142B] dark:text-[#F3EEEA] tracking-tight">
              {formatMoney(remainingBudget, useCompact)}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#554A43] dark:text-[#CCC4BD]">
              <span>Before commitments & dues</span>
            </div>
          </div>
        </div>

        {/* Committed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
              Committed / Upcoming
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2C2523] dark:text-[#EAE5DF] tracking-tight">
              {formatMoney(committedAmount, useCompact)}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#7D7067] dark:text-[#A89F97]">
              <span>Contractual vendor obligations</span>
            </div>
          </div>
        </div>
      </div>

      {/* BUDGET HEALTH - Visual Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Headline & Progress */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                  Budget Health
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF3E7] dark:bg-[#25201C] text-[#80142B] dark:text-[#E2C799] border border-[#E5D8C5] dark:border-[#352D25]">
                  {formatCompactINR(totalSpent)} spent of {formatCompactINR(totalBudget)}
                </span>
              </div>
              <span className="text-sm font-bold text-[#80142B] dark:text-[#E2C799]">
                {budgetUtilization}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-[#EFE9DF] dark:bg-[#26201B] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#E2D6C3] dark:border-[#302821]">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  budgetUtilization > 100
                    ? 'bg-red-600'
                    : budgetUtilization >= 85
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-[#80142B] via-[#A8203B] to-[#C5A059]'
                }`}
                style={{ width: `${Math.min(100, budgetUtilization)}%` }}
              />
            </div>

            {/* 4 Pillars below bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#201C18] border border-[#E8DFD1] dark:border-[#2C251F]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] block">
                  Spent
                </span>
                <span className="text-sm sm:text-base font-bold text-[#80142B] dark:text-[#E2C799]">
                  {formatMoney(totalSpent, useCompact)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#201C18] border border-[#E8DFD1] dark:border-[#2C251F]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] block">
                  Remaining
                </span>
                <span className="text-sm sm:text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                  {formatMoney(remainingBudget, useCompact)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#201C18] border border-[#E8DFD1] dark:border-[#2C251F]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] block">
                  Committed
                </span>
                <span className="text-sm sm:text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                  {formatMoney(committedAmount, useCompact)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                  Available to Spend
                </span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                  {formatMoney(availableAmount, useCompact)}
                </span>
              </div>
            </div>

            {/* Calculation Explanation */}
            <p className="text-xs text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1.5 pt-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>
                <strong>Available to Spend</strong> = Total Budget ({formatCompactINR(totalBudget)}) - Spent ({formatCompactINR(totalSpent)}) - Committed ({formatCompactINR(committedAmount)})
              </span>
            </p>
          </div>

          {/* Right: Circular Indicator */}
          <div className="flex items-center justify-center p-2 shrink-0">
            <ProgressRing
              percentage={budgetUtilization}
              size={135}
              strokeWidth={12}
              label={`${budgetUtilization}%`}
              sublabel="Budget Used"
            />
          </div>
        </div>
      </div>

      {/* DYNAMIC WEDDING INSIGHTS */}
      {dynamicInsights.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              Wedding Insights
            </h3>
            <span className="text-xs text-[#7D7067] dark:text-[#A89F97]">
              Live auto-calculated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dynamicInsights.slice(0, 3).map((ins) => (
              <div
                key={ins.id}
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                  ins.type === 'warning' || ins.type === 'alert'
                    ? 'bg-amber-50/60 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900/50'
                    : 'bg-white dark:bg-[#1A1613] border-[#E8DFD1] dark:border-[#28221D]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    ins.type === 'warning' || ins.type === 'alert'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                      : 'bg-[#80142B]/10 text-[#80142B] dark:bg-[#E2C799]/15 dark:text-[#E2C799]'
                  }`}
                >
                  {ins.type === 'warning' || ins.type === 'alert' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Lightbulb className="w-4 h-4" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                    {ins.title}
                  </h4>
                  <p className="text-[11px] text-[#554A43] dark:text-[#B8AEA5] leading-relaxed">
                    {ins.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXPENSE BREAKDOWN & CATEGORY LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart & Category Table */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                Expense Breakdown by Category
              </h3>
              <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                Click any category slice to see detailed transactions
              </p>
            </div>
            <button
              onClick={() => setActiveTab('categories')}
              className="text-xs font-semibold text-[#80142B] dark:text-[#E2C799] hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-5 flex justify-center py-2">
              <DonutChart
                data={categorySummaries}
                totalSpent={totalSpent}
                useCompact={useCompact}
                onSelectCategory={() => setActiveTab('expenses')}
              />
            </div>

            {/* Beside Chart: Category List with Progress Bars */}
            <div className="sm:col-span-7 space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {categorySummaries.slice(0, 6).map((cat) => (
                <div
                  key={cat.category.id}
                  onClick={() => setActiveTab('expenses')}
                  className="p-2 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#221D19] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.category.color }}
                      />
                      <span className="text-[#2C2523] dark:text-[#EAE5DF]">
                        {cat.category.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#80142B] dark:text-[#E2C799] font-bold">
                        {formatMoney(cat.spent, useCompact)}
                      </span>
                      <span className="text-[11px] text-[#7D7067] dark:text-[#A89F97]">
                        ({cat.percentageUsed}%)
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-[#EFE9DF] dark:bg-[#25211D] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, cat.percentageUsed)}%`,
                        backgroundColor: cat.isOverBudget ? '#DC2626' : cat.category.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BUDGET VS ACTUAL Comparative Bar Chart */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                Budget vs Actual Spending
              </h3>
              <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                Compare plan against actual expenditures
              </p>
            </div>
            <button
              onClick={() => setActiveTab('budget')}
              className="text-xs font-semibold text-[#80142B] dark:text-[#E2C799] hover:underline flex items-center gap-1"
            >
              Adjust
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto pr-1">
            <BudgetVsActualBarChart
              categories={categorySummaries}
              useCompact={useCompact}
              onSelectCategory={() => setActiveTab('budget')}
            />
          </div>
        </div>
      </div>

      {/* RECENT EXPENSES & UPCOMING PAYMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Expenses List */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#80142B] dark:text-[#C5A059]" />
              <h3 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                Recent Transactions
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-xs font-semibold text-[#80142B] dark:text-[#E2C799] hover:underline flex items-center gap-1"
            >
              All Expenses ({data.expenses.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentExpenses.map((exp) => (
              <div
                key={exp.id}
                onClick={() => {
                  setExpenseToEdit(exp);
                  setIsAddExpenseOpen(true);
                }}
                className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#201C18] hover:bg-[#F4EFE6] dark:hover:bg-[#26211C] border border-[#E8DFD1] dark:border-[#2C2520] flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#28221D] text-[#80142B] dark:text-[#E2C799] border border-[#E8DFD1] dark:border-[#352D26] flex items-center justify-center text-xs font-bold shrink-0">
                    ₹
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF] group-hover:text-[#80142B] dark:group-hover:text-[#E2C799] transition-colors block">
                      {exp.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-[#7D7067] dark:text-[#A89F97] mt-0.5">
                      <span>{formatFriendlyDate(exp.date)}</span>
                      <span>•</span>
                      <span>Paid by <strong>{exp.paidBy}</strong></span>
                      <span>•</span>
                      <span>{exp.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs sm:text-sm font-extrabold text-[#80142B] dark:text-[#E2C799] block">
                    {formatINR(exp.amount)}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    {exp.paymentStatus}
                  </span>
                </div>
              </div>
            ))}

            {recentExpenses.length === 0 && (
              <div className="text-center py-8 text-xs text-[#7D7067] dark:text-[#A89F97]">
                No expenses recorded yet. Click "+ Add Expense" to begin.
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Payments Urgency Cards */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              <h3 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                Upcoming Payments Due
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('payments')}
              className="text-xs font-semibold text-[#80142B] dark:text-[#E2C799] hover:underline flex items-center gap-1"
            >
              Timeline
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {nextPayments.map((sch) => (
              <div
                key={sch.id}
                onClick={() => {
                  if (sch.vendorId) {
                    openVendorDetail(sch.vendorId);
                  } else {
                    setActiveTab('payments');
                  }
                }}
                className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#201C18] border border-[#E8DFD1] dark:border-[#2C2520] hover:border-[#80142B] dark:hover:border-[#C5A059] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-1">
                  <span className="text-[#2C2523] dark:text-[#EAE5DF]">
                    {sch.vendorName}
                  </span>
                  <span className="font-extrabold text-[#80142B] dark:text-[#E2C799]">
                    {formatINR(sch.amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#7D7067] dark:text-[#A89F97]">
                  <span>{sch.category}</span>
                  <div className="flex items-center gap-1.5">
                    <span>Due: {formatFriendlyDate(sch.dueDate)}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sch.urgency === 'Due soon'
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300'
                          : sch.urgency === 'Overdue'
                          ? 'bg-red-100 text-red-900 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300'
                      }`}
                    >
                      {sch.urgency}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {nextPayments.length === 0 && (
              <div className="text-center py-8 text-xs text-[#7D7067] dark:text-[#A89F97]">
                No pending scheduled payments due.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
