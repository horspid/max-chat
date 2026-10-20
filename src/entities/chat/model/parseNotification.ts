import { normalizePhone } from '@/shared/lib/phone'
import type { Notification } from '../api/notifications'

export interface IncomingMessage {
  messageId: string
  chatKeys: string[]
  text: string
  createdAt: number
}

function chatIdToKey(value: string | undefined) {
  return value ? normalizePhone(value.split('@')[0]) : ''
}

export function parseIncomingMessage(notification: Notification): IncomingMessage | null {
  const { body } = notification

  if (body.typeWebhook !== 'incomingMessageReceived' || !body.idMessage) {
    return null
  }

  const text =
    body.messageData?.textMessageData?.textMessage ?? body.messageData?.extendedTextMessageData?.text

  if (!text) {
    return null
  }

  const phoneKey = normalizePhone(String(body.senderData?.senderPhoneNumber ?? ''))

  const chatKeys = phoneKey
    ? [phoneKey]
    : [
        ...new Set([chatIdToKey(body.senderData?.chatId), chatIdToKey(body.senderData?.sender)]),
      ].filter(Boolean)

  if (chatKeys.length === 0) {
    return null
  }

  return {
    messageId: body.idMessage,
    chatKeys,
    text,
    createdAt: body.timestamp ? body.timestamp * 1000 : Date.now(),
  }
}
