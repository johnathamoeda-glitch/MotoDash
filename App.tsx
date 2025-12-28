
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, Goal } from './types';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import FuelCalculator from './components/FuelCalculator';
import GoalManager from './components/GoalManager';

type TabType = 'dashboard' | 'history' | 'calculator' | 'goals';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  useEffect(() => {
    try {
      const savedTrans = localStorage.getItem('motodash_transactions');
      if (savedTrans) setTransactions(JSON.parse(savedTrans));
      
      const savedGoals = localStorage.getItem('motodash_goals');
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    } catch (e) {
      console.warn("LocalStorage vazio ou corrompido.");
    }
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('motodash_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('motodash_goals', JSON.stringify(goals));
    }
  }, [goals]);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [...prev, t]);
    setShowForm(false);
  };

  const deleteTransaction = (id: string) => {
    if(confirm("Excluir este registro?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const addGoal = (g: Goal) => {
    setGoals(prev => [...prev, g]);
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (!startDate && !endDate) return true;
      if (startDate && !endDate) return t.date >= startDate;
      if (!startDate && endDate) return t.date <= endDate;
      return t.date >= startDate && t.date <= endDate;
    });
  }, [transactions, startDate, endDate]);

  return (
    <div className="min-h-screen pb-32 bg-[#F8F8F8] text-black font-sans">
      <header className="sticky top-0 z-40 bg-black text-white shadow-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDE047] rounded-xl flex items-center justify-center text-black font-black italic shadow-lg transform -rotate-3">M</div>
            <h1 className="font-black text-white tracking-tighter text-xl uppercase">MotoDash</h1>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all font-bold text-sm shadow-md active:scale-95 ${showForm ? 'bg-gray-800 text-white' : 'bg-[#FDE047] text-black'}`}
          >
            {showForm ? 'Fechar' : 'Lançar +'}
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-6 overflow-x-auto no-scrollbar whitespace-nowrap border-t border-gray-800">
            {[
              { id: 'dashboard', label: 'Resumo' },
              { id: 'goals', label: 'Metas' },
              { id: 'history', label: 'Histórico' },
              { id: 'calculator', label: 'Consumo' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-[#FDE047]' : 'text-gray-400 hover:text-white'}`}
              >
                {tab.label}
                {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FDE047] rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 py-4 mb-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#FDE047] rounded-full"></div>
              Filtrar Período
            </label>
            {(startDate || endDate) && (
              <button onClick={() => {setStartDate(''); setEndDate('');}} className="text-[10px] font-black text-black bg-[#FDE047] px-2 py-0.5 rounded uppercase">Ver Tudo</button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 text-sm font-bold focus:border-black outline-none transition-all"
            />
            <div className="text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 text-sm font-bold focus:border-black outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6">
        {showForm && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
            <TransactionForm onAdd={addTransaction} />
          </div>
        )}

        <div className="animate-in fade-in duration-500">
          {activeTab === 'dashboard' && <Dashboard transactions={filteredTransactions} />}
          {activeTab === 'goals' && <GoalManager goals={goals} onAddGoal={addGoal} onDeleteGoal={deleteGoal} transactions={filteredTransactions} />}
          {activeTab === 'history' && <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />}
          {activeTab === 'calculator' && <FuelCalculator onSaveAsExpense={(expense) => { addTransaction(expense); setActiveTab('history'); }} />}
        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black px-4 py-3 rounded-3xl shadow-2xl flex items-center gap-6 z-50 border border-gray-800">
        {[
          { id: 'dashboard', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
          { id: 'goals', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
          { id: 'plus', icon: <div className="bg-[#FDE047] text-black p-2 rounded-xl scale-125"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg></div> },
          { id: 'history', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
          { id: 'calculator', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => item.id === 'plus' ? setShowForm(true) : setActiveTab(item.id as TabType)}
            className={`transition-all ${activeTab === item.id ? 'text-[#FDE047]' : 'text-gray-500 hover:text-white'}`}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
