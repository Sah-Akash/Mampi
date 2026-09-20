import React from 'react';
import { useWedding, ActiveTab } from '../../context/WeddingContext';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Store,
  CreditCard,
  Users,
  Tag,
  BarChart3,
  Settings,
  Plus,
  Sparkles,
  Calendar,
  Search,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { formatCompactINR, formatINR } from '../../utils/formatters';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const {
    data,
    activeTab,
    setActiveTab,
    setIsAddExpenseOpen,
    setIsSearchOpen,
    totalBudget,
    totalSpent,
    toggleCompactINR,
    toggleTheme,
    setIsOnboardingOpen,
  } = useWedding();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt, badge: data.expenses.length },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'vendors', label: 'Vendors', icon: Store, badge: data.vendors.length },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: data.paymentSchedules.filter((p) => p.status === 'Pending').length || undefined },
    { id: 'people', label: 'People', icon: Users },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#F4EFE6] dark:bg-[#181512] border-r border-[#E8DFD1] dark:border-[#26211C] h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E8DFD1] dark:border-[#26211C]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#80142B] to-[#580F1D] text-[#E2C799] flex items-center justify-center shadow-md shadow-[#80142B]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-[#2C2523] dark:text-[#EAE5DF] font-serif-royal">
                Shaadi Budget
              </h1>
              <p className="text-[11px] font-medium text-[#7D7067] dark:text-[#A89F97]">
                Indian Wedding Planner
              </p>
            </div>
          </div>
        </div>

        {/* Wedding Project Pill */}
        <div
          onClick={() => setIsOnboardingOpen(true)}
          className="mt-3.5 p-2.5 rounded-xl bg-white/70 dark:bg-[#201C18]/80 hover:bg-white dark:hover:bg-[#25211D] border border-[#E4DAC9] dark:border-[#302923] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#80142B] dark:text-[#E2C799] truncate max-w-[150px]">
              {data.coupleNames || data.name}
            </span>
            <span className="text-[10px] font-semibold text-[#7D7067] dark:text-[#998E85] group-hover:text-[#80142B] dark:group-hover:text-[#E2C799]">
              Edit
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#7D7067] dark:text-[#A89F97]">
            <Calendar className="w-3 h-3 text-[#C5A059]" />
            <span>{data.date ? new Date(data.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Dec 2026'}</span>
            <span>•</span>
            <span className="font-semibold text-[#2C2523] dark:text-[#EAE5DF]">
              {data.settings.useCompactINR ? formatCompactINR(totalBudget) : formatINR(totalBudget)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 space-y-2">
        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#80142B] hover:bg-[#6A1124] text-white rounded-xl text-xs font-bold shadow-sm shadow-[#80142B]/20 transition-all transform active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Expense</span>
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between py-1.5 px-3 bg-white/60 dark:bg-[#201C18]/60 hover:bg-white dark:hover:bg-[#25211D] text-[#7D7067] dark:text-[#A89F97] rounded-xl text-xs border border-[#E8DFD1] dark:border-[#2D2620] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search wedding...</span>
          </span>
          <kbd className="text-[10px] font-mono bg-[#EAE3D5] dark:bg-[#2D2620] px-1.5 py-0.5 rounded-sm">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white dark:bg-[#241F1B] text-[#80142B] dark:text-[#E2C799] shadow-xs border border-[#E2D6C3] dark:border-[#352E27]'
                  : 'text-[#5A4F48] dark:text-[#C5BCB4] hover:bg-[#EAE3D5]/60 dark:hover:bg-[#201C18]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#80142B] dark:text-[#E2C799]' : 'text-[#8C7E75] dark:text-[#8C8279]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#80142B]/10 text-[#80142B] dark:bg-[#E2C799]/20 dark:text-[#E2C799]'
                      : 'bg-[#EAE3D5] dark:bg-[#26211C] text-[#7D7067] dark:text-[#998E85]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Widget */}
      <div className="p-3 border-t border-[#E8DFD1] dark:border-[#26211C] space-y-2">
        {/* Compact Toggle & Dark Mode */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={toggleCompactINR}
            title="Toggle exact (₹7,42,500) vs compact (₹7.42L) Indian format"
            className="px-2 py-1 text-[11px] font-bold text-[#7D7067] hover:text-[#2C2523] dark:text-[#A89F97] dark:hover:text-white bg-[#EAE3D5] dark:bg-[#201C18] rounded-lg transition-colors"
          >
            {data.settings.useCompactINR ? 'Format: ₹ Lakhs' : 'Format: Exact ₹'}
          </button>

          <button
            onClick={toggleTheme}
            className="p-1.5 text-[#7D7067] hover:text-[#2C2523] dark:text-[#A89F97] dark:hover:text-white bg-[#EAE3D5] dark:bg-[#201C18] rounded-lg transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {data.settings.theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-[#C5A059]" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="px-2 py-1.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center gap-2 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Saved Locally (Private & Safe)</span>
        </div>
      </div>
    </aside>
  );
};
