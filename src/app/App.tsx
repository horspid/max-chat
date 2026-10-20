import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SessionProvider } from '@/entities/session'
import { ChatPage } from '@/pages/chat'
import { LoginPage } from '@/pages/login'

export function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  )
}
