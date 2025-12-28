
import React, { useState } from 'react';

interface Props {
  onLogin: () => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'adm' && password === 'adm') {
      onLogin();
    } else {
      setError('Credenciais inválidas. Tente novamente.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="mb-12 text-center">
        <div className="w-20 h-20 bg-[#FDE047] rounded-3xl flex items-center justify-center text-black font-black italic shadow-2xl transform -rotate-6 mx-auto mb-6 text-3xl">M</div>
        <h1 className="font-black text-white tracking-tighter text-4xl uppercase">MotoDash</h1>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">Sistema de Gestão Financeira</p>
      </div>

      <div className="w-full max-w-sm bg-[#111] p-8 rounded-[40px] border border-gray-800 shadow-2xl">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-1">Usuário</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border-2 border-gray-800 rounded-2xl px-6 py-4 text-white font-bold focus:border-[#FDE047] outline-none transition-all placeholder-gray-700"
              placeholder="Digite seu usuário"
              required
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border-2 border-gray-800 rounded-2xl px-6 py-4 text-white font-bold focus:border-[#FDE047] outline-none transition-all placeholder-gray-700"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-black uppercase text-center py-3 rounded-xl animate-pulse">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-[#FDE047] text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-300 transition-all active:scale-95 shadow-xl mt-4"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
      
      <p className="mt-12 text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">Exclusivo para Motoristas Parceiros</p>
    </div>
  );
};

export default Login;
