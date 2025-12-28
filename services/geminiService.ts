
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getFinancialInsights(transactions: Transaction[]) {
  if (transactions.length === 0) return "Adicione algumas corridas e gastos para eu analisar seu desempenho!";

  const dataSummary = transactions.map(t => {
    if (t.type === 'earning') {
      return `Ganho: R$${t.amount} em ${t.date} via ${t.app} (${t.kmTraveled}km, ${t.hoursWorked}h)`;
    } else {
      return `Gasto: R$${t.amount} em ${t.date} com ${t.category} (${t.description || 'sem descrição'})`;
    }
  }).join('\n');

  const prompt = `
    Analise os seguintes dados financeiros de um motorista de aplicativo (moto) no Brasil:
    ${dataSummary}

    Por favor, forneça:
    1. Uma breve análise do lucro líquido.
    2. Dicas práticas para reduzir custos ou aumentar ganhos com base nos dados.
    3. Identifique qual plataforma parece mais rentável se houver dados suficientes.
    4. Mantenha um tom encorajador e profissional. Use Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text || "Não foi possível gerar uma análise no momento.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Ocorreu um erro ao consultar o assistente de IA. Tente novamente mais tarde.";
  }
}
