import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { PaymentMethod, PaymentStatus, Expense } from '../../types';
import { X, Upload, IndianRupee, Calendar, User, Tag, Store, CreditCard, FileText, Check } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface ExpenseModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  expenseToEdit?: Expense | null;
}

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  expenseToEdit: propExpenseToEdit,
}) => {
  const {
    data,
    addExpense,
    updateExpense,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    expenseToEdit: contextExpenseToEdit,
    setExpenseToEdit,
  } = useWedding();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isAddExpenseOpen;
  const onClose =
    propOnClose ||
    (() => {
      setIsAddExpenseOpen(false);
      setExpenseToEdit(null);
    });
  const expenseToEdit =
    propExpenseToEdit !== undefined ? propExpenseToEdit : contextExpenseToEdit;

  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [eventId, setEventId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  
  // Partial payment fields
  const [totalAmount, setTotalAmount] = useState<number | ''>('');
  const [amountPaid, setAmountPaid] = useState<number | ''>('');
  const [amountRemaining, setAmountRemaining] = useState<number>(0);
  
  const [notes, setNotes] = useState('');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Pre-populate fields on open or edit
  useEffect(() => {
    if (isOpen) {
      if (expenseToEdit) {
        setName(expenseToEdit.name);
        setAmount(expenseToEdit.amount);
        setCategoryId(expenseToEdit.categoryId);
        setVendorId(expenseToEdit.vendorId || '');
        setEventId(expenseToEdit.eventId || data.events[0]?.id || '');
        setDate(expenseToEdit.date);
        setPaidBy(expenseToEdit.paidBy);
        setPaymentMethod(expenseToEdit.paymentMethod);
        setPaymentStatus(expenseToEdit.paymentStatus);
        setTotalAmount(expenseToEdit.totalAmount ?? expenseToEdit.amount);
        setAmountPaid(expenseToEdit.amountPaid ?? expenseToEdit.amount);
        setAmountRemaining(expenseToEdit.amountRemaining ?? 0);
        setNotes(expenseToEdit.notes || '');
        setReceiptUrl(expenseToEdit.receipt?.dataUrl || null);
        setReceiptName(expenseToEdit.receipt?.name || null);
      } else {
        // Defaults for fast entry
        setName('');
        setAmount('');
        setCategoryId(data.categories[0]?.id || '');
        setVendorId('');
        setEventId(data.events[0]?.id || '');
        setDate(new Date().toISOString().split('T')[0]);
        setPaidBy(data.people[0]?.name || 'Dad');
        setPaymentMethod('UPI');
        setPaymentStatus('Paid');
        setTotalAmount('');
        setAmountPaid('');
        setAmountRemaining(0);
        setNotes('');
        setReceiptUrl(null);
        setReceiptName(null);
      }
      setError('');
    }
  }, [isOpen, expenseToEdit, data]);

  // Recalculate remaining for partial payment
  useEffect(() => {
    if (paymentStatus === 'Partially Paid') {
      const tot = typeof totalAmount === 'number' ? totalAmount : 0;
      const pd = typeof amountPaid === 'number' ? amountPaid : 0;
      setAmountRemaining(Math.max(0, tot - pd));
    }
  }, [totalAmount, amountPaid, paymentStatus]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter what this expense was for (e.g. Wedding Hall, Lehenga)');
      return;
    }

    const finalAmount =
      paymentStatus === 'Partially Paid'
        ? typeof amountPaid === 'number'
          ? amountPaid
          : 0
        : typeof amount === 'number'
        ? amount
        : 0;

    if (finalAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    const receiptObj = receiptUrl
      ? {
          id: `rec-${Date.now()}`,
          name: receiptName || 'Receipt',
          dataUrl: receiptUrl,
        }
      : undefined;

    if (expenseToEdit) {
      updateExpense(expenseToEdit.id, {
        name,
        amount: finalAmount,
        totalAmount: paymentStatus === 'Partially Paid' ? Number(totalAmount) : finalAmount,
        amountPaid: paymentStatus === 'Partially Paid' ? Number(amountPaid) : finalAmount,
        amountRemaining: paymentStatus === 'Partially Paid' ? amountRemaining : 0,
        categoryId: categoryId || data.categories[0]?.id || 'cat-misc',
        vendorId: vendorId || undefined,
        eventId: eventId || undefined,
        date,
        paidBy: paidBy || data.people[0]?.name || 'Family',
        paymentMethod,
        paymentStatus,
        notes,
        receipt: receiptObj,
      });
    } else {
      addExpense({
        name,
        amount: finalAmount,
        totalAmount: paymentStatus === 'Partially Paid' ? Number(totalAmount) : finalAmount,
        amountPaid: paymentStatus === 'Partially Paid' ? Number(amountPaid) : finalAmount,
        amountRemaining: paymentStatus === 'Partially Paid' ? amountRemaining : 0,
        categoryId: categoryId || data.categories[0]?.id || 'cat-misc',
        vendorId: vendorId || undefined,
        eventId: eventId || undefined,
        date,
        paidBy: paidBy || data.people[0]?.name || 'Family',
        paymentMethod,
        paymentStatus,
        notes,
        receipt: receiptObj,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F5] dark:bg-[#181512] rounded-2xl shadow-2xl border border-[#E8DFD1] dark:border-[#2E2823] w-full max-w-xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F4EFE6] dark:bg-[#201C18] border-b border-[#E8DFD1] dark:border-[#2E2823] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#80142B] text-white flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                {expenseToEdit ? 'Edit Wedding Expense' : 'Add Wedding Expense'}
              </h3>
              <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                Quick & simple entry for family members
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7D7067] hover:text-[#2C2523] dark:hover:text-white hover:bg-[#EAE3D5] dark:hover:bg-[#2D2620] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Amount Field (Prominent & Clear) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
              {paymentStatus === 'Partially Paid' ? 'Amount Paid Now *' : 'Amount (₹) *'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-[#80142B] dark:text-[#C5A059]">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={paymentStatus === 'Partially Paid' ? amountPaid : amount}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  if (paymentStatus === 'Partially Paid') {
                    setAmountPaid(val);
                  } else {
                    setAmount(val);
                  }
                }}
                placeholder="25000"
                className="w-full pl-9 pr-4 py-2.5 text-xl font-bold bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden focus:ring-2 focus:ring-[#80142B] dark:focus:ring-[#C5A059]"
                autoFocus
              />
            </div>

            {/* Quick Amount Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => {
                    if (paymentStatus === 'Partially Paid') {
                      setAmountPaid(amt);
                    } else {
                      setAmount(amt);
                    }
                  }}
                  className="px-2.5 py-1 text-xs font-medium bg-[#EFE9DE] dark:bg-[#25211D] hover:bg-[#E2D8C7] dark:hover:bg-[#342D26] text-[#554A43] dark:text-[#D5CCC4] rounded-lg transition-colors"
                >
                  +{formatINR(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Expense Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#80142B] dark:text-[#C5A059]" />
              Expense Description *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wedding Hall Advance, Bridal Lehenga, Photography Token"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden focus:ring-2 focus:ring-[#80142B] dark:focus:ring-[#C5A059]"
            />
          </div>

          {/* Category & Vendor Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#80142B] dark:text-[#C5A059]" />
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden focus:ring-2 focus:ring-[#80142B]"
              >
                {data.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Budget: {formatINR(c.budget)})
                  </option>
                ))}
              </select>
            </div>

            {/* Vendor */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-[#80142B] dark:text-[#C5A059]" />
                Vendor / Service (Optional)
              </label>
              <select
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden focus:ring-2 focus:ring-[#80142B]"
              >
                <option value="">-- No Vendor Linked --</option>
                {data.vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Paid By & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Paid By */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#80142B] dark:text-[#C5A059]" />
                Paid By *
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden focus:ring-2 focus:ring-[#80142B]"
              >
                {data.people.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.relation})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#80142B] dark:text-[#C5A059]" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden focus:ring-2 focus:ring-[#80142B]"
              />
            </div>
          </div>

          {/* Payment Method & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Method */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#80142B] dark:text-[#C5A059]" />
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden focus:ring-2 focus:ring-[#80142B]"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Cheque">Bank Cheque</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden focus:ring-2 focus:ring-[#80142B]"
              >
                <option value="Paid">Fully Paid</option>
                <option value="Partially Paid">Partially Paid (Advance / Token)</option>
                <option value="Pending">Pending (Not yet paid)</option>
              </select>
            </div>
          </div>

          {/* Partial Payment Calculation Block */}
          {paymentStatus === 'Partially Paid' && (
            <div className="p-3.5 bg-[#F4EFE6] dark:bg-[#221D19] rounded-xl border border-[#E8DFD1] dark:border-[#332C25] space-y-3">
              <span className="text-xs font-bold text-[#80142B] dark:text-[#E2C799] uppercase tracking-wider block">
                Partial Payment Breakdown
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-[#7D7067] dark:text-[#A89F97] block">
                    Total Contract Cost
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="50000"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-[#181512] border border-[#E0D7C7] dark:border-[#352F28] rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#7D7067] dark:text-[#A89F97] block">
                    Amount Paid Now
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="20000"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-[#181512] border border-[#E0D7C7] dark:border-[#352F28] rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#7D7067] dark:text-[#A89F97] block">
                    Due Remaining (Auto)
                  </label>
                  <div className="px-2.5 py-1.5 text-xs font-bold text-[#80142B] dark:text-[#E2C799] bg-[#EAE3D5] dark:bg-[#2D2620] rounded-lg">
                    {formatINR(amountRemaining)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Linked Ceremony / Event */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
              Ceremony / Event
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden"
            >
              {data.events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
              Notes / Remarks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Receipt #1234, remaining due before Sangeet night"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden"
            />
          </div>

          {/* Receipt Attachment */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#80142B] dark:text-[#C5A059]" />
              Attach Bill / Receipt / Invoice (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-xs font-medium bg-[#EFE9DE] dark:bg-[#25211D] hover:bg-[#E2D8C7] dark:hover:bg-[#342D26] text-[#4A403A] dark:text-[#D5CCC4] rounded-xl border border-[#DFD5C3] dark:border-[#332C25] transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{receiptUrl ? 'Replace Document' : 'Upload Receipt'}</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {receiptName && (
                <span className="text-xs text-[#7D7067] dark:text-[#A89F97] truncate max-w-[200px]">
                  ✓ {receiptName}
                </span>
              )}
              {receiptUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setReceiptUrl(null);
                    setReceiptName(null);
                  }}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            {receiptUrl && (
              <div className="mt-2 w-24 h-16 rounded-lg overflow-hidden border border-[#E0D7C7] dark:border-[#352F28]">
                <img
                  src={receiptUrl}
                  alt="Receipt Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Modal Footer / Buttons */}
          <div className="pt-3 border-t border-[#E8DFD1] dark:border-[#2E2823] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[#7D7067] dark:text-[#A89F97] hover:bg-[#EAE3D5] dark:hover:bg-[#2D2620] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-[#80142B] hover:bg-[#681023] text-white rounded-xl shadow-md shadow-[#80142B]/20 transition-all transform active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>{expenseToEdit ? 'Save Changes' : 'Save Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
