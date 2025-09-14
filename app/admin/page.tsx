"use client" // Convertendo para Client Component para usar useBranding hook

import { DashboardMetrics } from "@/components/dashboard-metrics"
import { Badge } from "@/components/ui/badge"
import { useBranding } from "@/lib/branding-context"

export default function AdminPage() {
  const { branding } = useBranding()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">{branding.systemName} - Dashboard Administrativo</h1>
              <p className="text-muted-foreground mt-2">Métricas e indicadores do agente de suporte interativo</p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
              Sistema Online
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <DashboardMetrics />
      </main>
    </div>
  )
}
