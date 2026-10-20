export type MessageStatus = 'sending' | 'sent' | 'error'

export interface Message {
  id: string
  text: string
  createdAt: number
  outgoing: boolean
  status: MessageStatus
}

export interface Chat {
  id: string
  phone: string
  messages: Message[]
}
