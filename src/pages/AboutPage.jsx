import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { useRepresentatives } from '../hooks/useRepresentatives'
import { t } from '../i18n'

// ── Fade-in observer ─────────────────────────────────────────────────────────
function useFadeIn(delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return {
    ref,
    style: {
      opacity: 0,
      transform: 'translateY(18px)',
      transition: `opacity 380ms ease-out ${delay}ms, transform 380ms ease-out ${delay}ms`,
    },
  }
}

// ── External link icon ────────────────────────────────────────────────────────
function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
    </svg>
  )
}

function ArrowRightIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 240ms ease-out' }}
      aria-hidden="true">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

// ── Accordion item ────────────────────────────────────────────────────────────
function AccordionItem({ num, heading, body, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const fade = useFadeIn(0)
  return (
    <div {...fade} style={{
      borderBottom: '1px solid var(--md-sys-color-outline-variant)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '16px', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
        aria-expanded={open}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{
            fontFamily: 'Libre Baskerville, Georgia, serif',
            fontWeight: 700, fontSize: '0.72rem',
            color: 'var(--md-sys-color-primary)',
            letterSpacing: '0.04em', flexShrink: 0,
            minWidth: '36px',
          }}>{num}</span>
          <span style={{
            fontFamily: 'Libre Baskerville, Georgia, serif',
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            fontWeight: 700, lineHeight: 1.25,
            color: 'var(--md-sys-color-on-surface)',
            letterSpacing: '-0.01em',
          }}>{heading}</span>
        </div>
        <span style={{ color: 'var(--md-sys-color-on-surface-variant)', flexShrink: 0 }}>
          <ChevronIcon open={open} />
        </span>
      </button>
      <div style={{
        maxHeight: open ? '400px' : '0',
        overflow: 'hidden',
        transition: 'max-height 300ms ease-out',
      }}>
        <p style={{
          margin: '0 0 20px',
          fontSize: '0.92rem', lineHeight: 1.8,
          color: 'var(--md-sys-color-on-surface-variant)',
          maxWidth: '62ch',
          paddingLeft: '50px',
        }}>{body}</p>
      </div>
    </div>
  )
}

// ── Letter step ───────────────────────────────────────────────────────────────
function LetterStep({ number, label, body, isLast }) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ display: 'flex', gap: '20px', transition: 'opacity 200ms ease-out', opacity: active ? 1 : 0.55 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: active ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-primary-container)',
          border: `1.5px solid var(--md-sys-color-primary)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'background 200ms ease-out',
        }}>
          <span style={{
            fontFamily: 'Libre Baskerville, Georgia, serif',
            fontWeight: 700, fontSize: '0.78rem',
            color: active ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-primary-container)',
            transition: 'color 200ms ease-out',
          }}>{number}</span>
        </div>
        {!isLast && (
          <div style={{ width: '1px', flex: 1, minHeight: '16px', background: 'var(--md-sys-color-outline-variant)', margin: '4px 0' }} />
        )}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : '20px', paddingTop: '6px' }}>
        <p style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)', lineHeight: 1.3 }}>{label}</p>
        <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.65, color: 'var(--md-sys-color-on-surface-variant)', maxWidth: '52ch' }}>{body}</p>
      </div>
    </div>
  )
}

// ── Issues panel ──────────────────────────────────────────────────────────────
const NATIONAL_ISSUES = [
  { icon: '🏛️', label: 'Federal policy', body: 'New laws, budgets, and national policies that affect all Malaysians — from taxes to education reform.' },
  { icon: '📋', label: 'Dewan Rakyat bills', body: 'A bill you support or oppose going through parliament. Your MP votes on it — they should know your view.' },
  { icon: '🔍', label: 'Ministerial accountability', body: "Raise questions about a government ministry's conduct or decisions through your MP in parliament." },
]

const LOCAL_ISSUES = [
  { icon: '🚧', label: 'Broken infrastructure', body: 'Blocked drains, broken streetlights, potholes, damaged public facilities in your area.' },
  { icon: '🏗️', label: 'Local development', body: 'New construction, zoning changes, or development projects that affect your neighborhood.' },
  { icon: '🗑️', label: 'Council services', body: 'Rubbish collection, parks maintenance, local permits — matters under the local council\'s purview.' },
]

function IssueCard({ icon, label, body }) {
  return (
    <div style={{
      display: 'flex', gap: '12px', padding: '12px 14px',
      background: 'var(--md-sys-color-surface-container)',
      borderRadius: '10px',
    }}>
      <span style={{ fontSize: '1.25rem', flexShrink: 0, lineHeight: 1.4 }}>{icon}</span>
      <div>
        <p style={{ margin: '0 0 2px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)', lineHeight: 1.3 }}>{label}</p>
        <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.55, color: 'var(--md-sys-color-on-surface-variant)' }}>{body}</p>
      </div>
    </div>
  )
}

// ── Search helpers ────────────────────────────────────────────────────────────

/** Normalise a seat code: P15 → P015, N8 → N008, N28 → N028 */
function normCode(raw) {
  const m = raw.match(/^([A-Z]+)(\d+)$/)
  if (!m) return raw
  const prefix = m[1]
  const num = m[2]
  if (prefix === 'P') return `P${num.padStart(3, '0')}`
  // State codes: 1 digit → 3 zeros pad? No — data uses N27/N28 (2-digit), so pad to 2 min
  if (prefix === 'N') {
    // try both N28 and N028 by returning all variants; caller will match either
    return `N${num.padStart(2, '0')}`
  }
  return raw
}

/** Parse raw query into { pCode, nCode, text } */
function parseQuery(raw) {
  const up = raw.trim().toUpperCase()
  // Split on comma, semicolon, or whitespace runs
  const parts = up.split(/[\s,;]+/).filter(Boolean)
  let pCode = null, nCode = null, textParts = []
  for (const part of parts) {
    if (/^P\d+$/.test(part)) { pCode = normCode(part); continue }
    if (/^N\d+$/.test(part)) { nCode = normCode(part); continue }
    textParts.push(part)
  }
  return { pCode, nCode, text: textParts.join(' ') }
}

/** Match a seat code allowing both padded and original form */
function matchCode(repCode, target) {
  if (!repCode || !target) return false
  return repCode.toUpperCase() === target ||
    repCode.toUpperCase() === target.replace(/^([A-Z]+)0+(\d)$/, '$1$2') // strip leading zeros
}

// ── Representative result cards ───────────────────────────────────────────────

function RepCard({ rep, activeTab, setActiveTab }) {
  const seatCode = rep.type === 'MP' ? rep.federalSeatCode : rep.stateSeatCode
  return (
    <div style={{
      background: 'var(--md-sys-color-surface-container-low)',
      border: '1.5px solid var(--md-sys-color-primary)',
      borderRadius: '16px', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 20px', borderBottom: '1px solid var(--md-sys-color-outline-variant)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
              padding: '3px 10px', borderRadius: '999px',
              background: rep.type === 'MP' ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-tertiary-container)',
              color: rep.type === 'MP' ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-tertiary-container)',
              fontFamily: 'Inter, sans-serif',
            }}>
              {rep.type === 'MP' ? 'MP · Federal' : 'ADUN · State'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--md-sys-color-outline)', fontFamily: 'Inter, sans-serif' }}>{seatCode}</span>
          </div>
          <h3 style={{ margin: '0 0 3px', fontFamily: 'Libre Baskerville, Georgia, serif', fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--md-sys-color-on-surface)', letterSpacing: '-0.01em' }}>
            {rep.name}
          </h3>
          <p style={{ margin: '0 0 2px', fontSize: '0.8rem', color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'Inter, sans-serif' }}>
            {rep.type === 'MP' ? rep.federalSeatName : rep.stateSeatName} · {rep.state}
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--md-sys-color-primary)', fontFamily: 'Inter, sans-serif' }}>{rep.party}</p>
        </div>
        <Link
          to={`/profile/${rep.electedYear}/${seatCode}`}
          className="btn-outline"
          style={{ textDecoration: 'none', flexShrink: 0, fontSize: '0.78rem', padding: '7px 12px', whiteSpace: 'nowrap' }}
        >
          Profile <ArrowRightIcon size={11} />
        </Link>
      </div>

      {/* Issues tabs */}
      <div style={{ padding: '0 20px', borderBottom: '1px solid var(--md-sys-color-outline-variant)', display: 'flex' }}>
        {[
          { key: 'national', label: rep.type === 'MP' ? '🏛️ National — Your MP' : '🏛️ National Issues', dimmed: rep.type !== 'MP' },
          { key: 'local', label: rep.type === 'ADUN' ? '🏘️ Local — Your ADUN' : '🏘️ Local Issues', dimmed: rep.type !== 'ADUN' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '11px 12px 10px', border: 'none', cursor: 'pointer', background: 'none',
            fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', fontWeight: 600,
            color: activeTab === tab.key ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
            borderBottom: activeTab === tab.key ? '2px solid var(--md-sys-color-primary)' : '2px solid transparent',
            transition: 'color 0.15s, border-color 0.15s',
            opacity: tab.dimmed && activeTab !== tab.key ? 0.5 : 1,
            marginBottom: '-1px',
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ padding: '14px 20px 18px' }}>
        {activeTab === 'national' ? (
          <>
            <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: 'var(--md-sys-color-outline)', fontFamily: 'Inter, sans-serif' }}>
              {rep.type === 'MP' ? `${rep.name} represents you in the Dewan Rakyat:` : 'National issues go to your Member of Parliament:'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '12px' }}>
              {NATIONAL_ISSUES.map((issue) => <IssueCard key={issue.label} {...issue} />)}
            </div>
            {rep.type === 'MP' && (
              <Link to={`/profile/${rep.electedYear}/${seatCode}`} style={{ fontSize: '0.78rem', color: 'var(--md-sys-color-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                Get {rep.name}'s contact info <ArrowRightIcon size={11} />
              </Link>
            )}
          </>
        ) : (
          <>
            <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: 'var(--md-sys-color-outline)', fontFamily: 'Inter, sans-serif' }}>
              {rep.type === 'ADUN' ? `${rep.name} represents you in the State Assembly:` : 'Local issues go to your State Assembly Member:'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '12px' }}>
              {LOCAL_ISSUES.map((issue) => <IssueCard key={issue.label} {...issue} />)}
            </div>
            {rep.type === 'ADUN' && (
              <Link to={`/profile/${rep.electedYear}/${seatCode}`} style={{ fontSize: '0.78rem', color: 'var(--md-sys-color-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                Get {rep.name}'s contact info <ArrowRightIcon size={11} />
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function AdunRow({ rep }) {
  const seatCode = rep.stateSeatCode
  return (
    <Link
      to={`/profile/${rep.electedYear}/${seatCode}`}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        padding: '10px 14px', borderRadius: '10px', textDecoration: 'none',
        background: 'var(--md-sys-color-surface-container)',
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--md-sys-color-surface-container-high)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--md-sys-color-surface-container)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <span style={{
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
          padding: '2px 8px', borderRadius: '999px', flexShrink: 0,
          background: 'var(--md-sys-color-tertiary-container)',
          color: 'var(--md-sys-color-on-tertiary-container)',
          fontFamily: 'Inter, sans-serif',
        }}>{seatCode}</span>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Inter, sans-serif' }}>{rep.name}</p>
          <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'Inter, sans-serif' }}>{rep.stateSeatName} · {rep.party}</p>
        </div>
      </div>
      <ArrowRightIcon size={12} />
    </Link>
  )
}

// ── Representative lookup ─────────────────────────────────────────────────────
function RepLookup({ data }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null) // { mode: 'single'|'federal', mp, aduns, adun }
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState('national')
  const inputRef = useRef(null)

  // Deduplicate to latest year per seat
  const latestReps = useMemo(() => {
    const seen = new Map()
    for (const rep of data) {
      const key = rep.type === 'MP' ? `MP:${rep.federalSeatCode}` : `ADUN:${rep.stateSeatCode}`
      const existing = seen.get(key)
      if (!existing || rep.electedYear > existing.electedYear) seen.set(key, rep)
    }
    return Array.from(seen.values())
  }, [data])

  const handleSearch = (e) => {
    e.preventDefault()
    const raw = query.trim()
    if (!raw) return

    const { pCode, nCode, text } = parseQuery(raw)

    // ── Case 1: P + N combined → find exact ADUN ─────────────────────────────
    if (pCode && nCode) {
      const adun = latestReps.find(r =>
        r.type === 'ADUN' &&
        matchCode(r.federalSeatCode, pCode) &&
        matchCode(r.stateSeatCode, nCode)
      )
      if (adun) {
        setResults({ mode: 'single', rep: adun })
        setActiveTab('local')
        setNotFound(false)
        return
      }
    }

    // ── Case 2: P only → MP + all ADUNs under that federal seat ──────────────
    if (pCode && !nCode && !text) {
      const mp = latestReps.find(r => r.type === 'MP' && matchCode(r.federalSeatCode, pCode))
      const aduns = latestReps.filter(r => r.type === 'ADUN' && matchCode(r.federalSeatCode, pCode))
      if (mp || aduns.length > 0) {
        setResults({ mode: 'federal', mp, aduns })
        setActiveTab('national')
        setNotFound(false)
        return
      }
    }

    // ── Case 3: N only → exact ADUN ─────────────────────────────────────────
    if (nCode && !pCode && !text) {
      const adun = latestReps.find(r => r.type === 'ADUN' && matchCode(r.stateSeatCode, nCode))
      if (adun) {
        setResults({ mode: 'single', rep: adun })
        setActiveTab('local')
        setNotFound(false)
        return
      }
    }

    // ── Case 4: Text search — seat name or polling district ──────────────────
    if (text) {
      const t = text.toLowerCase()
      const match = latestReps.find(r => {
        if (r.federalSeatName && r.federalSeatName.toLowerCase().includes(t)) return true
        if (r.stateSeatName && r.stateSeatName.toLowerCase().includes(t)) return true
        if (Array.isArray(r.pollingDistricts) && r.pollingDistricts.some(d => d.toLowerCase().includes(t))) return true
        if (r.name && r.name.toLowerCase().includes(t)) return true
        return false
      })
      if (match) {
        if (match.type === 'ADUN') {
          setResults({ mode: 'single', rep: match })
          setActiveTab('local')
        } else {
          const aduns = latestReps.filter(r => r.type === 'ADUN' && r.federalSeatCode === match.federalSeatCode)
          setResults({ mode: 'federal', mp: match, aduns })
          setActiveTab('national')
        }
        setNotFound(false)
        return
      }
    }

    setResults(null)
    setNotFound(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Input */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{
            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--md-sys-color-outline)', pointerEvents: 'none',
          }}>
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setNotFound(false) }}
            placeholder="e.g. P015, P015 N28, N28, or Sungai Petani"
            style={{
              width: '100%',
              background: 'var(--md-sys-color-surface-container-lowest)',
              border: '1.5px solid var(--md-sys-color-outline-variant)',
              borderRadius: '12px',
              color: 'var(--md-sys-color-on-surface)',
              padding: '13px 16px 13px 46px',
              fontSize: '0.95rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--md-sys-color-primary)'
              e.target.style.boxShadow = '0 0 0 3px oklch(52% 0.065 148 / 0.12)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--md-sys-color-outline-variant)'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ borderRadius: '12px', padding: '13px 22px', fontSize: '0.88rem', flexShrink: 0 }}>
          Find
        </button>
      </form>

      {/* Hint pills */}
      <div style={{ margin: '-8px 0 0', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--md-sys-color-outline)', fontFamily: 'Inter, sans-serif' }}>Try:</span>
        {['P015', 'P015 N28', 'N28', 'Sungai Petani'].map(ex => (
          <button key={ex} onClick={() => setQuery(ex)} style={{
            padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--md-sys-color-outline-variant)',
            background: 'var(--md-sys-color-surface-container-low)', cursor: 'pointer',
            fontSize: '0.72rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)',
            fontFamily: 'Inter, sans-serif', transition: 'background 0.1s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--md-sys-color-primary-container)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--md-sys-color-surface-container-low)'}
          >{ex}</button>
        ))}
      </div>

      {/* Not found */}
      {notFound && (
        <div style={{
          padding: '14px 18px', borderRadius: '10px', fontSize: '0.85rem',
          background: 'var(--md-sys-color-error-container, oklch(90% 0.04 25))',
          color: 'var(--md-sys-color-on-error-container, oklch(30% 0.08 25))',
        }}>
          No representative found for <strong>"{query.trim()}"</strong>. Check the code and try again, or{' '}
          <a href="https://mysprsemak.spr.gov.my/semakan/daftarPemilih" target="_blank" rel="noopener noreferrer"
            style={{ color: 'inherit', fontWeight: 600 }}>look up your district at SPR Semakan</a>.
        </div>
      )}

      {/* ── Single result ── */}
      {results?.mode === 'single' && (
        <div style={{ animation: 'slideIn 300ms ease-out' }}>
          <RepCard rep={results.rep} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}

      {/* ── Federal result: MP + ADUNs ── */}
      {results?.mode === 'federal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'slideIn 300ms ease-out' }}>
          {results.mp && (
            <RepCard rep={results.mp} activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
          {results.aduns && results.aduns.length > 0 && (
            <div style={{
              background: 'var(--md-sys-color-surface-container-low)',
              border: '1px solid var(--md-sys-color-outline-variant)',
              borderRadius: '14px', overflow: 'hidden',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--md-sys-color-outline-variant)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                  padding: '2px 8px', borderRadius: '999px',
                  background: 'var(--md-sys-color-tertiary-container)',
                  color: 'var(--md-sys-color-on-tertiary-container)',
                  fontFamily: 'Inter, sans-serif',
                }}>ADUN · State</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'Inter, sans-serif' }}>
                  {results.aduns.length} state seats under {results.mp?.federalSeatName || results.aduns[0]?.federalSeatName}
                </span>
              </div>
              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {results.aduns.map(adun => <AdunRow key={adun.stateSeatCode} rep={adun} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── SPR ID Card ───────────────────────────────────────────────────────────────
function SPRCard() {
  const fade = useFadeIn(0)
  return (
    <div {...fade} style={{
      background: 'var(--md-sys-color-surface-container-low)',
      border: '1px solid var(--md-sys-color-outline-variant)',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Card header — SPR purple reinterpreted in sage */}
      <div style={{
        background: 'var(--md-sys-color-primary)',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      }}>
        <p style={{
          margin: 0, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
          color: 'var(--md-sys-color-on-primary)', fontFamily: 'Inter, sans-serif',
        }}>
          Daftar Pemilih yang Telah Disahkan
        </p>
        <span style={{ fontSize: '0.65rem', color: 'var(--md-sys-color-on-primary)', opacity: 0.75, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
          mysprsemak.spr.gov.my
        </span>
      </div>

      {/* Card fields */}
      <div style={{ padding: '0' }}>
        {[
          { label: 'Daerah Mengundi', value: '108 / 40 / 15 — Bukit Jelutong U8', hint: 'Polling district' },
          { label: 'DUN', value: '108 / 40 — Kota Anggerik', hint: 'State seat (ADUN)' },
          { label: 'Parlimen', value: '108 — Shah Alam', hint: 'Federal seat (MP)' },
          { label: 'Negeri', value: 'Selangor', hint: 'State' },
        ].map((row, i, arr) => (
          <div key={row.label} style={{
            display: 'grid', gridTemplateColumns: '110px 1fr',
            borderBottom: i < arr.length - 1 ? '1px solid var(--md-sys-color-outline-variant)' : 'none',
            padding: '11px 20px',
            alignItems: 'center', gap: '12px',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'Inter, sans-serif' }}>{row.label}</span>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)', fontFamily: 'Inter, sans-serif' }}>{row.value}</span>
              <span style={{ marginLeft: '8px', fontSize: '0.68rem', color: 'var(--md-sys-color-primary)', fontFamily: 'Inter, sans-serif', opacity: 0.8 }}>{row.hint}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--md-sys-color-outline-variant)',
        background: 'var(--md-sys-color-surface-container)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
      }}>
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'Inter, sans-serif', maxWidth: '28ch', lineHeight: 1.5 }}>
          Don't know your seat code? Look it up free at SPR Semakan.
        </p>
        <a
          href="https://mysprsemak.spr.gov.my/semakan/daftarPemilih"
          target="_blank" rel="noopener noreferrer"
          className="btn-primary"
          style={{ textDecoration: 'none', flexShrink: 0, fontSize: '0.82rem' }}
        >
          Check at SPR <ExternalIcon />
        </a>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  usePageMeta({
    title: t('about.page_title'),
    description: t('about.page_description'),
  })

  const { data, loading } = useRepresentatives()

  const heroFade = useFadeIn(0)
  const originFade = useFadeIn(60)
  const lookupFade = useFadeIn(0)
  const missionFade = useFadeIn(0)
  const ctaFade = useFadeIn(0)

  const LETTER_STEPS = [
    { label: t('about.letter_step1_label'), body: t('about.letter_step1_body') },
    { label: t('about.letter_step2_label'), body: t('about.letter_step2_body') },
    { label: t('about.letter_step3_label'), body: t('about.letter_step3_body') },
    { label: t('about.letter_step4_label'), body: t('about.letter_step4_body') },
    { label: t('about.letter_step5_label'), body: t('about.letter_step5_body') },
  ]

  return (
    <div className="page-enter">

      {/* ── Station 1: Hero ─────────────────────────────────────── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid var(--md-sys-color-outline-variant)',
        padding: '72px 24px 64px',
        background: 'var(--md-sys-color-surface)',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, var(--md-sys-color-outline-variant) 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.4,
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, var(--md-sys-color-primary-container) 0%, transparent 70%)',
          opacity: 0.6, pointerEvents: 'none',
        }} />

        <div {...heroFade} style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <span style={{
            display: 'inline-block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.09em',
            textTransform: 'uppercase', color: 'var(--md-sys-color-primary)', marginBottom: '28px',
            fontFamily: 'Inter, sans-serif',
          }}>
            {t('about.section_label')}
          </span>

          <blockquote style={{
            margin: '0 0 28px',
            fontFamily: 'Libre Baskerville, Georgia, serif',
            fontSize: 'clamp(1.45rem, 4vw, 2.2rem)',
            fontWeight: 700, lineHeight: 1.28, letterSpacing: '-0.02em',
            color: 'var(--md-sys-color-on-surface)',
          }}>
            <span style={{
              display: 'block',
              fontFamily: 'Libre Baskerville, Georgia, serif',
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              lineHeight: 0.6, color: 'var(--md-sys-color-primary)',
              marginBottom: '8px', opacity: 0.7, userSelect: 'none',
            }} aria-hidden="true">"</span>
            {t('about.pull_quote')}
          </blockquote>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <cite style={{ fontStyle: 'normal', fontSize: '0.78rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'Inter, sans-serif' }}>
              {t('about.pull_attribution')}
            </cite>
            <a
              href="https://cilisos.my/101-writing-a-letter-to-your-mp-and-how-it-can-save-malaysia/"
              target="_blank" rel="noopener noreferrer"
              style={{
                fontSize: '0.75rem', color: 'var(--md-sys-color-primary)', textDecoration: 'none',
                fontStyle: 'italic', fontFamily: 'Libre Baskerville, Georgia, serif',
                borderBottom: '1px solid var(--md-sys-color-outline-variant)', paddingBottom: '1px',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--md-sys-color-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--md-sys-color-outline-variant)'}
            >
              {t('about.pull_attribution_article')}
            </a>
          </div>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px 88px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '72px', alignItems: 'start' }} className="about-grid">

          {/* ── Left column ── */}
          <div>

            {/* Station 2: Origin */}
            <div {...originFade} style={{ marginBottom: '56px' }}>
              <h2 style={{
                margin: '0 0 16px',
                fontFamily: 'Libre Baskerville, Georgia, serif',
                fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
                fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em',
                color: 'var(--md-sys-color-on-surface)',
              }}>
                {t('about.origin_heading')}
              </h2>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--md-sys-color-on-surface-variant)', maxWidth: '62ch' }}>
                {t('about.origin_body')}
              </p>
            </div>

            {/* Station 3: Interactive lookup */}
            <div style={{ marginBottom: '64px' }}>
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  display: 'inline-block', marginBottom: '10px',
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                  color: 'var(--md-sys-color-primary)', fontFamily: 'Inter, sans-serif',
                }}>
                  Interactive
                </span>
                <h2 style={{
                  margin: '0 0 8px',
                  fontFamily: 'Libre Baskerville, Georgia, serif',
                  fontSize: 'clamp(1.2rem, 2.8vw, 1.6rem)',
                  fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em',
                  color: 'var(--md-sys-color-on-surface)',
                }}>
                  Find your representative
                </h2>
                <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--md-sys-color-on-surface-variant)', maxWidth: '56ch' }}>
                  Enter your seat code to instantly see who represents you — and learn what kinds of issues to bring to them.
                </p>
              </div>
              <div {...lookupFade}>
                {loading ? (
                  <div style={{ height: '120px', borderRadius: '12px', background: 'var(--md-sys-color-surface-container)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ) : (
                  <RepLookup data={data} />
                )}
              </div>
            </div>

            {/* Station 4: Three insights accordion */}
            <div style={{ marginBottom: '64px' }}>
              <h2 style={{
                margin: '0 0 4px',
                fontFamily: 'Libre Baskerville, Georgia, serif',
                fontSize: 'clamp(1.2rem, 2.8vw, 1.6rem)',
                fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em',
                color: 'var(--md-sys-color-on-surface)',
              }}>
                Three things every Malaysian should know
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: '0.85rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                From the 2015 article that started all of this.
              </p>
              <div style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                <AccordionItem
                  num={t('about.insight1_num')}
                  heading={t('about.insight1_heading')}
                  body={t('about.insight1_body')}
                  defaultOpen={true}
                />
                <AccordionItem
                  num={t('about.insight2_num')}
                  heading={t('about.insight2_heading')}
                  body={t('about.insight2_body')}
                />
                <AccordionItem
                  num={t('about.insight3_num')}
                  heading={t('about.insight3_heading')}
                  body={t('about.insight3_body')}
                />
              </div>
            </div>

            {/* Station 5: Mission */}
            <div {...missionFade} style={{ padding: '28px 32px', background: 'var(--md-sys-color-primary-container)', borderRadius: '16px' }}>
              <p style={{
                margin: '0 0 8px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: 'var(--md-sys-color-on-primary-container)', opacity: 0.75,
                fontFamily: 'Inter, sans-serif',
              }}>
                Our mission
              </p>
              <h2 style={{
                margin: '0 0 12px', fontFamily: 'Libre Baskerville, Georgia, serif',
                fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.3,
                color: 'var(--md-sys-color-on-primary-container)', letterSpacing: '-0.01em',
              }}>
                {t('about.mission_heading')}
              </h2>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--md-sys-color-on-primary-container)', opacity: 0.88, maxWidth: '60ch' }}>
                {t('about.mission_body')}
              </p>
            </div>
          </div>

          {/* ── Right column: sticky sidebar ── */}
          <div style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="about-sidebar">

            {/* SPR card */}
            <SPRCard />

            {/* Letter guide */}
            <div style={{
              background: 'var(--md-sys-color-surface-container-low)',
              border: '1px solid var(--md-sys-color-outline-variant)',
              borderRadius: '16px', padding: '24px 24px 20px',
            }}>
              <p style={{ margin: '0 0 4px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--md-sys-color-primary)', fontFamily: 'Inter, sans-serif' }}>
                Practical Guide
              </p>
              <h3 style={{ margin: '0 0 8px', fontFamily: 'Libre Baskerville, Georgia, serif', fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--md-sys-color-on-surface)', letterSpacing: '-0.01em' }}>
                {t('about.letter_heading')}
              </h3>
              <p style={{ margin: '0 0 20px', fontSize: '0.78rem', lineHeight: 1.65, color: 'var(--md-sys-color-on-surface-variant)' }}>
                {t('about.letter_intro')}
              </p>
              {LETTER_STEPS.map((step, i) => (
                <LetterStep key={i} number={i + 1} label={step.label} body={step.body} isLast={i === LETTER_STEPS.length - 1} />
              ))}
            </div>

            {/* Original article link */}
            <a
              href="https://cilisos.my/101-writing-a-letter-to-your-mp-and-how-it-can-save-malaysia/"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                padding: '14px 18px', background: 'var(--md-sys-color-surface-container-low)',
                border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: '12px',
                textDecoration: 'none', transition: 'box-shadow 0.15s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 12px oklch(18% 0.008 148 / 0.08)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)', lineHeight: 1.3 }}>{t('about.cta_link_article')}</p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.4 }}>cilisos.my, August 2015</p>
              </div>
              <span style={{ color: 'var(--md-sys-color-primary)', flexShrink: 0 }}><ExternalIcon /></span>
            </a>
          </div>

        </div>
      </div>

      {/* ── Station 6: Dual CTA ─────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)', background: 'var(--md-sys-color-surface-container)' }}>
        <div {...ctaFade} style={{
          maxWidth: '1200px', margin: '0 auto', padding: '48px 24px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
        }} className="about-cta-grid">
          {/* CTA 1 */}
          <div style={{
            padding: '28px 28px 24px', background: 'var(--md-sys-color-primary)',
            borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--md-sys-color-on-primary)', opacity: 0.75, fontFamily: 'Inter, sans-serif' }}>
              Step 1
            </p>
            <h3 style={{ margin: 0, fontFamily: 'Libre Baskerville, Georgia, serif', fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--md-sys-color-on-primary)', letterSpacing: '-0.01em' }}>
              Find your representative
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.65, color: 'var(--md-sys-color-on-primary)', opacity: 0.85 }}>
              Search by name, seat code, or constituency. Every MP and ADUN in one place.
            </p>
            <Link to="/directory" style={{
              marginTop: '4px', alignSelf: 'flex-start', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '9px',
              background: 'var(--md-sys-color-on-primary)', color: 'var(--md-sys-color-primary)',
              fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Inter, sans-serif',
              transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Open the Directory <ArrowRightIcon size={13} />
            </Link>
          </div>

          {/* CTA 2 */}
          <div style={{
            padding: '28px 28px 24px',
            background: 'var(--md-sys-color-surface-container-low)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--md-sys-color-primary)', opacity: 0.85, fontFamily: 'Inter, sans-serif' }}>
              Step 0 — If needed
            </p>
            <h3 style={{ margin: 0, fontFamily: 'Libre Baskerville, Georgia, serif', fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.25, color: 'var(--md-sys-color-on-surface)', letterSpacing: '-0.01em' }}>
              Check your district
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.65, color: 'var(--md-sys-color-on-surface-variant)' }}>
              Don't know your seat code? SPR Semakan shows your DUN and Parliament seat using your IC number.
            </p>
            <a
              href="https://mysprsemak.spr.gov.my/semakan/daftarPemilih"
              target="_blank" rel="noopener noreferrer"
              className="btn-outline"
              style={{ marginTop: '4px', alignSelf: 'flex-start', textDecoration: 'none' }}
            >
              SPR Semakan <ExternalIcon />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .about-sidebar { position: static !important; }
        }
        @media (max-width: 640px) {
          .about-cta-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  )
}
