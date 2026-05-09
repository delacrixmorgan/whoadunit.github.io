import { useEffect, useRef, useState } from 'react'

export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const delayCls = delay === 1 ? 'reveal-d1' : delay === 2 ? 'reveal-d2' : delay === 3 ? 'reveal-d3' : ''

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} ${delayCls} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  )
}
