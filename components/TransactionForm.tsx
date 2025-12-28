
import React, { useState } from 'react';
import { AppType, ExpenseCategory, Transaction } from '../types.ts';

interface Props {
  onAdd: (transaction: Transaction) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const TransactionForm: React.FC<Props> = ({ onAdd }) => {
  const [tab, setTab] = useState<'earning' | 'expense'>('earning');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [app, setApp] = useState<AppType>('Uber');
  const [km, setKm] = useState('');
  const [hoursPart, setHoursPart] = useState('');
  const [minutesPart, setMinutesPart] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Combustível');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'earning') {
      const h = parseInt(hoursPart || '0');
      const m = parseInt(minutesPart || '0');
      const totalHours = h + (m / 60);
      onAdd({
        id: generateId(),
        type: 'earning',
        date,
        app,
        amount: parseFloat(amount),
        kmTraveled: parseFloat(km),
        hoursWorked: totalHours
      });
      setAmount(''); setKm(''); setHoursPart(''); setMinutesPart('');
    } else {
      onAdd({
        id: generateId(),
        type: 'expense',
        date,
        category,
        amount: parseFloat(expenseAmount),
        description: desc
      });
      setExpenseAmount(''); setDesc('');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6">
      <div className="flex bg-black">
        <button 
          type="button"
          onClick={() => setTab('earning')}
          className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all ${tab === 'earning' ? 'bg-[#FDE047] text-black' : 'text-gray-500'}`}
        >
          Novo Ganho
        </button>
        <button 
          type="button"
          onClick={() => setTab('expense')}
          className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all ${tab === 'expense' ? 'bg-[#FDE047] text-black' : 'text-gray-500'}`}
        >
          Novo Gasto
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Data</label>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold focus:border-[#FDE047] outline-none transition-all"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Valor Total (R$)</label>
            <input type="number" step="0.01" required placeholder="0,00"
              value={tab === 'earning' ? amount : expenseAmount}
              onChange={(e) => tab === 'earning' ? setAmount(e.target.value) : setExpenseAmount(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-lg font-black focus:border-[#FDE047] outline-none transition-all"
            />
          </div>

          {tab === 'earning' ? (
            <>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Plataforma</label>
                <select value={app} onChange={(e) => setApp(e.target.value as AppType)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold focus:border-[#FDE047] outline-none transition-all appearance-none"
                >
                  <option value="Uber">Uber</option>
                  <option value="99">99</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Km Rodados</label>
                <input type="number" step="0.1" required placeholder="Ex: 45.5" value={km} onChange={(e) => setKm(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold focus:border-[#FDE047] outline-none transition-all"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tempo Online / Corrida</label>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <input type="number" placeholder="Horas" value={hoursPart} onChange={(e) => setHoursPart(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold focus:border-[#FDE047] outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 pointer-events-none">H</span>
                  </div>
                  <div className="flex-1 relative">
                    <input type="number" placeholder="Minutos" value={minutesPart} onChange={(e) => setMinutesPart(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold focus:border-[#FDE047] outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 pointer-events-none">M</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Categoria e Descrição</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold focus:border-[#FDE047] outline-none transition-all"
                >
                  <option value="Combustível">Combustível</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Seguro">Seguro</option>
                  <option value="Outros">Outros</option>
                </select>
                <input type="text" placeholder="Ex: Troca de óleo" value={desc} onChange={(e) => setDesc(e.target.value)}
                  className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold focus:border-[#FDE047] outline-none transition-all"
                />
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="w-full py-5 rounded-2xl bg-black text-[#FDE047] font-black uppercase tracking-widest transition-all transform active:scale-[0.98] shadow-2xl hover:bg-gray-900">
          Registrar {tab === 'earning' ? 'Ganho' : 'Gasto'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
