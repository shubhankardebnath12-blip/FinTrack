import { forwardRef } from 'react';
import { clsx } from 'clsx';

export const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="input-label">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'input',
            Icon && 'pl-10',
            error && 'border-danger-500/50 focus:ring-danger-500/50',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger-400 mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export const Select = forwardRef(({ label, error, options = [], className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="input-label">{label}</label>}
      <select
        ref={ref}
        className={clsx(
          'input appearance-none',
          'dark:[&>option]:bg-surface-900 dark:[&>option]:text-white',
          error && 'border-danger-500/50',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-400 mt-1">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="input-label">{label}</label>}
      <textarea
        ref={ref}
        className={clsx(
          'input resize-none',
          error && 'border-danger-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger-400 mt-1">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
