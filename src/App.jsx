import { useState } from 'react';
import { InvestmentProvider } from './context/InvestmentContext';
import Sidebar from './components/Sidebar';
import InvestmentForm from './components/InvestmentForm';
import Dashboard from './pages/Dashboard';
import GroupedView from './pages/GroupedView';
import Holdings from './pages/Holdings';
import './index.css';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [showAdd, setShowAdd] = useState(false);

  function renderPage() {
    switch (page) {
      case 'dashboard': return <Dashboard />;
      case 'assets': return <GroupedView groupKey="assetClass" title="By Asset Class" subtitle="Track performance across Equity, Debt, Gold and more" />;
      case 'regions': return <GroupedView groupKey="region" title="By Region" subtitle="Understand your geographical exposure" />;
      case 'portfolios': return <GroupedView groupKey="portfolio" title="By Portfolio" subtitle="Monitor each portfolio independently" />;
      case 'holdings': return <Holdings />;
      default: return <Dashboard />;
    }
  }

  return (
    <InvestmentProvider>
      <div className="flex min-h-screen">
        <Sidebar active={page} onChange={setPage} onAdd={() => setShowAdd(true)} />
        <main className="flex-1 p-6 overflow-auto bg-[#0f1117]">
          {renderPage()}
        </main>
      </div>
      {showAdd && <InvestmentForm onClose={() => setShowAdd(false)} />}
    </InvestmentProvider>
  );
}
