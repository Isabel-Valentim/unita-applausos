"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Palette, Save, Upload, Eye, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"
import { toast } from "sonner"
import { useBranding } from "@/lib/branding-context"

export default function AtendenteBrandingPage() {
  const { branding, updateBranding } = useBranding()
  const [config, setConfig] = useState(branding)
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    updateBranding(config)
    toast.success("Configurações de branding salvas com sucesso!")
  }

  const handleReset = () => {
    const defaultConfig = {
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
    setConfig(defaultConfig)
    toast.info("Configurações resetadas para o padrão")
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setConfig({ ...config, logo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const presetColors = [
    { name: "Azul", primary: "#3b82f6", secondary: "#64748b", accent: "#10b981" },
    { name: "Verde", primary: "#10b981", secondary: "#6b7280", accent: "#3b82f6" },
    { name: "Roxo", primary: "#8b5cf6", secondary: "#6b7280", accent: "#f59e0b" },
    { name: "Rosa", primary: "#ec4899", secondary: "#6b7280", accent: "#10b981" },
    { name: "Laranja", primary: "#f97316", secondary: "#6b7280", accent: "#3b82f6" },
    { name: "Vermelho", primary: "#ef4444", secondary: "#6b7280", accent: "#10b981" },
  ]

  const applyPreset = (preset: (typeof presetColors)[0]) => {
    setConfig({
      ...config,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/atendente">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-primary">Configurações de Branding</h1>
                <p className="text-muted-foreground mt-2">Personalize a identidade visual do sistema</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Editar" : "Preview"}
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Resetar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <Card className={previewMode ? "opacity-50" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  value={config.companyName}
                  onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                  placeholder="Ex: Minha Empresa Ltda"
                  disabled={previewMode}
                />
              </div>

              <div>
                <Label htmlFor="systemName">Nome do Sistema</Label>
                <Input
                  id="systemName"
                  value={config.systemName}
                  onChange={(e) => setConfig({ ...config, systemName: e.target.value })}
                  placeholder="Ex: Sistema de Suporte"
                  disabled={previewMode}
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={config.description || ""}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  placeholder="Breve descrição do sistema"
                  disabled={previewMode}
                />
              </div>

              <div>
                <Label htmlFor="logo">Logo da Empresa</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={previewMode}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Fazer Upload
                  </Button>
                  {config.logo && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setConfig({ ...config, logo: null })}
                      disabled={previewMode}
                    >
                      Remover
                    </Button>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                {config.logo && (
                  <div className="mt-2 p-2 border rounded-lg">
                    <img
                      src={config.logo || "/placeholder.svg"}
                      alt="Logo preview"
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={previewMode ? "opacity-50" : ""}>
            <CardHeader>
              <CardTitle>Esquema de Cores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Paletas Predefinidas</Label>
                <div className="grid grid-cols-2 gap-2">
                  {presetColors.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      disabled={previewMode}
                      className="justify-start"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.secondary }} />
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accent }} />
                        </div>
                        <span className="text-xs">{preset.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                      className="w-16"
                      disabled={previewMode}
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                      className="flex-1"
                      disabled={previewMode}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                      className="w-16"
                      disabled={previewMode}
                    />
                    <Input
                      value={config.secondaryColor}
                      onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                      className="flex-1"
                      disabled={previewMode}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accentColor">Cor de Destaque</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                      className="w-16"
                      disabled={previewMode}
                    />
                    <Input
                      value={config.accentColor}
                      onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                      className="flex-1"
                      disabled={previewMode}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                      className="w-16"
                      disabled={previewMode}
                    />
                    <Input
                      value={config.backgroundColor}
                      onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                      className="flex-1"
                      disabled={previewMode}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="textColor">Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={config.textColor}
                      onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                      className="w-16"
                      disabled={previewMode}
                    />
                    <Input
                      value={config.textColor}
                      onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                      className="flex-1"
                      disabled={previewMode}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header Preview */}
                <div className="border rounded-lg p-4" style={{ backgroundColor: config.backgroundColor }}>
                  <div className="flex items-center gap-3 mb-4">
                    {config.logo && (
                      <img src={config.logo || "/placeholder.svg"} alt="Logo" className="h-8 w-8 object-contain" />
                    )}
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: config.primaryColor }}>
                        {config.companyName}
                      </h3>
                      <p className="text-sm" style={{ color: config.secondaryColor }}>
                        {config.systemName}
                      </p>
                    </div>
                  </div>

                  {config.description && (
                    <p className="text-sm mb-4" style={{ color: config.textColor }}>
                      {config.description}
                    </p>
                  )}

                  {/* Buttons Preview */}
                  <div className="space-y-2">
                    <Button
                      style={{
                        backgroundColor: config.primaryColor,
                        color: config.backgroundColor,
                        border: "none",
                      }}
                      className="w-full"
                    >
                      Botão Primário
                    </Button>
                    <Button
                      variant="outline"
                      style={{
                        borderColor: config.secondaryColor,
                        color: config.secondaryColor,
                        backgroundColor: "transparent",
                      }}
                      className="w-full bg-transparent"
                    >
                      Botão Secundário
                    </Button>
                    <Button
                      style={{
                        backgroundColor: config.accentColor,
                        color: config.backgroundColor,
                        border: "none",
                      }}
                      className="w-full"
                    >
                      Botão de Destaque
                    </Button>
                  </div>

                  {/* Cards Preview */}
                  <div className="mt-4 p-3 border rounded" style={{ borderColor: config.secondaryColor + "40" }}>
                    <h4 style={{ color: config.primaryColor }} className="font-medium mb-2">
                      Card de Exemplo
                    </h4>
                    <p style={{ color: config.textColor }} className="text-sm">
                      Este é um exemplo de como os cards aparecerão no sistema.
                    </p>
                  </div>
                </div>

                {/* Color Palette Display */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Paleta de Cores</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: config.primaryColor }} />
                      <span>Primária</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: config.secondaryColor }} />
                      <span>Secundária</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: config.accentColor }} />
                      <span>Destaque</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: config.backgroundColor }} />
                      <span>Fundo</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
