"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  GripVertical,
  User,
  MessageSquare,
  Plus,
  Check,
  X,
  Edit2,
  ListChecks,
  Tag,
  BookOpen,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ticketStore, type Ticket } from "@/lib/ticket-store"
import { useBranding } from "@/lib/branding-context"

const statusConfig = {
  aberto: {
    label: "Aberto",
    icon: AlertCircle,
    variant: "destructive" as const,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  em_andamento: {
    label: "Em Andamento",
    icon: Clock,
    variant: "secondary" as const,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  resolvido: {
    label: "Resolvido",
    icon: CheckCircle,
    variant: "default" as const,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
}

const priorityConfig = {
  baixa: {
    label: "Não Crítico",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    variant: "secondary" as const,
    flag: "🟢",
    slaHours: 24,
  },
  media: {
    label: "Não Crítico",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    variant: "outline" as const,
    flag: "🟢",
    slaHours: 24,
  },
  alta: {
    label: "Intermediário",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    variant: "default" as const,
    flag: "🟡",
    slaHours: 4,
  },
  urgente: {
    label: "Crítico",
    color: "text-red-600",
    bgColor: "bg-red-100",
    variant: "destructive" as const,
    flag: "🔴",
    slaHours: 2,
  },
}

const categoryConfig = {
  RH: {
    label: "RH",
    variant: "secondary" as const,
  },
  Financeiro: {
    label: "Financeiro",
    variant: "secondary" as const,
  },
  TI: {
    label: "TI",
    variant: "secondary" as const,
  },
  Operacional: {
    label: "Operacional",
    variant: "secondary" as const,
  },
  Comercial: {
    label: "Comercial",
    variant: "secondary" as const,
  },
  Jurídico: {
    label: "Jurídico",
    variant: "secondary" as const,
  },
  Geral: {
    label: "Geral",
    variant: "outline" as const,
  },
}

function isTicketOverdue(ticket: Ticket): boolean {
  if (!ticket.slaDeadline) return false
  return new Date() > ticket.slaDeadline && ticket.status !== "resolvido"
}

function getTimeRemaining(deadline?: Date): string {
  if (!deadline) return "N/A"

  const now = new Date()
  const diff = deadline.getTime() - now.getTime()

  if (diff <= 0) {
    return "Vencido"
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [draggedTicket, setDraggedTicket] = useState<Ticket | null>(null)
  const [assigneeInput, setAssigneeInput] = useState("")
  const [responseInput, setResponseInput] = useState("")
  const [checklistInput, setChecklistInput] = useState("")
  const [editingChecklistItem, setEditingChecklistItem] = useState<string | null>(null)
  const [editingChecklistText, setEditingChecklistText] = useState("")
  const [saveToKnowledgeBase, setSaveToKnowledgeBase] = useState(false)
  const [knowledgeBaseTitle, setKnowledgeBaseTitle] = useState("")
  const [isImprovingArticle, setIsImprovingArticle] = useState(false)
  const { branding } = useBranding()

  useEffect(() => {
    loadTickets()
    const interval = setInterval(loadTickets, 60000)
    return () => clearInterval(interval)
  }, [])

  const loadTickets = () => {
    const storeTickets = ticketStore.getTickets()
    console.log("[v0] Loaded tickets from store:", storeTickets.length)
    setTickets(storeTickets)
  }

  const handleStatusChange = (ticketId: string, newStatus: Ticket["status"]) => {
    console.log("[v0] Changing status for ticket", ticketId, "to", newStatus)

    const success = ticketStore.updateTicketStatus(ticketId, newStatus)
    if (success) {
      loadTickets()
      if (selectedTicket?.id === ticketId) {
        const updatedTicket = ticketStore.getTicketById(ticketId)
        if (updatedTicket) {
          setSelectedTicket(updatedTicket)
        }
      }
    }
  }

  const handlePriorityChange = (ticketId: string, newPriority: Ticket["priority"]) => {
    console.log("[v0] Changing priority for ticket", ticketId, "to", newPriority)

    const success = ticketStore.updateTicketPriority(ticketId, newPriority)
    if (success) {
      loadTickets()
      if (selectedTicket?.id === ticketId) {
        const updatedTicket = ticketStore.getTicketById(ticketId)
        if (updatedTicket) {
          setSelectedTicket(updatedTicket)
        }
      }
    }
  }

  const handleCategoryChange = (ticketId: string, newCategory: string) => {
    console.log("[v0] Changing category for ticket", ticketId, "to", newCategory)

    const success = ticketStore.updateTicketCategory(ticketId, newCategory)
    if (success) {
      loadTickets()
      if (selectedTicket?.id === ticketId) {
        const updatedTicket = ticketStore.getTicketById(ticketId)
        if (updatedTicket) {
          setSelectedTicket(updatedTicket)
        }
      }
    }
  }

  const handleAssignTicket = (ticketId: string) => {
    if (assigneeInput.trim()) {
      console.log("[v0] Assigning ticket", ticketId, "to", assigneeInput.trim())

      const success = ticketStore.assignTicket(ticketId, assigneeInput.trim())
      if (success) {
        loadTickets()
        if (selectedTicket?.id === ticketId) {
          const updatedTicket = ticketStore.getTicketById(ticketId)
          if (updatedTicket) {
            setSelectedTicket(updatedTicket)
          }
        }
        setAssigneeInput("")
      }
    }
  }

  const handleAddResponse = async (ticketId: string) => {
    if (responseInput.trim()) {
      console.log("[v0] Adding response to ticket", ticketId, ":", responseInput.trim())

      ticketStore.addResponse({
        ticketId: ticketId,
        message: responseInput.trim(),
        author: "Atendente",
        authorType: "atendente",
      })

      if (saveToKnowledgeBase && knowledgeBaseTitle.trim()) {
        const ticket = ticketStore.getTicketById(ticketId)
        if (ticket) {
          setIsImprovingArticle(true)

          try {
            const improveResponse = await fetch("/api/improve-article", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                question: ticket.userQuery || ticket.title,
                answer: responseInput.trim(),
                title: knowledgeBaseTitle.trim(),
              }),
            })

            let articleContent = `**Pergunta:** ${ticket.userQuery || ticket.title}\n\n**Resposta:** ${responseInput.trim()}\n\n---\n\n*Este artigo foi criado automaticamente a partir da resposta ao chamado #${ticketId}*`

            if (improveResponse.ok) {
              const { improvedContent } = await improveResponse.json()
              articleContent =
                improvedContent +
                `\n\n---\n\n*Este artigo foi criado e melhorado automaticamente pela IA a partir da resposta ao chamado #${ticketId}*`
              console.log("[v0] Article improved by AI successfully")
            } else {
              console.warn("[v0] Failed to improve article, using original content")
            }

            const existingArticles = localStorage.getItem("knowledge-base")
            let articles = []
            if (existingArticles) {
              try {
                articles = JSON.parse(existingArticles)
              } catch (error) {
                console.error("Error parsing existing articles:", error)
              }
            }

            const newArticle = {
              id: Date.now().toString(),
              title: knowledgeBaseTitle.trim(),
              content: articleContent,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }

            articles.push(newArticle)
            localStorage.setItem("knowledge-base", JSON.stringify(articles))

            console.log("[v0] Saved improved response to knowledge base:", newArticle.title)
          } catch (error) {
            console.error("[v0] Error improving article:", error)
            const existingArticles = localStorage.getItem("knowledge-base")
            let articles = []
            if (existingArticles) {
              try {
                articles = JSON.parse(existingArticles)
              } catch (error) {
                console.error("Error parsing existing articles:", error)
              }
            }

            const newArticle = {
              id: Date.now().toString(),
              title: knowledgeBaseTitle.trim(),
              content: `**Pergunta:** ${ticket.userQuery || ticket.title}\n\n**Resposta:** ${responseInput.trim()}\n\n---\n\n*Este artigo foi criado automaticamente a partir da resposta ao chamado #${ticketId}*`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }

            articles.push(newArticle)
            localStorage.setItem("knowledge-base", JSON.stringify(articles))
          } finally {
            setIsImprovingArticle(false)
          }
        }
      }

      loadTickets()
      if (selectedTicket?.id === ticketId) {
        const updatedTicket = ticketStore.getTicketById(ticketId)
        if (updatedTicket) {
          setSelectedTicket(updatedTicket)
        }
      }
      setResponseInput("")
      setSaveToKnowledgeBase(false)
      setKnowledgeBaseTitle("")
    }
  }

  const handleDragStart = (e: React.DragEvent, ticket: Ticket) => {
    setDraggedTicket(ticket)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetStatus: Ticket["status"]) => {
    e.preventDefault()
    if (draggedTicket && draggedTicket.status !== targetStatus) {
      handleStatusChange(draggedTicket.id, targetStatus)
    }
    setDraggedTicket(null)
  }

  const handleAddChecklistItem = (ticketId: string) => {
    if (checklistInput.trim()) {
      console.log("[v0] Adding checklist item to ticket", ticketId, ":", checklistInput.trim())

      const success = ticketStore.addChecklistItem(ticketId, checklistInput.trim())
      if (success) {
        loadTickets()
        if (selectedTicket?.id === ticketId) {
          const updatedTicket = ticketStore.getTicketById(ticketId)
          if (updatedTicket) {
            setSelectedTicket(updatedTicket)
          }
        }
        setChecklistInput("")
      }
    }
  }

  const handleToggleChecklistItem = (ticketId: string, itemId: string) => {
    console.log("[v0] Toggling checklist item", itemId, "for ticket", ticketId)

    const success = ticketStore.toggleChecklistItem(ticketId, itemId)
    if (success) {
      loadTickets()
      if (selectedTicket?.id === ticketId) {
        const updatedTicket = ticketStore.getTicketById(ticketId)
        if (updatedTicket) {
          setSelectedTicket(updatedTicket)
        }
      }
    }
  }

  const handleRemoveChecklistItem = (ticketId: string, itemId: string) => {
    console.log("[v0] Removing checklist item", itemId, "from ticket", ticketId)

    const success = ticketStore.removeChecklistItem(ticketId, itemId)
    if (success) {
      loadTickets()
      if (selectedTicket?.id === ticketId) {
        const updatedTicket = ticketStore.getTicketById(ticketId)
        if (updatedTicket) {
          setSelectedTicket(updatedTicket)
        }
      }
    }
  }

  const handleUpdateChecklistItem = (ticketId: string, itemId: string) => {
    if (editingChecklistText.trim()) {
      console.log("[v0] Updating checklist item", itemId, "for ticket", ticketId, ":", editingChecklistText.trim())

      const success = ticketStore.updateChecklistItem(ticketId, itemId, editingChecklistText.trim())
      if (success) {
        loadTickets()
        if (selectedTicket?.id === ticketId) {
          const updatedTicket = ticketStore.getTicketById(ticketId)
          if (updatedTicket) {
            setSelectedTicket(updatedTicket)
          }
        }
        setEditingChecklistItem(null)
        setEditingChecklistText("")
      }
    }
  }

  const ticketsByStatus = {
    aberto: tickets.filter((t) => t.status === "aberto"),
    em_andamento: tickets.filter((t) => t.status === "em_andamento"),
    resolvido: tickets.filter((t) => t.status === "resolvido"),
  }

  const renderTicketCard = (ticket: Ticket) => {
    const config = statusConfig[ticket.status]
    const priorityConf = priorityConfig[ticket.priority]
    const categoryConf = categoryConfig[ticket.category as keyof typeof categoryConfig] || categoryConfig.Geral
    const StatusIcon = config.icon
    const isOverdue = isTicketOverdue(ticket)
    const timeRemaining = getTimeRemaining(ticket.slaDeadline)

    const latestResponse =
      ticket.responses && ticket.responses.length > 0 ? ticket.responses[ticket.responses.length - 1] : null

    return (
      <Dialog
        key={ticket.id}
        open={selectedTicket?.id === ticket.id}
        onOpenChange={(open) => {
          if (!open) setSelectedTicket(null)
        }}
      >
        <Card
          className={`mb-3 hover:shadow-md transition-shadow cursor-pointer ${isOverdue ? "ring-2 ring-red-500" : ""}`}
          draggable
          onDragStart={(e) => handleDragStart(e, ticket)}
          onClick={() => setSelectedTicket(ticket)}
        >
          <CardHeader className="pb-2 px-3 py-2 sm:px-4 sm:py-3">
            <div className="space-y-1">
              <CardTitle className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2 flex-wrap">
                <GripVertical className="h-3 w-3 text-muted-foreground cursor-grab flex-shrink-0" />
                <span className="text-muted-foreground">#</span>
                <span className="break-all text-xs">{ticket.id}</span>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant={categoryConf.variant}
                    className="text-[10px] sm:text-xs flex items-center gap-1 px-1 py-0"
                    style={{ backgroundColor: branding.accentColor, color: "white" }}
                  >
                    <Tag className="h-2 w-2 sm:h-3 sm:w-3" />
                    <span className="hidden sm:inline">{categoryConf.label}</span>
                    <span className="sm:hidden">{categoryConf.label.slice(0, 2)}</span>
                  </Badge>
                  <Badge
                    variant={priorityConf.variant}
                    className="text-[10px] sm:text-xs flex items-center gap-1 px-1 py-0"
                  >
                    <span className="text-xs">{priorityConf.flag}</span>
                    <span className="hidden sm:inline">{priorityConf.label}</span>
                  </Badge>
                  <Badge variant={isOverdue ? "destructive" : "outline"} className="text-[10px] sm:text-xs px-1 py-0">
                    <span className="hidden sm:inline">SLA: </span>
                    {timeRemaining}
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription className="line-clamp-2 text-xs font-medium">{ticket.title}</CardDescription>
              <CardDescription className="line-clamp-2 sm:line-clamp-3 text-[11px] sm:text-xs">
                {ticket.description}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-2 sm:px-4 sm:pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  {ticket.createdAt.toLocaleDateString("pt-BR")}
                </div>
                {ticket.assignee && (
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                    <User className="h-2 w-2 sm:h-3 sm:w-3 flex-shrink-0" />
                    <span className="truncate">{ticket.assignee}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground flex-shrink-0">
                <Eye className="h-2 w-2 sm:h-3 sm:w-3" />
                <span className="hidden sm:inline">Clique para ver</span>
                <span className="sm:hidden">Ver</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
            <DialogTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base md:text-lg flex-wrap">
              <span className="break-all">Chamado #{ticket.id}</span>
              <div className="flex flex-wrap gap-1">
                <Badge variant={config.variant} className="flex items-center gap-1 text-[10px] sm:text-xs">
                  <StatusIcon className="h-2 w-2 sm:h-3 sm:w-3" />
                  <span className="hidden sm:inline">{config.label}</span>
                </Badge>
                <Badge
                  variant={categoryConf.variant}
                  className="text-[10px] sm:text-xs flex items-center gap-1"
                  style={{ backgroundColor: branding.accentColor, color: "white" }}
                >
                  <Tag className="h-2 w-2 sm:h-3 sm:w-3" />
                  {categoryConf.label}
                </Badge>
                <Badge variant={priorityConf.variant} className="text-[10px] sm:text-xs flex items-center gap-1">
                  <span>{priorityConf.flag}</span>
                  <span className="hidden sm:inline">{priorityConf.label}</span>
                </Badge>
                <Badge variant={isOverdue ? "destructive" : "outline"} className="text-[10px] sm:text-xs">
                  <span className="hidden sm:inline">SLA: </span>
                  {timeRemaining}
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">{ticket.title}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-sm">Descrição</h4>
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
              </div>

              {ticket.userQuery && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Pergunta Original</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground italic break-words">"{ticket.userQuery}"</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium block">SLA:</span>
                  <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                    {priorityConf.slaHours}h ({timeRemaining})
                  </span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium block">Criado em:</span>
                  <span className="break-words">{ticket.createdAt.toLocaleString("pt-BR")}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded sm:col-span-2 lg:col-span-1">
                  <span className="font-medium block">Atualizado em:</span>
                  <span className="break-words">{ticket.updatedAt.toLocaleString("pt-BR")}</span>
                </div>
              </div>

              {latestResponse && (
                <div
                  className="border rounded-lg p-3"
                  style={{
                    backgroundColor: `${branding.accentColor}15`,
                    borderColor: `${branding.accentColor}40`,
                  }}
                >
                  <div className="text-sm font-medium mb-1" style={{ color: branding.accentColor }}>
                    Última Resposta
                  </div>
                  <div className="text-xs sm:text-sm break-words mb-2" style={{ color: branding.textColor }}>
                    {latestResponse.message}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Por {latestResponse.author} em {latestResponse.createdAt.toLocaleString("pt-BR")}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Colaborador Responsável
                </h4>
                {ticket.assignee ? (
                  <Badge variant="outline" className="text-xs sm:text-sm break-all">
                    {ticket.assignee}
                  </Badge>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Nome do colaborador"
                      value={assigneeInput}
                      onChange={(e) => setAssigneeInput(e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Button onClick={() => handleAssignTicket(ticket.id)} size="sm" className="w-full sm:w-auto">
                      Atribuir
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Adicionar Resposta
                </h4>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Digite a resposta para o chamado..."
                    value={responseInput}
                    onChange={(e) => setResponseInput(e.target.value)}
                    rows={3}
                    className="text-sm resize-none"
                  />

                  <div
                    className="border rounded-lg p-3 space-y-2"
                    style={{
                      backgroundColor: `${branding.primaryColor}10`,
                      borderColor: `${branding.primaryColor}30`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="saveToKnowledgeBase"
                        checked={saveToKnowledgeBase}
                        onChange={(e) => setSaveToKnowledgeBase(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="saveToKnowledgeBase" className="text-sm font-medium flex items-center gap-1">
                        <BookOpen className="h-4 w-4" style={{ color: branding.primaryColor }} />
                        Salvar como artigo na Base de Conhecimento
                      </label>
                    </div>
                    {saveToKnowledgeBase && (
                      <div>
                        <Input
                          placeholder="Título do artigo (ex: Como resolver problema de login)"
                          value={knowledgeBaseTitle}
                          onChange={(e) => setKnowledgeBaseTitle(e.target.value)}
                          className="text-sm"
                        />
                        <p className="text-xs mt-1" style={{ color: branding.primaryColor }}>
                          A IA irá automaticamente melhorar sua resposta para um formato de artigo profissional antes de
                          salvar na base de conhecimento.
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleAddResponse(ticket.id)}
                    size="sm"
                    className="w-full sm:w-auto text-white"
                    style={{ backgroundColor: branding.primaryColor }}
                    disabled={isImprovingArticle}
                  >
                    {isImprovingArticle ? "Melhorando artigo..." : "Adicionar Resposta"}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  Checklist do Atendente
                </h4>
                <div className="space-y-2">
                  {ticket.checklist && ticket.checklist.length > 0 ? (
                    <div className="space-y-2">
                      {ticket.checklist.map((item) => (
                        <div key={item.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                          <button
                            onClick={() => handleToggleChecklistItem(ticket.id, item.id)}
                            className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                              item.completed
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-300 hover:border-green-400"
                            }`}
                          >
                            {item.completed && <Check className="h-2 w-2 sm:h-3 sm:w-3" />}
                          </button>
                          {editingChecklistItem === item.id ? (
                            <div className="flex-1 flex flex-col sm:flex-row gap-2">
                              <Input
                                value={editingChecklistText}
                                onChange={(e) => setEditingChecklistText(e.target.value)}
                                className="flex-1 text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleUpdateChecklistItem(ticket.id, item.id)
                                  } else if (e.key === "Escape") {
                                    setEditingChecklistItem(null)
                                    setEditingChecklistText("")
                                  }
                                }}
                                autoFocus
                              />
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateChecklistItem(ticket.id, item.id)}
                                  className="px-2"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingChecklistItem(null)
                                    setEditingChecklistText("")
                                  }}
                                  className="px-2"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span
                                className={`flex-1 text-xs sm:text-sm break-words ${item.completed ? "line-through text-gray-500" : ""}`}
                              >
                                {item.text}
                              </span>
                              <div className="flex gap-1 flex-shrink-0">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingChecklistItem(item.id)
                                    setEditingChecklistText(item.text)
                                  }}
                                  className="px-1 sm:px-2"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRemoveChecklistItem(ticket.id, item.id)}
                                  className="px-1 sm:px-2 text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground italic">Nenhum item no checklist</p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Adicionar item ao checklist..."
                      value={checklistInput}
                      onChange={(e) => setChecklistInput(e.target.value)}
                      className="flex-1 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddChecklistItem(ticket.id)
                        }
                      }}
                    />
                    <Button onClick={() => handleAddChecklistItem(ticket.id)} size="sm" className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2 text-sm">Alterar Status</h4>
                  <Select
                    value={ticket.status}
                    onValueChange={(value) => handleStatusChange(ticket.id, value as Ticket["status"])}
                  >
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="resolvido">Resolvido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm">Alterar Prioridade</h4>
                  <Select
                    value={ticket.priority}
                    onValueChange={(value) => handlePriorityChange(ticket.id, value as Ticket["priority"])}
                  >
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">🟢 Não Crítico (24h)</SelectItem>
                      <SelectItem value="media">🟢 Não Crítico (24h)</SelectItem>
                      <SelectItem value="alta">🟡 Intermediário (4h)</SelectItem>
                      <SelectItem value="urgente">🔴 Crítico (2h)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <h4 className="font-medium mb-2 text-sm">Alterar Categoria</h4>
                  <Select value={ticket.category} onValueChange={(value) => handleCategoryChange(ticket.id, value)}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RH">RH</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="TI">TI</SelectItem>
                      <SelectItem value="Operacional">Operacional</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Jurídico">Jurídico</SelectItem>
                      <SelectItem value="Geral">Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const renderKanbanColumn = (status: keyof typeof statusConfig, tickets: Ticket[]) => {
    const config = statusConfig[status]
    const StatusIcon = config.icon

    return (
      <div
        className="flex-1 min-w-[280px] sm:min-w-0"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <div className={`rounded-t-lg p-3 sm:p-4 ${config.bgColor} ${config.borderColor} border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${config.color}`} />
              <h3 className="font-semibold text-sm">{config.label}</h3>
            </div>
            <Badge variant="outline" className="text-xs">
              {tickets.length}
            </Badge>
          </div>
        </div>
        <div className="bg-gray-50 min-h-[400px] p-2 sm:p-3 rounded-b-lg border-l border-r border-b border-gray-200">
          {tickets.length === 0 ? (
            <div className="text-center text-muted-foreground text-xs py-8">
              Nenhum chamado {status === "aberto" ? "aberto" : status === "em_andamento" ? "em andamento" : "resolvido"}
            </div>
          ) : (
            <div className="space-y-0">{tickets.map(renderTicketCard)}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card className="text-center">
          <CardContent className="pt-3 pb-3 sm:pt-4 sm:pb-4">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{ticketsByStatus.aberto.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Abertos</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-3 pb-3 sm:pt-4 sm:pb-4">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{ticketsByStatus.em_andamento.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Em Andamento</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-3 pb-3 sm:pt-4 sm:pb-4">
            <div className="text-xl sm:text-2xl font-bold" style={{ color: branding.accentColor }}>
              {ticketsByStatus.resolvido.length}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Resolvidos</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-3 pb-3 sm:pt-4 sm:pb-4">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{tickets.filter(isTicketOverdue).length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Vencidos</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 min-h-[500px]">
        {renderKanbanColumn("aberto", ticketsByStatus.aberto)}
        {renderKanbanColumn("em_andamento", ticketsByStatus.em_andamento)}
        {renderKanbanColumn("resolvido", ticketsByStatus.resolvido)}
      </div>
    </div>
  )
}
