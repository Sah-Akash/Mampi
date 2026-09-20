import React, { useEffect } from 'react';
import { WeddingProvider, useWedding } from './context/WeddingContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';

// Modals
import { ExpenseModal } from './components/modals/ExpenseModal';
import { VendorModal } from './components/modals/VendorModal';
import { VendorDetailDrawer } from './components/modals/VendorDetailDrawer';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { OnboardingModal } from './components/modals/OnboardingModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ExpensesView } from './components/views/ExpensesView';
import { BudgetView } from './components/views/BudgetView';
import { VendorsView } from './components/views/VendorsView';
import { PaymentsView } from './components/views/PaymentsView';
import { PeopleView } from './components/views/PeopleView';
import { CategoriesView } from './components/views/CategoriesView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab, isSearchOpen, setIsSearchOpen, setIsAddExpenseOpen } = useWedding();

  // Global keyboard shortcuts (⌘K for search, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'expenses':
        return <ExpensesView />;
      case 'budget':
        return <BudgetView />;
      case 'vendors':
        return <VendorsView />;
      case 'payments':
        return <PaymentsView />;
      case 'people':
        return <PeopleView />;
      case 'categories':
        return <CategoriesView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#12100E] text-[#2C2523] dark:text-[#EAE5DF] flex flex-row antialiased selection:bg-[#80142B] selection:text-white">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals & Drawers */}
      <ExpenseModal />
      <VendorModal />
      <VendorDetailDrawer />
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <OnboardingModal />
    </div>
  );
};

export default function App() {
  return (
    <WeddingProvider>
      <MainLayout />
    </WeddingProvider>
  );
}
