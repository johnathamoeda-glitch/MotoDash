
import React, { useState, useEffect } from 'react';
import { getSupabaseConfig } from '../lib/supabase.ts';

interface Props {
  onConfigChange: () => void;
}

const Settings: React.FC<Props> = ({ onConfigChange }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const config = getSupabaseConfig();
    setUrl(config.url);
    setKey(config.key);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('motodash_supabase_url', url.trim());
    localStorage.setItem('motodash_supabase_key', key.trim());
    onConfigChange();
    setStatus('success');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const handleClearData = () => {
    if (confirm("Isso apagará todos os dados salvos LOCALMENTE neste navegador. Continuar?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-[#FDE047]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight">Configurações de Nuvem</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Supabase Project URL</label>
            <input 
              type="url" 
              placeholder="https://xyz.supabase.co" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-black outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Supabase Anon Key</label>
            <input 
              type="password" 
              placeholder="Sua chave anon..." 
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-black outline-none transition-all"
            />
          </div>

          <button 
            type="submit" 
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 ${status === 'success' ? 'bg-green-500 text-white' : 'bg-black text-[#FDE047] hover:bg-gray-900'}`}
          >
            {status === 'success' ? 'Salvo com Sucesso!' : 'Salvar Configurações'}
          </button>
        </form>

        <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Como configurar?</h4>
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            1. Crie um projeto gratuito em <a href="https://supabase.com" target="_blank" className="underline font-black">supabase.com</a><br/>
            2. Vá em Project Settings > API<br/>
            3. Copie a Project URL e a anon public key<br/>
            4. Cole aqui e salve para sincronizar seus dados na nuvem!
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-black text-red-500 uppercase tracking-widest mb-6">Zona de Perigo</h3>
        <button 
          onClick={handleClearData}
          className="w-full py-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-all"
        >
          Limpar todos os dados locais
        </button>
      </div>
    </div>
  );
};

export default Settings;
