"use client"

import { KnowledgeBaseReadOnly } from "@/components/knowledge-base-readonly"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SolicitanteBasePage() {
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
            <div>
              <h1 className="text-3xl font-bold text-primary">Base de Conhecimento</h1>
              <p className="text-muted-foreground mt-2">
                Consulte todos os artigos disponíveis para encontrar respostas
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <KnowledgeBaseReadOnly />
      </main>
    </div>
  )
}
