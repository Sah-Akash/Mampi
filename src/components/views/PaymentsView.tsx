import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { PaymentSchedule } from '../../types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Check,
  CreditCard,
  User,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { formatINR, formatFriendlyDate, getPaymentUrgency } from '../../utils/formatters';

export const PaymentsView: React.FC = () => {
  const {
    data,
    upcomingPayments,
    markPaymentAsPaid,
    addPaymentSchedule,
  } = useWedding();

  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [vendorName, setVendorName] = useState(data.vendors[0]?.name || 'Grand Palace Resort');
  const [category, setCategory] = useState(data.categories[0]?.name || 'Venue & Stage');
  const [amount, setAmount] = useState<number | ''>(50000);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Status Filter
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');

  const allSchedules = data.paymentSchedules
    .map((p) => ({
      ...p,
      urgency: p.urgency || getPaymentUrgency(p.dueDate, p.status === 'Paid'),
    }))
    .filter((p) => {
      if (filterStatus === 'pending') return p.status === 'Pending';
      if (filterStatus === 'paid') return p.status === 'Paid';
      return true;
    });

  const totalPending = data.paymentSchedules
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPaid = data.paymentSchedules
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const matchedVendor = data.vendors.find((v) => v.name.toLowerCase() === vendorName.toLowerCase());

    addPaymentSchedule({
      vendorId: matchedVendor?.id,
      vendorName,
      category,
      amount: Number(amount),
      dueDate,
      status: 'Pending',
      notes: notes || undefined,
    });

    setIsAddingPayment(false);
    setAmount('');
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] block">
            Total Upcoming Milestone Dues
          </span>
          <span className="text-2xl font-black text-[#80142B] dark:text-[#E2C799] mt-1 block">
            {formatINR(totalPending)}
          </span>
          <span className="text-xs text-[#7D7067] dark:text-[#A89F97] mt-1 block">
            Across {data.paymentSchedules.filter((p) => p.status === 'Pending').length} pending milestones
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
            Cleared Milestones
          </span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1 block">
            {formatINR(totalPaid)}
          </span>
          <span className="text-xs text-[#7D7067] dark:text-[#A89F97] mt-1 block">
            {data.paymentSchedules.filter((p) => p.status === 'Paid').length} installments paid
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] block">
              Urgent Action
            </span>
            <span className="text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF] mt-1 block">
              {upcomingPayments.filter((p) => p.urgency === 'Due soon' || p.urgency === 'Overdue').length} payments need attention
            </span>
          </div>
          <button
            onClick={() => setIsAddingPayment(true)}
            className="mt-3 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#80142B] hover:bg-[#681023] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ Schedule Payment Due</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] dark:bg-[#201C18] rounded-xl border border-[#E8DFD1] dark:border-[#2C2520]">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-[#28221D] text-[#80142B] dark:text-[#E2C799] shadow-xs'
                : 'text-[#7D7067] dark:text-[#A89F97]'
            }`}
          >
            All Milestones ({data.paymentSchedules.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              filterStatus === 'pending'
                ? 'bg-white dark:bg-[#28221D] text-[#80142B] dark:text-[#E2C799] shadow-xs'
                : 'text-[#7D7067] dark:text-[#A89F97]'
            }`}
          >
            Pending Dues
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              filterStatus === 'paid'
                ? 'bg-white dark:bg-[#28221D] text-[#80142B] dark:text-[#E2C799] shadow-xs'
                : 'text-[#7D7067] dark:text-[#A89F97]'
            }`}
          >
            Paid
          </button>
        </div>
      </div>

      {/* Add Payment Milestone Drawer / Form */}
      {isAddingPayment && (
        <form
          onSubmit={handleAddSchedule}
          className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border-2 border-[#80142B]/20 dark:border-[#C5A059]/30 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF]">
              Schedule New Wedding Payment Milestone
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingPayment(false)}
              className="text-xs text-[#7D7067] hover:underline"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Vendor / Recipient
              </label>
              <input
                type="text"
                required
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Due Amount (₹)
              </label>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[#80142B] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#681023]"
            >
              Save Payment Milestone
            </button>
          </div>
        </form>
      )}

      {/* Chronological List of Payment Milestones */}
      <div className="space-y-3">
        {allSchedules.map((item) => {
          const isPending = item.status === 'Pending';
          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl bg-white dark:bg-[#1A1613] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                item.urgency === 'Overdue' && isPending
                  ? 'border-red-300 dark:border-red-900/50 bg-red-50/20'
                  : 'border-[#E8DFD1] dark:border-[#28221D]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    !isPending
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : item.urgency === 'Overdue'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  {!isPending ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : item.urgency === 'Overdue' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                      {item.vendorName}
                    </h4>
                    <span className="text-[11px] font-semibold text-[#7D7067] dark:text-[#A89F97] px-2 py-0.2 bg-[#FAF8F5] dark:bg-[#221D19] rounded-md">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs text-[#7D7067] dark:text-[#A89F97]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      Due: {formatFriendlyDate(item.dueDate)}
                    </span>
                    {item.notes && <span>• {item.notes}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#EFE9DE]">
                <div className="sm:text-right">
                  <span className="text-base sm:text-lg font-black text-[#80142B] dark:text-[#E2C799] block">
                    {formatINR(item.amount)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                      !isPending
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : item.urgency === 'Due soon'
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300'
                        : item.urgency === 'Overdue'
                        ? 'bg-red-100 text-red-900 dark:bg-red-950/60 dark:text-red-300'
                        : 'bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300'
                    }`}
                  >
                    {!isPending ? 'Cleared' : item.urgency || 'Pending'}
                  </span>
                </div>

                {isPending && (
                  <button
                    onClick={() => {
                      const person = data.people[0]?.name || 'Dad';
                      markPaymentAsPaid(item.id, person, 'UPI');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Mark Paid</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {allSchedules.length === 0 && (
          <div className="py-12 text-center text-xs text-[#7D7067] dark:text-[#A89F97]">
            No payment milestones found. Click "+ Schedule Payment Due" to add one.
          </div>
        )}
      </div>
    </div>
  );
};
