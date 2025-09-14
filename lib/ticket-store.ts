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
  status: "aberto" | "em_andamento" | "resolvido" | "fechado"
  priority: "baixa" | "media" | "alta" | "urgente"
  category: string
  createdAt: Date
  updatedAt: Date
  userId: string
  userName: string
  responses: TicketResponse[]
  assignee?: string
  userQuery?: string
  slaDeadline?: Date
  checklist?: ChecklistItem[]
}

export interface TicketResponse {
  id: string
  ticketId: string
  message: string
  author: string
  authorType: "solicitante" | "atendente"
  createdAt: Date
}

class TicketStore {
  private tickets: Ticket[] = []
  private responses: TicketResponse[] = []

  private calculateSLA(priority: Ticket["priority"], createdAt: Date): Date {
    const slaHours = {
      urgente: 2,
      alta: 4,
      media: 24,
      baixa: 24,
    }

    const deadline = new Date(createdAt)
    deadline.setHours(deadline.getHours() + slaHours[priority])
    return deadline
  }

  // Métodos para tickets
  createTicket(
    ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "responses" | "slaDeadline" | "checklist">,
  ): Ticket {
    const ticket: Ticket = {
      ...ticketData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: [],
      slaDeadline: this.calculateSLA(ticketData.priority, new Date()),
      checklist: [],
    }

    this.tickets.push(ticket)
    console.log("[v0] Created ticket in store:", ticket.id)
    return ticket
  }

  getTickets(): Ticket[] {
    return this.tickets.map((ticket) => ({
      ...ticket,
      responses: this.responses.filter((r) => r.ticketId === ticket.id),
    }))
  }

  getTicketsByUser(userId: string): Ticket[] {
    return this.tickets
      .filter((ticket) => ticket.userId === userId)
      .map((ticket) => ({
        ...ticket,
        responses: this.responses.filter((r) => r.ticketId === ticket.id),
      }))
  }

  getTicketById(id: string): Ticket | null {
    const ticket = this.tickets.find((t) => t.id === id)
    if (!ticket) return null

    return {
      ...ticket,
      responses: this.responses.filter((r) => r.ticketId === id),
    }
  }

  updateTicketStatus(id: string, status: Ticket["status"]): boolean {
    const ticket = this.tickets.find((t) => t.id === id)
    if (!ticket) return false

    ticket.status = status
    ticket.updatedAt = new Date()
    console.log("[v0] Updated ticket status in store:", id, status)
    return true
  }

  updateTicketPriority(id: string, priority: Ticket["priority"]): boolean {
    const ticket = this.tickets.find((t) => t.id === id)
    if (!ticket) return false

    ticket.priority = priority
    ticket.updatedAt = new Date()
    ticket.slaDeadline = this.calculateSLA(priority, ticket.createdAt)
    console.log("[v0] Updated ticket priority in store:", id, priority)
    return true
  }

  updateTicketCategory(id: string, category: string): boolean {
    const ticket = this.tickets.find((t) => t.id === id)
    if (!ticket) return false

    ticket.category = category
    ticket.updatedAt = new Date()
    console.log("[v0] Updated ticket category in store:", id, category)
    return true
  }

  assignTicket(id: string, assignee: string): boolean {
    const ticket = this.tickets.find((t) => t.id === id)
    if (!ticket) return false

    ticket.assignee = assignee
    ticket.updatedAt = new Date()
    console.log("[v0] Assigned ticket in store:", id, assignee)
    return true
  }

  addChecklistItem(ticketId: string, text: string): boolean {
    const ticket = this.tickets.find((t) => t.id === ticketId)
    if (!ticket) return false

    if (!ticket.checklist) ticket.checklist = []

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    }

    ticket.checklist.push(newItem)
    ticket.updatedAt = new Date()
    console.log("[v0] Added checklist item to store ticket:", ticketId, text)
    return true
  }

  toggleChecklistItem(ticketId: string, itemId: string): boolean {
    const ticket = this.tickets.find((t) => t.id === ticketId)
    if (!ticket || !ticket.checklist) return false

    const item = ticket.checklist.find((i) => i.id === itemId)
    if (!item) return false

    item.completed = !item.completed
    ticket.updatedAt = new Date()
    console.log("[v0] Toggled checklist item in store:", ticketId, itemId, item.completed)
    return true
  }

  removeChecklistItem(ticketId: string, itemId: string): boolean {
    const ticket = this.tickets.find((t) => t.id === ticketId)
    if (!ticket || !ticket.checklist) return false

    ticket.checklist = ticket.checklist.filter((i) => i.id !== itemId)
    ticket.updatedAt = new Date()
    console.log("[v0] Removed checklist item from store:", ticketId, itemId)
    return true
  }

  updateChecklistItem(ticketId: string, itemId: string, text: string): boolean {
    const ticket = this.tickets.find((t) => t.id === ticketId)
    if (!ticket || !ticket.checklist) return false

    const item = ticket.checklist.find((i) => i.id === itemId)
    if (!item) return false

    item.text = text
    ticket.updatedAt = new Date()
    console.log("[v0] Updated checklist item in store:", ticketId, itemId, text)
    return true
  }

  // Métodos para respostas
  addResponse(responseData: Omit<TicketResponse, "id" | "createdAt">): TicketResponse {
    const response: TicketResponse = {
      ...responseData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    }

    this.responses.push(response)
    console.log("[v0] Added response to store:", response.ticketId, response.message)

    // Atualizar status do ticket se for resposta do atendente
    if (response.authorType === "atendente") {
      this.updateTicketStatus(response.ticketId, "em_andamento")
    }

    return response
  }

  getResponsesByTicket(ticketId: string): TicketResponse[] {
    return this.responses.filter((r) => r.ticketId === ticketId)
  }
}

// Singleton para manter estado em memória
export const ticketStore = new TicketStore()
