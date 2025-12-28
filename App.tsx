
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, Goal } from './types.ts';
import TransactionForm from './components/TransactionForm.tsx';
import TransactionList from './components/TransactionList.tsx';
import Dashboard from './components/Dashboard.tsx';
import FuelCalculator from './components/FuelCalculator.tsx';
import GoalManager from './components/GoalManager.tsx';
import Login from './components/Login.tsx';
import { supabase, isSupabaseConfigured } from './lib/supabase.ts';

type TabType = 'dashboard' | 'history' | 'calculator' | 'goals';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
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
    const authStatus = sessionStorage.getItem('motodash_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoadingAuth(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (isSupabaseConfigured && supabase) {
        fetchDataFromSupabase();
      } else {
        loadLocalData();
      }
    }
  }, [isAuthenticated]);

  const loadLocalData = () => {
    const localTrans = localStorage.getItem('motodash_transactions');
    const localGoals = localStorage.getItem('motodash_goals');
    if (localTrans) setTransactions(JSON.parse(localTrans));
    if (localGoals) setGoals(JSON.parse(localGoals));
  };

  const saveLocalData = (newTrans?: Transaction[], newGoals?: Goal[]) => {
    if (newTrans) localStorage.setItem('motodash_transactions', JSON.stringify(newTrans));
    if (newGoals) localStorage.setItem('motodash_goals', JSON.stringify(newGoals));
  };

  const fetchDataFromSupabase = async () => {
    if (!supabase) return;
    setIsSyncing(true);
    try {
      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (transError) throw transError;

      const mappedTrans: Transaction[] = (transData || []).map(t => ({
        id: t.id,
        type: t.type,
        date: t.date,
        amount: Number(t.amount),
        ...(t.type === 'earning' ? {
          app: t.app,
          kmTraveled: Number(t.km_traveled),
          hoursWorked: Number(t.hours_worked)
        } : {
          category: t.category,
          description: t.description
        })
      })) as Transaction[];

      setTransactions(mappedTrans);

      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*');
      
      if (goalsError) throw goalsError;
      
      const mappedGoals: Goal[] = (goalsData || []).map(g => ({
        id: g.id,
        name: g.name,
        targetAmount: Number(g.target_amount),
        createdAt: g.created_at
      }));

      setGoals(mappedGoals);
    } catch (err) {
      console.error("Erro Supabase:", err);
      loadLocalData();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLoginSuccess = () => {
    sessionStorage.setItem('motodash_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (confirm("Deseja realmente sair?")) {
      sessionStorage.removeItem('motodash_auth');
      setIsAuthenticated(false);
    }
  };

  const addTransaction = async (t: Transaction) => {
    if (isSupabaseConfigured && supabase) {
      setIsSyncing(true);
      try {
        const payload = {
          type: t.type,
          date: t.date,
          amount: t.amount,
          ...(t.type === 'earning' ? {
            app: t.app,
            km_traveled: t.kmTraveled,
            hours_worked: t.hoursWorked
          } : {
            category: t.category,
            description: t.description
          })
        };

        const { data, error } = await supabase
          .from('transactions')
          .insert([payload])
          .select();

        if (error) throw error;
        
        const newT = data[0];
        const mappedNew: Transaction = {
          id: newT.id,
          type: newT.type,
          date: newT.date,
          amount: Number(newT.amount),
          ...(newT.type === 'earning' ? {
            app: newT.app,
            kmTraveled: Number(newT.km_traveled),
            hoursWorked: Number(newT.hours_worked)
          } : {
            category: newT.category,
            description: newT.description
          })
        } as Transaction;

        setTransactions(prev => [mappedNew, ...prev]);
        setShowForm(false);
      } catch (err) {
        alert("Erro ao salvar na nuvem. Salvando localmente.");
        const updated = [t, ...transactions];
        setTransactions(updated);
        saveLocalData(updated);
        setShowForm(false);
      } finally {
        setIsSyncing(false);
      }
    } else {
      const updated = [t, ...transactions];
      setTransactions(updated);
      saveLocalData(updated);
      setShowForm(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    if(confirm("Deseja excluir este registro?")) {
      if (isSupabaseConfigured && supabase) {
        setIsSyncing(true);
        try {
          await supabase.from('transactions').delete().eq('id', id);
          setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (err) {
          alert("Erro ao excluir.");
        } finally {
          setIsSyncing(false);
        }
      } else {
        const updated = transactions.filter(t => t.id !== id);
        setTransactions(updated);
        saveLocalData(updated);
      }
    }
  };

  const addGoal = async (g: Goal) => {
    if (isSupabaseConfigured && supabase) {
      setIsSyncing(true);
      try {
        const { data, error } = await supabase
          .from('goals')
          .insert([{ name: g.name, target_amount: g.targetAmount }])
          .select();
        
        if (error) throw error;
        
        const newG = data[0];
        setGoals(prev => [...prev, {
          id: newG.id,
          name: newG.name,
          targetAmount: Number(newG.target_amount),
          createdAt: newG.created_at
        }]);
      } catch (err) {
        const updated = [...goals, g];
        setGoals(updated);
        saveLocalData(undefined, updated);
      } finally {
        setIsSyncing(false);
      }
    } else {
      const updated = [...goals, g];
      setGoals(updated);
      saveLocalData(undefined, updated);
    }
  };

  const deleteGoal = async (id: string) => {
    if(confirm("Excluir esta meta?")) {
      if (isSupabaseConfigured && supabase) {
        setIsSyncing(true);
        try {
          await supabase.from('goals').delete().eq('id', id);
          setGoals(prev => prev.filter(g => g.id !== id));
        } catch (err) {
          alert("Erro ao excluir meta.");
        } finally {
          setIsSyncing(false);
        }
      } else {
        const updated = goals.filter(g => g.id !== id);
        setGoals(updated);
        saveLocalData(undefined, updated);
      }
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (!startDate && !endDate) return true;
      if (startDate && !endDate) return t.date >= startDate;
      if (!startDate && endDate) return t.date <= endDate;
      return t.date >= startDate && t.date <= endDate;
    });
  }, [transactions, startDate, endDate]);

  if (isLoadingAuth) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-[#FDE047] font-black uppercase text-xs tracking-widest">Iniciando...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen pb-32 bg-[#F8F8F8] text-black font-sans">
      <header className="sticky top-0 z-40 bg-black text-white shadow-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDE047] rounded-xl flex items-center justify-center text-black font-black italic shadow-lg transform -rotate-3">M</div>
            <div className="flex flex-col">
              <h1 className="font-black text-white tracking-tighter text-xl uppercase leading-none">MotoDash</h1>
              <span className="text-[8px] font-black text-[#FDE047] uppercase tracking-widest mt-1 flex items-center gap-1">
                {isSyncing ? <span className="animate-pulse">Sincronizando...</span> : (isSupabaseConfigured ? "Nuvem Conectada" : "Modo Local (Offline)")}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-6 whitespace-nowrap border-t border-gray-800">
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
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">De:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-1.5 text-xs font-bold focus:border-black outline-none" />
          </div>
          <div className="flex items-center gap-2 min-w-max">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Até:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-1.5 text-xs font-bold focus:border-black outline-none" />
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6">
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-t-[40px] sm:rounded-[40px] overflow-hidden animate-in slide-in-from-bottom-10 duration-300 relative">
              <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <TransactionForm onAdd={addTransaction} />
            </div>
          </div>
        )}

        <div className="animate-in fade-in duration-500">
          {activeTab === 'dashboard' && <Dashboard transactions={filteredTransactions} />}
          {activeTab === 'goals' && <GoalManager goals={goals} onAddGoal={addGoal} onDeleteGoal={deleteGoal} transactions={filteredTransactions} />}
          {activeTab === 'history' && <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />}
          {activeTab === 'calculator' && <FuelCalculator onSaveAsExpense={(expense) => { addTransaction(expense); setActiveTab('history'); }} />}
        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black px-6 py-4 rounded-[32px] shadow-2xl flex items-center gap-8 z-50 border border-gray-800">
        {[
          { id: 'dashboard', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
          { id: 'goals', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
          { id: 'plus', icon: <div className="bg-[#FDE047] text-black p-2 rounded-xl scale-110"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg></div> },
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
