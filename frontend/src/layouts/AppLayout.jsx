import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import MobileNav from '../components/layout/MobileNav';
import TransactionForm from '../components/transactions/TransactionForm';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/analytics': 'Analytics',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const location = useLocation();

  const title = PAGE_TITLES[location.pathname] || 'FinTrack';

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--color-bg)',
        backgroundImage:
          'radial-gradient(ellipse 80% 60% at 15% 0%, rgba(99,102,241,0.06) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 85% 90%, rgba(139,92,246,0.05) 0%, transparent 55%), radial-gradient(ellipse 40% 40% at 70% 20%, rgba(14,165,233,0.03) 0%, transparent 50%)',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((p) => !p)}
        />
      </div>

      {/* Main content */}
      <main
        className={`flex flex-col min-h-screen transition-all duration-300 main-content-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      >
        <Header
          title={title}
          onAddTransaction={() => setShowAddModal(true)}
        />

        {/* Page content */}
        <div
          className="flex-1 overflow-auto p-4 sm:p-7 pb-28 lg:pb-8"
          style={{ minHeight: 0 }}
        >
          <Outlet context={{ setShowAddModal }} />
        </div>
      </main>

      {/* Mobile bottom nav with FAB */}
      <MobileNav onAddTransaction={() => setShowAddModal(true)} />

      {/* Global Add Transaction Modal */}
      <TransactionForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          window.dispatchEvent(new CustomEvent('expense-updated'));
        }}
      />
    </div>
  );
};

export default AppLayout;
