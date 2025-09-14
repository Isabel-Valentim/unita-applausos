import { type NextRequest, NextResponse } from "next/server"
import { knowledgeSearch } from "@/lib/knowledge-search"
import { buildAIPrompt } from "@/lib/ai-prompt"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatRequest {
  message: string
  history: Message[]
}

export async function POST(request: NextRequest) {
  try {
    const { message, history }: ChatRequest = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: "Mensagem é obrigatória" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API OpenAI não configurada no servidor. Contate o administrador." },
        { status: 500 },
      )
    }

    knowledgeSearch.refresh()

    // Build the AI prompt with knowledge base context
    const prompt = buildAIPrompt(message, history || [], knowledgeSearch)

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
        max_tokens: 1500, // Increased token limit for better responses
        temperature: 0.7,
        presence_penalty: 0.1, // Added to encourage more diverse responses
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API Error:", errorData)

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Chave da API OpenAI inválida. Verifique suas configurações." },
          { status: 401 },
        )
      }

      if (response.status === 429) {
        return NextResponse.json(
          { error: "Limite de uso da API atingido. Tente novamente em alguns minutos." },
          { status: 429 },
        )
      }

      return NextResponse.json(
        { error: "Erro ao processar sua solicitação. Tente novamente." },
        { status: response.status },
      )
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content

    if (!aiResponse) {
      return NextResponse.json({ error: "Resposta inválida da API OpenAI" }, { status: 500 })
    }

    const usage = data.usage
    console.log("OpenAI Usage:", usage)

    return NextResponse.json({
      response: aiResponse,
      usage: usage, // Optional: can be used for monitoring
    })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
