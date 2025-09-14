"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Palette, Upload, Save, Eye, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { useBranding } from "@/lib/branding-context"

interface BrandingConfig {
  companyName: string
  systemName: string
  description: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logo: string | null
  favicon: string | null
  backgroundColor: string
  textColor: string
}

const colorPresets = [
  { name: "Azul Corporativo", primary: "#0f172a", secondary: "#64748b", accent: "#3b82f6" },
  { name: "Verde Moderno", primary: "#064e3b", secondary: "#6b7280", accent: "#10b981" },
  { name: "Roxo Criativo", primary: "#581c87", secondary: "#6b7280", accent: "#8b5cf6" },
  { name: "Laranja Energético", primary: "#9a3412", secondary: "#6b7280", accent: "#f97316" },
  { name: "Rosa Elegante", primary: "#831843", secondary: "#6b7280", accent: "#ec4899" },
]

export default function BrandingPage() {
  const { branding, updateBranding } = useBranding()
  const [localConfig, setLocalConfig] = useState(branding)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setLocalConfig(branding)
  }, [branding])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      updateBranding(localConfig)
      toast.success("Configurações salvas com sucesso! As mudanças foram aplicadas em todo o sistema.")

      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      toast.error("Erro ao salvar configurações")
    } finally {
      setIsSaving(false)
    }
  }

  const handleColorChange = (field: string, value: string) => {
    const newConfig = { ...localConfig, [field]: value }
    setLocalConfig(newConfig)

    // Auto-apply color changes immediately for preview
    updateBranding({ [field]: value })
  }

  const handleReset = () => {
    const defaultConfig = {
      companyName: "Sua Empresa",
      systemName: "Sistema de Suporte",
      description: "Sistema de suporte inteligente",
      logo: null,
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b",
      accentColor: "#10b981",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
    }
    setLocalConfig(defaultConfig)
    updateBranding(defaultConfig)
    toast.info("Configurações resetadas para o padrão")
  }

  const handleColorPreset = (preset: (typeof colorPresets)[0]) => {
    const newColors = {
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    }
    setLocalConfig((prev) => ({ ...prev, ...newColors }))
    updateBranding(newColors)
  }

  const handleFileUpload = (type: "logo" | "favicon") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLocalConfig((prev) => ({
          ...prev,
          [type]: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "var(--brand-primary)" }}>
                Configurações de Branding
              </h1>
              <p className="text-muted-foreground mt-2">Personalize a aparência e identidade visual do sistema</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {isPreviewMode ? "Sair do Preview" : "Preview"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 text-white"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configurações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      value={localConfig.companyName}
                      onChange={(e) => setLocalConfig((prev) => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Sua Empresa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="systemName">Nome do Sistema</Label>
                    <Input
                      id="systemName"
                      value={localConfig.systemName}
                      onChange={(e) => setLocalConfig((prev) => ({ ...prev, systemName: e.target.value }))}
                      placeholder="Sistema de Suporte"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={localConfig.description}
                    onChange={(e) => setLocalConfig((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do sistema..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cores */}
            <Card>
              <CardHeader>
                <CardTitle>Esquema de Cores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={localConfig.primaryColor}
                        onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={localConfig.primaryColor}
                        onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                        placeholder="#0f172a"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={localConfig.secondaryColor}
                        onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={localConfig.secondaryColor}
                        onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                        placeholder="#64748b"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accentColor">Cor de Destaque</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={localConfig.accentColor}
                        onChange={(e) => handleColorChange("accentColor", e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={localConfig.accentColor}
                        onChange={(e) => handleColorChange("accentColor", e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Presets de Cores</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                    {colorPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        onClick={() => handleColorPreset(preset)}
                        className="flex items-center gap-2 justify-start h-auto p-3"
                      >
                        <div className="flex gap-1">
                          <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: preset.primary }} />
                          <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: preset.secondary }} />
                          <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: preset.accent }} />
                        </div>
                        <span className="text-sm">{preset.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload de Arquivos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Logotipo e Ícones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logo">Logo Principal</Label>
                    <div className="mt-2">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload("logo")}
                        className="mb-2"
                      />
                      {localConfig.logo && (
                        <div className="border rounded p-2 bg-muted">
                          <img
                            src={localConfig.logo || "/placeholder.svg"}
                            alt="Logo preview"
                            className="max-h-16 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="favicon">Favicon</Label>
                    <div className="mt-2">
                      <Input
                        id="favicon"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload("favicon")}
                        className="mb-2"
                      />
                      {localConfig.favicon && (
                        <div className="border rounded p-2 bg-muted">
                          <img
                            src={localConfig.favicon || "/placeholder.svg"}
                            alt="Favicon preview"
                            className="max-h-8 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview em Tempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Header Preview */}
                  <div
                    className="border rounded-lg p-4"
                    style={{
                      backgroundColor: localConfig.primaryColor,
                      color: "white",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {localConfig.logo ? (
                        <img
                          src={localConfig.logo || "/placeholder.svg"}
                          alt="Logo"
                          className="h-6 w-6 object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-white/20 rounded" />
                      )}
                      <span className="font-bold">{localConfig.systemName}</span>
                    </div>
                  </div>

                  {/* Card Preview */}
                  <div className="border rounded-lg p-4 bg-card">
                    <h3 className="font-semibold mb-2" style={{ color: localConfig.primaryColor }}>
                      {localConfig.companyName}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{localConfig.description}</p>
                    <Button
                      size="sm"
                      className="text-white"
                      style={{
                        backgroundColor: localConfig.accentColor,
                      }}
                    >
                      Botão de Exemplo
                    </Button>
                  </div>

                  {/* Badge Preview */}
                  <div className="flex flex-wrap gap-2">
                    <Badge style={{ backgroundColor: localConfig.primaryColor, color: "white" }}>Primária</Badge>
                    <Badge variant="secondary" style={{ backgroundColor: localConfig.secondaryColor, color: "white" }}>
                      Secundária
                    </Badge>
                    <Badge style={{ backgroundColor: localConfig.accentColor, color: "white" }}>Destaque</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 text-white"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
