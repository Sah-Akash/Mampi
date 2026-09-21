export type PaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Card' | 'Cheque' | 'Other';
export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Pending';
export type UrgencyStatus = 'Paid' | 'Due soon' | 'Due later' | 'Overdue';

export interface WeddingEvent {
  id: string;
  name: string;
  date: string;
  allocatedBudget: number;
  budget?: number;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  budget: number;
  icon?: string;
  color: string;
}

export interface Person {
  id: string;
  name: string;
  relation: string;
  avatarColor: string;
  phone?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contractAmount: number;
  amountPaid: number;
  amountDue: number;
  contact: {
    phone: string;
    email?: string;
    personName?: string;
  };
  nextPaymentDate?: string;
  notes?: string;
  status: 'Booked' | 'In Discussion' | 'Completed' | 'Shortlisted' | 'Contacted';
}

export interface ExpenseReceipt {
  id: string;
  name: string;
  dataUrl?: string;
  size?: string;
  type?: string;
}

export interface Expense {
  id: string;
  eventId?: string; // Multi-event support (e.g. Sangeet, Wedding, Reception)
  categoryId: string;
  vendorId?: string;
  name: string;
  amount: number; // For partially paid, this is total cost or actual transaction
  totalAmount?: number; // If partially paid
  amountPaid?: number; // If partially paid
  amountRemaining?: number; // If partially paid
  date: string;
  paidBy: string; // Person Name or ID
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  receipt?: ExpenseReceipt;
  createdAt: string;
}

export interface PaymentSchedule {
  id: string;
  vendorId?: string;
  vendorName: string;
  category: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  urgency?: UrgencyStatus;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  expenseId?: string;
}

export interface WeddingData {
  id: string;
  name: string;
  coupleNames: string;
  date: string;
  totalBudget: number;
  currency: string;
  currencySymbol: string;
  city?: string;
  events: WeddingEvent[];
  categories: Category[];
  vendors: Vendor[];
  people: Person[];
  expenses: Expense[];
  paymentSchedules: PaymentSchedule[];
  settings: {
    useCompactINR: boolean;
    theme: 'light' | 'dark';
    activeEventId: string | 'all';
  };
  lastUpdated?: string;
}
