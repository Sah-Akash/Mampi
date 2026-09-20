import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Search, X, IndianRupee, Store, User, Tag, Calendar, ArrowRight } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    data,
    setActiveTab,
    openVendorDetail,
    setExpenseToEdit,
    setIsAddExpenseOpen,
  } = useWedding();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search Expenses
  const matchedExpenses = cleanQuery
    ? data.expenses.filter(
        (e) =>
          e.name.toLowerCase().includes(cleanQuery) ||
          e.paidBy.toLowerCase().includes(cleanQuery) ||
          e.paymentMethod.toLowerCase().includes(cleanQuery) ||
          (e.notes && e.notes.toLowerCase().includes(cleanQuery)) ||
          e.amount.toString().includes(cleanQuery)
      )
    : [];

  // Search Vendors
  const matchedVendors = cleanQuery
    ? data.vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(cleanQuery) ||
          v.category.toLowerCase().includes(cleanQuery) ||
          (v.contact?.personName && v.contact.personName.toLowerCase().includes(cleanQuery)) ||
          (v.notes && v.notes.toLowerCase().includes(cleanQuery))
      )
    : [];

  // Search Categories
  const matchedCategories = cleanQuery
    ? data.categories.filter((c) => c.name.toLowerCase().includes(cleanQuery))
    : [];

  // Search People
  const matchedPeople = cleanQuery
    ? data.people.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.relation.toLowerCase().includes(cleanQuery)
      )
    : [];

  // Search Payments
  const matchedPayments = cleanQuery
    ? data.paymentSchedules.filter(
        (s) =>
          s.vendorName.toLowerCase().includes(cleanQuery) ||
          s.category.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalResults =
    matchedExpenses.length +
    matchedVendors.length +
    matchedCategories.length +
    matchedPeople.length +
    matchedPayments.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF8F5] dark:bg-[#181512] rounded-2xl shadow-2xl border border-[#E8DFD1] dark:border-[#2E2823] w-full max-w-2xl overflow-hidden">
        {/* Search input bar */}
        <div className="p-4 border-b border-[#E8DFD1] dark:border-[#2E2823] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#80142B] dark:text-[#C5A059]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search wedding expenses, vendors, family members, categories, or dues..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#2C2523] dark:text-[#EAE5DF] placeholder-[#7D7067] dark:placeholder-[#8C837A] focus:outline-hidden"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#7D7067] hover:text-[#2C2523] dark:hover:text-white text-xs px-2 py-1 bg-[#EAE3D5] dark:bg-[#2A241F] rounded-md"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-[#7D7067] hover:text-[#2C2523] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-4">
          {!cleanQuery && (
            <div className="py-8 text-center text-xs text-[#7D7067] dark:text-[#A89F97] space-y-2">
              <p>Type anything: "photography", "caterer", "Dad", "jewellery", "advance"</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {['Venue', 'Catering', 'Photography', 'Dad', 'Advance'].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => setQuery(hint)}
                    className="px-2.5 py-1 text-xs bg-[#EFE9DE] dark:bg-[#221D19] rounded-lg text-[#52463F] dark:text-[#CCC4BD] hover:bg-[#E2D8C7]"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {cleanQuery && totalResults === 0 && (
            <div className="py-8 text-center text-sm text-[#7D7067] dark:text-[#A89F97]">
              No results found for "<span className="font-semibold text-[#2C2523] dark:text-[#EAE5DF]">{query}</span>"
            </div>
          )}

          {/* Vendors */}
          {matchedVendors.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-[#80142B] dark:text-[#C5A059]" />
                Vendors ({matchedVendors.length})
              </span>
              <div className="space-y-1">
                {matchedVendors.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      openVendorDetail(v.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#221D19] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2621] border border-[#E8DFD1] dark:border-[#2D2620] cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-[#2C2523] dark:text-[#EAE5DF] block">
                        {v.name}
                      </span>
                      <span className="text-[11px] text-[#7D7067] dark:text-[#A89F97]">
                        {v.category} • Contract {formatINR(v.contractAmount)} (Due: {formatINR(v.amountDue)})
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7D7067]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expenses */}
          {matchedExpenses.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-[#80142B] dark:text-[#C5A059]" />
                Expenses ({matchedExpenses.length})
              </span>
              <div className="space-y-1">
                {matchedExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => {
                      setExpenseToEdit(exp);
                      setIsAddExpenseOpen(true);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#221D19] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2621] border border-[#E8DFD1] dark:border-[#2D2620] cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-[#2C2523] dark:text-[#EAE5DF] block">
                        {exp.name}
                      </span>
                      <span className="text-[11px] text-[#7D7067] dark:text-[#A89F97]">
                        Paid by {exp.paidBy} via {exp.paymentMethod} • {exp.date}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#80142B] dark:text-[#E2C799]">
                      {formatINR(exp.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {matchedCategories.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#80142B] dark:text-[#C5A059]" />
                Categories ({matchedCategories.length})
              </span>
              <div className="grid grid-cols-2 gap-2">
                {matchedCategories.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveTab('categories');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#221D19] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2621] border border-[#E8DFD1] dark:border-[#2D2620] cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-xs font-semibold text-[#2C2523] dark:text-[#EAE5DF]">
                      {c.name}
                    </span>
                    <span className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                      Budget: {formatINR(c.budget)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Family Members */}
          {matchedPeople.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#80142B] dark:text-[#C5A059]" />
                Family Members ({matchedPeople.length})
              </span>
              <div className="grid grid-cols-2 gap-2">
                {matchedPeople.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActiveTab('people');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#221D19] hover:bg-[#F4EFE6] dark:hover:bg-[#2C2621] border border-[#E8DFD1] dark:border-[#2D2620] cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-xs font-semibold text-[#2C2523] dark:text-[#EAE5DF]">
                      {p.name}
                    </span>
                    <span className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                      {p.relation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
