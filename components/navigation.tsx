"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageCircle, Ticket, FileText, BarChart3, Menu, X, BookOpen, Palette, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useBranding } from "@/lib/branding-context"

const solicitanteNavigation = [
  { name: "Início", href: "/", icon: Home },
  { name: "Chat", href: "/solicitante/chat", icon: MessageCircle },
  { name: "Chamados", href: "/solicitante/chamados", icon: Ticket },
  { name: "Base", href: "/solicitante/base", icon: BookOpen },
]

const atendenteNavigation = [
  { name: "Início", href: "/", icon: Home },
  { name: "Chamados", href: "/atendente/chamados", icon: Ticket },
  { name: "Admin", href: "/atendente/admin", icon: Settings },
  { name: "Base", href: "/atendente/base", icon: BookOpen },
  { name: "Branding", href: "/atendente/branding", icon: Palette },
]

const adminNavigation = [
  { name: "Início", href: "/", icon: Home },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Chamados", href: "/tickets", icon: Ticket },
  { name: "Base", href: "/admin/knowledge", icon: BookOpen },
  { name: "Admin", href: "/admin", icon: BarChart3 },
  { name: "Branding", href: "/admin/branding", icon: Palette },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { branding } = useBranding()

  const navigation = useMemo(() => {
    if (pathname.startsWith("/solicitante")) {
      return solicitanteNavigation
    } else if (pathname.startsWith("/atendente")) {
      return atendenteNavigation
    } else if (pathname.startsWith("/admin")) {
      return adminNavigation
    } else {
      // Default navigation for home page
      return [{ name: "Início", href: "/", icon: Home }]
    }
  }, [pathname])

  const homeLink = useMemo(() => {
    if (pathname.startsWith("/solicitante")) {
      return "/solicitante"
    } else if (pathname.startsWith("/atendente")) {
      return "/atendente"
    } else if (pathname.startsWith("/admin")) {
      return "/admin"
    } else {
      return "/"
    }
  }, [pathname])

  return (
    <>
      <nav className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href={homeLink} className="flex items-center gap-2 font-bold text-primary">
              {branding.logo ? (
                <img src={branding.logo || "/placeholder.svg"} alt="Logo" className="h-6 w-6 object-contain" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
              <span className="hidden sm:inline">{branding.systemName}</span>
              <span className="sm:hidden">IA</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                    style={pathname === item.href ? { backgroundColor: "var(--brand-primary)" } : {}}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-card">
            <div className="container mx-auto px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors w-full",
                      pathname === item.href
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                    style={pathname === item.href ? { backgroundColor: "var(--brand-primary)" } : {}}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <div className="flex">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors",
                  pathname === item.href ? "text-white" : "text-muted-foreground hover:text-foreground",
                )}
                style={pathname === item.href ? { backgroundColor: "var(--brand-primary)" } : {}}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
