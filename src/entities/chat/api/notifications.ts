import { greenApiRequest } from '@/shared/api/greenApi'
import type { ApiCredentials } from '@/shared/api/greenApi'

export interface Notification {
  receiptId: number
  body: {
    typeWebhook: string
    idMessage?: string
    timestamp?: number
    senderData?: {
      chatId?: string
      sender?: string
      senderPhoneNumber?: number | string
    }
    messageData?: {
      typeMessage?: string
      textMessageData?: { textMessage?: string }
      extendedTextMessageData?: { text?: string }
    }
  }
}

export function receiveNotification(credentials: ApiCredentials, signal: AbortSignal) {
  return greenApiRequest<Notification | null>(credentials, {
    httpMethod: 'GET',
    method: 'receiveNotification',
    query: { receiveTimeout: 5 },
    signal,
  })
}

export function deleteNotification(credentials: ApiCredentials, receiptId: number) {
  return greenApiRequest<{ result: boolean }>(credentials, {
    httpMethod: 'DELETE',
    method: 'deleteNotification',
    params: [receiptId],
  })
}
