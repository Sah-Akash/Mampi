import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import {
  Calendar,
  Search,
  Plus,
  Moon,
  Sun,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  Cloud,
  RefreshCw,
} from 'lucide-react';
import { formatCompactINR, formatINR } from '../../utils/formatters';

export const Header: React.FC = () => {
  const {
    data,
    activeTab,
    activeEventId,
    setActiveEventId,
    setIsAddExpenseOpen,
    setIsSearchOpen,
    toggleCompactINR,
    toggleTheme,
    resetToDemoData,
    totalBudget,
    syncStatus,
    lastCloudSync,
    manualSync,
  } = useWedding();

  const getPageMeta = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Wedding Budget',
          subtitle: 'Track every rupee, stay within budget.',
        };
      case 'expenses':
        return {
          title: 'Wedding Expenses',
          subtitle: 'All transactions, receipts, and vendor advances.',
        };
      case 'budget':
        return {
          title: 'Category Budgets',
          subtitle: 'Plan allocations and prevent overspending.',
        };
      case 'vendors':
        return {
          title: 'Wedding Vendors & Services',
          subtitle: 'Contracts, payments made, and upcoming dues.',
        };
      case 'payments':
        return {
          title: 'Payment Timeline & Dues',
          subtitle: 'Upcoming milestones, advances, and final settlements.',
        };
      case 'people':
        return {
          title: 'Family Contributions',
          subtitle: 'Track who paid for each expense across the family.',
        };
      case 'categories':
        return {
          title: 'Expense Categories',
          subtitle: 'Manage ceremony-wise tags and allocation caps.',
        };
      case 'reports':
        return {
          title: 'Visual Reports & Analytics',
          subtitle: 'Deep insights, spending breakdowns, and PDF export.',
        };
      case 'settings':
        return {
          title: 'Wedding Settings',
          subtitle: 'Manage events, couple details, and data backup.',
        };
      default:
        return { title: 'Wedding Budget', subtitle: 'Track every rupee' };
    }
  };

  const meta = getPageMeta();

  return (
    <header className="bg-[#FAF8F5]/90 dark:bg-[#12100E]/90 backdrop-blur-md sticky top-0 z-20 border-b border-[#E8DFD1] dark:border-[#26211C] px-4 sm:px-8 py-3.5 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Title & Subtitle */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2C2523] dark:text-[#EAE5DF] tracking-tight font-serif-royal">
              {meta.title}
            </h2>
            {/* Multi-event indicator tag */}
            {activeEventId !== 'all' && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#80142B]/10 text-[#80142B] dark:bg-[#E2C799]/15 dark:text-[#E2C799]">
                {data.events.find((e) => e.id === activeEventId)?.name || 'Event Filtered'}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#7D7067] dark:text-[#A89F97]">
            {meta.subtitle}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          {/* Event Selector Dropdown (Multi-event support) */}
          <div className="flex items-center bg-white dark:bg-[#201C18] border border-[#E4DAC9] dark:border-[#302923] rounded-xl px-2.5 py-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#C5A059] mr-1.5 shrink-0" />
            <select
              value={activeEventId}
              onChange={(e) => setActiveEventId(e.target.value)}
              className="bg-transparent text-[#2C2523] dark:text-[#EAE5DF] font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Events ({data.events.length})</option>
              {data.events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>

          {/* Real-time Cloud Sync Indicator */}
          <button
            onClick={() => manualSync()}
            title={
              syncStatus === 'synced'
                ? `Live synced with all family members. Last updated: ${lastCloudSync || 'just now'}. Tap to refresh.`
                : syncStatus === 'saving'
                ? 'Broadcasting changes to all connected devices...'
                : syncStatus === 'connecting'
                ? 'Connecting to real-time cloud database...'
                : 'Working offline (cached locally). Tap to reconnect.'
            }
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-[#E4DAC9] dark:border-[#302923] bg-white dark:bg-[#201C18] hover:border-[#80142B] dark:hover:border-[#E2C799] transition-all cursor-pointer"
          >
            {syncStatus === 'synced' ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            ) : syncStatus === 'saving' ? (
              <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
            ) : syncStatus === 'connecting' ? (
              <Cloud className="w-3 h-3 text-blue-500 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            )}
            <span className="hidden md:inline text-[11px] text-[#5A4F48] dark:text-[#C5BCB4]">
              {syncStatus === 'synced'
                ? 'Live Synced'
                : syncStatus === 'saving'
                ? 'Syncing...'
                : syncStatus === 'connecting'
                ? 'Connecting...'
                : 'Offline'}
            </span>
          </button>

          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            title="Search (⌘K)"
            className="p-2 text-[#7D7067] hover:text-[#2C2523] dark:text-[#A89F97] dark:hover:text-white bg-white dark:bg-[#201C18] border border-[#E4DAC9] dark:border-[#302923] rounded-xl transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Exact / Compact INR toggle */}
          <button
            onClick={toggleCompactINR}
            title="Toggle exact numbers vs compact ₹ Lakhs"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#5A4F48] dark:text-[#C5BCB4] bg-white dark:bg-[#201C18] border border-[#E4DAC9] dark:border-[#302923] rounded-xl hover:border-[#80142B] dark:hover:border-[#E2C799] transition-all"
          >
            <SlidersHorizontal className="w-3 h-3 text-[#C5A059]" />
            <span>{data.settings.useCompactINR ? '₹ Lakhs' : '₹ Exact'}</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-[#7D7067] hover:text-[#2C2523] dark:text-[#A89F97] dark:hover:text-white bg-white dark:bg-[#201C18] border border-[#E4DAC9] dark:border-[#302923] rounded-xl transition-colors"
            title="Toggle Light / Dark theme"
          >
            {data.settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#C5A059]" />
            ) : (
              <Moon className="w-4 h-4 text-[#7D7067]" />
            )}
          </button>

          {/* + Add Expense Primary Button */}
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#80142B] hover:bg-[#6A1124] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-[#80142B]/25 transition-all transform active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>
    </header>
  );
};
