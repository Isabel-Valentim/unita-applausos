"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Send,
  Bot,
  User,
  AlertCircle,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ticketStore } from "@/lib/ticket-store"
import { addMessageFeedback } from "@/lib/analytics"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  isTicketCreated?: boolean
  ticketId?: string
  searchResults?: any[]
  feedback?: "helpful" | "unhelpful" | null
}

const CHAT_STORAGE_KEY = "support-chat-messages"
const CHAT_SETTINGS_KEY = "support-chat-settings"

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY)
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages)
          // Convert timestamp strings back to Date objects
          return parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        } catch (error) {
          console.error("Error parsing saved messages:", error)
        }
      }
    }
    return [
      {
        id: "1",
        type: "bot",
        content: "Olá! Sou seu agente de suporte virtual inteligente. Como posso ajudá-lo hoje?",
        timestamp: new Date(),
      },
    ]
  })

  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isRecording, setIsRecording] = useState(false)

  const [isAudioEnabled, setIsAudioEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem(CHAT_SETTINGS_KEY)
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          return parsed.isAudioEnabled || false
        } catch (error) {
          console.error("Error parsing saved settings:", error)
        }
      }
    }
    return false
  })

  const [recognition, setRecognition] = useState<any>(null)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [pendingAudioMessage, setPendingAudioMessage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const settings = { isAudioEnabled }
      localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(settings))
    }
  }, [isAudioEnabled])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = "pt-BR"

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
          setIsRecording(false)
        }

        recognitionInstance.onerror = () => {
          setIsRecording(false)
        }

        recognitionInstance.onend = () => {
          setIsRecording(false)
        }

        setRecognition(recognitionInstance)
      }

      if (window.speechSynthesis) {
        setSpeechSynthesis(window.speechSynthesis)
      }
    }
  }, [])

  useEffect(() => {
    if (pendingAudioMessage) {
      speakMessage(pendingAudioMessage)
      setPendingAudioMessage(null)
    }
  }, [messages, pendingAudioMessage])

  const toggleRecording = () => {
    if (!recognition) {
      alert("Reconhecimento de voz não é suportado neste navegador.")
      return
    }

    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
    } else {
      recognition.start()
      setIsRecording(true)
    }
  }

  const speakMessage = (text: string) => {
    if (!speechSynthesis || !isAudioEnabled) return

    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "pt-BR"
    utterance.rate = 0.9
    utterance.pitch = 1

    speechSynthesis.speak(utterance)
  }

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue
    if (!messageText.trim()) return

    const audioKeywords = [
      "responde em áudio",
      "responder em áudio",
      "resposta em áudio",
      "leia para mim",
      "ler em voz alta",
      "falar",
      "fale",
    ]

    let cleanMessage = messageText
    let shouldEnableAudio = false

    // Verificar se contém instrução de áudio e removê-la
    audioKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      if (regex.test(cleanMessage)) {
        shouldEnableAudio = true
        cleanMessage = cleanMessage.replace(regex, "").trim()
        // Limpar espaços extras e vírgulas
        cleanMessage = cleanMessage.replace(/\s+/g, " ").replace(/^[,\s]+|[,\s]+$/g, "")
      }
    })

    if (shouldEnableAudio && !isAudioEnabled) {
      setIsAudioEnabled(true)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText, // Mostrar a pergunta original no chat
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    setShowSuggestions(false)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: cleanMessage }),
      })

      const data = await response.json()
      const aiResponse = data.response || "SEM_RESPOSTA_DISPONIVEL"
      handleAIResponse(aiResponse, cleanMessage, shouldEnableAudio) // Usar pergunta limpa para o chamado também
    } catch (error) {
      console.error("Erro ao processar mensagem:", error)
      handleAIResponse("SEM_RESPOSTA_DISPONIVEL", cleanMessage, shouldEnableAudio)
    }

    setIsTyping(false)
  }

  const handleAIResponse = (aiResponse: string, currentQuery?: string, shouldPlayAudio = false) => {
    if (aiResponse.includes("SEM_RESPOSTA_DISPONIVEL")) {
      const query = currentQuery || "Pergunta não especificada"

      const ticket = ticketStore.createTicket({
        title: `Dúvida: ${query.substring(0, 50)}${query.length > 50 ? "..." : ""}`,
        description: `O usuário perguntou: "${query}"\n\nEsta pergunta não foi respondida pela IA e precisa de atenção manual.`,
        status: "aberto",
        priority: "media",
        category: "Geral",
        userId: "solicitante-1",
        userName: "Usuário do Chat",
      })

      console.log("[v0] Ticket created in chat:", ticket.id)

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `Desculpe, não encontrei uma resposta específica para sua pergunta na nossa base de conhecimento.\n\nCriei automaticamente um chamado para que nossa equipe de suporte possa ajudá-lo pessoalmente.\n\n**Chamado #${ticket.id}** foi registrado com sucesso!\n\nNossa equipe entrará em contato em breve. Você pode acompanhar o status do seu chamado na seção "Meus Chamados".`,
        timestamp: new Date(),
        isTicketCreated: true,
        ticketId: ticket.id,
      }
      setMessages((prev) => [...prev, botResponse])
      if (shouldPlayAudio || isAudioEnabled) {
        setPendingAudioMessage(botResponse.content)
      }
    } else {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      if (shouldPlayAudio || isAudioEnabled) {
        setPendingAudioMessage(aiResponse)
      }
    }
  }

  const formatMessageContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <div key={index} className="font-semibold text-accent mb-2">
            {line.slice(2, -2)}
          </div>
        )
      }
      if (line.startsWith("---")) {
        return <hr key={index} className="my-3 border-border" />
      }
      if (line.startsWith("*") && line.endsWith("*")) {
        return (
          <div key={index} className="text-sm text-muted-foreground italic">
            {line.slice(1, -1)}
          </div>
        )
      }
      return (
        <div key={index} className={line.trim() === "" ? "mb-2" : ""}>
          {line}
        </div>
      )
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFeedback = (messageId: string, isHelpful: boolean) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return { ...msg, feedback: isHelpful ? "helpful" : "unhelpful" }
        }
        return msg
      }),
    )

    try {
      addMessageFeedback(messageId, isHelpful)
    } catch (error) {
      console.error("Error saving feedback:", error)
    }
  }

  const clearChatHistory = () => {
    const initialMessage: Message = {
      id: "1",
      type: "bot",
      content: "Olá! Sou seu agente de suporte virtual inteligente. Como posso ajudá-lo hoje?",
      timestamp: new Date(),
    }
    setMessages([initialMessage])
    setShowSuggestions(true)
    if (typeof window !== "undefined") {
      localStorage.removeItem(CHAT_STORAGE_KEY)
    }
  }

  const handleTicketClick = (ticketId: string) => {
    router.push(`/solicitante/chamados/${ticketId}`)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-4rem)] md:h-[600px]">
      <Card className="flex-1 flex flex-col border-0 md:border rounded-none md:rounded-lg">
        <CardHeader className="pb-3 px-3 md:px-6">
          <CardTitle className="flex items-center justify-between text-base md:text-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              Chat de Suporte
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChatHistory}
                className="h-8 px-2 text-xs"
                title="Limpar histórico do chat"
              >
                Limpar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className="h-8 w-8 p-0"
                title={isAudioEnabled ? "Desativar áudio" : "Ativar áudio"}
              >
                {isAudioEnabled ? (
                  <Volume2 className="h-4 w-4 text-accent" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto px-3 md:px-4 space-y-3 md:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 md:gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "bot" && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-accent flex items-center justify-center">
                      <Bot className="h-3 w-3 md:h-4 md:w-4 text-accent-foreground" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-lg p-2 md:p-3 text-sm ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <div>{formatMessageContent(message.content)}</div>

                  {message.searchResults && message.searchResults.length > 1 && (
                    <div className="mt-2 md:mt-3 space-y-1 md:space-y-2">
                      <div className="text-xs font-medium">Outros artigos relacionados:</div>
                      {message.searchResults.slice(1, 3).map((result, index) => (
                        <div key={index} className="text-xs p-2 bg-background rounded border">
                          <div className="font-medium">{result.article.title}</div>
                          <div className="text-muted-foreground">{result.article.category}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {message.isTicketCreated && (
                    <Alert
                      className="mt-2 md:mt-3 cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleTicketClick(message.ticketId!)}
                    >
                      <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                      <AlertDescription className="text-xs">
                        <div className="mr-2 text-xs font-medium">Chamado #{message.ticketId}</div>
                        Registrado com sucesso •{" "}
                        <span className="text-primary underline">Clique para ver detalhes</span>
                      </AlertDescription>
                    </Alert>
                  )}

                  {message.type === "bot" && message.id !== "1" && (
                    <div className="flex items-center gap-2 mt-2 md:mt-3 pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">Esta resposta foi útil?</span>
                      <div className="flex gap-1">
                        <Button
                          variant={message.feedback === "helpful" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleFeedback(message.id, true)}
                          className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-700"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant={message.feedback === "unhelpful" ? "destructive" : "ghost"}
                          size="sm"
                          onClick={() => handleFeedback(message.id, false)}
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-700"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                      {message.feedback && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {message.feedback === "helpful" ? "Marcado como útil!" : "Marcado como não útil!"}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="text-xs opacity-70 mt-1 md:mt-2">
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {message.type === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 md:gap-3 justify-start">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-accent flex items-center justify-center">
                    <Bot className="h-3 w-3 md:h-4 md:w-4 text-accent-foreground" />
                  </div>
                </div>
                <div className="bg-muted text-muted-foreground rounded-lg p-2 md:p-3">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-current rounded-full animate-bounce" />
                    <div
                      className="w-1.5 h-1.5 md:w-2 md:h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-1.5 h-1.5 md:w-2 md:h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {showSuggestions && (
            <div className="px-3 md:px-4 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                <span className="text-xs md:text-sm font-medium">Sugestões:</span>
              </div>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {[
                  "Como fazer login?",
                  "Como alterar meus dados?",
                  "Como gerar relatórios?",
                  "Esqueci minha senha",
                  "Como exportar dados?",
                ].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(suggestion)}
                    className="text-xs h-7 md:h-8 px-2 md:px-3"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="border-t p-3 md:p-4 bg-background">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua pergunta..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-sm"
              />
              <Button
                onClick={toggleRecording}
                disabled={isTyping}
                size="sm"
                variant={isRecording ? "destructive" : "outline"}
                className="px-3"
                title={isRecording ? "Parar gravação" : "Gravar áudio"}
              >
                {isRecording ? <MicOff className="h-3 w-3 md:h-4 md:w-4" /> : <Mic className="h-3 w-3 md:h-4 md:w-4" />}
              </Button>
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="px-3"
              >
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1 md:mt-2">
              Pressione Enter para enviar {recognition && "• Clique no microfone para falar"}
              {isRecording && " • Falando..."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
