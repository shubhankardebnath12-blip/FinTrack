import { useEffect, useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import SpendingTrendChart from '../components/charts/SpendingTrendChart';
import Card from '../components/ui/Card';
import { CATEGORY_MAP } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import { Select } from '../components/ui/Input';

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 4 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

const AnalyticsPage = () => {
  const { fetchMonthlyStats, fetchCategoryStats, fetchTrend } = useExpenses();
  const { user } = useAuth();

  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trend, setTrend] = useState([]);
  const [year, setYear] = useState(String(currentYear));
  const [loading, setLoading] = useState(true);

  const currency = user?.currency || 'USD';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [m, c, t] = await Promise.all([
        fetchMonthlyStats(year),
        fetchCategoryStats({ type: 'expense', year }),
        fetchTrend(30),
      ]);
      setMonthly(m || []);
      setCategories(c || []);
      setTrend(t || []);
      setLoading(false);
    };
    load();
  }, [year, fetchMonthlyStats, fetchCategoryStats, fetchTrend]);

  // Compute totals from monthly data
  const totalIncome = monthly.reduce((s, m) => s + m.income, 0);
  const totalExpense = monthly.reduce((s, m) => s + m.expense, 0);
  const topCategory = categories[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Year selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>Financial Analytics</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Interactive charts and insights</p>
        </div>
        <div className="w-32">
          <Select
            options={YEAR_OPTIONS}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 bg-gradient-to-br from-primary-600/20 to-primary-500/5">
          <p className="text-xs text-white/40 mb-1">Total Income ({year})</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalIncome, user?.currency)}</p>
        </div>
        <div className="glass-card p-5 bg-gradient-to-br from-danger-600/20 to-danger-500/5">
          <p className="text-xs text-white/40 mb-1">Total Expenses ({year})</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalExpense, user?.currency)}</p>
        </div>
        <div className="glass-card p-5 bg-gradient-to-br from-success-600/20 to-success-500/5">
          <p className="text-xs text-white/40 mb-1">Net Savings ({year})</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalIncome - totalExpense, user?.currency)}</p>
        </div>
      </div>

      {/* Monthly bar chart */}
      <MonthlyBarChart data={monthly} currency={currency} />

      {/* Category pie + top category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={categories} currency={currency} />

        {/* Top spending category insight */}
        <Card className="p-6">
          <h3 className="text-base font-semibold text-white mb-6">Category Insights</h3>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-white/30">
              <span className="text-4xl mb-2">💡</span>
              <p className="text-sm">No data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.slice(0, 6).map((cat, i) => {
                const catMeta = CATEGORY_MAP[cat.category];
                return (
                  <div key={cat.category} className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center">{catMeta?.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-white">{cat.category}</span>
                        <span className="text-white/60">{formatCurrency(cat.total, user?.currency)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-violet-500 transition-all duration-700"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-white/40 w-10 text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Spending trend */}
      <SpendingTrendChart data={trend} currency={currency} />
    </div>
  );
};

export default AnalyticsPage;
