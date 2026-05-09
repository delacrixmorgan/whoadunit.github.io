import { useEffect, useRef, useState } from 'react'

/**
 * Right-side scroll-spy navigator.
 * @param sections {{id: string, tone: 'rose'|'leaf'|'violet'|'gold', label: string}[]}
 */
export default function SideDots({ sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id)
  const ratiosRef = useRef({})

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean)
    if (elements.length === 0) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratiosRef.current[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0
        })
        const top = Object.entries(ratiosRef.current).sort((a, b) => b[1] - a[1])[0]
        if (top && top[1] > 0) setActiveId(top[0])
      },
      { threshold: [0.15, 0.4, 0.7] },
    )
    elements.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [sections])

  const handleClick = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="side-dots" aria-label="Section navigation">
      {sections.map((s) => (
        <button
          key={s.id}
          type="button"
          aria-label={s.label}
          aria-current={activeId === s.id ? 'true' : 'false'}
          className={`sdot ${activeId === s.id ? `is-active tone-${s.tone}` : ''}`}
          onClick={() => handleClick(s.id)}
        />
      ))}
    </nav>
  )
}
