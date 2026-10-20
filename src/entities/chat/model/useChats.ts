import { useCallback, useMemo, useState } from 'react'
import type { ApiCredentials } from '@/shared/api/greenApi'
import { normalizePhone } from '@/shared/lib/phone'
import { sendTextMessage } from '../api/sendTextMessage'
import type { Chat, Message, MessageStatus } from './types'

export function useChats(credentials: ApiCredentials | null) {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? null,
    [chats, activeChatId],
  )

  const createChat = useCallback((rawPhone: string) => {
    const phone = normalizePhone(rawPhone)

    setChats((prev) =>
      prev.some((chat) => chat.id === phone) ? prev : [{ id: phone, phone, messages: [] }, ...prev],
    )
    setActiveChatId(phone)
  }, [])

  const updateMessageStatus = useCallback(
    (chatId: string, messageId: string, status: MessageStatus) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages.map((message) =>
                  message.id === messageId ? { ...message, status } : message,
                ),
              }
            : chat,
        ),
      )
    },
    [],
  )

  const sendMessage = useCallback(
    async (chatId: string, text: string) => {
      const message: Message = {
        id: crypto.randomUUID(),
        text,
        createdAt: Date.now(),
        outgoing: true,
        status: 'sending',
      }

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, messages: [...chat.messages, message] } : chat,
        ),
      )

      if (!credentials) {
        updateMessageStatus(chatId, message.id, 'error')
        return
      }

      try {
        await sendTextMessage(credentials, chatId, text)
        updateMessageStatus(chatId, message.id, 'sent')
      } catch {
        updateMessageStatus(chatId, message.id, 'error')
      }
    },
    [credentials, updateMessageStatus],
  )

  const closeChat = useCallback(() => setActiveChatId(null), [])

  return {
    chats,
    activeChat,
    selectChat: setActiveChatId,
    closeChat,
    createChat,
    sendMessage,
  }
}
