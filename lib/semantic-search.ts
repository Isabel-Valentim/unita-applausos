// Enhanced semantic search functionality
export interface SearchResult {
  article: any
  relevanceScore: number
  matchedTerms: string[]
  matchType: "exact" | "partial" | "semantic"
}

export function calculateRelevanceScore(query: string, article: any): SearchResult {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 2)

  let score = 0
  const matchedTerms: string[] = []
  let matchType: "exact" | "partial" | "semantic" = "semantic"

  // Title matching (highest weight)
  const titleLower = article.title.toLowerCase()
  if (titleLower.includes(queryLower)) {
    score += 100
    matchedTerms.push("título completo")
    matchType = "exact"
  } else {
    queryWords.forEach((word) => {
      if (titleLower.includes(word)) {
        score += 50
        matchedTerms.push(`título: ${word}`)
        if (matchType === "semantic") matchType = "partial"
      }
    })
  }

  // Content matching
  const contentLower = article.content.toLowerCase()
  if (contentLower.includes(queryLower)) {
    score += 80
    matchedTerms.push("conteúdo completo")
    if (matchType !== "exact") matchType = "exact"
  } else {
    queryWords.forEach((word) => {
      if (contentLower.includes(word)) {
        score += 30
        matchedTerms.push(`conteúdo: ${word}`)
        if (matchType === "semantic") matchType = "partial"
      }
    })
  }

  // Category matching
  if (article.category.toLowerCase().includes(queryLower)) {
    score += 60
    matchedTerms.push("categoria")
    if (matchType === "semantic") matchType = "partial"
  }

  // Tags matching
  article.tags.forEach((tag: string) => {
    if (tag.toLowerCase().includes(queryLower)) {
      score += 40
      matchedTerms.push(`tag: ${tag}`)
      if (matchType === "semantic") matchType = "partial"
    } else {
      queryWords.forEach((word) => {
        if (tag.toLowerCase().includes(word)) {
          score += 20
          matchedTerms.push(`tag: ${tag}`)
          if (matchType === "semantic") matchType = "partial"
        }
      })
    }
  })

  // Semantic similarity bonuses
  score += calculateSemanticBonus(queryLower, article)

  return {
    article,
    relevanceScore: score,
    matchedTerms: [...new Set(matchedTerms)],
    matchType,
  }
}

function calculateSemanticBonus(query: string, article: any): number {
  let bonus = 0

  // Common synonyms and related terms
  const synonymMap: Record<string, string[]> = {
    login: ["entrar", "acesso", "autenticação", "senha", "usuário"],
    perfil: ["dados", "informações", "conta", "configurações"],
    relatório: ["dados", "exportar", "planilha", "informações"],
    problema: ["erro", "bug", "falha", "não funciona"],
    ajuda: ["suporte", "dúvida", "como", "tutorial"],
  }

  Object.entries(synonymMap).forEach(([key, synonyms]) => {
    if (query.includes(key)) {
      synonyms.forEach((synonym) => {
        if (
          article.title.toLowerCase().includes(synonym) ||
          article.content.toLowerCase().includes(synonym) ||
          article.tags.some((tag: string) => tag.toLowerCase().includes(synonym))
        ) {
          bonus += 15
        }
      })
    }
  })

  return bonus
}

export function enhancedSearch(query: string, articles: any[]): SearchResult[] {
  if (!query.trim()) return []

  const results = articles
    .map((article) => calculateRelevanceScore(query, article))
    .filter((result) => result.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)

  return results
}

export function generateSmartResponse(query: string, searchResults: SearchResult[]): string {
  if (searchResults.length === 0) {
    return generateNoResultsResponse(query)
  }

  const bestMatch = searchResults[0]
  const { article, matchType, matchedTerms } = bestMatch

  let response = ""

  // Contextual introduction based on match type
  if (matchType === "exact") {
    response += "Encontrei exatamente o que você está procurando!\n\n"
  } else if (matchType === "partial") {
    response += "Encontrei informações relacionadas à sua pergunta:\n\n"
  } else {
    response += "Baseado na sua pergunta, acredito que isso possa ajudar:\n\n"
  }

  response += `**${article.title}**\n\n${article.content}`

  // Add additional context if there are more results
  if (searchResults.length > 1) {
    response += `\n\n---\n\n*Também encontrei ${searchResults.length - 1} outro${
      searchResults.length > 2 ? "s" : ""
    } artigo${searchResults.length > 2 ? "s" : ""} relacionado${searchResults.length > 2 ? "s" : ""} que pode${
      searchResults.length > 2 ? "m" : ""
    } ser útil.*`
  }

  return response
}

function generateNoResultsResponse(query: string): string {
  const responses = [
    `Não encontrei informações específicas sobre "${query}" em nossa base de conhecimento.`,
    `Infelizmente, não tenho uma resposta direta para "${query}" no momento.`,
    `Não localizei artigos que respondam especificamente sobre "${query}".`,
  ]

  const randomResponse = responses[Math.floor(Math.random() * responses.length)]

  return `${randomResponse}\n\nVou criar um chamado para que nossa equipe de suporte possa ajudá-lo pessoalmente com essa questão específica.`
}
