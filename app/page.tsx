"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Users } from "lucide-react"
import Link from "next/link"
import { useBranding } from "@/lib/branding-context"

export default function HomePage() {
  const { branding } = useBranding()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">{branding.systemName}</h1>
          <p className="text-lg text-muted-foreground">Escolha seu perfil de acesso</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-8 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${branding.primaryColor}20`, color: branding.primaryColor }}
              >
                <MessageCircle className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Solicitante</h2>
              <p className="text-muted-foreground mb-6">
                Acesse o chat de suporte, consulte a base de conhecimento e acompanhe seus chamados
              </p>
              <Link href="/solicitante">
                <Button size="lg" className="w-full" style={{ backgroundColor: branding.primaryColor, color: "white" }}>
                  Acessar como Solicitante
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-8 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${branding.accentColor}20`, color: branding.accentColor }}
              >
                <Users className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Atendente</h2>
              <p className="text-muted-foreground mb-6">
                Gerencie chamados, administre o sistema e configure a base de conhecimento
              </p>
              <Link href="/atendente">
                <Button
                  size="lg"
                  className="w-full bg-transparent"
                  variant="outline"
                  style={{ borderColor: branding.accentColor, color: branding.accentColor }}
                >
                  Acessar como Atendente
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
