import { useEffect, useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import { formatCurrency } from '../utils/helpers';
import { CATEGORY_MAP, MONTHS } from '../utils/constants';
import { Select } from '../components/ui/Input';
import { TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const YEAR_OPTIONS = Array.from({ length: 4 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

const MONTH_OPTIONS = [
  { value: '', label: 'Full Year' },
  ...MONTHS.map((m, i) => ({ value: String(i + 1), label: m })),
];

const ReportsPage = () => {
  const { fetchMonthlyStats, fetchCategoryStats, fetchSummary } = useExpenses();
  const { user } = useAuth();

  const [year, setYear] = useState(String(currentYear));
  const [month, setMonth] = useState(String(currentMonth));
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [m, c, s] = await Promise.all([
        fetchMonthlyStats(year),
        fetchCategoryStats({ type: 'expense', year, month: month || undefined }),
        fetchSummary(),
      ]);
      setMonthly(m || []);
      setCategories(c || []);
      setSummary(s);
      setLoading(false);
    };
    load();
  }, [year, month]);

  const selectedMonthData = month
    ? monthly.find((m) => m.month === parseInt(month))
    : null;

  const reportIncome = selectedMonthData ? selectedMonthData.income
    : monthly.reduce((s, m) => s + m.income, 0);

  const reportExpense = selectedMonthData ? selectedMonthData.expense
    : monthly.reduce((s, m) => s + m.expense, 0);

  const topCategory = categories[0];
  const lowestMonth = [...monthly].filter(m => m.expense > 0).sort((a, b) => a.expense - b.expense)[0];
  const highestMonth = [...monthly].sort((a, b) => b.expense - a.expense)[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filter row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="w-36">
          <Select
            options={YEAR_OPTIONS}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div className="w-36">
          <Select
            options={MONTH_OPTIONS}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
        <span className="text-sm text-white/30 ml-auto">
          {month ? `Report for ${MONTHS[parseInt(month) - 1]} ${year}` : `Annual Report ${year}`}
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 bg-gradient-to-br from-success-600/20 to-success-500/5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-success-400" />
            <p className="text-xs text-white/50">Total Income</p>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(reportIncome, user?.currency)}</p>
        </div>
        <div className="glass-card p-5 bg-gradient-to-br from-danger-600/20 to-danger-500/5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-danger-400" />
            <p className="text-xs text-white/50">Total Expenses</p>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(reportExpense, user?.currency)}</p>
        </div>
        <div className="glass-card p-5 bg-gradient-to-br from-primary-600/20 to-primary-500/5">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-primary-400" />
            <p className="text-xs text-white/50">Net Savings</p>
          </div>
          <p className={`text-2xl font-bold ${reportIncome - reportExpense >= 0 ? 'text-success-400' : 'text-danger-400'}`}>
            {formatCurrency(reportIncome - reportExpense, user?.currency)}
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending breakdown */}
        <Card className="p-6">
          <h3 className="text-base font-semibold text-white mb-5">Spending Breakdown</h3>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-white/30">
              <span className="text-4xl mb-2">📊</span>
              <p className="text-sm">No expense data</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((cat) => {
                const meta = CATEGORY_MAP[cat.category];
                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{meta?.icon}</span>
                        <span className="font-medium text-white">{cat.category}</span>
                        <span className="text-xs text-white/40">({cat.count} txns)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white/60">{formatCurrency(cat.total, user?.currency)}</span>
                        <span className="text-xs text-white/40 w-10 text-right">{cat.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-violet-500"
                        style={{ width: `${cat.percentage}%`, transition: 'width 0.6s ease' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Key insights */}
        <Card className="p-6">
          <h3 className="text-base font-semibold text-white mb-5">Key Insights</h3>
          <div className="space-y-4">
            {topCategory && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-warning-500/10 border border-warning-500/20">
                <AlertTriangle size={18} className="text-warning-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Top Spending Category</p>
                  <p className="text-xs text-white/50 mt-1">
                    {CATEGORY_MAP[topCategory.category]?.icon} {topCategory.category} accounts for{' '}
                    <strong className="text-warning-400">{topCategory.percentage}%</strong> of your expenses
                    ({formatCurrency(topCategory.total, user?.currency)})
                  </p>
                </div>
              </div>
            )}

            {highestMonth && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-danger-500/10 border border-danger-500/20">
                <TrendingDown size={18} className="text-danger-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Highest Expense Month</p>
                  <p className="text-xs text-white/50 mt-1">
                    <strong className="text-danger-400">{MONTHS[highestMonth.month - 1]}</strong> had the highest spending
                    at {formatCurrency(highestMonth.expense, user?.currency)}
                  </p>
                </div>
              </div>
            )}

            {lowestMonth && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-success-500/10 border border-success-500/20">
                <TrendingUp size={18} className="text-success-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Best Saving Month</p>
                  <p className="text-xs text-white/50 mt-1">
                    <strong className="text-success-400">{MONTHS[lowestMonth.month - 1]}</strong> had the lowest spending
                    at {formatCurrency(lowestMonth.expense, user?.currency)}
                  </p>
                </div>
              </div>
            )}

            {summary && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <Award size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Overall Savings Rate</p>
                  <p className="text-xs text-white/50 mt-1">
                    You're saving <strong className="text-primary-400">{summary.savingsRate}%</strong> of your total income.
                    {summary.savingsRate >= 20
                      ? ' Great job! 🎉'
                      : ' Try to increase your savings to 20%+.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Monthly table */}
      {!month && (
        <Card className="p-6">
          <h3 className="text-base font-semibold text-white mb-5">Monthly Breakdown {year}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-white/40 border-b border-white/10">
                  <th className="pb-3 pr-4 font-medium">Month</th>
                  <th className="pb-3 pr-4 font-medium text-right">Income</th>
                  <th className="pb-3 pr-4 font-medium text-right">Expenses</th>
                  <th className="pb-3 font-medium text-right">Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {monthly.map((m) => (
                  <tr key={m.month} className="table-row-hover">
                    <td className="py-3 pr-4 text-white font-medium">{m.monthName}</td>
                    <td className="py-3 pr-4 text-right text-success-400">
                      {formatCurrency(m.income, user?.currency)}
                    </td>
                    <td className="py-3 pr-4 text-right text-danger-400">
                      {formatCurrency(m.expense, user?.currency)}
                    </td>
                    <td className={`py-3 text-right font-semibold ${
                      m.income - m.expense >= 0 ? 'text-success-400' : 'text-danger-400'
                    }`}>
                      {formatCurrency(m.income - m.expense, user?.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportsPage;
