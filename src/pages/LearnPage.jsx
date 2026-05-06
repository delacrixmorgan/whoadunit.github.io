import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { useRepresentatives, getContactCompleteness } from '../hooks/useRepresentatives'
import { t } from '../i18n'

const PARTY_COLORS = {
  PKR: '#c0392b', DAP: '#1a5276', Amanah: '#1e8449', UMNO: '#d4ac0d',
  BERSATU: '#1a5276', PAS: '#196f3d', MCA: '#c0392b', MIC: '#7d3c98',
  GPS: '#1a6b8a', GRS: '#117a65', default: '#5d6d7e',
}
function getPartyColor(p) { return PARTY_COLORS[p] || PARTY_COLORS.default }

function getInitials(name) {
  return name.split(' ').filter(w => w.length > 1).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

// --- Search logic ---

function matchesPerson(person, q) {
  return [
    person.name,
    person.party,
    person.stateSeatName,
    person.stateSeatCode,
    ...(person.pollingDistricts ?? []),
  ].some(s => s?.toLowerCase().includes(q))
}

function groupSearch(seats, query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return seats.map(seat => {
    if ([seat.federalSeatCode, seat.federalSeatName, seat.state].some(s => s?.toLowerCase().includes(q))) {
      return { seat, matchedIn: 'seat', matchedAdunIndices: [] }
    }
    if (seat.mp && matchesPerson(seat.mp, q)) {
      return { seat, matchedIn: 'mp', matchedAdunIndices: [] }
    }
    const matchedAdunIndices = seat.aduns
      .map((a, i) => (matchesPerson(a, q) ? i : -1))
      .filter(i => i >= 0)
    if (matchedAdunIndices.length) {
      return { seat, matchedIn: 'adun', matchedAdunIndices }
    }
    return null
  }).filter(Boolean)
}

// --- FederalSeatCard ---

function PersonDetail({ rep, year, seatCode }) {
  if (!rep) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: 'var(--md-sys-color-on-surface-variant)',
        fontSize: '0.85rem',
      }}>
        {t('learn.no_mp')}
      </div>
    )
  }

  const partyColor = getPartyColor(rep.party)
  const completeness = getContactCompleteness(rep)

  return (
    <div style={{ padding: '20px 22px' }}>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
          background: `${partyColor}18`, border: `2px solid ${partyColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', fontWeight: 700, color: partyColor,
        }}>
          {getInitials(rep.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.97rem', color: 'var(--md-sys-color-on-surface)', marginBottom: '3px' }}>
            {rep.name}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px', borderRadius: '999px',
              background: `${partyColor}18`, color: partyColor,
            }}>
              {rep.party}
            </span>
            {rep.stateSeatCode && (
              <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                <span style={{ fontWeight: 600, color: 'var(--md-sys-color-primary)' }}>{rep.stateSeatCode}</span>
                {rep.stateSeatName && <span> · {rep.stateSeatName}</span>}
              </span>
            )}
            {rep.electedYear && (
              <span style={{
                fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: '5px',
                background: 'var(--md-sys-color-secondary-container)',
                color: 'var(--md-sys-color-on-secondary-container)',
              }}>
                {rep.electedYear}
              </span>
            )}
          </div>

          {/* Contact completeness bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: 'var(--md-sys-color-surface-container-high)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${completeness}%`,
                background: completeness >= 75 ? 'var(--md-sys-color-tertiary)'
                  : completeness >= 50 ? 'var(--md-sys-color-primary)'
                  : 'var(--md-sys-color-outline)',
              }} />
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--md-sys-color-on-surface-variant)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
              {completeness}% contact
            </span>
          </div>
        </div>
      </div>

      <Link
        to={`/profile/${year}/${seatCode}`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
          color: 'var(--md-sys-color-on-primary-container)',
          background: 'var(--md-sys-color-primary-container)',
          padding: '6px 14px', borderRadius: '8px',
        }}
      >
        View Profile →
      </Link>
    </div>
  )
}

function AdunRow({ adun }) {
  const partyColor = getPartyColor(adun.party)
  const seatCode = adun.stateSeatCode

  return (
    <Link
      to={`/profile/${adun.electedYear}/${seatCode}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{
        display: 'flex', gap: '12px', alignItems: 'center',
        padding: '12px 22px',
        borderBottom: '1px solid var(--md-sys-color-outline-variant)',
        cursor: 'pointer',
        transition: 'background 0.12s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--md-sys-color-surface-container)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{
          width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
          background: `${partyColor}18`, border: `1.5px solid ${partyColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 700, color: partyColor,
        }}>
          {getInitials(adun.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface)' }}>
            {adun.name}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '1px' }}>
            <span style={{ color: partyColor, fontWeight: 600 }}>{adun.party}</span>
            {adun.stateSeatCode && <span> · <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>{adun.stateSeatCode}</span></span>}
            {adun.stateSeatName && <span> {adun.stateSeatName}</span>}
          </div>
        </div>
        {adun.electedYear && (
          <span style={{
            fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: '5px',
            background: 'var(--md-sys-color-secondary-container)',
            color: 'var(--md-sys-color-on-secondary-container)',
            flexShrink: 0,
          }}>
            {adun.electedYear}
          </span>
        )}
      </div>
    </Link>
  )
}

