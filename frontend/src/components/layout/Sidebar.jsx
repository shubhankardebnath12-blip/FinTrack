import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',    to: '/',             exact: true },
  { icon: ArrowLeftRight,  label: 'Transactions', to: '/transactions', exact: false },
  { icon: BarChart3,       label: 'Analytics',    to: '/analytics',    exact: false },
  { icon: FileText,        label: 'Reports',      to: '/reports',      exact: false },
  { icon: Settings,        label: 'Settings',     to: '/settings',     exact: false },
];

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside
      style={{
        width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        background: 'var(--color-sidebar-bg)',
        borderRight: '1px solid var(--color-border)',
        boxShadow: '4px 0 32px rgba(0,0,0,0.15)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-white/[0.06] flex-shrink-0 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        {/* Logo mark */}
        <div
          className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 0 20px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
          onClick={onToggle}
        >
          <Wallet size={17} className="text-white" />
          {/* Sparkle dot */}
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-violet-400 border-2 border-surface-950 animate-pulse" />
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-white leading-none">FinTrack</h1>
            <p className="text-[10px] text-white/30 mt-0.5 font-medium tracking-wide uppercase">Smart Finance</p>
          </div>
        )}

        {!collapsed && (
          <button
            onClick={onToggle}
            className="btn-icon hidden lg:flex flex-shrink-0"
          >
            <ChevronLeft size={15} />
          </button>
        )}
        <button
          onClick={onToggle}
          className="btn-icon lg:hidden flex-shrink-0 ml-auto"
        >
          <X size={15} />
        </button>
        {collapsed && (
          <button
            onClick={onToggle}
            className="btn-icon hidden lg:flex absolute right-2 bottom-20"
          >
            <ChevronRight size={15} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/20 px-3 mb-3">
            Navigation
          </p>
        )}

        {NAV_ITEMS.map(({ icon: Icon, label, to, exact }) => {
          const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group
                ${collapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.05]'
                }`}
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.12) 100%)',
                border: '1px solid rgba(99,102,241,0.22)',
                boxShadow: '0 0 20px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
              } : {}}
            >
              {/* Active indicator bar */}
              {isActive && !collapsed && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: 'linear-gradient(180deg, #818cf8, #c084fc)' }}
                />
              )}

              <Icon
                size={17}
                className={`flex-shrink-0 transition-all duration-200 ${
                  isActive ? 'text-primary-400' : 'group-hover:text-white/70'
                }`}
              />

              {!collapsed && <span className="font-[480]">{label}</span>}

              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 shadow-glow-sm" />
              )}

              {/* Tooltip on collapse */}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-surface-800 text-white text-xs rounded-lg
                  opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200
                  whitespace-nowrap border border-white/10 shadow-lg z-50">
                  {label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Upgrade card (non-collapsed only) */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl" style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
          border: '1px solid rgba(99,102,241,0.15)',
        }}>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={13} className="text-violet-400" />
            <span className="text-xs font-semibold text-white">Pro Features</span>
          </div>
          <p className="text-[10px] text-white/35 leading-relaxed">
            Unlock AI insights, export & multi-currency.
          </p>
          <button
            className="mt-2 w-full py-1.5 text-[11px] font-semibold rounded-lg text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* User profile */}
      <div className={`px-3 pb-4 border-t border-white/[0.06] pt-3 flex-shrink-0 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
        <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.05] transition-colors duration-200 cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 12px rgba(99,102,241,0.3)' }}
          >
            {getInitials(user?.name)}
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white/90 truncate leading-none">{user?.name}</p>
                <p className="text-[10px] text-white/35 truncate mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="btn-icon text-white/25 hover:text-danger-400 w-8 h-8 flex-shrink-0"
                title="Logout"
              >
                <LogOut size={13} />
              </button>
            </>
          )}
        </div>

        {collapsed && (
          <button
            onClick={logout}
            className="btn-icon text-white/25 hover:text-danger-400 w-8 h-8"
            title="Logout"
          >
            <LogOut size={13} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
