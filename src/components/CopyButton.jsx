import { useEffect, useRef, useState } from 'react'

export default function CopyButton({ value, label = 'Copy', copiedLabel = '✓ Copied', className = '', ...rest }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleClick = async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1800)
    } catch (_) {
      /* clipboard unavailable; silently no-op */
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`copy-btn ${copied ? 'is-copied' : ''} ${className}`.trim()}
      aria-live="polite"
      {...rest}
    >
      {copied ? copiedLabel : label}
    </button>
  )
}
