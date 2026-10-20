import { Navigate } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { LoginForm } from '@/features/login'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const { credentials } = useSession()

  if (credentials) {
    return <Navigate to="/" replace />
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo} aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="2.6">
            <path d="M9 22V10l7 8 7-8v12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className={styles.title}>Вход в чат</h1>
        <p className={styles.subtitle}>Введите данные вашего аккаунта GREEN-API</p>
        <LoginForm />
      </div>
    </main>
  )
}
