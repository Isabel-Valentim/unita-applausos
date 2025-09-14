import { getAllTickets } from "./ticket-system"
import { knowledgeBase } from "./knowledge-base"

export interface DashboardMetrics {
  totalTickets: number
  openTickets: number
  pendingTickets: number
  resolvedTickets: number
  ticketsToday: number
  avgResolutionTime: number
  totalArticles: number
  mostAccessedArticles: Array<{ id: string; title: string; views: number }>
  ticketsByCategory: Array<{ category: string; count: number }>
  resolutionRate: number
  userSatisfaction: number
  messageFeedback: {
    totalFeedbacks: number
    helpfulFeedbacks: number
    unhelpfulFeedbacks: number
    helpfulPercentage: number
  }
}

// Simulated analytics data - in a real app, this would come from a database
const articleViews: Record<string, number> = {
  "1": 156,
  "2": 89,
  "3": 134,
  "4": 67,
  "5": 45,
}

interface MessageFeedback {
  messageId: string
  isHelpful: boolean
  timestamp: Date
}

// Simulated feedback storage - in a real app, this would be in a database
const messageFeedbacks: MessageFeedback[] = []

export function addMessageFeedback(messageId: string, isHelpful: boolean) {
  const existingFeedback = messageFeedbacks.find((f) => f.messageId === messageId)

  if (existingFeedback) {
    existingFeedback.isHelpful = isHelpful
    existingFeedback.timestamp = new Date()
  } else {
    messageFeedbacks.push({
      messageId,
      isHelpful,
      timestamp: new Date(),
    })
  }
}

export function getMessageFeedbackStats() {
  const totalFeedbacks = messageFeedbacks.length
  const helpfulFeedbacks = messageFeedbacks.filter((f) => f.isHelpful).length
  const unhelpfulFeedbacks = totalFeedbacks - helpfulFeedbacks

  return {
    totalFeedbacks,
    helpfulFeedbacks,
    unhelpfulFeedbacks,
    helpfulPercentage: totalFeedbacks > 0 ? (helpfulFeedbacks / totalFeedbacks) * 100 : 0,
  }
}

export function getDashboardMetrics(): DashboardMetrics {
  const tickets = getAllTickets()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const openTickets = tickets.filter((t) => t.status === "open").length
  const pendingTickets = tickets.filter((t) => t.status === "pending").length
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length
  const ticketsToday = tickets.filter((t) => t.createdAt >= today).length

  // Calculate average resolution time (simulated)
  const resolvedTicketsWithTime = tickets.filter((t) => t.status === "resolved")
  const avgResolutionTime =
    resolvedTicketsWithTime.length > 0
      ? resolvedTicketsWithTime.reduce((acc, ticket) => {
          const resolutionTime = ticket.updatedAt.getTime() - ticket.createdAt.getTime()
          return acc + resolutionTime / (1000 * 60 * 60) // Convert to hours
        }, 0) / resolvedTicketsWithTime.length
      : 0

  // Most accessed articles
  const mostAccessedArticles = knowledgeBase
    .map((article) => ({
      id: article.id,
      title: article.title,
      views: articleViews[article.id] || 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  // Tickets by category (simulated based on knowledge base categories)
  const categories = ["Autenticação", "Perfil", "Relatórios", "Suporte Técnico"]
  const ticketsByCategory = categories.map((category) => ({
    category,
    count: Math.floor(Math.random() * 20) + 5, // Simulated data
  }))

  const resolutionRate = tickets.length > 0 ? (resolvedTickets / tickets.length) * 100 : 0
  const userSatisfaction = 4.2 // Simulated satisfaction score out of 5

  const messageFeedback = getMessageFeedbackStats()

  return {
    totalTickets: tickets.length,
    openTickets,
    pendingTickets,
    resolvedTickets,
    ticketsToday,
    avgResolutionTime,
    totalArticles: knowledgeBase.length,
    mostAccessedArticles,
    ticketsByCategory,
    resolutionRate,
    userSatisfaction,
    messageFeedback,
  }
}

export function getTicketTrends(): Array<{ date: string; tickets: number; resolved: number }> {
  // Simulated trend data for the last 7 days
  const trends = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    trends.push({
      date: date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" }),
      tickets: Math.floor(Math.random() * 15) + 5,
      resolved: Math.floor(Math.random() * 12) + 3,
    })
  }
  return trends
}
