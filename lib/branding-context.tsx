"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface BrandingConfig {
  companyName: string
  systemName: string
  description?: string
  logo: string | null
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
}

const defaultBranding: BrandingConfig = {
  companyName: "Sua Empresa",
  systemName: "Agente de Suporte",
  description: "Sistema de suporte inteligente",
  logo: null,
  primaryColor: "#3b82f6",
  secondaryColor: "#64748b",
  accentColor: "#10b981",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
}

const BrandingContext = createContext<{
  branding: BrandingConfig
  updateBranding: (config: Partial<BrandingConfig>) => void
}>({
  branding: defaultBranding,
  updateBranding: () => {},
})

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingConfig>(defaultBranding)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedBranding = localStorage.getItem("branding-config")
    if (savedBranding) {
      try {
        const parsed = JSON.parse(savedBranding)
        setBranding({ ...defaultBranding, ...parsed })
      } catch (error) {
        console.error("Error parsing branding config:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    const root = document.documentElement
    root.style.setProperty("--brand-primary", branding.primaryColor)
    root.style.setProperty("--brand-secondary", branding.secondaryColor)
    root.style.setProperty("--brand-accent", branding.accentColor)
    root.style.setProperty("--brand-background", branding.backgroundColor)
    root.style.setProperty("--brand-text", branding.textColor)

    // Update document title
    document.title = `${branding.systemName} - ${branding.companyName}`

    // Update favicon if available
    if (branding.logo) {
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
      if (favicon) {
        favicon.href = branding.logo
      }
    }
  }, [branding, isLoaded])

  const updateBranding = (config: Partial<BrandingConfig>) => {
    const newBranding = { ...branding, ...config }
    setBranding(newBranding)
    localStorage.setItem("branding-config", JSON.stringify(newBranding))

    const root = document.documentElement
    Object.entries(config).forEach(([key, value]) => {
      if (key === "primaryColor") root.style.setProperty("--brand-primary", value as string)
      if (key === "secondaryColor") root.style.setProperty("--brand-secondary", value as string)
      if (key === "accentColor") root.style.setProperty("--brand-accent", value as string)
      if (key === "backgroundColor") root.style.setProperty("--brand-background", value as string)
      if (key === "textColor") root.style.setProperty("--brand-text", value as string)
    })
  }

  return <BrandingContext.Provider value={{ branding, updateBranding }}>{children}</BrandingContext.Provider>
}

export const useBranding = () => {
  const context = useContext(BrandingContext)
  if (!context) {
    throw new Error("useBranding must be used within a BrandingProvider")
  }
  return context
}
