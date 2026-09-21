import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  WeddingData,
  Expense,
  Vendor,
  Category,
  Person,
  PaymentSchedule,
  WeddingEvent,
  PaymentMethod,
} from '../types';
import { initialWeddingData } from '../utils/sampleData';
import { getPaymentUrgency } from '../utils/formatters';

export type ActiveTab =
  | 'dashboard'
  | 'expenses'
  | 'budget'
  | 'vendors'
  | 'payments'
  | 'people'
  | 'categories'
  | 'reports'
  | 'settings';

export interface CategorySummary {
  category: Category;
  budget: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  isOverBudget: boolean;
  overAmount: number;
  expenseCount: number;
}

export interface PersonSummary {
  person: Person;
  totalPaid: number;
  count: number;
  percentageOfTotal: number;
  expenses: Expense[];
}

export interface DynamicInsight {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  icon: string;
  title: string;
  message: string;
}

interface WeddingContextType {
  data: WeddingData;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeEventId: string;
  setActiveEventId: (eventId: string) => void;
  
  // Calculated metrics
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  committedAmount: number;
  availableAmount: number;
  budgetUtilization: number;
  categorySummaries: CategorySummary[];
  peopleSummaries: PersonSummary[];
  upcomingPayments: (PaymentSchedule & { urgency: ReturnType<typeof getPaymentUrgency> })[];
  dynamicInsights: DynamicInsight[];
  
  // Expense operations
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Vendor operations
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  
  // Category operations
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // People operations
  addPerson: (person: Omit<Person, 'id'>) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  
  // Payment schedule operations
  addPaymentSchedule: (schedule: Omit<PaymentSchedule, 'id'>) => void;
  markPaymentPaid: (scheduleId: string, method?: PaymentMethod) => void;
  markPaymentAsPaid: (scheduleId: string, paidBy?: string, method?: PaymentMethod) => void;
  deletePaymentSchedule: (id: string) => void;
  
  // Event operations
  addEvent: (event: Omit<WeddingEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<WeddingEvent>) => void;
  
  // Meta / Settings
  updateWeddingBudget: (budget: number) => void;
  updateWeddingInfo: (name: string, coupleNames: string, date: string, city?: string) => void;
  toggleCompactINR: () => void;
  toggleTheme: () => void;
  resetToDemoData: () => void;
  clearAllData: () => void;
  importJsonData: (jsonString: string) => boolean;
  exportDataBackup: () => void;
  importDataBackup: (jsonString: string) => boolean;
  
