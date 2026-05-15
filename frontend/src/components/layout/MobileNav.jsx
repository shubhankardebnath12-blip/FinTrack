import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, BarChart3, FileText, Settings } from 'lucide-react';

const NAV = [
  { icon: LayoutDashboard, label: 'Home',    to: '/',             exact: true },
  { icon: ArrowLeftRight,  label: 'Txns',    to: '/transactions', exact: false },
  { icon: BarChart3,       label: 'Charts',  to: '/analytics',    exact: false },
  { icon: FileText,        label: 'Reports', to: '/reports',      exact: false },
  { icon: Settings,        label: 'Settings',to: '/settings',     exact: false },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden flex items-center gap-1 px-3 py-2.5"
      style={{
        background: 'rgba(10, 15, 25, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '999px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)',
      }}
    >
      {NAV.map(({ icon: Icon, label, to, exact }) => {
        const active = exact ? location.pathname === to : location.pathname.startsWith(to);

        return (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-full transition-all duration-200"
            style={active ? {
              background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))',
              border: '1px solid rgba(99,102,241,0.25)',
            } : {}}
          >
            <Icon
              size={18}
              className="transition-colors duration-200 flex-shrink-0"
              style={{ color: active ? '#818cf8' : 'rgba(255,255,255,0.35)' }}
            />
            <span
              className="text-[9px] font-semibold tracking-wide transition-colors duration-200"
              style={{ color: active ? '#818cf8' : 'rgba(255,255,255,0.25)' }}
            >
              {label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;
