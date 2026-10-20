import { useEffect, useRef } from 'react'
import type { Chat } from '@/entities/chat'
import { MessageForm } from '@/features/send-message'
import { formatPhone } from '@/shared/lib/phone'
import { formatTime } from '@/shared/lib/time'
import { Avatar } from '@/shared/ui/Avatar'
import styles from './ChatWindow.module.css'

interface ChatWindowProps {
  chat: Chat | null
  onSend: (chatId: string, text: string) => void
  onBack: () => void
}

export function ChatWindow({ chat, onSend, onBack }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null)
  const messagesCount = chat?.messages.length ?? 0

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesCount, chat?.id])

  if (!chat) {
    return (
      <section className={`${styles.window} ${styles.placeholder}`}>
        <p>Выберите чат или создайте новый</p>
      </section>
    )
  }

  return (
    <section className={styles.window}>
      <header className={styles.header}>
        <button className={styles.back} type="button" onClick={onBack} aria-label="Назад">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <Avatar seed={chat.phone} size={40} />
        <span className={styles.name}>{formatPhone(chat.phone)}</span>
      </header>

      <div className={styles.messages}>
        {chat.messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${message.outgoing ? styles.outgoing : styles.incoming}`}
          >
            <span className={styles.text}>{message.text}</span>
            <span className={styles.time}>{formatTime(message.createdAt)}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <MessageForm onSend={(text) => onSend(chat.id, text)} />
    </section>
  )
}
