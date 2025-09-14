"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Ticket, Settings, FileText, Palette, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useBranding } from "@/lib/branding-context"

export default function AtendentePage() {
  const { branding } = useBranding()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">Portal do Atendente - {branding.companyName}</h1>
              <p className="text-muted-foreground mt-2">Gerencie o {branding.systemName}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/atendente/chamados">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 text-center">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${branding.primaryColor}20`, color: branding.primaryColor }}
                >
                  <Ticket className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Chamados</h3>
                <p className="text-sm text-muted-foreground">Gerencie tickets e respostas</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/atendente/admin">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 text-center">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${branding.secondaryColor}20`, color: branding.secondaryColor }}
                >
                  <Settings className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Admin</h3>
                <p className="text-sm text-muted-foreground">Configurações do sistema</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/atendente/base">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 text-center">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${branding.accentColor}20`, color: branding.accentColor }}
                >
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Base de Conhecimento</h3>
                <p className="text-sm text-muted-foreground">Gerencie artigos e conteúdo</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/atendente/branding">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 text-center">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${branding.primaryColor}30`, color: branding.primaryColor }}
                >
                  <Palette className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Branding</h3>
                <p className="text-sm text-muted-foreground">Personalize a aparência</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
