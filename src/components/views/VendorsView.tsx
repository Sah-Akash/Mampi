import React, { useState, useMemo } from 'react';
import { useWedding } from '../../context/WeddingContext';
import {
  Store,
  Plus,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { formatINR, formatFriendlyDate } from '../../utils/formatters';

export const VendorsView: React.FC = () => {
  const {
    data,
    setIsAddVendorOpen,
    openVendorDetail,
    deleteVendor,
  } = useWedding();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Vendor calculations
  const totalContracts = data.vendors.reduce((sum, v) => sum + v.contractAmount, 0);
  const totalPaid = data.vendors.reduce((sum, v) => sum + v.amountPaid, 0);
  const totalDue = data.vendors.reduce((sum, v) => sum + v.amountDue, 0);

  const filteredVendors = useMemo(() => {
    return data.vendors.filter((v) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesCategory = v.category.toLowerCase().includes(q);
        const matchesContact = v.contact?.personName?.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesContact) return false;
      }

      if (selectedCategory !== 'all' && v.category !== selectedCategory) {
        return false;
      }

      if (selectedStatus !== 'all' && v.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [data.vendors, searchQuery, selectedCategory, selectedStatus]);

  // Unique vendor categories
  const categoriesList = Array.from(new Set(data.vendors.map((v) => v.category)));

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* 3 Summary metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] block">
            Total Vendor Contracts
          </span>
          <span className="text-2xl font-black text-[#2C2523] dark:text-[#EAE5DF] mt-1 block">
            {formatINR(totalContracts)}
          </span>
          <span className="text-xs text-[#7D7067] dark:text-[#A89F97] mt-1 block">
            Across {data.vendors.length} booked & shortlisted partners
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
            Paid to Vendors
          </span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1 block">
            {formatINR(totalPaid)}
          </span>
          <span className="text-xs text-[#7D7067] dark:text-[#A89F97] mt-1 block">
            {totalContracts > 0 ? Math.round((totalPaid / totalContracts) * 100) : 0}% of contracts cleared
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#80142B] dark:text-[#E2C799] block">
            Remaining Vendor Dues
          </span>
          <span className="text-2xl font-black text-[#80142B] dark:text-[#E2C799] mt-1 block">
            {formatINR(totalDue)}
          </span>
          <span className="text-xs text-[#7D7067] dark:text-[#A89F97] mt-1 block">
            To be settled before or on event days
          </span>
        </div>
      </div>

      {/* Filter & Action bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#7D7067] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendors by name, service, or contact..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E4DAC9] dark:border-[#332C25] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-2 text-xs bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E4DAC9] dark:border-[#332C25] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
          >
            <option value="all">All Services</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-2 text-xs bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E4DAC9] dark:border-[#332C25] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
          >
            <option value="all">All Statuses</option>
            <option value="Booked">Booked</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Contacted">Contacted</option>
          </select>

          <button
            onClick={() => setIsAddVendorOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#80142B] hover:bg-[#681023] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((vendor) => {
          const percentPaid = vendor.contractAmount > 0 ? Math.round((vendor.amountPaid / vendor.contractAmount) * 100) : 0;
          return (
            <div
              key={vendor.id}
              onClick={() => openVendorDetail(vendor.id)}
              className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] hover:border-[#80142B] dark:hover:border-[#C5A059] shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#80142B]/10 text-[#80142B] dark:bg-[#E2C799]/15 dark:text-[#E2C799] mb-1">
                    {vendor.category}
                  </span>
                  <h4 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF] group-hover:text-[#80142B] dark:group-hover:text-[#E2C799] transition-colors">
                    {vendor.name}
                  </h4>
                  {vendor.contact?.personName && (
                    <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                      Contact: {vendor.contact.personName}
                    </p>
                  )}
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    vendor.status === 'Booked'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  {vendor.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#7D7067] dark:text-[#A89F97]">Paid: {formatINR(vendor.amountPaid)}</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{percentPaid}%</span>
                </div>
                <div className="w-full bg-[#EFE9DF] dark:bg-[#25211D] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, percentPaid)}%` }}
                  />
                </div>
              </div>

              {/* Numbers */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#EFE9DE] dark:border-[#25201C]">
                <div>
                  <span className="text-[10px] text-[#7D7067] dark:text-[#A89F97] block">Contract</span>
                  <span className="font-bold text-[#2C2523] dark:text-[#EAE5DF]">{formatINR(vendor.contractAmount)}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#7D7067] dark:text-[#A89F97] block">Due</span>
                  <span className="font-extrabold text-[#80142B] dark:text-[#E2C799]">{formatINR(vendor.amountDue)}</span>
                </div>
              </div>

              {/* Next Due Date */}
              {vendor.nextPaymentDate && (
                <div className="flex items-center justify-between text-[11px] text-[#7D7067] dark:text-[#A89F97] bg-[#FAF8F5] dark:bg-[#221D19] p-2 rounded-xl">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#C5A059]" />
                    Next due: {formatFriendlyDate(vendor.nextPaymentDate)}
                  </span>
                  <span className="text-[#80142B] dark:text-[#E2C799] font-bold group-hover:translate-x-0.5 transition-transform">
                    View Details →
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {filteredVendors.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-[#7D7067] dark:text-[#A89F97]">
            No matching wedding vendors found. Click "+ Add Vendor" to add one.
          </div>
        )}
      </div>
    </div>
  );
};
