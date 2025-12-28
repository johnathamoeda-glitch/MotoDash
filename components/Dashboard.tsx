
import React, { useMemo } from 'react';
import { Transaction, DashboardStats } from '../types.ts';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface Props {
  transactions: Transaction[];
}

const Dashboard: React.FC<Props> = ({ transactions }) => {
  const stats: DashboardStats = useMemo(() => {
    const s: DashboardStats = {
      totalEarnings: 0,
      totalExpenses: 0,
      netProfit: 0,
      avgPerHour: 0,
      avgPerKm: 0,
      totalKm: 0,
      totalHours: 0
    };

    transactions.forEach(t => {
      if (t.type === 'earning') {
        s.totalEarnings += t.amount;
        s.totalKm += t.kmTraveled;
        s.totalHours += t.hoursWorked;
      } else {
        s.totalExpenses += t.amount;
      }
    });

    s.netProfit = s.totalEarnings - s.totalExpenses;
    s.avgPerHour = s.totalHours > 0 ? s.totalEarnings / s.totalHours : 0;
    s.avgPerKm = s.totalKm > 0 ? s.totalEarnings / s.totalKm : 0;

    return s;
  }, [transactions]);

  const chartData = useMemo(() => {
    const groups: Record<string, { date: string, gains: number, costs: number }> = {};
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    sorted.forEach(t => {
      const d = t.date;
      if (!groups[d]) groups[d] = { date: d, gains: 0, costs: 0 };
      if (t.type === 'earning') groups[d].gains += t.amount;
      else groups[d].costs += t.amount;
    });
    return Object.values(groups);
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Ganhos', val: `R$ ${stats.totalEarnings.toFixed(2)}`, color: 'text-black' },
          { label: 'Gastos', val: `R$ ${stats.totalExpenses.toFixed(2)}`, color: 'text-red-500' },
          { label: 'Lucro', val: `R$ ${stats.netProfit.toFixed(2)}`, color: 'text-black', bg: 'bg-[#FDE047]' },
          { label: 'Km Total', val: `${stats.totalKm.toFixed(1)} km`, color: 'text-black' }
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-2xl shadow-sm border border-gray-100 ${item.bg || 'bg-white'}`}>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
            <p className={`text-xl font-black ${item.color}`}>{item.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black text-white p-5 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Média p/ Hora</p>
          <p className="text-2xl font-black text-[#FDE047]">R$ {stats.avgPerHour.toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Custo p/ KM</p>
          <p className="text-2xl font-black text-black">R$ {(stats.totalExpenses / (stats.totalKm || 1)).toFixed(2)}</p>
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-black text-black mb-6 uppercase tracking-wider flex items-center gap-2">
            <span className="w-3 h-3 bg-[#FDE047] rounded-full shadow-sm"></span> Tendência de Ganhos
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" fontSize={10} tickFormatter={(v) => v.split('-').reverse().slice(0, 2).join('/')} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#fefce8'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="gains" fill="#FDE047" radius={[4, 4, 0, 0]} name="Ganhos" />
                <Bar dataKey="costs" fill="#000000" radius={[4, 4, 0, 0]} name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-dashed border-gray-200 text-center">
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Sem dados para este período</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
