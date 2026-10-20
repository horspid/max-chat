import { Navigate } from 'react-router-dom'
import { useChats } from '@/entities/chat'
import { useSession } from '@/entities/session'
import { ChatList } from '@/widgets/chat-list'
import { ChatWindow } from '@/widgets/chat-window'
import styles from './ChatPage.module.css'

export function ChatPage() {
  const { credentials, logout } = useSession()
  const { chats, activeChat, selectChat, closeChat, createChat, sendMessage } = useChats(credentials)

  if (!credentials) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className={`${styles.layout} ${activeChat ? styles.chatOpened : ''}`}>
      <div className={styles.list}>
        <ChatList
          chats={chats}
          activeChatId={activeChat?.id ?? null}
          onSelect={selectChat}
          onCreate={createChat}
          onLogout={logout}
        />
      </div>
      <div className={styles.window}>
        <ChatWindow chat={activeChat} onSend={sendMessage} onBack={closeChat} />
      </div>
    </div>
  )
}
