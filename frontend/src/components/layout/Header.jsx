import { Sun, Moon, Bell, Plus, Menu, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

const Header = ({ title, onMenuToggle, onAddTransaction }) => {
  const { isDark, toggleTheme } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6"
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
        <button
          onClick={onMenuToggle}
          className="btn-icon lg:hidden flex-shrink-0"
          aria-label="Toggle menu"
        >
          <Menu size={19} />
        </button>

        <div>
          <h2
            className="text-base font-bold text-white tracking-tight leading-none"
            style={{ letterSpacing: '-0.02em' }}
          >
            {title}
          </h2>
          <p className="text-[11px] text-white/30 mt-0.5 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Add transaction button */}
        {onAddTransaction && (
          <button
            onClick={onAddTransaction}
            className="flex items-center justify-center gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
              boxShadow: '0 0 20px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:block">Add</span>
          </button>
        )}

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark
            ? <Sun size={17} className="text-amber-400" />
            : <Moon size={17} />
          }
        </button>

        {/* Notifications */}
        <button className="btn-icon relative" title="Notifications">
          <Bell size={17} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderColor: 'rgba(6,9,16,0.9)',
            }}
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
