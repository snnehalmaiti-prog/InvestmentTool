import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useInvestments } from '../context/InvestmentContext';
import { formatCurrency, formatPct, groupBy, aggregateGroup } from '../utils/format';

const COLORS = { positive: '#10b981', negative: '#f43f5e', invested: '#6366f1', current: '#22d3ee' };

function GroupRow({ name, items, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const { invested, current, gain, gainPct } = aggregateGroup(items);

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#161b27] hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {open ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
          <span className="font-semibold text-white">{name}</span>
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{items.length} holdings</span>
        </div>
        <div className="flex items-center gap-8 text-sm">
          <div className="text-right hidden sm:block">
            <div className="text-slate-400 text-xs">Invested</div>
            <div className="text-white">{formatCurrency(invested)}</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-slate-400 text-xs">Current</div>
            <div className="text-white">{formatCurrency(current)}</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-xs">Gain/Loss</div>
            <div className={gain >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {formatCurrency(gain)} ({formatPct(gainPct)})
            </div>
          </div>
        </div>
      </button>

      {open && (
        <div className="divide-y divide-slate-800">
          {items.map(inv => {
            const g = inv.currentValue - inv.investedAmount;
            const gp = (g / inv.investedAmount) * 100;
            return (
              <div key={inv.id} className="flex items-center justify-between px-5 py-3 bg-slate-900/40">
                <div className="pl-7">
                  <div className="text-sm text-white">{inv.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{inv.portfolio} · {inv.purchaseDate}</div>
                </div>
                <div className="flex items-center gap-8 text-sm">
                  <div className="text-right hidden sm:block">
                    <div className="text-slate-500 text-xs">Invested</div>
                    <div className="text-slate-300">{formatCurrency(inv.investedAmount)}</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-slate-500 text-xs">Current</div>
                    <div className="text-slate-300">{formatCurrency(inv.currentValue)}</div>
                  </div>
                  <div className="text-right w-32">
                    <div className="text-slate-500 text-xs">Return</div>
                    <div className={g >= 0 ? 'text-emerald-400' : 'text-red-400'}>{formatPct(gp)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function GroupedView({ groupKey, title, subtitle }) {
  const { investments } = useInvestments();
  const grouped = groupBy(investments, groupKey);

  const chartData = Object.entries(grouped).map(([name, items]) => {
    const { invested, current } = aggregateGroup(items);
    return { name, invested, current };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
      </div>

      <div className="bg-[#161b27] border border-slate-800 rounded-xl p-5">
        <div className="text-sm font-medium text-white mb-4">Invested vs Current Value</div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <Tooltip
              formatter={(v, n) => [formatCurrency(v), n === 'invested' ? 'Invested' : 'Current']}
              contentStyle={{ background: '#1e2535', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            <Bar dataKey="invested" name="Invested" fill={COLORS.invested} radius={[4, 4, 0, 0]} />
            <Bar dataKey="current" name="Current" fill={COLORS.current} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {Object.entries(grouped).map(([name, items], i) => (
          <GroupRow key={name} name={name} items={items} defaultOpen={i === 0} />
        ))}
      </div>
    </div>
  );
}
