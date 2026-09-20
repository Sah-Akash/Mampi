import React, { useState } from 'react';
import { useWedding, ActiveTab } from '../../context/WeddingContext';
import { LayoutDashboard, Receipt, PieChart, Store, MoreHorizontal, Plus, Users, Tag, BarChart3, Settings, X } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsAddExpenseOpen } = useWedding();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const mainTabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'vendors', label: 'Vendors', icon: Store },
  ];

  const moreItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'payments', label: 'Payment Timeline', icon: Receipt },
    { id: 'people', label: 'Family Contributions', icon: Users },
    { id: 'categories', label: 'Categories & Budgets', icon: Tag },
    { id: 'reports', label: 'Visual Reports & CSV', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Data Backup', icon: Settings },
  ];

  return (
    <>
      {/* More Options Modal / Sheet */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-end md:hidden animate-fadeIn">
          <div className="bg-[#FAF8F5] dark:bg-[#181512] w-full rounded-t-3xl border-t border-[#E8DFD1] dark:border-[#2E2823] p-6 pb-24 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8DFD1] dark:border-[#2E2823] pb-3">
              <span className="text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                More Wedding Sections
              </span>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1 text-[#7D7067] hover:text-[#2C2523] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#80142B] text-white border-[#80142B]'
                        : 'bg-white dark:bg-[#221D19] text-[#4A403A] dark:text-[#D5CCC4] border-[#E8DFD1] dark:border-[#2D2620]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#C5A059]" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FAF8F5]/95 dark:bg-[#181512]/95 backdrop-blur-md border-t border-[#E8DFD1] dark:border-[#26211C] px-3 py-2">
        <div className="flex items-center justify-around relative max-w-md mx-auto">
          {mainTabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#80142B] dark:text-[#E2C799]'
                    : 'text-[#7D7067] dark:text-[#8C837A]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold">{tab.label}</span>
              </button>
            );
          })}

          {/* Prominent Quick Add Expense Button */}
          <div className="-mt-7">
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="w-13 h-13 rounded-full bg-[#80142B] hover:bg-[#681023] text-white flex items-center justify-center shadow-lg shadow-[#80142B]/30 border-4 border-[#FAF8F5] dark:border-[#181512] transition-transform active:scale-95"
              aria-label="Add Expense"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {mainTabs.slice(2, 4).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#80142B] dark:text-[#E2C799]'
                    : 'text-[#7D7067] dark:text-[#8C837A]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold">{tab.label}</span>
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              ['payments', 'people', 'categories', 'reports', 'settings'].includes(activeTab)
                ? 'text-[#80142B] dark:text-[#E2C799]'
                : 'text-[#7D7067] dark:text-[#8C837A]'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-bold">More</span>
          </button>
        </div>
      </div>
    </>
  );
};
