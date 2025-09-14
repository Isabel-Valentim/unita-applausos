"use client"

import { KnowledgeBaseSearch } from "@/components/knowledge-base-search"
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
              <p className="text-muted-foreground mt-2">Pesquise artigos e encontre respostas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <KnowledgeBaseSearch />
      </main>
    </div>
  )
}
