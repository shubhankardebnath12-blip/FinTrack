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
      className="group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl animate-in"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        animationDelay: `${index * 40}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.045)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.transform = 'translateX(2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
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
          background: catData?.bgColor
            ? catData.bgColor.replace(')', ', 0.15)').replace('rgba(', 'rgba(')
            : 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {catData?.icon || '💸'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white/90 truncate">{transaction.title}</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
            style={{
              background: catData?.bgColor?.replace(')', ', 0.12)') || 'rgba(255,255,255,0.06)',
              color: catData?.color || '#94a3b8',
              border: `1px solid ${catData?.color ? catData.color + '30' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            {catData?.icon} {transaction.category}
          </span>
          <span className="text-[10px] text-white/25">•</span>
          <span className="text-[11px] text-white/35">{formatRelativeDate(transaction.date)}</span>
        </div>
      </div>

      {/* Amount */}
      <div className="flex items-center gap-3">
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
            <p className="text-[10px] text-white/25 mt-0.5 truncate max-w-[100px]">{transaction.note}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={() => onEdit(transaction)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-primary-400 hover:bg-primary-500/10 transition-all duration-150"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-danger-400 hover:bg-danger-500/10 transition-all duration-150 disabled:opacity-40"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
