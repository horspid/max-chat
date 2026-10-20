export interface Message {
  id: string
  text: string
  createdAt: number
  outgoing: boolean
}

export interface Chat {
  id: string
  phone: string
  messages: Message[]
}
