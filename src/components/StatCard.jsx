import { formatCurrency, formatPct } from '../utils/format';

export default function StatCard({ label, value, sub, positive, type = 'currency' }) {
  const isPos = positive === undefined ? (typeof value === 'number' ? value >= 0 : true) : positive;
  const color = positive === undefined ? 'text-white' : isPos ? 'text-emerald-400' : 'text-red-400';

  return (
    <div className="bg-[#161b27] border border-slate-800 rounded-xl p-5">
      <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>
        {type === 'currency' ? formatCurrency(value) : type === 'pct' ? formatPct(value) : value}
      </div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}
