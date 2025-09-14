import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary">Chat de Suporte</h1>
          <p className="text-muted-foreground mt-2">Converse com nosso agente virtual para obter ajuda instantânea</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ChatInterface />
        </div>
      </main>
    </div>
  )
}
