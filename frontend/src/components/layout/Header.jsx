import { Sun, Moon, Bell, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ title, onAddTransaction }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6"
      style={{
        height: 'var(--header-height)',
        background: 'var(--color-header-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
        transition: 'background 0.3s ease',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <div>
          <h2
            className="text-base font-bold tracking-tight leading-none"
            style={{ letterSpacing: '-0.02em', color: 'var(--color-text)' }}
          >
            {title}
          </h2>
          <p className="text-[11px] mt-0.5 hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Add transaction — desktop only, FAB handles mobile */}
        {onAddTransaction && (
          <button
            onClick={onAddTransaction}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
              boxShadow: '0 0 20px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
            aria-label="Add Transaction"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Transaction
          </button>
        )}

        {/* Divider */}
        <div className="w-px h-5 mx-1 hidden sm:block" style={{ background: 'var(--color-border-2)' }} />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={isDark ? 'Light mode' : 'Dark mode'}
          aria-label="Toggle theme"
        >
          {isDark
            ? <Sun size={17} className="text-amber-400" />
            : <Moon size={17} />
          }
        </button>

        {/* Notifications */}
        <button
          className="btn-icon relative"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderColor: isDark ? 'rgba(6,9,16,0.9)' : 'rgba(244,246,251,0.9)',
            }}
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
