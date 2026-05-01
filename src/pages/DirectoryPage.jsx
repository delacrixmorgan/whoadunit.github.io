import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useRepresentatives, getContactCompleteness } from '../hooks/useRepresentatives'
import { t } from '../i18n'

const PARTY_COLORS = {
  PKR: '#c0392b', DAP: '#1a5276', Amanah: '#1e8449', UMNO: '#d4ac0d',
  BERSATU: '#1a5276', PAS: '#196f3d', MCA: '#c0392b', MIC: '#7d3c98',
  GPS: '#1a6b8a', GRS: '#117a65', default: '#5d6d7e',
}
function getPartyColor(p) { return PARTY_COLORS[p] || PARTY_COLORS.default }

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function getInitials(name) {
  return name.split(' ').filter(w => w.length > 1).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

const selectStyle = {
  background: 'var(--md-sys-color-surface-container)',
  border: '1px solid var(--md-sys-color-outline-variant)',
  borderRadius: '8px',
  color: 'var(--md-sys-color-on-surface)',
  padding: '8px 32px 8px 12px',
  fontSize: '0.82rem',
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  minHeight: '36px',
}

export default function DirectoryPage() {
  const { data, loading } = useRepresentatives()
  const [searchParams, setSearchParams] = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'All')
  const [partyFilter, setPartyFilter] = useState(searchParams.get('party') || 'All')
  const [stateFilter, setStateFilter] = useState(searchParams.get('state') || 'All')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All')
  const [yearFilter, setYearFilter] = useState(searchParams.get('year') || 'All')
  const [viewMode, setViewMode] = useState('table')
  const [sortField, setSortField] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  useEffect(() => {
    const q = searchParams.get('q')
    const type = searchParams.get('type')
    const party = searchParams.get('party')
    const state = searchParams.get('state')
    const status = searchParams.get('status')
    const year = searchParams.get('year')
    if (q) setQuery(q)
    if (type) setTypeFilter(type)
    if (party) setPartyFilter(party)
    if (state) setStateFilter(state)
    if (status) setStatusFilter(status)
    if (year) setYearFilter(year)
  }, [searchParams])

  const parties = useMemo(() => ['All', ...Array.from(new Set(data.map(r => r.party))).sort()], [data])
  const states = useMemo(() => ['All', ...Array.from(new Set(data.map(r => r.state))).sort()], [data])
  const years = useMemo(() => ['All', ...Array.from(new Set(data.map(r => r.electedYear).filter(Boolean))).sort((a, b) => b - a)], [data])

  const filtered = useMemo(() => {
    let result = data
    const q = query.trim().toLowerCase()
    if (q) {
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.federalSeatCode?.toLowerCase().includes(q) ||
        r.stateSeatCode?.toLowerCase().includes(q) ||
        r.federalSeatName?.toLowerCase().includes(q) ||
        r.stateSeatName?.toLowerCase().includes(q) ||
        r.party?.toLowerCase().includes(q) ||
        r.state?.toLowerCase().includes(q)
      )
    }
    if (typeFilter !== 'All') result = result.filter(r => r.type === typeFilter)
    if (partyFilter !== 'All') result = result.filter(r => r.party === partyFilter)
    if (stateFilter !== 'All') result = result.filter(r => r.state === stateFilter)
    if (statusFilter !== 'All') result = result.filter(r => r.status === statusFilter)
    if (yearFilter !== 'All') result = result.filter(r => String(r.electedYear) === String(yearFilter))

    return [...result].sort((a, b) => {
      let aVal = '', bVal = ''
      if (sortField === 'name') { aVal = a.name; bVal = b.name }
      else if (sortField === 'party') { aVal = a.party; bVal = b.party }
      else if (sortField === 'state') { aVal = a.state; bVal = b.state }
      else if (sortField === 'seat') { aVal = a.federalSeatCode || a.stateSeatCode; bVal = b.federalSeatCode || b.stateSeatCode }
      else if (sortField === 'year') {
        const cmp2 = (a.electedYear || 0) - (b.electedYear || 0)
        return sortDir === 'asc' ? cmp2 : -cmp2
      }
      const cmp = aVal.localeCompare(bVal)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, query, typeFilter, partyFilter, stateFilter, statusFilter, yearFilter, sortField, sortDir])

  const clearFilters = () => {
    setQuery(''); setTypeFilter('All'); setPartyFilter('All')
    setStateFilter('All'); setStatusFilter('All'); setYearFilter('All')
    setSearchParams({})
  }

  const hasFilters = query || typeFilter !== 'All' || partyFilter !== 'All' || stateFilter !== 'All' || statusFilter !== 'All' || yearFilter !== 'All'

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const SortIndicator = ({ field }) => {
    if (sortField !== field) return <span style={{ opacity: 0.25, marginLeft: '4px' }}>↕</span>
    return <span style={{ color: 'var(--md-sys-color-primary)', marginLeft: '4px' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="page-enter" style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px 64px' }}>

      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 6px' }}>{t('directory.title')}</h1>
        <p style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)', maxWidth: 'none' }}>
          {t('directory.subtitle')}
        </p>
      </div>

      {/* Search + Filters */}
      <div style={{
        background: 'var(--md-sys-color-surface-container-low)',
        border: '1px solid var(--md-sys-color-outline-variant)',
        borderRadius: '14px',
        padding: '18px 20px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--md-sys-color-outline)', pointerEvents: 'none',
          }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder={t('directory.search_placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--md-sys-color-surface-container-highest)',
              border: '1px solid var(--md-sys-color-outline-variant)',
              borderRadius: '10px',
              color: 'var(--md-sys-color-on-surface)',
              padding: '11px 14px 11px 38px',
              fontSize: '0.9rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--md-sys-color-primary)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--md-sys-color-outline-variant)' }}
          />
        </div>

        {/* Filter row */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)' }}>
            Filter:
          </span>

          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={selectStyle}>
            <option value="All">All Types</option>
            <option value="MP">MP (Federal)</option>
            <option value="ADUN">ADUN (State)</option>
          </select>

          <select value={partyFilter} onChange={e => setPartyFilter(e.target.value)} style={selectStyle}>
            {parties.map(p => <option key={p} value={p}>{p === 'All' ? 'All Parties' : p}</option>)}
          </select>

          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={selectStyle}>
            {states.map(s => <option key={s} value={s}>{s === 'All' ? 'All States' : s}</option>)}
          </select>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={selectStyle}>
            {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : `${y}`}</option>)}
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className="btn-outline" style={{ padding: '7px 12px', fontSize: '0.78rem', minHeight: '36px' }}>
              Clear filters
            </button>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
            {['table', 'grid'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
                style={{
                  background: viewMode === mode ? 'var(--md-sys-color-primary-container)' : 'transparent',
                  color: viewMode === mode ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)',
                  border: '1px solid var(--md-sys-color-outline-variant)',
                  borderRadius: '7px', padding: '6px 10px', cursor: 'pointer',
                  fontSize: '0.75rem', fontWeight: 500,
                  minHeight: '36px',
                }}
              >
                {mode === 'table' ? '☰ Table' : '⊞ Grid'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '12px' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
          {loading ? 'Loading…' : (
            <>
              <span style={{ fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>{filtered.length}</span>
              {' representative'}{filtered.length !== 1 ? 's' : ''} found
            </>
          )}
        </span>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              height: '52px', borderRadius: '10px',
              background: 'var(--md-sys-color-surface-container)',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.07}s`,
            }} />
          ))}
        </div>
      )}

      {/* Table view */}
      {!loading && viewMode === 'table' && (
        <div style={{
          background: 'var(--md-sys-color-surface-container-low)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          borderRadius: '14px',
          overflow: 'hidden',
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔍</div>
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>{t('directory.no_results')}</div>
              <button onClick={clearFilters} className="btn-tonal" style={{ marginTop: '16px' }}>{t('directory.clear_filters')}</button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('name')}>
                      Name <SortIndicator field="name" />
                    </th>
                    <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('seat')}>
                      Seat <SortIndicator field="seat" />
                    </th>
                    <th>Type</th>
                    <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('party')}>
                      Party <SortIndicator field="party" />
                    </th>
                    <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('state')}>
                      State <SortIndicator field="state" />
                    </th>
                    <th>Status</th>
                    <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('year')}>
                      Year <SortIndicator field="year" />
                    </th>
                    <th title="Contact completeness">Contact</th>
                    <th style={{ width: '56px' }} />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((rep) => {
                    const seatCode = rep.federalSeatCode || rep.stateSeatCode
                    const seatName = rep.federalSeatName || rep.stateSeatName
                    const completeness = getContactCompleteness(rep)
                    const partyColor = getPartyColor(rep.party)
                    return (
                      <tr key={seatCode} style={{ cursor: 'pointer' }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                              background: `${partyColor}18`,
                              border: `1.5px solid ${partyColor}38`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.65rem', fontWeight: '700', color: partyColor,
                            }}>
                              {getInitials(rep.name)}
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{rep.name}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--md-sys-color-primary)', marginRight: '5px' }}>{seatCode}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--md-sys-color-on-surface-variant)' }}>{seatName}</span>
                        </td>
                        <td><span className={`badge badge-${rep.type?.toLowerCase()}`}>{rep.type}</span></td>
                        <td>
                          <span style={{
                            fontSize: '0.75rem', fontWeight: 700, padding: '3px 9px', borderRadius: '999px',
                            background: `${partyColor}18`, color: partyColor,
                          }}>
                            {rep.party}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--md-sys-color-on-surface-variant)' }}>{rep.state}</td>
                        <td><span className={`badge badge-${rep.status?.toLowerCase()}`}>{rep.status}</span></td>
                        <td>
                          {rep.electedYear ? (
                            <span style={{
                              fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
                              background: 'var(--md-sys-color-secondary-container)',
                              color: 'var(--md-sys-color-on-secondary-container)',
                            }}>
                              {rep.electedYear}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', opacity: 0.5 }}>—</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <div style={{
                              width: '40px', height: '4px', borderRadius: '2px',
                              background: 'var(--md-sys-color-surface-container-high)',
                              overflow: 'hidden',
                            }}>
                              <div style={{
                                height: '100%',
                                width: `${completeness}%`,
                                background: completeness >= 75
                                  ? 'var(--md-sys-color-tertiary)'
                                  : completeness >= 50
                                  ? 'var(--md-sys-color-primary)'
                                  : 'var(--md-sys-color-outline)',
                              }} />
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--md-sys-color-on-surface-variant)', fontVariantNumeric: 'tabular-nums' }}>{completeness}%</span>
                          </div>
                        </td>
                        <td>
                          <Link
                            to={`/profile/${seatCode}`}
                            style={{
                              fontSize: '0.75rem', fontWeight: 600,
                              color: 'var(--md-sys-color-on-primary-container)',
                              textDecoration: 'none',
                              padding: '4px 10px', borderRadius: '6px',
                              background: 'var(--md-sys-color-primary-container)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Grid view */}
      {!loading && viewMode === 'grid' && (
        <>
          {filtered.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔍</div>
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>{t('directory.no_results')}</div>
              <button onClick={clearFilters} className="btn-tonal" style={{ marginTop: '16px' }}>{t('directory.clear_filters')}</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
              {filtered.map((rep) => {
                const seatCode = rep.federalSeatCode || rep.stateSeatCode
                const seatName = rep.federalSeatName || rep.stateSeatName
                const completeness = getContactCompleteness(rep)
                const partyColor = getPartyColor(rep.party)
                return (
                  <Link key={seatCode} to={`/profile/${seatCode}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '11px', flexShrink: 0,
                          background: `${partyColor}18`,
                          border: `1.5px solid ${partyColor}38`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.78rem', fontWeight: '700', color: partyColor,
                        }}>
                          {getInitials(rep.name)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--md-sys-color-on-surface)' }}>
                            {rep.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '1px' }}>
                            <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>{seatCode}</span>
                            {seatName && <span> · {seatName}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end', flexShrink: 0 }}>
                          <span className={`badge badge-${rep.type?.toLowerCase()}`}>{rep.type}</span>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: '999px', background: `${partyColor}18`, color: partyColor }}>{rep.party}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>{rep.state}</span>
                          {rep.electedYear && (
                            <span style={{
                              fontSize: '0.68rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px',
                              background: 'var(--md-sys-color-secondary-container)',
                              color: 'var(--md-sys-color-on-secondary-container)',
                            }}>
                              {rep.electedYear}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'var(--md-sys-color-surface-container-high)', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${completeness}%`,
                              background: completeness >= 75 ? 'var(--md-sys-color-tertiary)' : completeness >= 50 ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)',
                            }} />
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--md-sys-color-on-surface-variant)', fontVariantNumeric: 'tabular-nums' }}>{completeness}%</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        @media (max-width: 640px) {
          .data-table th:nth-child(6),
          .data-table td:nth-child(6) { display: none; }
        }
      `}</style>
    </div>
  )
}
