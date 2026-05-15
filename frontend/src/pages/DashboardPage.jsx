import { useEffect, useState, useCallback } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, ArrowRight,
  Flame, Target, Zap,
} from 'lucide-react';
import { StatCard } from '../components/ui/Card';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import TransactionCard from '../components/transactions/TransactionCard';
import TransactionForm from '../components/transactions/TransactionForm';
import { TransactionSkeleton } from '../components/ui/Skeleton';
import InsightsPanel from '../components/insights/InsightsPanel';
import { formatCurrency } from '../utils/helpers';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const { summary, statsLoading, fetchSummary, fetchExpenses, deleteExpense } = useExpenses();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [txnLoading, setTxnLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [insightsKey, setInsightsKey] = useState(0); // force re-fetch after data changes
  const currency = user?.currency || 'USD';

  const loadData = useCallback(async () => {
    try {
      await fetchSummary();
      const result = await fetchExpenses({ limit: 6, sortBy: 'date', sortOrder: 'desc' });
      setRecentTransactions(result.data || []);
    } finally {
      setTxnLoading(false);
    }
  }, [fetchSummary, fetchExpenses]);

  useEffect(() => {
    loadData();
    const handler = () => { loadData(); setInsightsKey(k => k + 1); };
    window.addEventListener('expense-updated', handler);
    return () => window.removeEventListener('expense-updated', handler);
  }, [loadData]);

  const handleDelete = async (id) => {
    await deleteExpense(id);
    loadData();
    setInsightsKey(k => k + 1);
  };

  const savingsRateNum = summary?.savingsRate ?? 0;
  const budgetPct = summary?.totalIncome > 0
    ? Math.min(100, (summary.totalExpense / summary.totalIncome) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Hero welcome banner ── */}
      <div
        className="relative rounded-3xl p-7 overflow-hidden animate-in"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.12) 50%, rgba(14,165,233,0.08) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Background orbs */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(139,92,246,0.15)' }} />
        <div className="absolute right-24 bottom-0 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(99,102,241,0.1)' }} />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Overview</span>
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold leading-tight"
              style={{ letterSpacing: '-0.03em', color: 'var(--color-text)' }}
            >
              Good day, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p className="text-sm mt-1.5 max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
              Your finances are looking{' '}
              <span className="font-medium" style={{ color: savingsRateNum >= 30 ? '#4ade80' : savingsRateNum >= 10 ? '#fbbf24' : '#f87171' }}>
                {savingsRateNum >= 30 ? 'excellent' : savingsRateNum >= 10 ? 'good' : 'needs attention'}
              </span>
              {' '}— {savingsRateNum.toFixed(1)}% savings rate.
            </p>
          </div>

          <button
            onClick={() => { setEditData(null); setShowForm(true); }}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Net Balance"    value={formatCurrency(summary?.balance || 0, currency)}      icon={Wallet}      color="primary" subtitle="All time"   loading={statsLoading} index={0} />
        <StatCard title="Total Income"   value={formatCurrency(summary?.totalIncome || 0, currency)}  icon={TrendingUp}  color="success" subtitle="All time"   loading={statsLoading} index={1} />
        <StatCard title="Total Expenses" value={formatCurrency(summary?.totalExpense || 0, currency)} icon={TrendingDown} color="danger" subtitle="All time"   loading={statsLoading} index={2} />
        <StatCard title="Savings Rate"   value={`${savingsRateNum.toFixed(1)}%`}                     icon={PiggyBank}   color="violet"  subtitle="Of income"  loading={statsLoading} index={3} />
      </div>

      {/* ── Main 3-column layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── LEFT: Budget + Quick stats ── */}
        <div className="xl:col-span-1 space-y-4">
          {/* Budget progress card */}
          {summary && (
            <div
              className="rounded-2xl p-5 animate-in animate-in-delay-2"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target size={15} className="text-primary-400" />
                  <span className="text-sm font-semibold text-white">Budget Used</span>
                </div>
                <span className="text-xs font-bold text-white/60">{budgetPct.toFixed(1)}%</span>
              </div>

              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${budgetPct}%`,
                    background: budgetPct > 80
                      ? 'linear-gradient(90deg, #f87171, #ef4444)'
                      : budgetPct > 60
                      ? 'linear-gradient(90deg, #fbbf24, #f97316)'
                      : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  }}
                />
              </div>

              <div className="flex justify-between mt-2.5">
                <span className="text-[10px] text-white/25">{formatCurrency(summary.totalExpense, currency)}</span>
                <span className="text-[10px] text-white/25">{formatCurrency(summary.totalIncome, currency)}</span>
              </div>

              <div
                className="mt-4 flex items-center gap-2 p-3 rounded-xl"
                style={{
                  background: budgetPct > 80 ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
                  border: `1px solid ${budgetPct > 80 ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}`,
                }}
              >
                <Flame size={13} className={budgetPct > 80 ? 'text-danger-400' : 'text-success-400'} />
                <p className="text-[11px] font-medium" style={{ color: budgetPct > 80 ? '#f87171' : '#4ade80' }}>
                  {budgetPct > 80
                    ? 'Spending is high — consider cutting back'
                    : `Saved ${formatCurrency(summary.balance, currency)} so far`}
                </p>
              </div>
            </div>
          )}

          {/* Quick stats row */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Net Savings', value: formatCurrency(summary?.balance || 0, currency), color: (summary?.balance || 0) >= 0 ? '#4ade80' : '#f87171' },
              { label: 'Savings Rate', value: `${savingsRateNum.toFixed(1)}%`, color: savingsRateNum >= 20 ? '#4ade80' : '#fbbf24' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-4 animate-in animate-in-delay-3" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-1.5">{s.label}</p>
                <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* ── AI Insights Panel ── */}
          <div className="animate-in animate-in-delay-4">
            <InsightsPanel key={insightsKey} />
          </div>
        </div>

        {/* ── RIGHT: Recent Transactions (2/3 width) ── */}
        <div className="xl:col-span-2 animate-in animate-in-delay-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Recent Transactions</h3>
              {recentTransactions.length > 0 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                  {recentTransactions.length}
                </span>
              )}
            </div>
            <Link to="/transactions" className="flex items-center gap-1 text-xs font-medium text-white/35 hover:text-primary-400 transition-colors duration-200">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {txnLoading ? (
            <TransactionSkeleton />
          ) : recentTransactions.length === 0 ? (
            <div
              className="rounded-2xl p-14 flex flex-col items-center text-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}>
                💸
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">No transactions yet</h4>
              <p className="text-xs text-white/30 mb-5">Add your first to start tracking your finances</p>
              <button
                onClick={() => { setEditData(null); setShowForm(true); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 0 20px rgba(99,102,241,0.25)' }}
              >
                <Plus size={14} /> Add Transaction
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((txn, i) => (
                <TransactionCard
                  key={txn._id}
                  transaction={txn}
                  onEdit={(t) => { setEditData(t); setShowForm(true); }}
                  onDelete={handleDelete}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TransactionForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditData(null); }}
        editData={editData}
        onSuccess={() => { loadData(); setInsightsKey(k => k + 1); }}
      />
    </div>
  );
};

export default DashboardPage;