  // Modals & UI helpers
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  expenseToEdit: Expense | null;
  setExpenseToEdit: (exp: Expense | null) => void;
  isAddVendorOpen: boolean;
  setIsAddVendorOpen: (open: boolean) => void;
  vendorToEdit: Vendor | null;
  setVendorToEdit: (v: Vendor | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isVendorDetailOpen: boolean;
  selectedVendorId: string | null;
  openVendorDetail: (id: string) => void;
  closeVendorDetail: () => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  syncStatus: 'connecting' | 'synced' | 'saving' | 'offline';
  lastCloudSync: string | null;
  manualSync: () => Promise<void>;
}

const STORAGE_KEY = 'shaadi_wedding_budget_data_v2';
const WEDDING_DOC_ID = 'w-mampi-akash-2026';

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WeddingData>(() => {
    try {
      // Clean up previous v1 cache if any
      localStorage.removeItem('shaadi_wedding_budget_data_v1');
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id === 'w-mampi-akash-2026') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored wedding data', e);
    }
    return initialWeddingData;
  });

  const [syncStatus, setSyncStatus] = useState<'connecting' | 'synced' | 'saving' | 'offline'>('connecting');
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(null);
  const isIncomingCloudUpdate = useRef(false);
  const hasInitializedFromCloud = useRef(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeEventId, setActiveEventId] = useState<string>(data.settings.activeEventId || 'all');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [vendorToEdit, setVendorToEdit] = useState<Vendor | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVendorDetailOpen, setIsVendorDetailOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // 1. Real-time Cloud Synchronization Listener
  useEffect(() => {
    const docRef = doc(db, 'weddings', WEDDING_DOC_ID);
    setSyncStatus('connecting');

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data() as WeddingData;
          if (cloudData && cloudData.id) {
            isIncomingCloudUpdate.current = true;
            setData(cloudData);
            setSyncStatus('synced');
            setLastCloudSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
            } catch (err) {
              console.warn('Storage warning', err);
            }
          }
        } else {
          // If first time cloud init, seed the wedding plan to Firestore
          setDoc(docRef, {
            ...initialWeddingData,
            lastUpdated: new Date().toISOString(),
          })
            .then(() => {
              setSyncStatus('synced');
              setLastCloudSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            })
            .catch((err) => {
              console.error('Failed to seed cloud database:', err);
              setSyncStatus('offline');
            });
        }
        hasInitializedFromCloud.current = true;
      },
      (error) => {
        console.warn('Real-time listener warning (using offline/local cache):', error);
        setSyncStatus('offline');
        hasInitializedFromCloud.current = true;
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Broadcast local changes to Firestore in real-time
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save wedding data to localStorage', e);
    }

    // Skip write back if this update was pushed from the cloud
    if (isIncomingCloudUpdate.current) {
      isIncomingCloudUpdate.current = false;
      return;
    }

    if (!hasInitializedFromCloud.current) {
      return;
    }

    setSyncStatus('saving');
    const timer = setTimeout(async () => {
      try {
        const docRef = doc(db, 'weddings', WEDDING_DOC_ID);
        await setDoc(docRef, {
          ...data,
          lastUpdated: new Date().toISOString(),
        }, { merge: true });
        setSyncStatus('synced');
        setLastCloudSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.error('Failed to sync changes to Firestore:', err);
        setSyncStatus('offline');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [data]);

  const manualSync = async () => {
    setSyncStatus('saving');
    try {
      const docRef = doc(db, 'weddings', WEDDING_DOC_ID);
      await setDoc(docRef, {
        ...data,
        lastUpdated: new Date().toISOString(),
      }, { merge: true });
      setSyncStatus('synced');
      setLastCloudSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.error('Manual sync failed:', e);
      setSyncStatus('offline');
    }
  };

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (data.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data.settings.theme]);

  // Filter expenses by active event if selected
  const filteredExpenses = useMemo(() => {
    if (activeEventId === 'all' || !activeEventId) {
      return data.expenses;
    }
    return data.expenses.filter((e) => e.eventId === activeEventId);
  }, [data.expenses, activeEventId]);

  // Total Budget calculation
  const totalBudget = useMemo(() => {
    if (activeEventId === 'all' || !activeEventId) {
      return data.totalBudget;
    }
    const currentEvent = data.events.find((ev) => ev.id === activeEventId);
    return currentEvent ? currentEvent.allocatedBudget : data.totalBudget;
  }, [data.totalBudget, data.events, activeEventId]);

  // Total Spent (paid expenses)
  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => {
      if (exp.paymentStatus === 'Paid') {
        return sum + exp.amount;
      }
      if (exp.paymentStatus === 'Partially Paid' && exp.amountPaid) {
        return sum + exp.amountPaid;
      }
      return sum;
    }, 0);
  }, [filteredExpenses]);

  // Remaining Budget
  const remainingBudget = useMemo(() => {
    return totalBudget - totalSpent;
  }, [totalBudget, totalSpent]);

  // Committed Amount: pending payment schedules + unpaid amounts from partially paid expenses
  const committedAmount = useMemo(() => {
    const pendingSchedules = data.paymentSchedules
      .filter((s) => s.status === 'Pending' || s.status === 'Overdue')
      .reduce((sum, s) => sum + s.amount, 0);

    const pendingExpenses = filteredExpenses
      .filter((e) => e.paymentStatus === 'Pending')
      .reduce((sum, e) => sum + e.amount, 0);

    const partialRemaining = filteredExpenses
      .filter((e) => e.paymentStatus === 'Partially Paid' && e.amountRemaining)
      .reduce((sum, e) => sum + (e.amountRemaining || 0), 0);

    // If schedules exist, use them as primary committed or fallback to pending expenses
    return Math.max(pendingSchedules, pendingExpenses + partialRemaining);
  }, [data.paymentSchedules, filteredExpenses]);

  // Available = Total Budget - Total Spent - Committed
  const availableAmount = useMemo(() => {
    return totalBudget - totalSpent - committedAmount;
  }, [totalBudget, totalSpent, committedAmount]);

  // Budget Utilization %
  const budgetUtilization = useMemo(() => {
    if (totalBudget <= 0) return 0;
    return Math.round((totalSpent / totalBudget) * 100);
  }, [totalSpent, totalBudget]);

  // Category Summaries
  const categorySummaries = useMemo<CategorySummary[]>(() => {
    return data.categories.map((cat) => {
      const catExpenses = filteredExpenses.filter((e) => e.categoryId === cat.id);
      const spent = catExpenses.reduce((sum, exp) => {
        if (exp.paymentStatus === 'Paid') return sum + exp.amount;
        if (exp.paymentStatus === 'Partially Paid' && exp.amountPaid) return sum + exp.amountPaid;
        return sum;
      }, 0);

      const budget = cat.budget || 0;
      const remaining = budget - spent;
      const percentageUsed = budget > 0 ? Math.round((spent / budget) * 100) : 0;
      const isOverBudget = spent > budget;
      const overAmount = isOverBudget ? spent - budget : 0;

      return {
        category: cat,
        budget,
        spent,
        remaining,
        percentageUsed,
        isOverBudget,
        overAmount,
        expenseCount: catExpenses.length,
      };
    });
  }, [data.categories, filteredExpenses]);

  // People Summaries
  const peopleSummaries = useMemo<PersonSummary[]>(() => {
    const totalContributed = totalSpent || 1;
    return data.people.map((person) => {
      const personExpenses = filteredExpenses.filter((e) => e.paidBy === person.name);
      const totalPaid = personExpenses.reduce((sum, exp) => {
        if (exp.paymentStatus === 'Paid') return sum + exp.amount;
        if (exp.paymentStatus === 'Partially Paid' && exp.amountPaid) return sum + exp.amountPaid;
        return sum;
      }, 0);

      const count = personExpenses.length;
      const percentageOfTotal = Math.round((totalPaid / totalContributed) * 100);

      return {
        person,
        totalPaid,
        count,
        percentageOfTotal,
        expenses: personExpenses,
      };
    }).sort((a, b) => b.totalPaid - a.totalPaid);
  }, [data.people, filteredExpenses, totalSpent]);

  // Upcoming Payments with Urgency
  const upcomingPayments = useMemo(() => {
    return data.paymentSchedules
      .map((s) => ({
        ...s,
        urgency: getPaymentUrgency(s.dueDate, s.status === 'Paid'),
      }))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [data.paymentSchedules]);

  // Dynamic Insights
  const dynamicInsights = useMemo<DynamicInsight[]>(() => {
    const insights: DynamicInsight[] = [];

    // 1. Over budget categories
    const overBudgetCats = categorySummaries.filter((c) => c.isOverBudget);
    overBudgetCats.forEach((c) => {
      insights.push({
        id: `ins-over-${c.category.id}`,
        type: 'warning',
        icon: 'AlertTriangle',
        title: `${c.category.name} is Over Budget`,
        message: `${c.category.name} has exceeded its allocation by ₹${c.overAmount.toLocaleString('en-IN')}.`,
      });
    });

    // 2. High utilization warning (e.g. >= 85% used)
    const highCats = categorySummaries.filter((c) => !c.isOverBudget && c.percentageUsed >= 85 && c.budget > 0);
    highCats.forEach((c) => {
      insights.push({
        id: `ins-high-${c.category.id}`,
        type: 'info',
        icon: 'Lightbulb',
        title: `${c.category.name} Budget Warning`,
        message: `${c.category.name} has used ${c.percentageUsed}% of its assigned budget.`,
      });
    });

    // 3. Overall budget status
    if (totalSpent > totalBudget && totalBudget > 0) {
      insights.push({
        id: 'ins-overall-over',
        type: 'alert',
        icon: 'AlertCircle',
        title: 'Wedding Budget Exceeded',
        message: `Total expenses exceed overall budget by ₹${(totalSpent - totalBudget).toLocaleString('en-IN')}.`,
      });
    } else if (totalBudget > 0) {
      insights.push({
        id: 'ins-overall-health',
        type: 'success',
        icon: 'CheckCircle2',
        title: 'Budget On Track',
        message: `You have used ${budgetUtilization}% of the total wedding budget with ₹${availableAmount.toLocaleString('en-IN')} available.`,
      });
    }

    // 4. Largest expense category
    const sortedCats = [...categorySummaries].sort((a, b) => b.spent - a.spent);
    if (sortedCats.length > 0 && sortedCats[0].spent > 0) {
      insights.push({
        id: 'ins-largest-cat',
        type: 'info',
        icon: 'TrendingUp',
        title: 'Largest Expense Category',
        message: `${sortedCats[0].category.name} is currently your highest expenditure category at ₹${sortedCats[0].spent.toLocaleString('en-IN')}.`,
      });
    }

    // 5. Urgent upcoming payments
    const dueSoon = upcomingPayments.filter((p) => p.urgency === 'Due soon' || p.urgency === 'Overdue');
    if (dueSoon.length > 0) {
      const sumDue = dueSoon.reduce((s, p) => s + p.amount, 0);
      insights.push({
        id: 'ins-due-soon',
        type: 'warning',
        icon: 'Calendar',
        title: 'Payments Due Soon',
        message: `₹${sumDue.toLocaleString('en-IN')} in payments require attention in the next 7 days.`,
      });
    }

    return insights;
  }, [categorySummaries, totalSpent, totalBudget, budgetUtilization, availableAmount, upcomingPayments]);

  // Operations
  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // If linked to vendor, update vendor amounts
    let updatedVendors = data.vendors;
    if (expenseData.vendorId) {
      const paidToAdd =
        expenseData.paymentStatus === 'Paid'
          ? expenseData.amount
          : expenseData.paymentStatus === 'Partially Paid' && expenseData.amountPaid
          ? expenseData.amountPaid
          : 0;

      updatedVendors = data.vendors.map((v) => {
        if (v.id === expenseData.vendorId) {
          const newPaid = v.amountPaid + paidToAdd;
          const newDue = Math.max(0, v.contractAmount - newPaid);
          return { ...v, amountPaid: newPaid, amountDue: newDue };
        }
        return v;
      });
    }

    setData((prev) => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses],
      vendors: updatedVendors,
    }));
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  };

  const deleteExpense = (id: string) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  };

  const addVendor = (vendorData: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `v-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      vendors: [...prev.vendors, newVendor],
    }));
  };

  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    setData((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  };

  const deleteVendor = (id: string) => {
    setData((prev) => ({
      ...prev,
      vendors: prev.vendors.filter((v) => v.id !== id),
      expenses: prev.expenses.map((e) => (e.vendorId === id ? { ...e, vendorId: undefined } : e)),
    }));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  const deleteCategory = (id: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
  };

  const addPerson = (personData: Omit<Person, 'id'>) => {
    const newPerson: Person = {
      ...personData,
      id: `p-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      people: [...prev.people, newPerson],
    }));
  };

  const updatePerson = (id: string, updates: Partial<Person>) => {
    setData((prev) => ({
      ...prev,
      people: prev.people.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const deletePerson = (id: string) => {
    setData((prev) => ({
      ...prev,
      people: prev.people.filter((p) => p.id !== id),
    }));
  };

  const addPaymentSchedule = (scheduleData: Omit<PaymentSchedule, 'id'>) => {
    const newSchedule: PaymentSchedule = {
      ...scheduleData,
      id: `sch-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      paymentSchedules: [...prev.paymentSchedules, newSchedule],
    }));
  };

  const markPaymentPaid = (scheduleId: string, method: PaymentMethod = 'UPI') => {
    markPaymentAsPaid(scheduleId, undefined, method);
  };

  const markPaymentAsPaid = (
    scheduleId: string,
    paidBy?: string,
    method: PaymentMethod = 'UPI'
  ) => {
    const targetSchedule = data.paymentSchedules.find((s) => s.id === scheduleId);
    if (!targetSchedule) return;

    // Create an expense automatically for this paid payment
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      categoryId:
        data.categories.find((c) => c.name.toLowerCase() === targetSchedule.category.toLowerCase())?.id ||
        data.categories[0]?.id ||
        'cat-misc',
      vendorId: targetSchedule.vendorId,
      name: `${targetSchedule.vendorName} Payment`,
      amount: targetSchedule.amount,
      date: new Date().toISOString().split('T')[0],
      paidBy: paidBy || data.people[0]?.name || 'Family',
      paymentMethod: method,
      paymentStatus: 'Paid',
      notes: targetSchedule.notes || 'Recorded from Payment Schedule',
      createdAt: new Date().toISOString(),
    };

    // Update vendor if applicable
    const updatedVendors = targetSchedule.vendorId
      ? data.vendors.map((v) => {
          if (v.id === targetSchedule.vendorId) {
            const newPaid = v.amountPaid + targetSchedule.amount;
            const newDue = Math.max(0, v.contractAmount - newPaid);
            return { ...v, amountPaid: newPaid, amountDue: newDue };
          }
          return v;
        })
      : data.vendors;

    setData((prev) => ({
      ...prev,
      paymentSchedules: prev.paymentSchedules.map((s) =>
        s.id === scheduleId
          ? {
              ...s,
              status: 'Paid',
              paidDate: new Date().toISOString().split('T')[0],
              paymentMethod: method,
            }
          : s
      ),
      expenses: [newExpense, ...prev.expenses],
      vendors: updatedVendors,
    }));
  };

  const exportDataBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `shaadi_budget_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataBackup = (jsonString: string): boolean => {
    return importJsonData(jsonString);
  };

  const deletePaymentSchedule = (id: string) => {
    setData((prev) => ({
      ...prev,
      paymentSchedules: prev.paymentSchedules.filter((s) => s.id !== id),
    }));
  };

  const addEvent = (eventData: Omit<WeddingEvent, 'id'>) => {
    const newEvent: WeddingEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));
  };

  const updateEvent = (id: string, updates: Partial<WeddingEvent>) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev)),
    }));
  };

  const updateWeddingBudget = (budget: number) => {
    setData((prev) => ({
      ...prev,
      totalBudget: budget,
    }));
  };

  const updateWeddingInfo = (name: string, coupleNames: string, date: string, city?: string) => {
    setData((prev) => ({
      ...prev,
      name,
      coupleNames,
      date,
      city: city || prev.city,
    }));
  };

  const toggleCompactINR = () => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        useCompactINR: !prev.settings.useCompactINR,
      },
    }));
  };

  const toggleTheme = () => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: prev.settings.theme === 'dark' ? 'light' : 'dark',
      },
    }));
  };

  const resetToDemoData = () => {
    setData(initialWeddingData);
    setActiveEventId('all');
  };

  const clearAllData = () => {
    const freshData: WeddingData = {
      ...initialWeddingData,
      id: `w-${Date.now()}`,
      name: 'Our Shubh Vivah',
      coupleNames: 'Bride & Groom',
      totalBudget: 1000000,
      expenses: [],
      paymentSchedules: [],
      vendors: [],
    };
    setData(freshData);
    setActiveEventId('all');
  };

  const importJsonData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.categories && parsed.expenses && parsed.totalBudget !== undefined) {
        setData(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON file', e);
    }
    return false;
  };

  const openVendorDetail = (id: string) => {
    setSelectedVendorId(id);
    setIsVendorDetailOpen(true);
  };

  const closeVendorDetail = () => {
    setIsVendorDetailOpen(false);
    setSelectedVendorId(null);
  };

  return (
    <WeddingContext.Provider
      value={{
        data,
        activeTab,
        setActiveTab,
        activeEventId,
        setActiveEventId,
        totalBudget,
        totalSpent,
        remainingBudget,
        committedAmount,
        availableAmount,
        budgetUtilization,
        categorySummaries,
        peopleSummaries,
        upcomingPayments,
        dynamicInsights,
        addExpense,
        updateExpense,
        deleteExpense,
        addVendor,
        updateVendor,
        deleteVendor,
        addCategory,
        updateCategory,
        deleteCategory,
        addPerson,
        updatePerson,
        deletePerson,
        addPaymentSchedule,
        markPaymentPaid,
        markPaymentAsPaid,
        deletePaymentSchedule,
        addEvent,
        updateEvent,
        updateWeddingBudget,
        updateWeddingInfo,
        toggleCompactINR,
        toggleTheme,
        resetToDemoData,
        clearAllData,
        importJsonData,
        exportDataBackup,
        importDataBackup,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        expenseToEdit,
        setExpenseToEdit,
        isAddVendorOpen,
        setIsAddVendorOpen,
        vendorToEdit,
        setVendorToEdit,
        isSearchOpen,
        setIsSearchOpen,
        isVendorDetailOpen,
        selectedVendorId,
        openVendorDetail,
        closeVendorDetail,
        isOnboardingOpen,
        setIsOnboardingOpen,
        syncStatus,
        lastCloudSync,
        manualSync,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
