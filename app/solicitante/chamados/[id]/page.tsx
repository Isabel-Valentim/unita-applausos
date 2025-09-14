"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Clock, User, AlertCircle, MessageSquare, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ticketStore } from "@/lib/ticket-store"
import { getAllTickets } from "@/lib/ticket-system"

interface TicketDetail {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  userId: string
  userName: string
  createdAt: Date
  updatedAt: Date
  responses?: Array<{
    id: string
    content: string
    author: string
    timestamp: Date
    isAgent: boolean
  }>
}

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string
  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTicket = () => {
      let foundTicket = null

      // Buscar no ticket-store primeiro (tickets do chat)
      const storeTickets = ticketStore.getTickets()
      foundTicket = storeTickets.find((t) => t.id === ticketId)

      // Se não encontrou, buscar no ticket-system (tickets originais)
      if (!foundTicket) {
        const systemTickets = getAllTickets()
        foundTicket = systemTickets.find((t) => t.id === ticketId)
      }

      if (foundTicket) {
        const createdAt = foundTicket.createdAt ? new Date(foundTicket.createdAt) : new Date()
        const updatedAt = foundTicket.updatedAt ? new Date(foundTicket.updatedAt) : new Date()

        // Validate dates and use current date as fallback if invalid
        const validCreatedAt = isNaN(createdAt.getTime()) ? new Date() : createdAt
        const validUpdatedAt = isNaN(updatedAt.getTime()) ? new Date() : updatedAt

        setTicket({
          ...foundTicket,
          createdAt: validCreatedAt,
          updatedAt: validUpdatedAt,
          responses:
            foundTicket.responses?.map((response) => ({
              ...response,
              timestamp: response.timestamp ? new Date(response.timestamp) : new Date(),
            })) || [],
        })
      }

      setLoading(false)
    }

    if (ticketId) {
      loadTicket()
    }
  }, [ticketId])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aberto":
        return "bg-red-100 text-red-800 border-red-200"
      case "em andamento":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolvido":
        return "bg-green-100 text-green-800 border-green-200"
      case "fechado":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "alta":
        return "bg-red-100 text-red-800 border-red-200"
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "baixa":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando detalhes do chamado...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Chamado não encontrado</h2>
            <p className="text-muted-foreground mb-4">O chamado #{ticketId} não foi encontrado.</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Meus Chamados
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Chamado #{ticket.id}</h1>
            <p className="text-muted-foreground">{ticket.title}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
            <Badge className={getPriorityColor(ticket.priority)}>Prioridade {ticket.priority}</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Informações do Chamado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Informações do Chamado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Categoria</label>
                <p className="text-sm">{ticket.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Solicitante</label>
                <p className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {ticket.userName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                <p className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {ticket.createdAt ? ticket.createdAt.toLocaleString("pt-BR") : "Data não disponível"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
                <p className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {ticket.updatedAt ? ticket.updatedAt.toLocaleString("pt-BR") : "Data não disponível"}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">Descrição</label>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Respostas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Histórico de Conversas
              {ticket.responses && ticket.responses.length > 0 && (
                <Badge variant="secondary">{ticket.responses.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ticket.responses && ticket.responses.length > 0 ? (
              <div className="space-y-4">
                {ticket.responses.map((response, index) => (
                  <div key={response.id} className="border-l-2 border-muted pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${response.isAgent ? "bg-blue-500" : "bg-green-500"}`} />
                        <span className="text-sm font-medium">{response.isAgent ? "Atendente" : "Você"}</span>
                        <span className="text-xs text-muted-foreground">
                          {response.timestamp ? response.timestamp.toLocaleString("pt-BR") : "Data não disponível"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{response.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma resposta ainda</p>
                <p className="text-sm text-muted-foreground">Nossa equipe entrará em contato em breve</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status do Chamado */}
        {ticket.status.toLowerCase() === "resolvido" && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-800">Chamado Resolvido</h3>
                  <p className="text-sm text-green-700">
                    Este chamado foi marcado como resolvido. Se você ainda precisar de ajuda, entre em contato conosco
                    novamente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
