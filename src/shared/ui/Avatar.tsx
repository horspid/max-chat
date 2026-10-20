import styles from './Avatar.module.css'

interface AvatarProps {
  seed: string
  size?: number
}

const palette = [
  'linear-gradient(135deg, #3d8bff, #6a5cf0)',
  'linear-gradient(135deg, #8a4dff, #d14dff)',
  'linear-gradient(135deg, #17b890, #3d8bff)',
  'linear-gradient(135deg, #ff8a3d, #ff4d6d)',
  'linear-gradient(135deg, #f5b73d, #ff8a3d)',
]

function pickBackground(seed: string) {
  let hash = 0
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % palette.length
  }
  return palette[hash]
}

export function Avatar({ seed, size = 48 }: AvatarProps) {
  return (
    <div
      className={styles.avatar}
      style={{ width: size, height: size, background: pickBackground(seed) }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6z" />
      </svg>
    </div>
  )
}
