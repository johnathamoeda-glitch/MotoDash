
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types.ts";

const getAIClient = () => {
  const apiKey = process?.env?.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export async function getFinancialInsights(transactions: Transaction[]) {
  if (transactions.length === 0) return "Adicione algumas corridas e gastos para eu analisar seu desempenho!";

  const ai = getAIClient();
  if (!ai) return "Chave de IA não configurada.";

  const dataSummary = transactions.map(t => {
    if (t.type === 'earning') {
      return `Ganho: R$${t.amount} em ${t.date} via ${t.app} (${t.kmTraveled}km, ${t.hoursWorked}h)`;
    } else {
      return `Gasto: R$${t.amount} em ${t.date} com ${t.category} (${t.description || 'sem descrição'})`;
    }
  }).join('\n');

  const prompt = `Analise os dados financeiros do motorista de moto:\n${dataSummary}\nForneça lucro líquido, dicas de economia e qual plataforma rende mais.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Sem análise disponível.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao consultar IA.";
  }
}
