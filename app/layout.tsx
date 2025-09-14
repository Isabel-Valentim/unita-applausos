import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/sonner"
import { BrandingProvider } from "@/lib/branding-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Agente de Suporte Interativo",
  description: "Sistema de suporte com IA, base de conhecimento e tickets",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <BrandingProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Navigation />
            <main className="pb-16 md:pb-0">{children}</main>
          </Suspense>
          <Toaster />
        </BrandingProvider>
        <Analytics />
      </body>
    </html>
  )
}
