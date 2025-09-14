import type { KnowledgeSearch } from "./knowledge-search"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function buildAIPrompt(userMessage: string, history: Message[], knowledgeSearch: KnowledgeSearch): string {
  // Search for relevant knowledge
  const relevantItems = knowledgeSearch.searchRelevant(userMessage, 3)
  const knowledgeContext = knowledgeSearch.formatForAI(relevantItems)

  // Build conversation history (last 6 messages to keep context manageable)
  const recentHistory = history.slice(-6)
  const conversationContext = recentHistory
    .map((msg) => `${msg.role === "user" ? "Usuário" : "Assistente"}: ${msg.content}`)
    .join("\n")

  const systemPrompt = `Você é um assistente inteligente e prestativo que responde em português brasileiro. 

INSTRUÇÕES IMPORTANTES:
1. Use SEMPRE as informações da base de conhecimento quando relevantes para a pergunta
2. Se não houver informações relevantes na base de conhecimento (quando aparecer "Nenhuma informação relevante encontrada"), você DEVE responder EXATAMENTE: "SEM_RESPOSTA_DISPONIVEL"
3. NUNCA use conhecimentos gerais quando não há informações na base de conhecimento
4. NUNCA invente ou especule respostas quando não há informações específicas disponíveis
5. Seja conversacional, amigável e direto quando há informações relevantes
6. Mantenha respostas concisas mas completas quando há informações na base
7. Se a pergunta não estiver clara, peça esclarecimentos

REGRA CRÍTICA: Se a base de conhecimento não contém informações relevantes para responder a pergunta do usuário, você DEVE responder apenas "SEM_RESPOSTA_DISPONIVEL" para que um chamado seja criado automaticamente.

BASE DE CONHECIMENTO DISPONÍVEL:
${knowledgeContext}

HISTÓRICO DA CONVERSA:
${conversationContext}

PERGUNTA ATUAL DO USUÁRIO: ${userMessage}

Responda de forma natural e útil se houver informações relevantes, ou responda "SEM_RESPOSTA_DISPONIVEL" se não houver:`

  return systemPrompt
}
