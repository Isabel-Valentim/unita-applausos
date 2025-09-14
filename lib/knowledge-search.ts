import { syncUserArticlesToKnowledgeBase, type KnowledgeArticle } from "./knowledge-base"

interface KnowledgeItem {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export class KnowledgeSearch {
  private items: KnowledgeItem[] = []

  private semanticMap: Record<string, string[]> = {
    kaizen: ["melhoria contínua", "melhoria", "continua", "aperfeiçoamento", "otimização"],
    a3: ["relatório a3", "formulário a3", "documento a3", "template a3"],
    lean: ["enxuto", "lean manufacturing", "produção enxuta"],
    pdca: ["plan do check act", "planejar fazer verificar agir"],
    gemba: ["local de trabalho", "chão de fábrica"],
    "5s": ["cinco s", "organização", "limpeza", "ordem"],
  }

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    const combinedKnowledgeBase = syncUserArticlesToKnowledgeBase()
    this.items = combinedKnowledgeBase.map((article: KnowledgeArticle) => ({
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    }))
  }

  private calculateSimilarity(query: string, text: string): number {
    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2)
    const textWords = text.toLowerCase().split(/\s+/)

    if (queryWords.length === 0) return 0

    let matches = 0
    let exactMatches = 0
    let partialMatches = 0

    for (const queryWord of queryWords) {
      let foundMatch = false
      for (const textWord of textWords) {
        if (textWord === queryWord) {
          exactMatches++
          matches++
          foundMatch = true
          break
        } else if (textWord.includes(queryWord) && queryWord.length > 3) {
          partialMatches++
          matches += 0.7
          foundMatch = true
          break
        } else if (queryWord.includes(textWord) && textWord.length > 3) {
          partialMatches++
          matches += 0.5
          foundMatch = true
          break
        }
      }

      if (!foundMatch && queryWord.length > 3) {
        if (text.toLowerCase().includes(queryWord)) {
          matches += 0.8
        }
      }
    }

    const baseScore = matches / queryWords.length
    const exactBonus = (exactMatches / queryWords.length) * 0.3
    const phraseBonus = this.checkPhraseMatch(query, text) * 0.4

    return Math.min(baseScore + exactBonus + phraseBonus, 1.0)
  }

  private checkPhraseMatch(query: string, text: string): number {
    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()

    // Check if the entire query appears as a phrase
    if (textLower.includes(queryLower)) {
      return 1.0
    }

    // Check for partial phrase matches
    const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 2)
    if (queryWords.length < 2) return 0

    let phraseMatches = 0
    for (let i = 0; i < queryWords.length - 1; i++) {
      const phrase = queryWords.slice(i, i + 2).join(" ")
      if (textLower.includes(phrase)) {
        phraseMatches++
      }
    }

    return phraseMatches / (queryWords.length - 1)
  }

  private expandQueryWithSemantics(query: string): string[] {
    const queryLower = query.toLowerCase()
    const expandedTerms = [queryLower]

    // Check for semantic matches
    for (const [key, synonyms] of Object.entries(this.semanticMap)) {
      if (queryLower.includes(key)) {
        expandedTerms.push(...synonyms)
      }
      // Also check if any synonym matches the query
      for (const synonym of synonyms) {
        if (queryLower.includes(synonym)) {
          expandedTerms.push(key, ...synonyms.filter((s) => s !== synonym))
        }
      }
    }

    return [...new Set(expandedTerms)] // Remove duplicates
  }

  // Search for relevant knowledge items
  searchRelevant(query: string, maxResults = 3): KnowledgeItem[] {
    if (!query.trim()) return []

    console.log("[v0] Searching for:", query)
    console.log("[v0] Total items in knowledge base:", this.items.length)
    console.log(
      "[v0] Items titles:",
      this.items.map((item) => item.title),
    )

    const expandedQueries = this.expandQueryWithSemantics(query)
    console.log("[v0] Expanded search terms:", expandedQueries)

    const scoredItems = this.items.map((item) => {
      let bestScore = 0

      for (const expandedQuery of expandedQueries) {
        const titleScore = this.calculateSimilarity(expandedQuery, item.title) * 2.0
        const contentScore = this.calculateSimilarity(expandedQuery, item.content) * 1.5

        // Additional fuzzy matching for partial terms
        const queryLower = expandedQuery.toLowerCase()
        const titleLower = item.title.toLowerCase()
        const contentLower = item.content.toLowerCase()

        // Bonus for exact phrase matches
        let exactPhraseBonus = 0
        if (titleLower.includes(queryLower)) {
          exactPhraseBonus += 0.5
        }
        if (contentLower.includes(queryLower)) {
          exactPhraseBonus += 0.3
        }

        // Bonus for individual word matches
        const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 1)
        let wordMatchBonus = 0
        queryWords.forEach((word) => {
          if (titleLower.includes(word)) wordMatchBonus += 0.2
          if (contentLower.includes(word)) wordMatchBonus += 0.1
        })

        const totalScore = Math.max(titleScore, contentScore) + exactPhraseBonus + wordMatchBonus
        bestScore = Math.max(bestScore, totalScore)
      }

      console.log(`[v0] Item "${item.title}":`)
      console.log(`  - bestScore: ${bestScore.toFixed(3)}`)
      console.log(`  - content preview: "${item.content.substring(0, 100)}..."`)

      return { item, score: bestScore }
    })

    const filteredItems = scoredItems
      .filter(({ score }) => score > 0.05) // Lower threshold to catch more potential matches
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)

    console.log(
      "[v0] Final filtered results:",
      filteredItems.map((f) => ({ title: f.item.title, score: f.score.toFixed(3) })),
    )

    return filteredItems.map(({ item }) => item)
  }

  // Get all items
  getAllItems(): KnowledgeItem[] {
    return this.items
  }

  formatForAI(items: KnowledgeItem[]): string {
    if (items.length === 0) {
      return "Nenhuma informação relevante encontrada na base de conhecimento."
    }

    return items
      .map((item, index) => `[CONHECIMENTO ${index + 1}]\nTítulo: ${item.title}\nConteúdo: ${item.content}`)
      .join("\n\n")
  }

  refresh() {
    this.loadFromStorage()
  }

  search(query: string): KnowledgeItem[] {
    return this.searchRelevant(query, 5)
  }
}

// Singleton instance
export const knowledgeSearch = new KnowledgeSearch()
