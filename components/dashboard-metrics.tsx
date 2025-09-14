"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Ticket, Clock, CheckCircle, TrendingUp, Star } from "lucide-react"
import { getDashboardMetrics, getTicketTrends, type DashboardMetrics as DashboardMetricsType } from "@/lib/analytics"
import { useBranding } from "@/lib/branding-context"

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetricsType | null>(null)
  const [trends, setTrends] = useState<any[]>([])
  const { branding } = useBranding()

  const COLORS = [branding.primaryColor, branding.accentColor, branding.secondaryColor, "#10b981", "#f59e0b"]

  useEffect(() => {
    const loadMetrics = () => {
      setMetrics(getDashboardMetrics())
      setTrends(getTicketTrends())
    }

    loadMetrics()
    // Refresh metrics every 30 seconds
    const interval = setInterval(loadMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!metrics) {
    return <div>Carregando métricas...</div>
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Chamados</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: branding.primaryColor }}>
              {metrics.totalTickets}
            </div>
            <p className="text-xs text-muted-foreground">{metrics.ticketsToday} criados hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: branding.accentColor }}>
              {metrics.resolutionRate.toFixed(1)}%
            </div>
            <Progress
              value={metrics.resolutionRate}
              className="mt-2"
              style={
                {
                  "--progress-background": branding.accentColor,
                } as React.CSSProperties
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: branding.secondaryColor }}>
              {metrics.avgResolutionTime.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">Para resolução</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: branding.primaryColor }}>
              {metrics.userSatisfaction}/5
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= metrics.userSatisfaction ? "fill-current" : "text-gray-300"}`}
                  style={{
                    color: star <= metrics.userSatisfaction ? "#fbbf24" : undefined,
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback do Chat</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: branding.accentColor }}>
              {metrics.messageFeedback.helpfulPercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">{metrics.messageFeedback.totalFeedbacks} avaliações</p>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="font-medium" style={{ color: branding.accentColor }}>
                👍 {metrics.messageFeedback.helpfulFeedbacks}
              </span>
              <span className="text-red-600">👎 {metrics.messageFeedback.unhelpfulFeedbacks}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Artigos Mais Acessados</CardTitle>
            <CardDescription>Top 5 artigos da base de conhecimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.mostAccessedArticles.map((article, index) => (
              <div key={article.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="w-6 h-6 p-0 flex items-center justify-center text-xs"
                    style={{ borderColor: branding.primaryColor, color: branding.primaryColor }}
                  >
                    {index + 1}
                  </Badge>
                  <span className="text-sm truncate">{article.title}</span>
                </div>
                <Badge
                  variant="secondary"
                  style={{ backgroundColor: `${branding.accentColor}20`, color: branding.accentColor }}
                >
                  {article.views}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chamados por Categoria</CardTitle>
            <CardDescription>Distribuição por tipo de problema</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={metrics.ticketsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {metrics.ticketsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {metrics.ticketsByCategory.map((category, index) => (
                <div key={category.category} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>
                    {category.category}: {category.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tendência de Chamados (Últimos 7 dias)
          </CardTitle>
          <CardDescription>Comparação entre chamados criados e resolvidos</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tickets" stroke={branding.primaryColor} strokeWidth={2} name="Criados" />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke={branding.accentColor}
                strokeWidth={2}
                name="Resolvidos"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
