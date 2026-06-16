import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ASSET_CLASSES, REGIONS, CURRENCIES } from '../data/sampleData';
import { useInvestments } from '../context/InvestmentContext';

const empty = {
  name: '', portfolio: '', assetClass: 'Equity', region: 'India',
  investedAmount: '', currentValue: '', currency: 'INR',
  purchaseDate: new Date().toISOString().split('T')[0], notes: '',
};

export default function InvestmentForm({ onClose, editData }) {
  const { addInvestment, updateInvestment, portfolios } = useInvestments();
  const [form, setForm] = useState(editData ? { ...editData } : empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editData) setForm({ ...editData });
  }, [editData]);

  function handle(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');
    if (!form.portfolio.trim()) return setError('Portfolio is required');
    if (!form.investedAmount || Number(form.investedAmount) <= 0) return setError('Invested amount must be > 0');
    if (!form.currentValue || Number(form.currentValue) < 0) return setError('Current value must be >= 0');

    const data = {
      ...form,
      investedAmount: Number(form.investedAmount),
      currentValue: Number(form.currentValue),
    };

    if (editData) {
      updateInvestment(editData.id, data);
    } else {
      addInvestment(data);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#161b27] border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
          <h2 className="text-white font-semibold text-lg">{editData ? 'Edit Investment' : 'Add Investment'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Investment Name *</label>
            <input name="name" value={form.name} onChange={handle} placeholder="e.g. Nifty 50 Index Fund"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Portfolio *</label>
              <input name="portfolio" value={form.portfolio} onChange={handle} list="portfolios-list"
                placeholder="e.g. Core Portfolio"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
              <datalist id="portfolios-list">
                {portfolios.map(p => <option key={p} value={p} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Currency</label>
              <select name="currency" value={form.currency} onChange={handle}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500">
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Asset Class *</label>
              <select name="assetClass" value={form.assetClass} onChange={handle}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500">
                {ASSET_CLASSES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Region *</label>
              <select name="region" value={form.region} onChange={handle}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500">
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Invested Amount *</label>
              <input name="investedAmount" type="number" value={form.investedAmount} onChange={handle} placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Current Value *</label>
              <input name="currentValue" type="number" value={form.currentValue} onChange={handle} placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Purchase Date</label>
            <input name="purchaseDate" type="date" value={form.purchaseDate} onChange={handle}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handle} rows={2} placeholder="Optional notes..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
              {editData ? 'Save Changes' : 'Add Investment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
