import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Vendor } from '../../types';
import { X, Store, IndianRupee, Phone, Calendar, Check } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface VendorModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  vendorToEdit?: Vendor | null;
}

const VENDOR_CATEGORIES = [
  'Venue',
  'Catering',
  'Decoration',
  'Photography',
  'Videography',
  'Makeup & Mehendi',
  'Entertainment & DJ',
  'Clothing',
  'Jewellery',
  'Travel & Transport',
  'Accommodation',
  'Invitations & Gifts',
  'Rituals & Priest',
  'Other',
];

export const VendorModal: React.FC<VendorModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  vendorToEdit: propVendorToEdit,
}) => {
  const {
    addVendor,
    updateVendor,
    isAddVendorOpen,
    setIsAddVendorOpen,
    vendorToEdit: contextVendorToEdit,
    setVendorToEdit,
  } = useWedding();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isAddVendorOpen;
  const onClose =
    propOnClose ||
    (() => {
      setIsAddVendorOpen(false);
      setVendorToEdit(null);
    });
  const vendorToEdit =
    propVendorToEdit !== undefined ? propVendorToEdit : contextVendorToEdit;

  const [name, setName] = useState('');
  const [category, setCategory] = useState(VENDOR_CATEGORIES[0]);
  const [contractAmount, setContractAmount] = useState<number | ''>('');
  const [amountPaid, setAmountPaid] = useState<number | ''>(0);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [personName, setPersonName] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Vendor['status']>('Booked');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (vendorToEdit) {
        setName(vendorToEdit.name);
        setCategory(vendorToEdit.category);
        setContractAmount(vendorToEdit.contractAmount);
        setAmountPaid(vendorToEdit.amountPaid);
        setPhone(vendorToEdit.contact?.phone || '');
        setEmail(vendorToEdit.contact?.email || '');
        setPersonName(vendorToEdit.contact?.personName || '');
        setNextPaymentDate(vendorToEdit.nextPaymentDate || '');
        setNotes(vendorToEdit.notes || '');
        setStatus(vendorToEdit.status);
      } else {
        setName('');
        setCategory(VENDOR_CATEGORIES[0]);
        setContractAmount('');
        setAmountPaid(0);
        setPhone('');
        setEmail('');
        setPersonName('');
        setNextPaymentDate('');
        setNotes('');
        setStatus('Booked');
      }
      setError('');
    }
  }, [isOpen, vendorToEdit]);

  if (!isOpen) return null;

  const totalContract = typeof contractAmount === 'number' ? contractAmount : 0;
  const paidVal = typeof amountPaid === 'number' ? amountPaid : 0;
  const dueVal = Math.max(0, totalContract - paidVal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide vendor or agency name');
      return;
    }
    if (totalContract <= 0) {
      setError('Please enter contract or package amount');
      return;
    }

    if (vendorToEdit) {
      updateVendor(vendorToEdit.id, {
        name,
        category,
        contractAmount: totalContract,
        amountPaid: paidVal,
        amountDue: dueVal,
        contact: {
          phone,
          email: email || undefined,
          personName: personName || undefined,
        },
        nextPaymentDate: nextPaymentDate || undefined,
        notes,
        status,
      });
    } else {
      addVendor({
        name,
        category,
        contractAmount: totalContract,
        amountPaid: paidVal,
        amountDue: dueVal,
        contact: {
          phone,
          email: email || undefined,
          personName: personName || undefined,
        },
        nextPaymentDate: nextPaymentDate || undefined,
        notes,
        status,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F5] dark:bg-[#181512] rounded-2xl shadow-2xl border border-[#E8DFD1] dark:border-[#2E2823] w-full max-w-lg overflow-hidden my-6">
        <div className="px-6 py-4 bg-[#F4EFE6] dark:bg-[#201C18] border-b border-[#E8DFD1] dark:border-[#2E2823] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#80142B] text-white flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                {vendorToEdit ? 'Edit Wedding Vendor' : 'Add Wedding Vendor'}
              </h3>
              <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                Track contracts, advances & balance due
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Vendor Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
              Vendor / Business Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Palace Banquet, Annapurna Caterers, Kabir Photography"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden focus:ring-2 focus:ring-[#80142B]"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
                Service Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden"
              >
                {VENDOR_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
                Booking Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden"
              >
                <option value="Booked">Confirmed / Booked</option>
                <option value="In Discussion">In Discussion / Quotation</option>
                <option value="Completed">Service Completed</option>
              </select>
            </div>
          </div>

          {/* Financials: Contract Amount, Paid, Due */}
          <div className="p-3.5 bg-[#F4EFE6] dark:bg-[#221D19] rounded-xl border border-[#E8DFD1] dark:border-[#332C25] space-y-3">
            <span className="text-xs font-bold text-[#80142B] dark:text-[#E2C799] uppercase tracking-wider block">
              Contract & Payment Figures
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] text-[#7D7067] dark:text-[#A89F97] block font-medium">
                  Total Contract (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="200000"
                  value={contractAmount}
                  onChange={(e) => setContractAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-bold bg-white dark:bg-[#181512] border border-[#E0D7C7] dark:border-[#352F28] rounded-lg text-[#2C2523] dark:text-[#EAE5DF]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#7D7067] dark:text-[#A89F97] block font-medium">
                  Already Paid (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="50000"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-bold bg-white dark:bg-[#181512] border border-[#E0D7C7] dark:border-[#352F28] rounded-lg text-[#2C2523] dark:text-[#EAE5DF]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#7D7067] dark:text-[#A89F97] block font-medium">
                  Balance Due
                </label>
                <div className="px-2.5 py-1.5 text-xs font-bold text-[#80142B] dark:text-[#E2C799] bg-[#EAE3D5] dark:bg-[#2D2620] rounded-lg">
                  {formatINR(dueVal)}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#80142B] dark:text-[#C5A059]" />
                Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
                Contact Person
              </label>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Manager / Point of Contact"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Next Due Date & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#80142B] dark:text-[#C5A059]" />
                Next Payment Date
              </label>
              <input
                type="date"
                value={nextPaymentDate}
                onChange={(e) => setNextPaymentDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vendor@shubhevent.in"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
              Scope / Deliverables / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 500 guests capacity, includes sound equipment, drone shoot included"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF] focus:outline-hidden"
            />
          </div>

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
              <span>{vendorToEdit ? 'Save Vendor' : 'Add Vendor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
