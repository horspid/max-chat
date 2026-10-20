import { useCallback, useMemo, useState } from 'react'
import { normalizePhone } from '@/shared/lib/phone'
import type { Chat, Message } from './types'

export function useChats() {
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

  const sendMessage = useCallback((chatId: string, text: string) => {
    const message: Message = {
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
      outgoing: true,
    }

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, messages: [...chat.messages, message] } : chat,
      ),
    )
  }, [])

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
