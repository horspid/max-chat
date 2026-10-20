import { useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import styles from './MessageForm.module.css'

interface MessageFormProps {
  onSend: (text: string) => void
}

export function MessageForm({ onSend }: MessageFormProps) {
  const [text, setText] = useState('')

  const submit = () => {
    const trimmed = text.trim()

    if (!trimmed) return

    onSend(trimmed)
    setText('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        rows={1}
        placeholder="Сообщение"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.send} type="submit" disabled={!text.trim()} aria-label="Отправить">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" />
        </svg>
      </button>
    </form>
  )
}
