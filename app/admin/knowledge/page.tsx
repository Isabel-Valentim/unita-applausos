import { KnowledgeBase } from "@/components/knowledge-base"

export default function KnowledgeBasePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Base de Conhecimento</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie os artigos que o assistente usa para responder perguntas
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <KnowledgeBase />
      </main>
    </div>
  )
}
