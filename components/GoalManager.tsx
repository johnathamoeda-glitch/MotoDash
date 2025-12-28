
import React, { useState, useMemo } from 'react';
import { Goal, Transaction } from '../types.ts';

interface Props {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
  transactions: Transaction[];
}

const GoalManager: React.FC<Props> = ({ goals, onAddGoal, onDeleteGoal, transactions }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const currentNetProfit = useMemo(() => {
    return transactions.reduce((acc, t) => {
      return t.type === 'earning' ? acc + t.amount : acc - t.amount;
    }, 0);
  }, [transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetValue = parseFloat(target.replace(',', '.'));
    if (!name.trim() || isNaN(targetValue) || targetValue <= 0) {
      alert("Por favor, preencha o nome e um valor válido.");
      return;
    }

    const newGoal: Goal = {
      id: Math.random().toString(36).substring(2, 11),
      name: name.trim(),
      targetAmount: targetValue,
      createdAt: new Date().toISOString()
    };

    onAddGoal(newGoal);
    setName('');
    setTarget('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-black text-white p-6 rounded-3xl shadow-xl flex items-center justify-between border-b-4 border-[#FDE047]">
        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Saldo Líquido no Período</p>
          <p className="text-3xl font-black text-[#FDE047]">R$ {currentNetProfit.toFixed(2)}</p>
        </div>
        <button 
          type="button"
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-[#FDE047] text-black p-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          {isAdding ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg> Nova Meta</>
          )}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-in slide-in-from-top-4">
          <h3 className="text-sm font-black text-black mb-6 uppercase tracking-widest">Configurar Novo Objetivo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Qual o objetivo?</label>
              <input 
                type="text" 
                placeholder="Ex: Conta de Luz" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold focus:border-black outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Valor da Meta (R$)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0,00" 
                value={target} 
                onChange={(e) => setTarget(e.target.value)}
                required
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold focus:border-black outline-none transition-all"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-black text-[#FDE047] py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-900 transition-all active:scale-95 shadow-xl"
          >
            Salvar Objetivo
          </button>
        </form>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Nenhuma meta cadastrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const percentage = Math.min(Math.max((currentNetProfit / goal.targetAmount) * 100, 0), 100);
            const isCompleted = currentNetProfit >= goal.targetAmount;
            return (
              <div key={goal.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group relative">
                <button 
                  type="button"
                  onClick={() => {
                    if(confirm("Deseja excluir esta meta?")) onDeleteGoal(goal.id);
                  }} 
                  className="absolute top-4 right-4 text-gray-200 hover:text-black transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h4 className="font-black text-black uppercase tracking-tight">{goal.name}</h4>
                    <p className="text-[10px] font-black text-gray-400">ALVO: R$ {goal.targetAmount.toFixed(2)}</p>
                  </div>
                  <span className="text-2xl font-black text-black">{percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-[#FDE047]' : 'bg-black'}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalManager;
