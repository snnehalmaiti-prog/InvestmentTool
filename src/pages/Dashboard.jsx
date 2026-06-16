import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useInvestments } from '../context/InvestmentContext';
import { formatCurrency, formatPct, groupBy, aggregateGroup } from '../utils/format';
import StatCard from '../components/StatCard';

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa'];

function AllocationChart({ data, title }) {
  return (
    <div className="bg-[#161b27] border border-slate-800 rounded-xl p-5">
      <div className="text-sm font-medium text-white mb-4">{title}</div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip
            formatter={(v) => formatCurrency(v)}
            contentStyle={{ background: '#1e2535', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function TopHoldings({ investments }) {
  const sorted = [...investments].sort((a, b) => b.currentValue - a.currentValue).slice(0, 5);
  const total = investments.reduce((s, i) => s + i.currentValue, 0);

  return (
    <div className="bg-[#161b27] border border-slate-800 rounded-xl p-5">
      <div className="text-sm font-medium text-white mb-4">Top Holdings</div>
      <div className="space-y-3">
        {sorted.map(inv => {
          const pct = ((inv.currentValue / total) * 100).toFixed(1);
          const gain = inv.currentValue - inv.investedAmount;
          const gainPct = (gain / inv.investedAmount) * 100;
          return (
            <div key={inv.id}>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="text-sm text-white">{inv.name}</span>
                  <span className="ml-2 text-xs text-slate-500">{inv.assetClass} · {inv.region}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white">{formatCurrency(inv.currentValue)}</div>
                  <div className={`text-xs ${gainPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatPct(gainPct)}</div>
                </div>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full">
                <div className="h-1.5 bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{pct}% of portfolio</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { investments, summary } = useInvestments();

  const byAsset = Object.entries(groupBy(investments, 'assetClass')).map(([name, items]) => ({
    name,
    value: items.reduce((s, i) => s + i.currentValue, 0),
  }));

  const byRegion = Object.entries(groupBy(investments, 'region')).map(([name, items]) => ({
    name,
    value: items.reduce((s, i) => s + i.currentValue, 0),
  }));

  const byPortfolio = Object.entries(groupBy(investments, 'portfolio')).map(([name, items]) => ({
    name,
    value: items.reduce((s, i) => s + i.currentValue, 0),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Your investment portfolio at a glance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Invested" value={summary.totalInvested} />
        <StatCard label="Current Value" value={summary.totalCurrent} />
        <StatCard
          label="Total Gain / Loss"
          value={summary.totalGain}
          positive={summary.totalGain >= 0}
          sub={formatPct(summary.totalGainPct)}
        />
        <StatCard label="Holdings" value={investments.length} type="number" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AllocationChart data={byAsset} title="By Asset Class" />
        <AllocationChart data={byRegion} title="By Region" />
        <AllocationChart data={byPortfolio} title="By Portfolio" />
      </div>

      <TopHoldings investments={investments} />
    </div>
  );
}
