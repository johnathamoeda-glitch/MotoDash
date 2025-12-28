
import React from 'react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const formatDuration = (hoursDecimal: number) => {
  const totalMinutes = Math.round(hoursDecimal * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

const TransactionList: React.FC<Props> = ({ transactions, onDelete }) => {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-400">Nenhum registro encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo/App</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Valor</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                  {t.date.split('-').reverse().join('/')}
                </td>
                <td className="px-6 py-4">
                  {t.type === 'earning' ? (
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{t.app}</span>
                      <span className="text-xs text-gray-400">{t.kmTraveled}km • {formatDuration(t.hoursWorked)}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{t.category}</span>
                      <span className="text-xs text-gray-400 truncate max-w-[120px]">{t.description || '-'}</span>
                    </div>
                  )}
                </td>
                <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${t.type === 'earning' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'earning' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    title="Excluir"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
