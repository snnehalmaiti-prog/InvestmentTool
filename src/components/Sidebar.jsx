import { LayoutDashboard, PieChart, Globe, Briefcase, List, Plus } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assets', label: 'By Asset Class', icon: PieChart },
  { id: 'regions', label: 'By Region', icon: Globe },
  { id: 'portfolios', label: 'By Portfolio', icon: Briefcase },
  { id: 'holdings', label: 'All Holdings', icon: List },
];

export default function Sidebar({ active, onChange, onAdd }) {
  return (
    <aside className="w-64 min-h-screen bg-[#161b27] border-r border-slate-800 flex flex-col">
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">IV</div>
          <div>
            <div className="font-semibold text-white text-sm">InvestTrack</div>
            <div className="text-xs text-slate-400">Portfolio Manager</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active === id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Investment
        </button>
      </div>
    </aside>
  );
}
