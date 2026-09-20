import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { X, Phone, Mail, User, IndianRupee, Calendar, CheckCircle2, Clock, Plus, Trash2, Edit } from 'lucide-react';
import { formatINR, formatFriendlyDate } from '../../utils/formatters';

export const VendorDetailDrawer: React.FC = () => {
  const {
    data,
    isVendorDetailOpen,
    closeVendorDetail,
    selectedVendorId,
    deleteVendor,
    addExpense,
  } = useWedding();

  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [payAmount, setPayAmount] = useState<number | ''>('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payMethod, setPayMethod] = useState<any>('UPI');
  const [payBy, setPayBy] = useState(data.people[0]?.name || 'Dad');
  const [payNotes, setPayNotes] = useState('');

  if (!isVendorDetailOpen || !selectedVendorId) return null;

  const vendor = data.vendors.find((v) => v.id === selectedVendorId);
  if (!vendor) return null;

  // Expenses linked to this vendor
  const vendorExpenses = data.expenses.filter((e) => e.vendorId === vendor.id);
  const totalPaid = vendor.amountPaid;
  const balanceDue = vendor.amountDue;
  const percentPaid = vendor.contractAmount > 0 ? Math.round((totalPaid / vendor.contractAmount) * 100) : 0;

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = typeof payAmount === 'number' ? payAmount : 0;
    if (amountNum <= 0) return;

    addExpense({
      categoryId:
        data.categories.find((c) => c.name.toLowerCase().includes(vendor.category.toLowerCase()))?.id ||
        data.categories[0]?.id ||
        'cat-misc',
      vendorId: vendor.id,
      name: `${vendor.name} Payment`,
      amount: amountNum,
      date: payDate,
      paidBy: payBy,
      paymentMethod: payMethod,
      paymentStatus: 'Paid',
      notes: payNotes || `Installment towards ${vendor.name} contract`,
    });

    setIsRecordingPayment(false);
    setPayAmount('');
    setPayNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF8F5] dark:bg-[#181512] w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-[#E8DFD1] dark:border-[#2E2823] overflow-hidden">
        {/* Drawer Header */}
        <div className="p-6 bg-[#F4EFE6] dark:bg-[#201C18] border-b border-[#E8DFD1] dark:border-[#2E2823] flex items-start justify-between">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#80142B]/10 text-[#80142B] dark:bg-[#E2C799]/10 dark:text-[#E2C799] mb-1.5">
              {vendor.category}
            </span>
            <h2 className="text-xl font-bold text-[#2C2523] dark:text-[#EAE5DF]">
              {vendor.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-[#7D7067] dark:text-[#A89F97]">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                vendor.status === 'Booked'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
              }`}>
                {vendor.status}
              </span>
              {vendor.nextPaymentDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Next Due: {formatFriendlyDate(vendor.nextPaymentDate)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={closeVendorDetail}
            className="p-2 rounded-xl text-[#7D7067] hover:text-[#2C2523] dark:hover:text-white hover:bg-[#EAE3D5] dark:hover:bg-[#2D2620] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#221D19] border border-[#E8DFD1] dark:border-[#2D2620]">
              <span className="text-[11px] font-bold text-[#7D7067] dark:text-[#A89F97] uppercase tracking-wider block">
                Total Contract
              </span>
              <span className="text-base sm:text-lg font-bold text-[#2C2523] dark:text-[#EAE5DF] mt-1 block">
                {formatINR(vendor.contractAmount)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#221D19] border border-[#E8DFD1] dark:border-[#2D2620]">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                Total Paid
              </span>
              <span className="text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-1 block">
                {formatINR(totalPaid)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#221D19] border border-[#E8DFD1] dark:border-[#2D2620]">
              <span className="text-[11px] font-bold text-[#80142B] dark:text-[#E2C799] uppercase tracking-wider block">
                Balance Due
              </span>
              <span className="text-base sm:text-lg font-bold text-[#80142B] dark:text-[#E2C799] mt-1 block">
                {formatINR(balanceDue)}
              </span>
            </div>
          </div>

          {/* Payment Progress Bar */}
          <div className="space-y-1.5 p-4 rounded-xl bg-white dark:bg-[#221D19] border border-[#E8DFD1] dark:border-[#2D2620]">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#7D7067] dark:text-[#A89F97]">Fulfillment Progress</span>
              <span className="text-[#80142B] dark:text-[#E2C799]">{percentPaid}% Paid</span>
            </div>
            <div className="w-full bg-[#EFE9DF] dark:bg-[#2E2823] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, percentPaid)}%` }}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#221D19] border border-[#E8DFD1] dark:border-[#2D2620] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
              Contact Details
            </h4>
            <div className="space-y-2 text-sm">
              {vendor.contact?.personName && (
                <div className="flex items-center gap-2 text-[#2C2523] dark:text-[#EAE5DF]">
                  <User className="w-4 h-4 text-[#80142B] dark:text-[#C5A059]" />
                  <span>{vendor.contact.personName}</span>
                </div>
              )}
              {vendor.contact?.phone && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#2C2523] dark:text-[#EAE5DF]">
                    <Phone className="w-4 h-4 text-[#80142B] dark:text-[#C5A059]" />
                    <a href={`tel:${vendor.contact.phone}`} className="hover:underline">
                      {vendor.contact.phone}
                    </a>
                  </div>
                  <a
                    href={`tel:${vendor.contact.phone}`}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#EFE9DE] dark:bg-[#2E2823] hover:bg-[#80142B] hover:text-white rounded-lg transition-colors"
                  >
                    Call Vendor
                  </a>
                </div>
              )}
              {vendor.contact?.email && (
                <div className="flex items-center gap-2 text-[#2C2523] dark:text-[#EAE5DF]">
                  <Mail className="w-4 h-4 text-[#80142B] dark:text-[#C5A059]" />
                  <a href={`mailto:${vendor.contact.email}`} className="hover:underline">
                    {vendor.contact.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Notes / Deliverables */}
          {vendor.notes && (
            <div className="p-4 rounded-xl bg-white dark:bg-[#221D19] border border-[#E8DFD1] dark:border-[#2D2620] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
                Contract Notes & Deliverables
              </h4>
              <p className="text-xs sm:text-sm text-[#554A43] dark:text-[#D5CCC4] leading-relaxed">
                {vendor.notes}
              </p>
            </div>
          )}

          {/* Record Quick Payment form inline */}
          {isRecordingPayment ? (
            <form onSubmit={handleRecordPayment} className="p-4 rounded-xl bg-[#F4EFE6] dark:bg-[#201C18] border border-[#E8DFD1] dark:border-[#332C25] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#80142B] dark:text-[#E2C799]">
                  Record Payment to {vendor.name}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsRecordingPayment(false)}
                  className="text-xs text-[#7D7067] hover:underline"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-[#7D7067] dark:text-[#A89F97] block">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={balanceDue > 0 ? balanceDue : undefined}
                    placeholder={balanceDue.toString()}
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-white dark:bg-[#181512] border border-[#E0D7C7] dark:border-[#352F28] rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[#7D7067] dark:text-[#A89F97] block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#181512] border border-[#E0D7C7] dark:border-[#352F28] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-[#7D7067] dark:text-[#A89F97] block">
                    Paid By
                  </label>
                  <select
                    value={payBy}
                    onChange={(e) => setPayBy(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white dark:bg-[#181512] border border-[#E0D7C7] dark:border-[#352F28] rounded-lg"
                  >
                    {data.people.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[#7D7067] dark:text-[#A89F97] block">
                    Payment Method
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white dark:bg-[#181512] border border-[#E0D7C7] dark:border-[#352F28] rounded-lg"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#80142B] text-white text-xs font-bold rounded-lg hover:bg-[#681023] transition-colors"
              >
                Confirm Payment & Update Balance
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setPayAmount(balanceDue > 0 ? balanceDue : '');
                setIsRecordingPayment(true);
              }}
              className="w-full py-2.5 inline-flex items-center justify-center gap-2 bg-[#80142B] hover:bg-[#681023] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Record Payment to Vendor</span>
            </button>
          )}

          {/* Payment History / Transactions linked to this vendor */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
              Payment History ({vendorExpenses.length})
            </h4>

            {vendorExpenses.length === 0 ? (
              <p className="text-xs text-[#7D7067] dark:text-[#A89F97] italic py-2">
                No individual payments recorded yet.
              </p>
            ) : (
              <div className="space-y-2">
                {vendorExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 bg-white dark:bg-[#221D19] rounded-xl border border-[#E8DFD1] dark:border-[#2D2620] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold text-[#2C2523] dark:text-[#EAE5DF] block">
                        {exp.name}
                      </span>
                      <span className="text-[11px] text-[#7D7067] dark:text-[#A89F97]">
                        {formatFriendlyDate(exp.date)} • Paid by {exp.paidBy} via {exp.paymentMethod}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      {formatINR(exp.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-[#F4EFE6] dark:bg-[#201C18] border-t border-[#E8DFD1] dark:border-[#2E2823] flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm(`Delete vendor "${vendor.name}"?`)) {
                deleteVendor(vendor.id);
                closeVendorDetail();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Vendor
          </button>
          <button
            onClick={closeVendorDetail}
            className="px-4 py-2 text-xs font-semibold bg-[#EFE9DE] dark:bg-[#25211D] text-[#2C2523] dark:text-[#EAE5DF] rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
