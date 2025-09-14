import { type NextRequest, NextResponse } from "next/server"

interface ImproveArticleRequest {
  question: string
  answer: string
  title: string
}

export async function POST(request: NextRequest) {
  try {
    const { question, answer, title }: ImproveArticleRequest = await request.json()

    if (!question?.trim() || !answer?.trim() || !title?.trim()) {
      return NextResponse.json({ error: "Pergunta, resposta e título são obrigatórios" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API OpenAI não configurada no servidor. Contate o administrador." },
        { status: 500 },
      )
    }

    const prompt = `Você é um especialista em criar artigos para base de conhecimento. Sua tarefa é melhorar uma resposta de atendimento para transformá-la em um artigo profissional e bem estruturado.

CONTEXTO:
- Pergunta original: "${question}"
- Resposta do atendente: "${answer}"
- Título sugerido: "${title}"

INSTRUÇÕES:
1. Mantenha o conteúdo técnico e a solução original
2. Melhore a estrutura, clareza e organização
3. Use formatação em Markdown para melhor legibilidade
4. Adicione seções como "Problema", "Solução", "Passos" se apropriado
5. Torne o texto mais profissional mas acessível
6. Mantenha o tom amigável e útil
7. Adicione dicas extras se relevante

Retorne APENAS o conteúdo melhorado do artigo em Markdown, sem explicações adicionais.`

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
        max_tokens: 2000,
        temperature: 0.3, // Lower temperature for more consistent, professional output
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API Error:", errorData)
      return NextResponse.json(
        { error: "Erro ao processar melhoria do artigo. Tente novamente." },
        { status: response.status },
      )
    }

    const data = await response.json()
    const improvedContent = data.choices?.[0]?.message?.content

    if (!improvedContent) {
      return NextResponse.json({ error: "Resposta inválida da API OpenAI" }, { status: 500 })
    }

    return NextResponse.json({
      improvedContent: improvedContent.trim(),
    })
  } catch (error) {
    console.error("Improve Article API Error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
