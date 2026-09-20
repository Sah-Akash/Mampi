import React, { useState, useMemo } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Expense } from '../../types';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Paperclip,
  ArrowUpDown,
  Download,
  Calendar,
  Tag,
  User,
  CreditCard,
  FileText,
} from 'lucide-react';
import { formatINR, formatFriendlyDate, downloadCSV } from '../../utils/formatters';

export const ExpensesView: React.FC = () => {
  const {
    data,
    deleteExpense,
    setExpenseToEdit,
    setIsAddExpenseOpen,
    activeEventId,
  } = useWedding();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPaidBy, setSelectedPaidBy] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'name-asc'>('date-desc');
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  // Filter & Sort
  const filteredExpenses = useMemo(() => {
    return data.expenses.filter((exp) => {
      // Event filter
      if (activeEventId !== 'all' && exp.eventId && exp.eventId !== activeEventId) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = exp.name.toLowerCase().includes(q);
        const matchesNotes = exp.notes?.toLowerCase().includes(q);
        const matchesAmount = exp.amount.toString().includes(q);
        if (!matchesName && !matchesNotes && !matchesAmount) return false;
      }

      // Category
      if (selectedCategory !== 'all' && exp.categoryId !== selectedCategory) {
        return false;
      }

      // Paid By
      if (selectedPaidBy !== 'all' && exp.paidBy !== selectedPaidBy) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && exp.paymentStatus !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [data.expenses, activeEventId, searchQuery, selectedCategory, selectedPaidBy, selectedStatus, sortBy]);

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleExportCSV = () => {
    const rows = filteredExpenses.map((e) => {
      const cat = data.categories.find((c) => c.id === e.categoryId)?.name || 'Misc';
      const vendor = data.vendors.find((v) => v.id === e.vendorId)?.name || 'None';
      return {
        Date: e.date,
        Expense: e.name,
        Category: cat,
        Vendor: vendor,
        Amount: e.amount,
        PaidBy: e.paidBy,
        PaymentMethod: e.paymentMethod,
        Status: e.paymentStatus,
        Notes: e.notes || '',
      };
    });
    downloadCSV(`wedding_expenses_${new Date().toISOString().split('T')[0]}.csv`, rows);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-16">
      {/* Top Filter & Action Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7D7067] dark:text-[#A89F97] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses by title, notes, or amount..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E4DAC9] dark:border-[#332C25] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden focus:ring-2 focus:ring-[#80142B]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#FAF8F5] dark:bg-[#221D19] hover:bg-[#EAE3D5] text-[#2C2523] dark:text-[#EAE5DF] border border-[#E4DAC9] dark:border-[#332C25] rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                setExpenseToEdit(null);
                setIsAddExpenseOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#80142B] hover:bg-[#681023] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add Expense</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E4DAC9] dark:border-[#332C25] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden"
          >
            <option value="all">All Categories ({data.categories.length})</option>
            {data.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Paid By Filter */}
          <select
            value={selectedPaidBy}
            onChange={(e) => setSelectedPaidBy(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E4DAC9] dark:border-[#332C25] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden"
          >
            <option value="all">Paid by: All Family ({data.people.length})</option>
            {data.people.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Payment Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E4DAC9] dark:border-[#332C25] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E4DAC9] dark:border-[#332C25] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden"
          >
            <option value="date-desc">Sort: Newest First</option>
            <option value="date-asc">Sort: Oldest First</option>
            <option value="amount-desc">Sort: Highest Amount</option>
            <option value="amount-asc">Sort: Lowest Amount</option>
            <option value="name-asc">Sort: A to Z</option>
          </select>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-[#7D7067] dark:text-[#A89F97] pt-2 border-t border-[#EFE9DE] dark:border-[#28221D]">
          <span>
            Showing <strong className="text-[#2C2523] dark:text-[#EAE5DF]">{filteredExpenses.length}</strong> transactions
          </span>
          <span>
            Total in view: <strong className="text-[#80142B] dark:text-[#E2C799] font-bold text-sm">{formatINR(totalFilteredAmount)}</strong>
          </span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F4EFE6] dark:bg-[#201C18] border-b border-[#E8DFD1] dark:border-[#28221D] text-[#7D7067] dark:text-[#A89F97] uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Expense Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Paid By</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE9DE] dark:divide-[#26201B]">
            {filteredExpenses.map((exp) => {
              const cat = data.categories.find((c) => c.id === exp.categoryId);
              const vendor = data.vendors.find((v) => v.id === exp.vendorId);
              return (
                <tr
                  key={exp.id}
                  className="hover:bg-[#FAF8F5] dark:hover:bg-[#221D19] transition-colors group"
                >
                  <td className="py-3 px-4 text-[#7D7067] dark:text-[#A89F97] whitespace-nowrap">
                    {formatFriendlyDate(exp.date)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#2C2523] dark:text-[#EAE5DF]">
                    <div className="flex items-center gap-1.5">
                      <span>{exp.name}</span>
                      {exp.receipt && (
                        <button
                          onClick={() => setPreviewReceiptUrl(exp.receipt?.dataUrl || null)}
                          title="View attached bill/receipt"
                          className="text-[#80142B] dark:text-[#E2C799] p-0.5 hover:bg-[#EAE3D5] rounded-sm"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {exp.notes && (
                      <span className="text-[11px] text-[#7D7067] dark:text-[#8C837A] block truncate max-w-xs">
                        {exp.notes}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium"
                      style={{
                        backgroundColor: `${cat?.color || '#C5A059'}15`,
                        color: cat?.color || '#C5A059',
                      }}
                    >
                      {cat?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#554A43] dark:text-[#C5BCB4]">
                    {vendor ? vendor.name : '—'}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#80142B] dark:text-[#E2C799] text-sm whitespace-nowrap">
                    {formatINR(exp.amount)}
                  </td>
                  <td className="py-3 px-4 text-[#2C2523] dark:text-[#EAE5DF]">
                    <span className="inline-block px-2 py-0.5 bg-[#FAF8F5] dark:bg-[#25201C] rounded-md font-medium text-[11px]">
                      {exp.paidBy}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        exp.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : exp.paymentStatus === 'Partially Paid'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                      }`}
                    >
                      {exp.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setExpenseToEdit(exp);
                          setIsAddExpenseOpen(true);
                        }}
                        title="Edit Expense"
                        className="p-1.5 text-[#7D7067] hover:text-[#80142B] dark:hover:text-[#E2C799] rounded-lg hover:bg-[#EAE3D5] dark:hover:bg-[#2B241E] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${exp.name}"?`)) {
                            deleteExpense(exp.id);
                          }
                        }}
                        title="Delete Expense"
                        className="p-1.5 text-[#7D7067] hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-xs text-[#7D7067] dark:text-[#A89F97]">
                  No matching wedding expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-2.5">
        {filteredExpenses.map((exp) => {
          const cat = data.categories.find((c) => c.id === exp.categoryId);
          return (
            <div
              key={exp.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF] block">
                    {exp.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#7D7067] dark:text-[#A89F97]">
                    <span>{formatFriendlyDate(exp.date)}</span>
                    <span>•</span>
                    <span
                      className="px-1.5 py-0.2 rounded-sm text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${cat?.color || '#C5A059'}15`,
                        color: cat?.color || '#C5A059',
                      }}
                    >
                      {cat?.name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-[#80142B] dark:text-[#E2C799]">
                    {formatINR(exp.amount)}
                  </span>
                  <span
                    className={`block text-[10px] font-bold mt-0.5 ${
                      exp.paymentStatus === 'Paid'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {exp.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#554A43] dark:text-[#C5BCB4] pt-2 border-t border-[#EFE9DE] dark:border-[#25201C]">
                <span>Paid by: <strong>{exp.paidBy}</strong> ({exp.paymentMethod})</span>
                <div className="flex items-center gap-1">
                  {exp.receipt && (
                    <button
                      onClick={() => setPreviewReceiptUrl(exp.receipt?.dataUrl || null)}
                      className="p-1 text-[#80142B] dark:text-[#E2C799]"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setExpenseToEdit(exp);
                      setIsAddExpenseOpen(true);
                    }}
                    className="p-1 text-[#7D7067] hover:text-[#2C2523]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${exp.name}"?`)) {
                        deleteExpense(exp.id);
                      }
                    }}
                    className="p-1 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredExpenses.length === 0 && (
          <div className="py-12 text-center text-xs text-[#7D7067] dark:text-[#A89F97]">
            No matching wedding expenses found.
          </div>
        )}
      </div>

      {/* Simple Image Receipt Preview Modal */}
      {previewReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] dark:bg-[#181512] rounded-2xl p-4 max-w-md w-full shadow-2xl space-y-3 border border-[#E8DFD1]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-[#7D7067] dark:text-[#A89F97]">
                Attached Receipt / Bill
              </h4>
              <button
                onClick={() => setPreviewReceiptUrl(null)}
                className="text-xs font-semibold text-[#80142B] hover:underline"
              >
                Close
              </button>
            </div>
            <div className="max-h-[70vh] overflow-hidden rounded-xl bg-white border border-[#E0D7C7]">
              <img
                src={previewReceiptUrl}
                alt="Receipt Preview"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
