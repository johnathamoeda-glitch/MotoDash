
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Não foi possível encontrar o elemento root.");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Erro ao renderizar App:", error);
  const display = document.getElementById('error-display');
  if (display) {
    display.style.display = 'block';
    display.innerHTML = "<h1>Erro de Inicialização</h1><pre>" + String(error) + "</pre>";
  }
}
