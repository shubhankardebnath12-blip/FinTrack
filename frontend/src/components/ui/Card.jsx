import { clsx } from 'clsx';

const Card = ({ children, className = '', hover = false, padding = true, ...props }) => (
  <div
    className={clsx('glass-card', hover && 'glass-card-hover', padding && 'p-6', className)}
    {...props}
  >
    {children}
  </div>
);

// ── Premium animated stat card ──────────────────────────────────────
const CARD_THEMES = {
  primary: {
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)',
    border: 'rgba(99,102,241,0.2)',
    glow: 'rgba(99,102,241,0.15)',
    iconBg: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))',
    iconColor: '#818cf8',
    orb: 'rgba(99,102,241,0.12)',
  },
  success: {
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(16,185,129,0.06) 100%)',
    border: 'rgba(34,197,94,0.18)',
    glow: 'rgba(34,197,94,0.12)',
    iconBg: 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(16,185,129,0.2))',
    iconColor: '#4ade80',
    orb: 'rgba(34,197,94,0.1)',
  },
  danger: {
    gradient: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(220,38,38,0.06) 100%)',
    border: 'rgba(239,68,68,0.18)',
    glow: 'rgba(239,68,68,0.12)',
    iconBg: 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(220,38,38,0.2))',
    iconColor: '#f87171',
    orb: 'rgba(239,68,68,0.1)',
  },
  warning: {
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(249,115,22,0.06) 100%)',
    border: 'rgba(251,191,36,0.18)',
    glow: 'rgba(251,191,36,0.12)',
    iconBg: 'linear-gradient(135deg, rgba(251,191,36,0.25), rgba(249,115,22,0.2))',
    iconColor: '#fbbf24',
    orb: 'rgba(251,191,36,0.1)',
  },
  violet: {
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.08) 100%)',
    border: 'rgba(139,92,246,0.2)',
    glow: 'rgba(139,92,246,0.15)',
    iconBg: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.2))',
    iconColor: '#c084fc',
    orb: 'rgba(139,92,246,0.12)',
  },
};

export const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle, trend, loading, index = 0 }) => {
  const theme = CARD_THEMES[color] || CARD_THEMES.primary;

  if (loading) {
    return (
      <div
        className="rounded-2xl p-6 space-y-4 shimmer skeleton"
        style={{ animationDelay: `${index * 80}ms`, minHeight: 148 }}
      />
    );
  }

  return (
    <div
      className="stat-card rounded-2xl p-6 animate-in"
      style={{
        background: theme.gradient,
        border: `1px solid ${theme.border}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)`,
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Background orb */}
      <div
        className="absolute -right-6 -top-6 w-28 h-28 rounded-full blur-2xl pointer-events-none"
        style={{ background: theme.orb }}
      />
      <div
        className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full blur-xl pointer-events-none opacity-50"
        style={{ background: theme.orb }}
      />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-[0.08em]">{title}</p>

          {Icon && (
            <div
              className="stat-card-icon w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: theme.iconBg, boxShadow: `0 4px 12px ${theme.glow}` }}
            >
              <Icon size={17} style={{ color: theme.iconColor }} strokeWidth={2} />
            </div>
          )}
        </div>

        {/* Value */}
        <p
          className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tighter truncate"
          style={{ letterSpacing: '-0.03em', lineHeight: 1 }}
        >
          {value}
        </p>

        {/* Subtitle / trend */}
        <div className="flex items-center gap-2 mt-2">
          {subtitle && (
            <p className="text-[11px] text-white/30 font-medium">{subtitle}</p>
          )}
          {trend !== undefined && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                trend >= 0
                  ? 'bg-success-500/15 text-success-400'
                  : 'bg-danger-500/15 text-danger-400'
              }`}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
