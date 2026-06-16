import { useState } from 'react';
import { Pencil, Trash2, Search, Filter } from 'lucide-react';
import { useInvestments } from '../context/InvestmentContext';
import { formatCurrency, formatPct } from '../utils/format';
import { ASSET_CLASSES, REGIONS } from '../data/sampleData';
import InvestmentForm from '../components/InvestmentForm';

export default function Holdings() {
  const { investments, deleteInvestment, portfolios } = useInvestments();
  const [search, setSearch] = useState('');
  const [filterAsset, setFilterAsset] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterPortfolio, setFilterPortfolio] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = investments.filter(inv => {
    const q = search.toLowerCase();
    const matchSearch = !q || inv.name.toLowerCase().includes(q) || inv.portfolio.toLowerCase().includes(q);
    const matchAsset = !filterAsset || inv.assetClass === filterAsset;
    const matchRegion = !filterRegion || inv.region === filterRegion;
    const matchPortfolio = !filterPortfolio || inv.portfolio === filterPortfolio;
    return matchSearch && matchAsset && matchRegion && matchPortfolio;
  });

  function handleDelete(id) {
    deleteInvestment(id);
    setConfirmDelete(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">All Holdings</h1>
        <p className="text-slate-400 text-sm mt-1">{investments.length} investments across your portfolios</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-[#161b27] border border-slate-700 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search size={14} className="text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search investments..."
            className="bg-transparent text-sm text-white placeholder-slate-500 outline-none flex-1"
          />
        </div>
        <select value={filterAsset} onChange={e => setFilterAsset(e.target.value)}
          className="bg-[#161b27] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none">
          <option value="">All Asset Classes</option>
          {ASSET_CLASSES.map(a => <option key={a}>{a}</option>)}
        </select>
        <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)}
          className="bg-[#161b27] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none">
          <option value="">All Regions</option>
          {REGIONS.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={filterPortfolio} onChange={e => setFilterPortfolio(e.target.value)}
          className="bg-[#161b27] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none">
          <option value="">All Portfolios</option>
          {portfolios.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#161b27] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-5 py-3.5 text-xs text-slate-400 font-medium uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3.5 text-xs text-slate-400 font-medium uppercase tracking-wide">Portfolio</th>
                <th className="text-left px-4 py-3.5 text-xs text-slate-400 font-medium uppercase tracking-wide">Asset</th>
                <th className="text-left px-4 py-3.5 text-xs text-slate-400 font-medium uppercase tracking-wide">Region</th>
                <th className="text-right px-4 py-3.5 text-xs text-slate-400 font-medium uppercase tracking-wide">Invested</th>
                <th className="text-right px-4 py-3.5 text-xs text-slate-400 font-medium uppercase tracking-wide">Current</th>
                <th className="text-right px-4 py-3.5 text-xs text-slate-400 font-medium uppercase tracking-wide">Gain/Loss</th>
                <th className="text-right px-4 py-3.5 text-xs text-slate-400 font-medium uppercase tracking-wide">Return</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-500">No investments found</td>
                </tr>
              ) : filtered.map(inv => {
                const gain = inv.currentValue - inv.investedAmount;
                const gainPct = (gain / inv.investedAmount) * 100;
                return (
                  <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="text-white font-medium">{inv.name}</div>
                      <div className="text-xs text-slate-500">{inv.purchaseDate}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">{inv.portfolio}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-300 rounded text-xs">{inv.assetClass}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">{inv.region}</td>
                    <td className="px-4 py-3.5 text-right text-slate-300">{formatCurrency(inv.investedAmount, inv.currency)}</td>
                    <td className="px-4 py-3.5 text-right text-white">{formatCurrency(inv.currentValue, inv.currency)}</td>
                    <td className={`px-4 py-3.5 text-right ${gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatCurrency(gain, inv.currency)}
                    </td>
                    <td className={`px-4 py-3.5 text-right font-medium ${gainPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatPct(gainPct)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditItem(inv)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setConfirmDelete(inv.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
            <span>Showing {filtered.length} of {investments.length} holdings</span>
            <span>Total Current: {formatCurrency(filtered.reduce((s, i) => s + i.currentValue, 0))}</span>
          </div>
        )}
      </div>

      {editItem && <InvestmentForm editData={editItem} onClose={() => setEditItem(null)} />}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b27] border border-slate-700 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">Delete Investment</h3>
            <p className="text-slate-400 text-sm mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
