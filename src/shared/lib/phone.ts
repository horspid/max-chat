export function normalizePhone(value: string) {
  return value.replace(/\D/g, '')
}

export function isValidPhone(value: string) {
  const digits = normalizePhone(value)
  return digits.length >= 10 && digits.length <= 15
}

export function formatPhone(value: string) {
  const digits = normalizePhone(value)

  if (digits.length === 11) {
    return `+${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
  }

  return `+${digits}`
}
