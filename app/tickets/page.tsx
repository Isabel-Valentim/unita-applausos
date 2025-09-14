import { TicketList } from "@/components/ticket-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, AlertCircle, Clock, CheckCircle } from "lucide-react"
import { useBranding } from "@/lib/branding-context"

export default function TicketsPage() {
  const { branding } = useBranding()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
          <h1 className="text-xl md:text-3xl font-bold text-primary">{branding.systemName} - Sistema de Chamados</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
            Visualize e gerencie todos os chamados de suporte registrados
          </p>
        </div>
      </header>

      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <TicketList />
          </div>

          {/* Sidebar - shows first on mobile */}
          <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <Ticket className="h-4 w-4 md:h-5 md:w-5" />
                  Status dos Chamados
                </CardTitle>
                <CardDescription className="text-sm">Legenda dos status disponíveis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-brand-primary" />
                  <span className="text-xs md:text-sm">
                    <strong>Aberto:</strong> Aguardando atendimento
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 text-brand-secondary" />
                  <span className="text-xs md:text-sm">
                    <strong>Pendente:</strong> Em andamento
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-brand-accent" />
                  <span className="text-xs md:text-sm">
                    <strong>Resolvido:</strong> Finalizado
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hidden md:block">
              <CardHeader>
                <CardTitle className="text-lg">Como Funciona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>1. Quando você faz uma pergunta no chat que não tem resposta na base de conhecimento</p>
                <p>2. O sistema cria automaticamente um chamado</p>
                <p>3. Nossa equipe de suporte analisa e responde</p>
                <p>4. Você pode acompanhar o status aqui</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
