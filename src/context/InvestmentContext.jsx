import { createContext, useContext, useState, useEffect } from 'react';
import { sampleInvestments } from '../data/sampleData';

const InvestmentContext = createContext(null);

export function InvestmentProvider({ children }) {
  const [investments, setInvestments] = useState(() => {
    const saved = localStorage.getItem('investments');
    return saved ? JSON.parse(saved) : sampleInvestments;
  });

  const [portfolios, setPortfolios] = useState(() => {
    const saved = localStorage.getItem('portfolios');
    return saved ? JSON.parse(saved) : ['Core Portfolio', 'International', 'Retirement', 'Hedge', 'Speculative'];
  });

  useEffect(() => {
    localStorage.setItem('investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
  }, [portfolios]);

  function addInvestment(investment) {
    const newInv = { ...investment, id: Date.now().toString() };
    setInvestments(prev => [...prev, newInv]);
    if (investment.portfolio && !portfolios.includes(investment.portfolio)) {
      setPortfolios(prev => [...prev, investment.portfolio]);
    }
  }

  function updateInvestment(id, updates) {
    setInvestments(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
    if (updates.portfolio && !portfolios.includes(updates.portfolio)) {
      setPortfolios(prev => [...prev, updates.portfolio]);
    }
  }

  function deleteInvestment(id) {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  }

  function addPortfolio(name) {
    if (!portfolios.includes(name)) {
      setPortfolios(prev => [...prev, name]);
    }
  }

  const totalInvested = investments.reduce((s, i) => s + i.investedAmount, 0);
  const totalCurrent = investments.reduce((s, i) => s + i.currentValue, 0);
  const totalGain = totalCurrent - totalInvested;
  const totalGainPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  return (
    <InvestmentContext.Provider value={{
      investments, portfolios,
      addInvestment, updateInvestment, deleteInvestment, addPortfolio,
      summary: { totalInvested, totalCurrent, totalGain, totalGainPct },
    }}>
      {children}
    </InvestmentContext.Provider>
  );
}

export const useInvestments = () => useContext(InvestmentContext);
