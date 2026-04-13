import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'missing_key' || apiKey === '') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export interface EvaluationResult {
  status: 'success' | 'error';
  message: string;
  improvedCode?: string;
}

// Mock evaluation for offline testing
function mockEvaluate(objective: string, code: string): EvaluationResult {
  const normalizedCode = code.replace(/\s/g, '').toLowerCase();
  const normalizedObjective = objective.toLowerCase();

  // Basic logic for the existing lessons
  if (normalizedObjective.includes('olá, mundo') || normalizedObjective.includes('ola, mundo')) {
    if (code.includes('print') && (code.includes('"Olá, Mundo!"') || code.includes("'Olá, Mundo!'"))) {
      return { status: 'success', message: "(Modo Offline) Perfeito! Você usou a função print corretamente para exibir a mensagem." };
    }
    return { status: 'error', message: "(Modo Offline) Quase lá! Verifique se você escreveu print(\"Olá, Mundo!\") exatamente como solicitado." };
  }

  if (normalizedObjective.includes('pontuacao') && normalizedObjective.includes('100')) {
    if (normalizedCode.includes('pontuacao=100') && code.includes('print')) {
      return { status: 'success', message: "(Modo Offline) Excelente! Você criou a variável e a imprimiu corretamente." };
    }
    return { status: 'error', message: "(Modo Offline) Lembre-se de criar a variável pontuacao = 100 e depois usar o print(pontuacao)." };
  }

  if (normalizedObjective.includes('if') && normalizedObjective.includes('veterano')) {
    if (code.includes('if') && code.includes('else') && code.includes('Veterano') && code.includes('Iniciante')) {
      return { status: 'success', message: "(Modo Offline) Muito bem! Você captou a lógica das condicionais." };
    }
    return { status: 'error', message: "(Modo Offline) Verifique se você usou o if nivel > 5: e os prints correspondentes." };
  }

  // Default success for other things in test mode to not block the user
  return { 
    status: 'success', 
    message: "(Modo Offline) Código aceito para fins de teste. No modo online, eu faria uma análise profunda!" 
  };
}

export async function evaluateCodeWithAI(
  lessonObjective: string,
  code: string,
  language: string
): Promise<EvaluationResult> {
  const ai = getAI();
  
  if (!ai) {
    return mockEvaluate(lessonObjective, code);
  }

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
    console.error("Erro ao avaliar código com IA, mudando para modo offline:", error);
    return mockEvaluate(lessonObjective, code);
  }
}

export async function askAITutor(question: string, code: string, language: string): Promise<string> {
  const ai = getAI();

  if (!ai) {
    return `**(Modo Offline)** Estou funcionando sem conexão com a API no momento. 
    
Sua pergunta foi: "${question}"
    
Para responder de forma personalizada, preciso de uma chave de API configurada. Mas continue praticando! Você está indo bem no curso de ${language}.`;
  }

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
    return 'Desculpe, estou com problemas de conexão no momento. (Modo Offline ativo)';
  }
}
