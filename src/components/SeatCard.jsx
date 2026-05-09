import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const initials = (name) =>
  (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

const personEmoji = (gender) => (gender === 'F' ? '👩' : gender === 'M' ? '👨' : '👤')

/**
 * Federal-seat result card with MP / ADUN tabs.
 * Used by /find (Individual Search) and the suggestion previews on /.
 *
 * Props:
 *   seat                  — full seat object from useRepresentatives()
 *   defaultTab            — 'mp' | 'adun' | undefined; auto-derived if missing
 *   visibleAdunIndices    — when defined, the ADUN tab renders only these indices and the count reflects that
 *   showMpTab             — boolean; defaults to !!seat.mp
 *   detailHref            — base href for the seat (defaults to /seat/:code)
 */
export default function SeatCard({
  seat,
  defaultTab,
  visibleAdunIndices,
  showMpTab,
  detailHref,
}) {
  const allAduns = seat.aduns || []
  const isFT = allAduns.length === 0

  const visibleAduns = useMemo(() => {
    if (!visibleAdunIndices) return allAduns
    return visibleAdunIndices.map((i) => allAduns[i]).filter(Boolean)
  }, [allAduns, visibleAdunIndices])

  const mpVisible = (showMpTab ?? !!seat.mp)

  const initialTab =
    defaultTab ??
    (mpVisible ? 'mp' : visibleAduns.length > 0 ? 'adun' : 'mp')

  const [tab, setTab] = useState(initialTab)
  const baseId = useId()

  const seatHref = detailHref || `/seat/${seat.federalSeatCode}`
  const adunCount = visibleAdunIndices ? visibleAduns.length : allAduns.length

  // If the only visible side is ADUN (e.g. filter excluded the MP), force tab there.
  const effectiveTab = !mpVisible && visibleAduns.length > 0 ? 'adun' : tab

  return (
    <article className="seat-card">
      <header className="seat-card__header">
        <Link to={seatHref} className="seat-header-left" style={{ color: 'inherit' }}>
          <span className="seat-code">{seat.federalSeatCode}</span>
          <span className="seat-name">{seat.federalSeatName}</span>
        </Link>
        <span className="seat-state">
          {seat.state}
          {!isFT && ` · ${allAduns.length} ADUN${allAduns.length === 1 ? '' : 's'}`}
          {isFT && ' · Federal Territory'}
        </span>
      </header>

      <div className="card-tabs" role="tablist" aria-label="Representative type">
        {mpVisible && (
          <button
            id={`${baseId}-tab-mp`}
            type="button"
            role="tab"
            aria-selected={effectiveTab === 'mp'}
            aria-controls={`${baseId}-panel-mp`}
            tabIndex={effectiveTab === 'mp' ? 0 : -1}
            className={`card-tab ${effectiveTab === 'mp' ? 'is-active' : ''}`}
            onClick={() => setTab('mp')}
          >
            MP
          </button>
        )}
        {!isFT && visibleAduns.length > 0 && (
          <button
            id={`${baseId}-tab-adun`}
            type="button"
            role="tab"
            aria-selected={effectiveTab === 'adun'}
            aria-controls={`${baseId}-panel-adun`}
            tabIndex={effectiveTab === 'adun' ? 0 : -1}
            className={`card-tab ${effectiveTab === 'adun' ? 'is-active' : ''}`}
            onClick={() => setTab('adun')}
          >
            ADUN ({adunCount})
          </button>
        )}
      </div>

      {effectiveTab === 'mp' && mpVisible && (
        <div
          id={`${baseId}-panel-mp`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-mp`}
          className="tab-panel"
        >
          {seat.mp ? (
            <PersonRow person={seat.mp} kind="mp" detailHref={seatHref} />
          ) : (
            <p className="contact-row__missing">MP data not yet available</p>
          )}
        </div>
      )}

      {effectiveTab === 'adun' && !isFT && visibleAduns.length > 0 && (
        <div
          id={`${baseId}-panel-adun`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-adun`}
          className="tab-panel"
        >
          <ul className="adun-list">
            {visibleAduns.map((a) => (
              <li className="adun-item" key={`${seat.federalSeatCode}-${a.stateSeatCode}`}>
                <span className="adun-seat-code">{a.stateSeatCode}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="adun-name">{a.name}</div>
                  <div className="adun-meta">
                    {a.party} · {a.stateSeatName}
                  </div>
                </div>
                <Link to={seatHref} className="adun-cta">View →</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

function PersonRow({ person, kind, detailHref }) {
  return (
    <div className="person-row">
      <div className={`person-avatar person-avatar--${kind}`} aria-hidden="true">
        {person.gender ? personEmoji(person.gender) : initials(person.name)}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <span className={`person-badge person-badge--${kind}`}>{kind === 'mp' ? 'MP' : 'ADUN'}</span>
        <div className="person-name">{person.name}</div>
        <div className="person-meta">
          {person.party} · {person.federalSeatCode} {person.federalSeatName} · {person.state}
        </div>
      </div>
      <Link to={detailHref} className="person-cta">View →</Link>
    </div>
  )
}
