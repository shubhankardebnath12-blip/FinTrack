import { clsx } from 'clsx';

const VARIANTS = {
  primary: {
    style: {
      background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
      boxShadow: '0 0 20px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
    },
    className: 'text-white hover:opacity-90',
  },
  secondary: {
    style: {
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    className: 'text-white/80 hover:bg-white/10 hover:text-white',
  },
  danger: {
    style: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      boxShadow: '0 0 16px rgba(239,68,68,0.2)',
    },
    className: 'text-white hover:opacity-90',
  },
  ghost: {
    style: {},
    className: 'text-white/50 hover:text-white hover:bg-white/[0.06]',
  },
  outline: {
    style: { border: '1px solid rgba(99,102,241,0.35)' },
    className: 'text-primary-400 hover:bg-primary-500/10',
  },
};

const SIZES = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
  sm: 'px-3.5 py-2 text-sm rounded-xl gap-2',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
  icon: 'w-9 h-9 rounded-xl',
};

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
  </svg>
);

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  style = {},
  ...props
}) => {
  const v = VARIANTS[variant] || VARIANTS.primary;

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-semibold transition-all duration-200',
        'active:scale-[0.96] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        SIZES[size],
        v.className,
        className
      )}
      style={{ ...v.style, ...style }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner /> : (Icon && <Icon size={14} strokeWidth={2.5} />)}
      {children}
    </button>
  );
};

export default Button;
