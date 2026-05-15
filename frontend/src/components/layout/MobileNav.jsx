import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Plus,
} from 'lucide-react';

const NAV = [
  { icon: LayoutDashboard, label: 'Home',    to: '/',             exact: true },
  { icon: ArrowLeftRight,  label: 'Txns',    to: '/transactions', exact: false },
  { icon: BarChart3,       label: 'Charts',  to: '/analytics',    exact: false },
  { icon: Settings,        label: 'Settings',to: '/settings',     exact: false },
];

const MobileNav = ({ onAddTransaction }) => {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        background: 'var(--color-sidebar-bg)',
        borderTop: '1px solid var(--color-border)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.25)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around px-2 h-[64px]">
        {/* First two nav items */}
        {NAV.slice(0, 2).map(({ icon: Icon, label, to, exact }) => {
          const active = exact ? location.pathname === to : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 active:scale-90 select-none"
              style={{ touchAction: 'manipulation' }}
            >
              <div
                className="relative flex items-center justify-center w-10 h-8 rounded-2xl transition-all duration-200"
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))',
                } : {}}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{ color: active ? '#818cf8' : 'var(--color-text-muted)' }}
                />
                {active && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: '#818cf8' }}
                  />
                )}
              </div>
              <span
                className="text-[10px] font-semibold tracking-wide transition-colors duration-200"
                style={{ color: active ? '#818cf8' : 'var(--color-text-muted)' }}
              >
                {label}
              </span>
            </NavLink>
          );
        })}

        {/* Central FAB */}
        <div className="flex flex-col items-center justify-center flex-shrink-0 px-2">
          <button
            onClick={onAddTransaction}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all duration-200 active:scale-90 shadow-lg -mt-6"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
              boxShadow: '0 0 24px rgba(99,102,241,0.45), 0 4px 16px rgba(0,0,0,0.3)',
              touchAction: 'manipulation',
            }}
            aria-label="Add Transaction"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Last two nav items */}
        {NAV.slice(2).map(({ icon: Icon, label, to, exact }) => {
          const active = exact ? location.pathname === to : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 active:scale-90 select-none"
              style={{ touchAction: 'manipulation' }}
            >
              <div
                className="relative flex items-center justify-center w-10 h-8 rounded-2xl transition-all duration-200"
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))',
                } : {}}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{ color: active ? '#818cf8' : 'var(--color-text-muted)' }}
                />
                {active && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: '#818cf8' }}
                  />
                )}
              </div>
              <span
                className="text-[10px] font-semibold tracking-wide transition-colors duration-200"
                style={{ color: active ? '#818cf8' : 'var(--color-text-muted)' }}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
