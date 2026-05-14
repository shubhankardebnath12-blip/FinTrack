import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = [
  '#818cf8', '#c084fc', '#f472b6', '#fb923c',
  '#4ade80', '#22d3ee', '#fbbf24', '#f87171',
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      className="px-4 py-3 rounded-2xl animation-scale-in"
      style={{
        background: 'linear-gradient(135deg, #0f1520, #0a0f18)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full" style={{ background: d.payload.fill }} />
        <p className="text-xs font-semibold text-white">{d.name}</p>
      </div>
      <p className="text-base font-bold text-white">
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(d.value)}
      </p>
      <p className="text-[10px] text-white/35 mt-0.5">{d.payload.percentage}% of expenses</p>
    </div>
  );
};

const CategoryPieChart = ({ data = [] }) => (
  <div
    className="rounded-2xl p-6 animate-in"
    style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}
  >
    <div className="mb-5">
      <h3 className="text-sm font-bold text-white">Spending by Category</h3>
      <p className="text-[11px] text-white/30 mt-0.5">Expense distribution</p>
    </div>

    {data.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-52 text-white/20">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}
        >
          🥧
        </div>
        <p className="text-xs">No expense data yet</p>
      </div>
    ) : (
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut */}
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <defs>
                {data.slice(0, 8).map((_, i) => (
                  <radialGradient key={i} id={`pieGrad${i}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.6} />
                  </radialGradient>
                ))}
              </defs>
              <Pie
                data={data.slice(0, 8).map((d, i) => ({ ...d, fill: `url(#pieGrad${i})` }))}
                cx={85}
                cy={85}
                innerRadius={52}
                outerRadius={82}
                paddingAngle={3}
                dataKey="total"
                nameKey="category"
                strokeWidth={0}
              >
                {data.slice(0, 8).map((_, i) => (
                  <Cell key={i} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xs text-white/30 font-medium">Total</p>
            <p className="text-lg font-bold text-white mt-0.5">
              {new Intl.NumberFormat('en-US', { notation: 'compact', style: 'currency', currency: 'USD' })
                .format(data.reduce((s, d) => s + d.total, 0))}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 min-w-0 w-full sm:w-auto">
          {data.slice(0, 6).map((cat, i) => (
            <div key={cat.category} className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-xs text-white/55 flex-1 truncate">{cat.category}</span>
              <span className="text-xs font-semibold text-white/80">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default CategoryPieChart;
