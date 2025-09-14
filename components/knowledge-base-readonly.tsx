"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Search, FileText, BookOpen, Eye } from "lucide-react"
import { getKnowledgeBaseWithUserArticles } from "@/lib/knowledge-base"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface KnowledgeItem {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  isDefault?: boolean
  category?: string
}

export function KnowledgeBaseReadOnly() {
  const [userItems, setUserItems] = useState<KnowledgeItem[]>([])
  const [defaultItems, setDefaultItems] = useState<KnowledgeItem[]>([])
  const [allItems, setAllItems] = useState<KnowledgeItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>([])
  const [showFilter, setShowFilter] = useState<"all" | "default" | "user">("all")
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeItem | null>(null)

  useEffect(() => {
    loadAllArticles()
  }, [])

  const loadAllArticles = async () => {
    const saved = localStorage.getItem("knowledge-base")
    let loadedUserItems: KnowledgeItem[] = []
    if (saved) {
      const parsed = JSON.parse(saved)
      loadedUserItems = parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        isDefault: false,
      }))
    }

    const allKnowledgeBase = await getKnowledgeBaseWithUserArticles()
    const loadedDefaultItems: KnowledgeItem[] = allKnowledgeBase.map((item, index) => ({
      id: `default-${index}`,
      title: item.title,
      content: item.content,
      category: item.category,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: true,
    }))

    setUserItems(loadedUserItems)
    setDefaultItems(loadedDefaultItems)

    const combined = [...loadedDefaultItems, ...loadedUserItems]
    setAllItems(combined)
    setFilteredItems(combined)
  }

  useEffect(() => {
    let itemsToFilter = allItems

    if (showFilter === "default") {
      itemsToFilter = allItems.filter((item) => item.isDefault)
    } else if (showFilter === "user") {
      itemsToFilter = allItems.filter((item) => !item.isDefault)
    }

    if (!searchQuery.trim()) {
      setFilteredItems(itemsToFilter)
    } else {
      const filtered = itemsToFilter.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredItems(filtered)
    }
  }, [searchQuery, allItems, showFilter])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Base de Conhecimento</h2>
          <p className="text-muted-foreground">
            Consulte as informações disponíveis para encontrar respostas às suas dúvidas
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button variant={showFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setShowFilter("all")}>
          Todos ({allItems.length})
        </Button>
        <Button
          variant={showFilter === "default" ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFilter("default")}
          className="flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Padrão ({defaultItems.length})
        </Button>
        <Button variant={showFilter === "user" ? "default" : "outline"} size="sm" onClick={() => setShowFilter("user")}>
          Criados por Usuários ({userItems.length})
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar na base de conhecimento..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </Card>

      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <Card className="p-8 text-center">
            {allItems.length === 0 ? (
              <>
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum artigo disponível na base de conhecimento.</p>
              </>
            ) : (
              <>
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum artigo encontrado para "{searchQuery}"</p>
              </>
            )}
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    {item.isDefault && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Padrão
                      </Badge>
                    )}
                    {item.category && (
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedArticle(item)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Ver completo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {item.title}
                        {item.isDefault && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Padrão
                          </Badge>
                        )}
                        {item.category && <Badge variant="outline">{item.category}</Badge>}
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{item.content}</div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-muted-foreground mb-3 leading-relaxed">
                {item.content.length > 200 ? `${item.content.substring(0, 200)}...` : item.content}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.isDefault
                  ? `Artigo padrão • Categoria: ${item.category || "Geral"}`
                  : `Criado em ${item.createdAt.toLocaleDateString("pt-BR")} • Atualizado em ${item.updatedAt.toLocaleDateString("pt-BR")}`}
              </p>
            </Card>
          ))
        )}
      </div>

      {allItems.length > 0 && (
        <Card className="p-4 mt-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Total: {allItems.length} artigos ({defaultItems.length} padrão, {userItems.length} criados por usuários)
            </span>
            {searchQuery && (
              <span>
                Mostrando: {filteredItems.length} de {allItems.length}
              </span>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
