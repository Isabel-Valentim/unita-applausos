"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Clock, MessageSquare, RefreshCw, Bell, Send, Loader2 } from "lucide-react"
import Link from "next/link"
import { ticketStore, type Ticket } from "@/lib/ticket-store"
import { toast } from "sonner"

export default function MeusChamadosPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const lastUpdateRef = useRef(lastUpdate)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [saveToKnowledge, setSaveToKnowledge] = useState(false)
  const [knowledgeTitle, setKnowledgeTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const userId = "solicitante-1"

  const loadTickets = async () => {
    try {
      const userTickets = ticketStore.getTicketsByUser(userId)
      setTickets(userTickets)
      setLastUpdate(new Date())
      lastUpdateRef.current = new Date()
    } catch (error) {
      toast.error("Erro ao carregar chamados")
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (ticketId: string) => {
    if (!replyMessage.trim()) {
      toast.error("Digite uma mensagem para responder")
      return
    }

    if (saveToKnowledge && !knowledgeTitle.trim()) {
      toast.error("Digite um título para o artigo da base de conhecimento")
      return
    }

    setIsSubmitting(true)

    try {
      let finalMessage = replyMessage

      if (saveToKnowledge) {
        const response = await fetch("/api/improve-article", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: replyMessage,
            title: knowledgeTitle,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          finalMessage = data.improvedContent

          const existingArticles = JSON.parse(localStorage.getItem("knowledge-base") || "[]")
          const newArticle = {
            id: Date.now().toString(),
            title: knowledgeTitle,
            content: finalMessage,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          existingArticles.push(newArticle)
          localStorage.setItem("knowledge-base", JSON.stringify(existingArticles))

          toast.success("Resposta melhorada pela IA e salva na base de conhecimento!")
        } else {
          toast.error("Erro ao melhorar o texto, mas a resposta será enviada normalmente")
        }
      }

      ticketStore.addResponse(ticketId, {
        message: finalMessage,
        authorType: "solicitante",
        authorId: userId,
      })

      setReplyMessage("")
      setSaveToKnowledge(false)
      setKnowledgeTitle("")
      setReplyingTo(null)

      loadTickets()

      toast.success("Resposta enviada com sucesso!")
    } catch (error) {
      toast.error("Erro ao enviar resposta")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    loadTickets()

    const interval = setInterval(() => {
      const userTickets = ticketStore.getTicketsByUser(userId)
      const currentTime = new Date()

      const hasNewResponses = userTickets.some((ticket) =>
        ticket.responses.some(
          (response) => response.authorType === "atendente" && response.createdAt > lastUpdateRef.current,
        ),
      )

      if (hasNewResponses) {
        toast.success("🔔 Você tem novas respostas dos atendentes!", {
          duration: 5000,
        })

        if (typeof window !== "undefined" && window.Audio) {
          try {
            const audio = new Audio(
              "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
            )
            audio.volume = 0.3
            audio.play().catch(() => {})
          } catch (error) {
            // Ignore audio errors
          }
        }
      }

      setTickets(userTickets)
      setLastUpdate(currentTime)
      lastUpdateRef.current = currentTime
    }, 3000)

    return () => clearInterval(interval)
  }, [userId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberto":
        return "bg-blue-100 text-blue-800"
      case "em_andamento":
        return "bg-yellow-100 text-yellow-800"
      case "resolvido":
        return "bg-green-100 text-green-800"
      case "fechado":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgente":
        return "bg-red-100 text-red-800"
      case "alta":
        return "bg-orange-100 text-orange-800"
      case "media":
        return "bg-yellow-100 text-yellow-800"
      case "baixa":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const hasNewResponses = (ticket: Ticket) => {
    return ticket.responses.some(
      (response) => response.authorType === "atendente" && response.createdAt > new Date(Date.now() - 300000), // Last 5 minutes
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando chamados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/solicitante">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary">Meus Chamados</h1>
              <p className="text-muted-foreground mt-2">
                Acompanhe o status dos seus tickets • Atualização automática a cada 3 segundos
              </p>
            </div>
            <Button onClick={loadTickets} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {tickets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum chamado encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não possui chamados abertos. Use o chat para criar um novo chamado quando precisar de ajuda.
              </p>
              <Link href="/solicitante/chat">
                <Button>Ir para o Chat</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className={hasNewResponses(ticket) ? "ring-2 ring-green-200 bg-green-50/30" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{ticket.title}</CardTitle>
                        {hasNewResponses(ticket) && (
                          <Badge variant="default" className="bg-green-100 text-green-800 animate-pulse">
                            <Bell className="h-3 w-3 mr-1" />
                            Nova Resposta
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        #{ticket.id} • {ticket.category}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{ticket.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Criado em {ticket.createdAt.toLocaleDateString("pt-BR")} às{" "}
                        {ticket.createdAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {ticket.responses.length} resposta(s)
                      </span>
                    </div>
                    {ticket.responses.length > 0 && (
                      <span>
                        Última atividade:{" "}
                        {ticket.responses[ticket.responses.length - 1].createdAt.toLocaleString("pt-BR")}
                      </span>
                    )}
                  </div>

                  {ticket.responses.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Histórico de Conversas:
                      </h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {ticket.responses.map((response) => (
                          <div
                            key={response.id}
                            className={`p-3 rounded-lg ${
                              response.authorType === "atendente"
                                ? "bg-blue-50 border-l-4 border-blue-200"
                                : "bg-gray-50 border-l-4 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={response.authorType === "atendente" ? "default" : "secondary"}
                                className={response.authorType === "atendente" ? "bg-blue-100 text-blue-800" : ""}
                              >
                                {response.authorType === "atendente" ? "🎧 Atendente" : "👤 Você"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {response.createdAt.toLocaleString("pt-BR")}
                              </span>
                              {hasNewResponses(ticket) && response.authorType === "atendente" && (
                                <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                                  Novo
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed">{response.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t">
                    {replyingTo === ticket.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Sua resposta:</label>
                          <Textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Digite sua resposta..."
                            className="min-h-[100px]"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`save-knowledge-${ticket.id}`}
                              checked={saveToKnowledge}
                              onCheckedChange={(checked) => setSaveToKnowledge(checked as boolean)}
                            />
                            <label htmlFor={`save-knowledge-${ticket.id}`} className="text-sm font-medium">
                              Salvar como artigo na Base de Conhecimento (IA irá melhorar o texto)
                            </label>
                          </div>

                          {saveToKnowledge && (
                            <div>
                              <label className="text-sm font-medium mb-2 block">Título do artigo:</label>
                              <Input
                                value={knowledgeTitle}
                                onChange={(e) => setKnowledgeTitle(e.target.value)}
                                placeholder="Ex: Como resolver problema de login"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={() => handleReply(ticket.id)} disabled={isSubmitting} className="flex-1">
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {saveToKnowledge ? "Melhorando com IA..." : "Enviando..."}
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Enviar Resposta
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyMessage("")
                              setSaveToKnowledge(false)
                              setKnowledgeTitle("")
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" onClick={() => setReplyingTo(ticket.id)} className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Responder
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
