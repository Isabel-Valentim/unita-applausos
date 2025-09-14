"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { searchKnowledgeBase, type KnowledgeArticle } from "@/lib/knowledge-base"

interface KnowledgeBaseSearchProps {
  onArticleSelect?: (article: KnowledgeArticle) => void
}

export function KnowledgeBaseSearch({ onArticleSelect }: KnowledgeBaseSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<KnowledgeArticle[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    const searchResults = searchKnowledgeBase(query)
    setResults(searchResults)
    setIsSearching(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar na base de conhecimento..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
          </h3>
          {results.map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onArticleSelect?.(article)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base text-accent">{article.title}</CardTitle>
                  <Badge variant="secondary" className="ml-2">
                    {article.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2">{article.content.substring(0, 150)}...</CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {query && results.length === 0 && !isSearching && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Nenhum resultado encontrado para "{query}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
