import { greenApiPost } from '@/shared/api/greenApi'
import type { ApiCredentials } from '@/shared/api/greenApi'
import { toChatId } from '@/shared/lib/phone'

interface SendMessageResponse {
  idMessage: string
}

export function sendTextMessage(credentials: ApiCredentials, phone: string, message: string) {
  return greenApiPost<SendMessageResponse>(credentials, 'sendMessage', {
    chatId: toChatId(phone),
    message,
  })
}
