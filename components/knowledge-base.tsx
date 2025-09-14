"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, X, Search, FileText, BookOpen } from "lucide-react"
import { getKnowledgeBaseWithUserArticles } from "@/lib/knowledge-base"

interface KnowledgeItem {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  isDefault?: boolean
  category?: string
}

export function KnowledgeBase() {
  const [userItems, setUserItems] = useState<KnowledgeItem[]>([])
  const [defaultItems, setDefaultItems] = useState<KnowledgeItem[]>([])
  const [allItems, setAllItems] = useState<KnowledgeItem[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: "", content: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>([])
  const [showFilter, setShowFilter] = useState<"all" | "default" | "user">("all")

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

  const saveToStorage = (newUserItems: KnowledgeItem[]) => {
    localStorage.setItem("knowledge-base", JSON.stringify(newUserItems))
    setUserItems(newUserItems)
    const combined = [...defaultItems, ...newUserItems]
    setAllItems(combined)
  }

  const handleAdd = () => {
    setIsEditing("new")
    setEditForm({ title: "", content: "" })
  }

  const handleEdit = (item: KnowledgeItem) => {
    if (item.isDefault) {
      alert("Artigos padrão não podem ser editados. Você pode criar um novo artigo baseado neste conteúdo.")
      return
    }
    setIsEditing(item.id)
    setEditForm({ title: item.title, content: item.content })
  }

  const handleSave = () => {
    if (!editForm.title.trim() || !editForm.content.trim()) return

    if (isEditing === "new") {
      const newItem: KnowledgeItem = {
        id: Date.now().toString(),
        title: editForm.title,
        content: editForm.content,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      saveToStorage([...userItems, newItem])
    } else {
      const updatedItems = userItems.map((item) =>
        item.id === isEditing
          ? { ...item, title: editForm.title, content: editForm.content, updatedAt: new Date() }
          : item,
      )
      saveToStorage(updatedItems)
    }

    setIsEditing(null)
    setEditForm({ title: "", content: "" })
  }

  const handleDelete = (id: string) => {
    const item = allItems.find((i) => i.id === id)
    if (item?.isDefault) {
      alert("Artigos padrão não podem ser excluídos.")
      return
    }

    if (confirm("Tem certeza que deseja excluir este item?")) {
      const updatedUserItems = userItems.filter((item) => item.id !== id)
      saveToStorage(updatedUserItems)
    }
  }

  const handleCancel = () => {
    setIsEditing(null)
    setEditForm({ title: "", content: "" })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Base de Conhecimento</h2>
          <p className="text-muted-foreground">
            Gerencie as informações que o assistente pode usar para responder perguntas
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Item
        </Button>
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

      {isEditing && (
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Digite o título..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Conteúdo</label>
              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm((prev) => ({ ...prev, content: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-border rounded-md bg-input resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Digite o conteúdo..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Salvar
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 bg-transparent">
                <X className="w-4 h-4" />
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <Card className="p-8 text-center">
            {allItems.length === 0 ? (
              <>
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Nenhum item na base de conhecimento ainda.</p>
                <Button onClick={handleAdd} variant="outline">
                  Adicionar primeiro item
                </Button>
              </>
            ) : (
              <>
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum item encontrado para "{searchQuery}"</p>
              </>
            )}
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    {item.isDefault && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Padrão</span>
                    )}
                    {item.category && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">{item.category}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="flex items-center gap-1"
                    disabled={item.isDefault}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1 text-destructive hover:text-destructive"
                    disabled={item.isDefault}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground mb-3 leading-relaxed whitespace-pre-wrap">{item.content}</p>
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
