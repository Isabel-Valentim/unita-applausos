export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "pending" | "resolved"
  priority: "low" | "medium" | "high" | "urgent"
  createdAt: Date
  updatedAt: Date
  userQuery: string
  assignee?: string
  response?: string
  responseDate?: Date
  slaDeadline: Date
  checklist: ChecklistItem[]
  category: "RH" | "Financeiro" | "TI" | "Operacional" | "Comercial" | "Jurídico" | "Geral"
}

// In-memory storage for demo purposes
const tickets: Ticket[] = []
let ticketCounter = 1

export function calculateSLA(priority: Ticket["priority"], createdAt: Date): Date {
  const slaHours = {
    urgent: 2, // Crítico: 2h
    high: 4, // Intermediário: 4h
    medium: 24, // Não crítico: 24h
    low: 24, // Não crítico: 24h
  }

  const deadline = new Date(createdAt)
  deadline.setHours(deadline.getHours() + slaHours[priority])
  return deadline
}

export function isTicketOverdue(ticket: Ticket): boolean {
  return new Date() > ticket.slaDeadline && ticket.status !== "resolved"
}

export function getTimeRemaining(deadline: Date): string {
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()

  if (diff <= 0) {
    return "Vencido"
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function determineCategory(query: string): Ticket["category"] {
  const lowerQuery = query.toLowerCase()

  // RH keywords
  const rhKeywords = [
    "férias",
    "salário",
    "folha",
    "pagamento",
    "contrato",
    "demissão",
    "admissão",
    "benefícios",
    "plano de saúde",
    "vale",
    "rh",
    "recursos humanos",
    "funcionário",
    "colaborador",
    "ponto",
    "horas extras",
  ]

  // Financeiro keywords
  const financeiroKeywords = [
    "financeiro",
    "pagamento",
    "cobrança",
    "fatura",
    "nota fiscal",
    "boleto",
    "pix",
    "transferência",
    "conta",
    "banco",
    "cartão",
    "dinheiro",
    "valor",
    "preço",
    "custo",
    "orçamento",
    "despesa",
    "receita",
  ]

  // TI keywords
  const tiKeywords = [
    "sistema",
    "computador",
    "internet",
    "email",
    "senha",
    "login",
    "software",
    "aplicativo",
    "site",
    "erro",
    "bug",
    "tecnologia",
    "ti",
    "rede",
    "servidor",
    "backup",
    "vírus",
    "antivírus",
    "impressora",
  ]

  // Operacional keywords
  const operacionalKeywords = [
    "procedimento",
    "operação",
    "produção",
    "qualidade",
    "entrega",
    "logística",
    "estoque",
    "fornecedor",
    "cliente",
    "atendimento",
    "suporte",
    "manutenção",
    "equipamento",
  ]

  // Comercial keywords
  const comercialKeywords = [
    "venda",
    "vendas",
    "cliente",
    "proposta",
    "contrato comercial",
    "negociação",
    "desconto",
    "promoção",
    "marketing",
    "campanha",
    "lead",
    "prospect",
    "comercial",
    "representante",
  ]

  // Jurídico keywords
  const juridicoKeywords = [
    "jurídico",
    "legal",
    "contrato",
    "processo",
    "advogado",
    "lei",
    "regulamento",
    "compliance",
    "auditoria",
    "documentação legal",
    "termo",
    "acordo",
  ]

  if (rhKeywords.some((keyword) => lowerQuery.includes(keyword))) {
    return "RH"
  }
  if (financeiroKeywords.some((keyword) => lowerQuery.includes(keyword))) {
    return "Financeiro"
  }
  if (tiKeywords.some((keyword) => lowerQuery.includes(keyword))) {
    return "TI"
  }
  if (operacionalKeywords.some((keyword) => lowerQuery.includes(keyword))) {
    return "Operacional"
  }
  if (comercialKeywords.some((keyword) => lowerQuery.includes(keyword))) {
    return "Comercial"
  }
  if (juridicoKeywords.some((keyword) => lowerQuery.includes(keyword))) {
    return "Jurídico"
  }

  return "Geral"
}

export function createTicket(
  title: string,
  description: string,
  userQuery: string,
  priority: "low" | "medium" | "high" | "urgent" = "medium",
): Ticket {
  const determinePriority = (query: string): "low" | "medium" | "high" | "urgent" => {
    const lowerQuery = query.toLowerCase()
    let urgencyScore = 0

    // Critical/Urgent indicators (score +4)
    const criticalKeywords = [
      "urgente",
      "crítico",
      "emergência",
      "parado",
      "não funciona",
      "sistema fora",
      "não consigo acessar",
      "bloqueado",
      "travado",
      "erro grave",
      "falha crítica",
      "servidor down",
      "site fora do ar",
      "não carrega",
      "perdeu dados",
      "vírus",
      "hackeado",
      "vazamento",
      "segurança comprometida",
      "prazo vencendo hoje",
      "cliente reclamando",
      "processo parado",
      "produção parada",
    ]

    // High priority indicators (score +3)
    const highKeywords = [
      "importante",
      "preciso urgente",
      "rápido",
      "problema",
      "erro",
      "falha",
      "não está funcionando",
      "lento",
      "demora",
      "trava",
      "bug",
      "defeito",
      "cliente esperando",
      "prazo apertado",
      "reunião hoje",
      "apresentação",
      "relatório urgente",
      "pagamento atrasado",
      "cobrança",
      "multa",
    ]

    // Medium priority indicators (score +2)
    const mediumKeywords = [
      "preciso",
      "necessário",
      "quando possível",
      "melhorar",
      "otimizar",
      "configurar",
      "instalar",
      "atualizar",
      "verificar",
      "revisar",
      "solicitar",
      "pedido",
      "requisição",
    ]

    // Low priority indicators (score +1)
    const lowKeywords = [
      "dúvida",
      "como fazer",
      "tutorial",
      "ajuda",
      "orientação",
      "informação",
      "esclarecimento",
      "sugestão",
      "melhoria",
      "quando der",
      "sem pressa",
      "curiosidade",
      "aprender",
      "entender",
    ]

    // Time-sensitive phrases (score +3)
    const timeKeywords = [
      "agora",
      "hoje",
      "imediatamente",
      "o quanto antes",
      "com urgência",
      "não pode esperar",
      "prazo",
      "deadline",
      "vencimento",
      "até às",
      "antes de",
      "reunião em",
      "apresentação em",
    ]

    // Impact indicators (score +2)
    const impactKeywords = [
      "todos os usuários",
      "sistema inteiro",
      "empresa toda",
      "clientes afetados",
      "vendas paradas",
      "produção afetada",
      "muitas pessoas",
      "equipe inteira",
      "departamento",
      "filial",
      "matriz",
    ]

    // Negative impact phrases (score +4)
    const negativeImpactKeywords = [
      "perdendo dinheiro",
      "prejuízo",
      "cliente insatisfeito",
      "reclamação",
      "processo judicial",
      "auditoria",
      "fiscalização",
      "multa",
      "penalidade",
      "contrato em risco",
      "perda de cliente",
    ]

    // Check for keywords and add scores
    criticalKeywords.forEach((keyword) => {
      if (lowerQuery.includes(keyword)) urgencyScore += 4
    })

    highKeywords.forEach((keyword) => {
      if (lowerQuery.includes(keyword)) urgencyScore += 3
    })

    mediumKeywords.forEach((keyword) => {
      if (lowerQuery.includes(keyword)) urgencyScore += 2
    })

    lowKeywords.forEach((keyword) => {
      if (lowerQuery.includes(keyword)) urgencyScore += 1
    })

    timeKeywords.forEach((keyword) => {
      if (lowerQuery.includes(keyword)) urgencyScore += 3
    })

    impactKeywords.forEach((keyword) => {
      if (lowerQuery.includes(keyword)) urgencyScore += 2
    })

    negativeImpactKeywords.forEach((keyword) => {
      if (lowerQuery.includes(keyword)) urgencyScore += 4
    })

    // Additional context analysis
    // Multiple exclamation marks indicate urgency
    const exclamationCount = (lowerQuery.match(/!/g) || []).length
    if (exclamationCount >= 2) urgencyScore += 2
    if (exclamationCount >= 4) urgencyScore += 2

    // ALL CAPS words indicate urgency
    const capsWords = query.match(/\b[A-Z]{3,}\b/g) || []
    if (capsWords.length > 0) urgencyScore += 1
    if (capsWords.length >= 3) urgencyScore += 2

    // Question length analysis (very long descriptions often indicate complex/urgent issues)
    if (lowerQuery.length > 200) urgencyScore += 1
    if (lowerQuery.length > 500) urgencyScore += 2

    // Time references
    if (lowerQuery.includes("ontem") || lowerQuery.includes("desde ontem")) urgencyScore += 2
    if (lowerQuery.includes("há dias") || lowerQuery.includes("há semanas")) urgencyScore += 3
    if (lowerQuery.includes("há horas")) urgencyScore += 2

    // Determine final priority based on score
    if (urgencyScore >= 8) return "urgent"
    if (urgencyScore >= 5) return "high"
    if (urgencyScore >= 3) return "medium"
    return "low"
  }

  const aiDeterminedPriority = determinePriority(userQuery)
  const finalPriority = priority === "medium" ? aiDeterminedPriority : priority
  const aiDeterminedCategory = determineCategory(userQuery)
  const createdAt = new Date()

  const ticket: Ticket = {
    id: ticketCounter.toString(),
    title,
    description,
    status: "open",
    priority: finalPriority,
    createdAt,
    updatedAt: createdAt,
    userQuery,
    checklist: [],
    slaDeadline: calculateSLA(finalPriority, createdAt),
    category: aiDeterminedCategory,
  }

  tickets.push(ticket)
  ticketCounter++

  return ticket
}

export function getAllTickets(): Ticket[] {
  return [...tickets].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getTicketById(id: string): Ticket | undefined {
  return tickets.find((ticket) => ticket.id === id)
}

export function updateTicketStatus(id: string, status: Ticket["status"]): Ticket | null {
  const ticket = tickets.find((t) => t.id === id)
  if (ticket) {
    ticket.status = status
    ticket.updatedAt = new Date()
    return ticket
  }
  return null
}

export function getTicketsByStatus(status: Ticket["status"]): Ticket[] {
  return tickets.filter((ticket) => ticket.status === status)
}

export function updateTicketPriority(id: string, priority: Ticket["priority"]): Ticket | null {
  const ticket = tickets.find((t) => t.id === id)
  if (ticket) {
    ticket.priority = priority
    ticket.updatedAt = new Date()
    ticket.slaDeadline = calculateSLA(priority, ticket.createdAt)
    return ticket
  }
  return null
}

export function assignTicket(id: string, assignee: string): Ticket | null {
  const ticket = tickets.find((t) => t.id === id)
  if (ticket) {
    ticket.assignee = assignee
    ticket.updatedAt = new Date()
    return ticket
  }
  return null
}

export function addTicketResponse(id: string, response: string): Ticket | null {
  const ticket = tickets.find((t) => t.id === id)
  if (ticket) {
    ticket.response = response
    ticket.updatedAt = new Date()
    ticket.responseDate = new Date()
    return ticket
  }
  return null
}

export function addChecklistItem(ticketId: string, text: string): Ticket | null {
  const ticket = tickets.find((t) => t.id === ticketId)
  if (ticket) {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    }
    ticket.checklist.push(newItem)
    ticket.updatedAt = new Date()
    return ticket
  }
  return null
}

export function toggleChecklistItem(ticketId: string, itemId: string): Ticket | null {
  const ticket = tickets.find((t) => t.id === ticketId)
  if (ticket) {
    const item = ticket.checklist.find((i) => i.id === itemId)
    if (item) {
      item.completed = !item.completed
      ticket.updatedAt = new Date()
      return ticket
    }
  }
  return null
}

export function removeChecklistItem(ticketId: string, itemId: string): Ticket | null {
  const ticket = tickets.find((t) => t.id === ticketId)
  if (ticket) {
    ticket.checklist = ticket.checklist.filter((i) => i.id !== itemId)
    ticket.updatedAt = new Date()
    return ticket
  }
  return null
}

export function updateChecklistItem(ticketId: string, itemId: string, text: string): Ticket | null {
  const ticket = tickets.find((t) => t.id === ticketId)
  if (ticket) {
    const item = ticket.checklist.find((i) => i.id === itemId)
    if (item) {
      item.text = text
      ticket.updatedAt = new Date()
      return ticket
    }
  }
  return null
}

export function updateTicketCategory(id: string, category: Ticket["category"]): Ticket | null {
  const ticket = tickets.find((t) => t.id === id)
  if (ticket) {
    ticket.category = category
    ticket.updatedAt = new Date()
    return ticket
  }
  return null
}
