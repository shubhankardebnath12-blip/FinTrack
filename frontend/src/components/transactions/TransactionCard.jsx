import { useState } from 'react';
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency, formatRelativeDate } from '../../utils/helpers';
import { CATEGORY_MAP } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const TransactionCard = ({ transaction, onEdit, onDelete, index = 0 }) => {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const catData = CATEGORY_MAP[transaction.category];
  const isIncome = transaction.type === 'income';

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try { await onDelete(transaction._id); }
    finally { setDeleting(false); }
  };

  return (
    <div
      className="group relative flex items-center gap-3 sm:gap-4 px-4 py-3.5 rounded-2xl animate-in"
      style={{
        background: 'var(--color-card-bg)',
        border: '1px solid var(--color-card-border)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        animationDelay: `${index * 40}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.transform = 'translateX(2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--color-card-bg)';
        e.currentTarget.style.borderColor = 'var(--color-card-border)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      {/* Left accent stripe */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: isIncome ? '#4ade80' : '#f87171' }}
      />

      {/* Category icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{
          background: catData?.bgColor || 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {catData?.icon || '\uD83D\uDCB8'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>
          {transaction.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
            style={{
              background: catData?.bgColor || 'rgba(255,255,255,0.06)',
              color: catData?.color || '#94a3b8',
              border: `1px solid ${catData?.color ? catData.color + '30' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            {catData?.icon} {transaction.category}
          </span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>•</span>
          <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            {formatRelativeDate(transaction.date)}
          </span>
        </div>
      </div>

      {/* Amount + Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            {isIncome
              ? <ArrowUpRight size={12} className="text-success-400" strokeWidth={2.5} />
              : <ArrowDownLeft size={12} className="text-danger-400" strokeWidth={2.5} />
            }
            <p className={`text-sm font-bold tracking-tight ${isIncome ? 'text-success-400' : 'text-danger-400'}`}>
              {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, user?.currency)}
            </p>
          </div>
          {transaction.note && (
            <p className="text-[10px] mt-0.5 truncate max-w-[80px]" style={{ color: 'var(--color-text-muted)' }}>
              {transaction.note}
            </p>
          )}
        </div>

        {/* Actions — always visible, 44px touch targets on mobile */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onEdit(transaction)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-90"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#818cf8'; e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
            aria-label="Edit transaction"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-90 disabled:opacity-40"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
            aria-label="Delete transaction"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