function FederalSeatCard({ seat, matchedIn }) {
  const defaultTab = matchedIn === 'adun' ? 'adun' : 'mp'
  const [activeTab, setActiveTab] = useState(defaultTab)
  const isFederalTerritory = seat.aduns.length === 0
  const mpYear = seat.mp?.electedYear ?? 2022

  return (
    <div style={{
      background: 'var(--md-sys-color-surface-container-low)',
      border: '1px solid var(--md-sys-color-outline-variant)',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Card header */}
      <div style={{
        padding: '16px 22px 0',
        borderBottom: '1px solid var(--md-sys-color-outline-variant)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--md-sys-color-primary)' }}>
            {seat.federalSeatCode}
          </span>
          <span style={{ fontSize: '0.97rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
            {seat.federalSeatName}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
            · {seat.state}
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {[
            { id: 'mp', label: t('learn.tab_mp') },
            ...(!isFederalTerritory ? [{ id: 'adun', label: t('learn.tab_adun')(seat.aduns.length) }] : []),
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                fontSize: '0.8rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                background: activeTab === tab.id
                  ? 'var(--md-sys-color-surface-container-low)'
                  : 'transparent',
                color: activeTab === tab.id
                  ? 'var(--md-sys-color-primary)'
                  : 'var(--md-sys-color-on-surface-variant)',
                borderBottom: activeTab === tab.id
                  ? '2px solid var(--md-sys-color-primary)'
                  : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'color 0.12s',
              }}
            >
              {tab.label}
            </button>
          ))}
          {isFederalTerritory && (
            <span style={{
              padding: '8px 14px',
              fontSize: '0.74rem',
              color: 'var(--md-sys-color-on-surface-variant)',
              fontStyle: 'italic',
              alignSelf: 'center',
            }}>
              {t('learn.no_aduns')}
            </span>
          )}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'mp' && (
        <PersonDetail
          rep={seat.mp}
          year={mpYear}
          seatCode={seat.federalSeatCode}
        />
      )}

      {activeTab === 'adun' && (
        <div>
          {seat.aduns.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.85rem' }}>
              {t('learn.no_aduns')}
            </div>
          ) : (
            seat.aduns.map((adun, i) => (
              <AdunRow key={`${adun.stateSeatCode}-${i}`} adun={adun} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// --- Page ---

export default function LearnPage() {
  usePageMeta({
    title: 'Learn — Whoadunit',
    description: 'Find your Malaysian constituency by name, seat code, representative, or polling district.',
  })

  const { seats, loading } = useRepresentatives()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const results = useMemo(() => groupSearch(seats, query), [seats, query])

  const handleQueryChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (val.trim()) {
      setSearchParams({ q: val }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  const hasQuery = query.trim().length > 0

  return (
    <div className="page-enter" style={{ maxWidth: '800px', margin: '0 auto', padding: '36px 24px 80px' }}>

      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 6px' }}>{t('learn.title')}</h1>
        <p style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
          {t('learn.subtitle')}
        </p>
      </div>

      {/* Search input */}
      <div style={{
        position: 'relative',
        marginBottom: '20px',
      }}>
        <span style={{
          position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
          color: 'var(--md-sys-color-outline)', pointerEvents: 'none',
        }}>
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder={t('learn.search_placeholder')}
          value={query}
          onChange={handleQueryChange}
          autoFocus
          style={{
            width: '100%',
            background: 'var(--md-sys-color-surface-container-highest)',
            border: '1.5px solid var(--md-sys-color-outline-variant)',
            borderRadius: '12px',
            color: 'var(--md-sys-color-on-surface)',
            padding: '13px 16px 13px 42px',
            fontSize: '1rem',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--md-sys-color-primary)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--md-sys-color-outline-variant)' }}
        />
      </div>

      {/* Results count / empty state */}
      {loading ? (
        <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.85rem', marginBottom: '16px' }}>
          Loading…
        </div>
      ) : hasQuery ? (
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '0.83rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
            <span style={{ fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>{results.length}</span>
            {' '}{t('learn.results_count')(results.length).replace(/^\d+ /, '')}
          </span>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '64px 24px',
          color: 'var(--md-sys-color-on-surface-variant)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
          <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--md-sys-color-on-surface)', marginBottom: '6px' }}>
            {t('learn.empty_prompt')}
          </div>
          <div style={{ fontSize: '0.85rem' }}>
            Try a constituency name, seat code like <strong>P001</strong>, a party, or a polling district.
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              height: '140px', borderRadius: '16px',
              background: 'var(--md-sys-color-surface-container)',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`,
            }} />
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && hasQuery && results.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '64px 24px',
          color: 'var(--md-sys-color-on-surface-variant)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🤷</div>
          <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--md-sys-color-on-surface)', marginBottom: '6px' }}>
            No constituencies found for "{query}"
          </div>
          <div style={{ fontSize: '0.85rem' }}>
            Try a different spelling, a seat code, or a polling district name.
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {results.map(({ seat, matchedIn }) => (
            <FederalSeatCard
              key={seat.federalSeatCode}
              seat={seat}
              matchedIn={matchedIn}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
      `}</style>
    </div>
  )
}
