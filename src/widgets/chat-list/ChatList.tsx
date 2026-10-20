import type { Chat } from '@/entities/chat'
import { CreateChatForm } from '@/features/create-chat'
import { formatPhone } from '@/shared/lib/phone'
import { formatTime } from '@/shared/lib/time'
import { Avatar } from '@/shared/ui/Avatar'
import styles from './ChatList.module.css'

interface ChatListProps {
  chats: Chat[]
  activeChatId: string | null
  onSelect: (chatId: string) => void
  onCreate: (phone: string) => void
  onLogout: () => void
}

export function ChatList({ chats, activeChatId, onSelect, onCreate, onLogout }: ChatListProps) {
  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h1 className={styles.title}>Чаты</h1>
        <button className={styles.logout} type="button" onClick={onLogout}>
          Выйти
        </button>
      </header>

      <div className={styles.create}>
        <CreateChatForm onCreate={onCreate} />
      </div>

      <ul className={styles.list}>
        {chats.length === 0 && <li className={styles.empty}>Чатов пока нет</li>}
        {chats.map((chat) => {
          const lastMessage = chat.messages.at(-1)
          const itemClasses = [styles.item, chat.id === activeChatId && styles.active]
            .filter(Boolean)
            .join(' ')

          return (
            <li key={chat.id}>
              <button className={itemClasses} type="button" onClick={() => onSelect(chat.id)}>
                <Avatar seed={chat.phone} />
                <span className={styles.info}>
                  <span className={styles.name}>{formatPhone(chat.phone)}</span>
                  <span className={styles.preview}>
                    {lastMessage ? lastMessage.text : 'Нет сообщений'}
                  </span>
                </span>
                {lastMessage && (
                  <span className={styles.time}>{formatTime(lastMessage.createdAt)}</span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
