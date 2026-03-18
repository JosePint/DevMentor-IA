import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface EvaluationResult {
  status: 'success' | 'error';
  message: string;
  improvedCode?: string;
}

export async function evaluateCodeWithAI(
  lessonObjective: string,
  code: string,
  language: string
): Promise<EvaluationResult> {
  try {
    const prompt = `Você é um tutor de programação de elite, amigável e encorajador, trabalhando em uma plataforma de ensino.
O aluno está resolvendo um exercício de ${language}.

OBJETIVO DO EXERCÍCIO: ${lessonObjective}

CÓDIGO DO ALUNO:
\`\`\`${language}
${code}
\`\`\`

Sua tarefa é avaliar o código do aluno.
1. Verifique se o código atinge o objetivo proposto.
2. Verifique se há erros de sintaxe ou lógica.

Se o código estiver CORRETO e atingir o objetivo:
Responda com um JSON contendo:
- "status": "success"
- "message": "Uma mensagem curta de parabéns e uma brevíssima explicação do porquê está bom."

Se o código estiver INCORRETO, incompleto ou com erro:
Responda com um JSON contendo:
- "status": "error"
- "message": "Uma dica construtiva e amigável de como consertar o erro. NÃO DÊ A RESPOSTA FINAL COMPLETA, guie o aluno a pensar."

IMPORTANTE: Retorne APENAS um objeto JSON válido, sem formatação markdown em volta, sem crases. Apenas o JSON puro.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text) as EvaluationResult;
  } catch (error) {
    console.error("Erro ao avaliar código com IA:", error);
    return {
      status: 'error',
      message: 'Ops! Nosso tutor IA teve um problema de conexão. Tente rodar novamente.'
    };
  }
}

export async function askAITutor(question: string, code: string, language: string): Promise<string> {
  try {
    const prompt = `Você é um tutor de programação de elite. O aluno fez uma pergunta sobre o código dele.
Linguagem: ${language}
Código atual:
\`\`\`${language}
${code}
\`\`\`

Pergunta do aluno: "${question}"

Responda de forma clara, didática, em português do Brasil. Use markdown para formatar código se necessário. Seja conciso, não escreva um texto gigante.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || 'Não consegui processar sua pergunta.';
  } catch (error) {
    console.error("Erro ao perguntar para IA:", error);
    return 'Desculpe, estou com problemas de conexão no momento.';
  }
}
