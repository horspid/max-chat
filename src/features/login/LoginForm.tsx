import { useState } from 'react'
import type { FormEvent } from 'react'
import { useSession } from '@/entities/session'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import styles from './LoginForm.module.css'

export function LoginForm() {
  const { login } = useSession()
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')

  const isFilled = idInstance.trim() !== '' && apiTokenInstance.trim() !== ''

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!isFilled) return

    login({ idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        label="idInstance"
        placeholder="1101000000"
        autoComplete="off"
        value={idInstance}
        onChange={(event) => setIdInstance(event.target.value)}
      />
      <Input
        label="apiTokenInstance"
        type="password"
        placeholder="Введите токен"
        autoComplete="off"
        value={apiTokenInstance}
        onChange={(event) => setApiTokenInstance(event.target.value)}
      />
      <Button type="submit" fullWidth disabled={!isFilled}>
        Войти
      </Button>
    </form>
  )
}
