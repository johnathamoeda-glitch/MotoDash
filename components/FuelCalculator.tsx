
import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';

interface Props {
  onSaveAsExpense: (expense: Transaction) => void;
}

const FuelCalculator: React.FC<Props> = ({ onSaveAsExpense }) => {
  const [amountSpent, setAmountSpent] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [kmTraveled, setKmTraveled] = useState('');

  const results = useMemo(() => {
    const total = parseFloat(amountSpent || '0');
    const price = parseFloat(pricePerLiter || '0');
    const km = parseFloat(kmTraveled || '0');

    const liters = price > 0 ? total / price : 0;
    const avg = liters > 0 ? km / liters : 0;
    const costPerKm = km > 0 ? total / km : 0;

    return {
      liters,
      avg,
      costPerKm
    };
  }, [amountSpent, pricePerLiter, kmTraveled]);

  const handleSave = () => {
    if (!amountSpent) return;

    const newExpense: Transaction = {
      id: crypto.randomUUID(),
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      category: 'Combustível',
      amount: parseFloat(amountSpent),
      description: `Abastecimento: ${results.avg.toFixed(2)} km/L (${kmTraveled}km)`
    };
    onSaveAsExpense(newExpense);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Valor Abastecido (R$)</label>
            <input 
              type="number"
              placeholder="Ex: 50.00"
              value={amountSpent}
              onChange={(e) => setAmountSpent(e.target.value)}
              className="w-full bg-gray-50 border-0 rounded-xl px-4 py-4 text-lg font-bold focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Preço p/ Litro (R$)</label>
            <input 
              type="number"
              placeholder="Ex: 5.89"
              value={pricePerLiter}
              onChange={(e) => setPricePerLiter(e.target.value)}
              className="w-full bg-gray-50 border-0 rounded-xl px-4 py-4 text-lg font-bold focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">KM Rodados</label>
            <input 
              type="number"
              placeholder="Ex: 120"
              value={kmTraveled}
              onChange={(e) => setKmTraveled(e.target.value)}
              className="w-full bg-gray-50 border-0 rounded-xl px-4 py-4 text-lg font-bold focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl text-center">
          <p className="text-xs font-bold text-orange-600 uppercase mb-2">Média da Moto</p>
          <p className="text-3xl font-black text-orange-900">{results.avg.toFixed(2)} <span className="text-sm font-normal">km/L</span></p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center">
          <p className="text-xs font-bold text-blue-600 uppercase mb-2">Custo por KM</p>
          <p className="text-3xl font-black text-blue-900">R$ {results.costPerKm.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 border border-green-100 p-6 rounded-2xl text-center">
          <p className="text-xs font-bold text-green-600 uppercase mb-2">Total Litros</p>
          <p className="text-3xl font-black text-green-900">{results.liters.toFixed(2)} <span className="text-sm font-normal">L</span></p>
        </div>
      </div>

      {amountSpent && (
        <button 
          onClick={handleSave}
          className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
          Registrar como Gasto no Histórico
        </button>
      )}

      <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Como usar?</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          1. Quando for abastecer, zere o trip da sua moto ou anote o KM atual.<br/>
          2. No próximo abastecimento, veja quantos KM você rodou.<br/>
          3. Preencha o valor que pagou no posto e a bomba te dirá o preço por litro.<br/>
          4. O MotoDash calcula sua média real e quanto você gasta por cada km rodado nas entregas!
        </p>
      </div>
    </div>
  );
};

export default FuelCalculator;
