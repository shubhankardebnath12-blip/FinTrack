import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-4 py-3 rounded-2xl animation-scale-in"
      style={{
        background: 'linear-gradient(135deg, #0f1520, #0a0f18)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      }}
    >
      <p className="text-xs font-semibold text-white/40 mb-2 uppercase tracking-wider">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2.5 mb-1.5 last:mb-0">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.fill }} />
          <span className="text-xs text-white/50 capitalize">{entry.name}:</span>
          <span className="text-sm font-bold text-white">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const MonthlyBarChart = ({ data = [], currency = '$' }) => (
  <div
    className="rounded-2xl p-6 animate-in"
    style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-sm font-bold text-white">Monthly Overview</h3>
        <p className="text-[11px] text-white/30 mt-0.5">Income vs Expenses by month</p>
      </div>
      <div className="flex items-center gap-4">
        {[
          { label: 'Income', color: '#6366f1' },
          { label: 'Expense', color: '#f43f5e' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-[10px] text-white/40 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>

    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barCategoryGap="35%" barGap={4}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="monthName"
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'Inter' }}
          axisLine={false}
          tickLine={false}
          tickMargin={8}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'Inter' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }} />
        <Bar dataKey="income" fill="url(#incomeGrad)" radius={[5, 5, 0, 0]} maxBarSize={28} name="income" />
        <Bar dataKey="expense" fill="url(#expenseGrad)" radius={[5, 5, 0, 0]} maxBarSize={28} name="expense" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default MonthlyBarChart;
