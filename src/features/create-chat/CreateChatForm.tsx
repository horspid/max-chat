import { useState } from 'react'
import type { FormEvent } from 'react'
import { isValidPhone } from '@/shared/lib/phone'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import styles from './CreateChatForm.module.css'

interface CreateChatFormProps {
  onCreate: (phone: string) => void
}

export function CreateChatForm({ onCreate }: CreateChatFormProps) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!isValidPhone(phone)) {
      setError('Введите номер в международном формате, например 79001234567')
      return
    }

    onCreate(phone)
    setPhone('')
    setError('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="tel"
        inputMode="tel"
        placeholder="Номер телефона"
        value={phone}
        error={error}
        onChange={(event) => {
          setPhone(event.target.value)
          setError('')
        }}
      />
      <Button type="submit" fullWidth>
        Создать чат
      </Button>
    </form>
  )
}
