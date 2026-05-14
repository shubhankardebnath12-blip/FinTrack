import { useState, useEffect, useCallback } from 'react';
import {
  Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  XCircle, Zap, Target, BarChart2, RefreshCw, ChevronRight,
  Lightbulb, Calendar, DollarSign, ArrowUpRight, ArrowDownRight,
  Sparkles, ShieldAlert,
} from 'lucide-react';
import { expenseService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

/* ── Helpers ─────────────────────────────── */
const fmt = (n, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);

const INSIGHT_CONFIG = {
  positive: {
    icon: CheckCircle2,
    border: 'rgba(34,197,94,0.2)',
    bg: 'rgba(34,197,94,0.06)',
    iconColor: '#4ade80',
    badgeBg: 'rgba(34,197,94,0.12)',
    badgeColor: '#4ade80',
    label: 'Positive',
  },
  warning: {
    icon: AlertTriangle,
    border: 'rgba(251,191,36,0.25)',
    bg: 'rgba(251,191,36,0.06)',
    iconColor: '#fbbf24',
    badgeBg: 'rgba(251,191,36,0.12)',
    badgeColor: '#fbbf24',
    label: 'Action Needed',
  },
  danger: {
    icon: XCircle,
    border: 'rgba(239,68,68,0.25)',
    bg: 'rgba(239,68,68,0.06)',
    iconColor: '#f87171',
    badgeBg: 'rgba(239,68,68,0.12)',
    badgeColor: '#f87171',
    label: 'Critical',
  },
};

const CATEGORY_ICONS = {
  savings: Target,
  spending: TrendingDown,
  forecast: Calendar,
  category: BarChart2,
  behavior: Lightbulb,
};

/* ── Sub-components ──────────────────────── */
const InsightCard = ({ insight, index }) => {
  const cfg = INSIGHT_CONFIG[insight.type] || INSIGHT_CONFIG.positive;
  const Icon = cfg.icon;
  const CatIcon = CATEGORY_ICONS[insight.category] || Lightbulb;

  return (
    <div
      className="relative rounded-2xl p-4 animate-in"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        animationDelay: `${index * 60}ms`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${cfg.border}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div className="flex items-start gap-3">
        {/* Category icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: cfg.badgeBg }}
        >
          <Icon size={16} style={{ color: cfg.iconColor }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="text-sm font-bold text-white leading-tight">{insight.title}</h4>
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: cfg.badgeBg, color: cfg.badgeColor }}
            >
              {cfg.label}
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {insight.message}
          </p>

          {/* Category tag */}
          <div className="flex items-center gap-1.5 mt-2">
            <CatIcon size={10} style={{ color: 'rgba(255,255,255,0.25)' }} />
            <span className="text-[10px] capitalize" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {insight.category} · {insight.impact} impact
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BudgetBar = ({ label, description, target, color, icon: Icon }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
      <Icon size={13} style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-white/70">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{fmt(target)}</span>
      </div>
      <p className="text-[10px] text-white/25">{description}</p>
    </div>
  </div>
);

const StatChip = ({ label, value, change, color }) => (
  <div className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">{label}</p>
    <p className="text-base font-bold" style={{ color: color || '#fff' }}>{value}</p>
    {change !== undefined && (
      <div className={`flex items-center gap-1 mt-1 text-[10px] font-semibold ${change >= 0 ? 'text-danger-400' : 'text-success-400'}`}>
        {change >= 0
          ? <ArrowUpRight size={10} />
          : <ArrowDownRight size={10} />
        }
        {Math.abs(change).toFixed(1)}% vs last month
      </div>
    )}
  </div>
);

/* ── Main Component ──────────────────────── */
const InsightsPanel = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('insights');
  const currency = user?.currency || 'USD';

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await expenseService.getInsights();
      setData(res.data.data);
    } catch (e) {
      setError('Could not load insights. Make sure you have transactions first.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Skeleton ── */
  if (loading) {
    return (
      <div className="rounded-3xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl skeleton shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded-lg skeleton shimmer" />
            <div className="h-3 w-48 rounded-md skeleton shimmer" />
          </div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 rounded-2xl skeleton shimmer" style={{ animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
    );
  }

  /* ── Error ── */
  if (error || !data) {
    return (
      <div className="rounded-3xl p-8 flex flex-col items-center text-center" style={{ background: 'rgba(255,255,255,0.025)', border: '1px dashed rgba(255,255,255,0.08)' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <Brain size={24} className="text-primary-400" />
        </div>
        <h4 className="text-sm font-semibold text-white mb-1.5">No Insights Yet</h4>
        <p className="text-xs text-white/30 max-w-[220px] leading-relaxed">
          Add income and expense transactions to generate AI-powered financial insights.
        </p>
      </div>
    );
  }

  const { summary, forecast, insights, budgetRecommendations, categoryAnalysis, overspendingCategories } = data;
  const hasInsights = insights?.length > 0;

  const TABS = [
    { id: 'insights', label: 'Insights', count: insights?.length },
    { id: 'budget', label: 'Budget Plan' },
    { id: 'forecast', label: 'Forecast' },
  ];

  return (
    <div
      className="rounded-3xl overflow-hidden animate-in"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      {/* ── Header ── */}
      <div
        className="px-5 pt-5 pb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Animated brain icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))',
                border: '1px solid rgba(99,102,241,0.25)',
                boxShadow: '0 0 20px rgba(99,102,241,0.15)',
              }}
            >
              <Brain size={18} className="text-primary-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="text-sm font-bold text-white">AI Financial Insights</h3>
                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <Sparkles size={8} /> Smart
                </span>
              </div>
              <p className="text-[11px] text-white/30">
                {hasInsights ? `${insights.length} insight${insights.length > 1 ? 's' : ''} · Updated just now` : 'Analysing your data...'}
              </p>
            </div>
          </div>

          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="btn-icon flex-shrink-0"
            title="Refresh insights"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-primary-400' : ''} />
          </button>
        </div>

        {/* Month summary chips */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <StatChip
            label="This Month Income"
            value={fmt(summary.thisMonth.income, currency)}
            color="#4ade80"
          />
          <StatChip
            label="This Month Spend"
            value={fmt(summary.thisMonth.expense, currency)}
            change={summary.changes.expense}
            color="#f87171"
          />
          <StatChip
            label="Savings Rate"
            value={`${summary.thisMonth.savingsRate}%`}
            color={summary.thisMonth.savingsRate >= 20 ? '#4ade80' : summary.thisMonth.savingsRate > 0 ? '#fbbf24' : '#f87171'}
          />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 px-4 pt-3 pb-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-3 py-2 text-xs font-semibold rounded-t-xl transition-all duration-200 relative flex items-center gap-1.5"
            style={{
              color: activeTab === tab.id ? '#818cf8' : 'rgba(255,255,255,0.3)',
              background: activeTab === tab.id ? 'rgba(99,102,241,0.1)' : 'transparent',
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto no-scrollbar">

        {/* ─ Insights Tab ─ */}
        {activeTab === 'insights' && (
          hasInsights ? (
            <>
              {/* Overspending alert banner if any */}
              {overspendingCategories?.length > 0 && (
                <div
                  className="rounded-2xl p-3.5 flex items-center gap-3 mb-2"
                  style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <ShieldAlert size={16} className="text-danger-400 flex-shrink-0" />
                  <p className="text-xs text-white/60">
                    <span className="font-semibold text-danger-400">{overspendingCategories.length} category</span>
                    {overspendingCategories.length > 1 ? 'ies' : ''} flagged for overspending —
                    {' '}{overspendingCategories.map(c => c.category).join(', ')}
                  </p>
                </div>
              )}

              {insights.map((insight, i) => (
                <InsightCard key={`${insight.title}-${i}`} insight={insight} index={i} />
              ))}
            </>
          ) : (
            <div className="py-8 flex flex-col items-center text-center">
              <CheckCircle2 size={32} className="text-success-400 mb-3" />
              <h4 className="text-sm font-semibold text-white mb-1">All Clear!</h4>
              <p className="text-xs text-white/35">No issues detected with your finances right now.</p>
            </div>
          )
        )}

        {/* ─ Budget Plan Tab ─ */}
        {activeTab === 'budget' && budgetRecommendations && (
          <div className="space-y-4">
            {/* 50/30/20 explainer */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={13} className="text-violet-400" />
                <span className="text-xs font-bold text-white">50 / 30 / 20 Budget Rule</span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Based on your monthly income of <strong className="text-white/70">{fmt(budgetRecommendations.monthlyIncome, currency)}</strong>,
                here's your ideal budget split for healthy finances.
              </p>
            </div>

            {/* Budget bars */}
            <div className="space-y-3">
              <BudgetBar
                label="Needs (50%)"
                description="Rent, groceries, utilities, transport"
                target={budgetRecommendations.needs.target}
                color="#60a5fa"
                icon={DollarSign}
              />
              <BudgetBar
                label="Wants (30%)"
                description="Dining, entertainment, shopping"
                target={budgetRecommendations.wants.target}
                color="#c084fc"
                icon={Sparkles}
              />
              <BudgetBar
                label="Savings & Debt (20%)"
                description="Emergency fund, investments, goals"
                target={budgetRecommendations.savings.target}
                color="#4ade80"
                icon={Target}
              />
            </div>

            {/* Current vs Ideal */}
            <div className="rounded-2xl p-4 mt-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">Current vs Ideal</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Spending', current: budgetRecommendations.currentExpense, ideal: budgetRecommendations.needs.target + budgetRecommendations.wants.target, colorOk: '#4ade80', colorBad: '#f87171' },
                  { label: 'Savings', current: Math.max(0, budgetRecommendations.currentSavings), ideal: budgetRecommendations.savings.target, colorOk: '#4ade80', colorBad: '#f87171' },
                ].map(row => {
                  const pct = row.ideal > 0 ? Math.min(100, (row.current / row.ideal) * 100) : 0;
                  const isGood = row.label === 'Savings' ? pct >= 100 : pct <= 100;
                  return (
                    <div key={row.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[11px] text-white/40">{row.label}</span>
                        <span className="text-[11px] font-semibold" style={{ color: isGood ? row.colorOk : row.colorBad }}>
                          {fmt(row.current, currency)} / {fmt(row.ideal, currency)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(pct, 100)}%`,
                            background: isGood
                              ? `linear-gradient(90deg, ${row.colorOk}88, ${row.colorOk})`
                              : `linear-gradient(90deg, ${row.colorBad}88, ${row.colorBad})`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {budgetRecommendations.savingsGap > 0 && (
                <div className="mt-3 flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.18)' }}>
                  <AlertTriangle size={12} className="text-warning-400 flex-shrink-0" />
                  <p className="text-[11px] text-white/50">
                    Save an extra <strong className="text-warning-400">{fmt(budgetRecommendations.savingsGap, currency)}/mo</strong> to hit your 20% savings target.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─ Forecast Tab ─ */}
        {activeTab === 'forecast' && forecast && (
          <div className="space-y-3">
            {/* Forecast overview */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: forecast.projectedMonthExpense > summary.thisMonth.income
                  ? 'rgba(239,68,68,0.07)'
                  : forecast.projectedMonthExpense > summary.thisMonth.income * 0.8
                  ? 'rgba(251,191,36,0.07)'
                  : 'rgba(34,197,94,0.07)',
                border: `1px solid ${
                  forecast.projectedMonthExpense > summary.thisMonth.income
                    ? 'rgba(239,68,68,0.2)'
                    : forecast.projectedMonthExpense > summary.thisMonth.income * 0.8
                    ? 'rgba(251,191,36,0.2)'
                    : 'rgba(34,197,94,0.2)'
                }`,
              }}
            >
              <p className="text-[11px] text-white/40 mb-1">Projected Month-End Spending</p>
              <p className="text-2xl font-bold tracking-tight text-white"
                style={{ letterSpacing: '-0.03em' }}>
                {fmt(forecast.projectedMonthExpense, currency)}
              </p>
              <p className="text-xs text-white/30 mt-1">
                {forecast.daysRemaining} days remaining · {fmt(forecast.dailyAvg, currency)}/day avg
              </p>
            </div>

            {/* Forecast stats grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Daily Spend Avg', value: fmt(forecast.dailyAvg, currency), color: '#818cf8' },
                { label: 'Remaining Budget', value: fmt(Math.max(0, forecast.remainingBudget), currency), color: forecast.remainingBudget > 0 ? '#4ade80' : '#f87171' },
                { label: 'Days Remaining', value: `${forecast.daysRemaining} days`, color: '#fbbf24' },
                { label: 'Burn Rate', value: `${summary.thisMonth.income > 0 ? ((forecast.projectedMonthExpense / summary.thisMonth.income) * 100).toFixed(0) : 0}%`, color: '#c084fc' },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[10px] text-white/30 mb-1">{s.label}</p>
                  <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Top categories (3-month avg) */}
            {categoryAnalysis?.length > 0 && (
              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Top Spending Categories (3-mo avg)</p>
                <div className="space-y-2.5">
                  {categoryAnalysis.slice(0, 5).map((cat, i) => {
                    const colors = ['#818cf8', '#c084fc', '#f472b6', '#fb923c', '#4ade80'];
                    const color = colors[i % colors.length];
                    return (
                      <div key={cat.category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-white/50">{cat.category}</span>
                          <span className="text-xs font-semibold text-white/70">{cat.percentage}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${cat.percentage}%`, background: `linear-gradient(90deg, ${color}66, ${color})`, transition: 'width 1s ease' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
