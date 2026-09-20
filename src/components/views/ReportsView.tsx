import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  IndianRupee,
  PieChart,
  Users,
  CheckCircle2,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { formatINR, formatCompactINR, downloadCSV } from '../../utils/formatters';
import { SpendingTimelineChart } from '../charts/SpendingTimelineChart';
import { DonutChart } from '../charts/DonutChart';
import { BudgetVsActualBarChart } from '../charts/BudgetVsActualBarChart';
import { ContributionChart } from '../charts/ContributionChart';

export const ReportsView: React.FC = () => {
  const {
    data,
    totalBudget,
    totalSpent,
    remainingBudget,
    committedAmount,
    availableAmount,
    budgetUtilization,
    categorySummaries,
    peopleSummaries,
  } = useWedding();

  const useCompact = data.settings.useCompactINR;

  const handlePrint = () => {
    window.print();
  };

  const handleExportFullCSV = () => {
    const rows = data.expenses.map((e) => {
      const cat = data.categories.find((c) => c.id === e.categoryId)?.name || 'Misc';
      const vendor = data.vendors.find((v) => v.id === e.vendorId)?.name || 'None';
      const eventName = data.events.find((ev) => ev.id === e.eventId)?.name || 'General';
      return {
        ID: e.id,
        Event: eventName,
        Date: e.date,
        Expense: e.name,
        Category: cat,
        Vendor: vendor,
        Amount: e.amount,
        PaidBy: e.paidBy,
        PaymentMethod: e.paymentMethod,
        PaymentStatus: e.paymentStatus,
        Notes: e.notes || '',
      };
    });
    downloadCSV(`wedding_full_report_${new Date().toISOString().split('T')[0]}.csv`, rows);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner & Export Actions */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#80142B] dark:text-[#E2C799]" />
            <h3 className="text-base sm:text-lg font-bold text-[#2C2523] dark:text-[#EAE5DF]">
              Wedding Financial Reports & Audit
            </h3>
          </div>
          <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
            Comprehensive breakdown of expenses, timelines, and family contributions
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#FAF8F5] dark:bg-[#221D19] hover:bg-[#EAE3D5] text-[#2C2523] dark:text-[#EAE5DF] border border-[#E4DAC9] dark:border-[#352F28] rounded-xl transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Print Report (PDF)</span>
          </button>

          <button
            onClick={handleExportFullCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#80142B] hover:bg-[#681023] text-white rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All Data (CSV)</span>
          </button>
        </div>
      </div>

      {/* Printable Financial Summary Sheet */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
          Executive Financial Summary
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-[#FAF8F5] dark:bg-[#201C18] rounded-2xl border border-[#E8DFD1] dark:border-[#28221D]">
            <span className="text-[10px] uppercase font-bold text-[#7D7067] dark:text-[#A89F97] block">
              Master Budget
            </span>
            <span className="text-base sm:text-lg font-black text-[#2C2523] dark:text-[#EAE5DF] mt-0.5 block">
              {formatINR(totalBudget)}
            </span>
          </div>

          <div className="p-3 bg-[#FAF8F5] dark:bg-[#201C18] rounded-2xl border border-[#E8DFD1] dark:border-[#28221D]">
            <span className="text-[10px] uppercase font-bold text-[#80142B] dark:text-[#E2C799] block">
              Total Spent
            </span>
            <span className="text-base sm:text-lg font-black text-[#80142B] dark:text-[#E2C799] mt-0.5 block">
              {formatINR(totalSpent)}
            </span>
          </div>

          <div className="p-3 bg-[#FAF8F5] dark:bg-[#201C18] rounded-2xl border border-[#E8DFD1] dark:border-[#28221D]">
            <span className="text-[10px] uppercase font-bold text-[#7D7067] dark:text-[#A89F97] block">
              Remaining
            </span>
            <span className="text-base sm:text-lg font-black text-[#2C2523] dark:text-[#EAE5DF] mt-0.5 block">
              {formatINR(remainingBudget)}
            </span>
          </div>

          <div className="p-3 bg-[#FAF8F5] dark:bg-[#201C18] rounded-2xl border border-[#E8DFD1] dark:border-[#28221D]">
            <span className="text-[10px] uppercase font-bold text-[#7D7067] dark:text-[#A89F97] block">
              Committed Dues
            </span>
            <span className="text-base sm:text-lg font-black text-[#2C2523] dark:text-[#EAE5DF] mt-0.5 block">
              {formatINR(committedAmount)}
            </span>
          </div>

          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
              Available Buffer
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block">
              {formatINR(availableAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Spending Timeline over Months */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-4">
        <div>
          <h4 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
            Spending Progression Timeline
          </h4>
          <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
            Monthly and cumulative expenditure trajectory
          </p>
        </div>
        <SpendingTimelineChart
          expenses={data.expenses}
          totalBudget={totalBudget}
          useCompact={useCompact}
        />
      </div>

      {/* Side by side: Category Breakdown & Family Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-4">
          <h4 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
            Category Breakdown
          </h4>
          <div className="flex justify-center py-2">
            <DonutChart
              data={categorySummaries}
              totalSpent={totalSpent}
              useCompact={useCompact}
            />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-4">
          <h4 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
            Family Contribution Share
          </h4>
          <ContributionChart
            data={peopleSummaries}
            totalSpent={totalSpent}
            useCompact={useCompact}
          />
        </div>
      </div>
    </div>
  );
};
