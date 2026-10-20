import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ApiCredentials } from '@/shared/api/greenApi'
import { normalizePhone } from '@/shared/lib/phone'
import { deleteNotification, receiveNotification } from '../api/notifications'
import { sendTextMessage } from '../api/sendTextMessage'
import { parseIncomingMessage } from './parseNotification'
import type { IncomingMessage } from './parseNotification'
import type { Chat, Message, MessageStatus } from './types'

const POLL_RETRY_DELAY = 3000

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      resolve()
    })
  })
}

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

  const receiveMessage = useCallback((incoming: IncomingMessage) => {
    const message: Message = {
      id: incoming.messageId,
      text: incoming.text,
      createdAt: incoming.createdAt,
      outgoing: false,
      status: 'sent',
    }

    setChats((prev) => {
      const target = prev.find((chat) => incoming.chatKeys.includes(chat.id))

      if (!target) {
        const id = incoming.chatKeys[0]
        return [{ id, phone: id, messages: [message] }, ...prev]
      }

      if (target.messages.some((existing) => existing.id === message.id)) {
        return prev
      }

      return prev.map((chat) =>
        chat.id === target.id ? { ...chat, messages: [...chat.messages, message] } : chat,
      )
    })
  }, [])

  useEffect(() => {
    if (!credentials) return

    const controller = new AbortController()
    const { signal } = controller

    const poll = async () => {
      while (!signal.aborted) {
        try {
          const notification = await receiveNotification(credentials, signal)

          if (!notification) continue

          const incoming = parseIncomingMessage(notification)

          if (incoming) {
            receiveMessage(incoming)
          }

          await deleteNotification(credentials, notification.receiptId)
        } catch {
          if (signal.aborted) return
          await wait(POLL_RETRY_DELAY, signal)
        }
      }
    }

    poll()

    return () => controller.abort()
  }, [credentials, receiveMessage])

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
