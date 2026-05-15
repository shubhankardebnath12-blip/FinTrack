import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label, currency }) => {
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
      <p className="text-[10px] text-white/35 mb-1.5 font-medium">{label}</p>
      <p className="text-sm font-bold text-white">
        {formatCurrency(payload[0]?.value || 0, currency)}
      </p>
    </div>
  );
};

const SpendingTrendChart = ({ data = [], currency = 'USD' }) => (
  <div
    className="rounded-2xl p-5 sm:p-6 animate-in"
    style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Spending Trend</h3>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>30-day rolling expenses</p>
      </div>
      {data.length > 0 && (
        <div
          className="text-xs font-semibold px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          Last 30 days
        </div>
      )}
    </div>

    {data.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-48 text-white/20">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}
        >
          📈
        </div>
        <p className="text-xs">No trend data available</p>
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="60%" stopColor="#6366f1" stopOpacity={0.05} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            tickMargin={8}
          />
          <YAxis
            tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}
            width={36}
          />
          <Tooltip
            content={(props) => <CustomTooltip {...props} currency={currency} />}
            cursor={{ stroke: 'rgba(99,102,241,0.3)', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#818cf8"
            strokeWidth={2}
            fill="url(#trendGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#818cf8', stroke: 'rgba(99,102,241,0.3)', strokeWidth: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default SpendingTrendChart;
