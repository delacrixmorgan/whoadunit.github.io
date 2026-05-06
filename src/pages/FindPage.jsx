import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
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

function SortIcon({ field, activeField, dir }) {
  if (activeField !== field) return <span style={{ opacity: 0.3, marginLeft: '4px' }}>↕</span>
  return <span style={{ marginLeft: '4px' }}>{dir === 'asc' ? '↑' : '↓'}</span>
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
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

function repKey(rep) {
  return rep.type === 'MP'
    ? `MP-${rep.electedYear}-${rep.federalSeatCode}`
    : `ADUN-${rep.electedYear}-${rep.federalSeatCode}-${rep.stateSeatCode}`
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

function individualSearch(flat, query, filters) {
  const q = query.trim().toLowerCase()
  return flat.filter(person => {
    if (filters.type && person.type !== filters.type) return false
    if (filters.party && person.party !== filters.party) return false
    if (filters.year && person.electedYear !== Number(filters.year)) return false
    if (filters.gender && person.gender !== filters.gender) return false
    if (filters.state && person.state !== filters.state) return false
    if (!q) return true
    return (
      matchesPerson(person, q) ||
      [person.federalSeatCode, person.federalSeatName, person.state]
        .some(s => s?.toLowerCase().includes(q))
    )
  })
}

// --- PersonRow (grid card) ---

function PersonRow({ rep }) {
  const navigate = useNavigate()
  const partyColor = getPartyColor(rep.party)
  const profilePath = rep.type === 'MP'
    ? `/profile/${rep.electedYear}/${rep.federalSeatCode}`
    : `/profile/${rep.electedYear}/${rep.federalSeatCode}/${rep.stateSeatCode}`
  const completeness = getContactCompleteness(rep)

  return (
    <div
      onClick={() => navigate(profilePath)}
      style={{
        display: 'flex', gap: '14px', alignItems: 'center',
        padding: '14px 18px',
        background: 'var(--md-sys-color-surface-container-low)',
        border: '1px solid var(--md-sys-color-outline-variant)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'border-color 0.12s, background 0.12s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--md-sys-color-primary)'
        e.currentTarget.style.background = 'var(--md-sys-color-surface-container)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--md-sys-color-outline-variant)'
        e.currentTarget.style.background = 'var(--md-sys-color-surface-container-low)'
      }}
    >
      {/* Avatar */}
      <div style={{
        width: '42px', height: '42px', borderRadius: '11px', flexShrink: 0,
        background: `${partyColor}18`, border: `1.5px solid ${partyColor}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.75rem', fontWeight: 700, color: partyColor,
      }}>
        {getInitials(rep.name)}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: '5px',
            background: rep.type === 'MP' ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-tertiary-container)',
            color: rep.type === 'MP' ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-tertiary-container)',
          }}>
            {rep.type}
          </span>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--md-sys-color-on-surface)' }}>
            {rep.name}
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
          <span style={{ color: partyColor, fontWeight: 600 }}>{rep.party}</span>
          {rep.federalSeatCode && (
            <span> · <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>{rep.federalSeatCode}</span> {rep.federalSeatName}</span>
          )}
          {rep.state && <span> · {rep.state}</span>}
        </div>
        {rep.electedYear && (
          <div style={{ fontSize: '0.72rem', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '2px' }}>
            Elected {rep.electedYear}
          </div>
        )}
      </div>

      {/* Right side: contact bar + link */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '40px', height: '4px', borderRadius: '2px',
            background: 'var(--md-sys-color-surface-container-high)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${completeness}%`,
              background: completeness >= 75 ? 'var(--md-sys-color-tertiary)'
                : completeness >= 50 ? 'var(--md-sys-color-primary)'
                : 'var(--md-sys-color-outline)',
            }} />
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--md-sys-color-on-surface-variant)', fontVariantNumeric: 'tabular-nums' }}>
            {completeness}%
          </span>
        </div>
        <Link
          to={profilePath}
          onClick={e => e.stopPropagation()}
          style={{
            fontSize: '0.72rem', fontWeight: 600, textDecoration: 'none',
            color: 'var(--md-sys-color-on-primary-container)',
            background: 'var(--md-sys-color-primary-container)',
            padding: '4px 10px', borderRadius: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          View →
        </Link>
      </div>
    </div>
  )
}

// --- Page ---

export default function FindPage() {
  usePageMeta({
    title: 'Find — Whoadunit',
    description: 'Browse and filter Malaysian MPs and ADUNs by name, party, year, or gender.',
  })

  const { data, loading } = useRepresentatives()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [query, setQuery]           = useState(searchParams.get('q') || '')
  const [partyFilter, setParty]     = useState(searchParams.get('party') || '')
  const [yearFilter, setYear]       = useState(searchParams.get('year') || '')
  const [genderFilter, setGender]   = useState(searchParams.get('gender') || '')
  const [stateFilter, setState]     = useState(searchParams.get('state') || '')
  const [typeFilter, setType]       = useState(searchParams.get('type') || '')
  const [viewMode, setViewMode]     = useState(searchParams.get('view') || 'table')
  const [sortField, setSortField]   = useState(null)
  const [sortDir, setSortDir]       = useState('asc')

  function handleSort(field) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const parties = useMemo(() => [...new Set(data.map(r => r.party).filter(Boolean))].sort(), [data])
  const years   = useMemo(() => [...new Set(data.map(r => r.electedYear).filter(Boolean))].sort((a, b) => b - a), [data])
  const states  = useMemo(() => [...new Set(data.map(r => r.state).filter(Boolean))].sort(), [data])
  const genders = [{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }]

  const results = useMemo(() =>
    individualSearch(data, query, { type: typeFilter, party: partyFilter, year: yearFilter, gender: genderFilter, state: stateFilter }),
    [data, query, typeFilter, partyFilter, yearFilter, genderFilter, stateFilter]
  )

  const sortedResults = useMemo(() => {
    if (!sortField) return results
    return [...results].sort((a, b) => {
      let av, bv
      if (sortField === 'seat') {
        av = a.type === 'MP' ? a.federalSeatCode : a.stateSeatCode
        bv = b.type === 'MP' ? b.federalSeatCode : b.stateSeatCode
      } else if (sortField === 'contact') {
        av = getContactCompleteness(a)
        bv = getContactCompleteness(b)
      } else {
        av = a[sortField]
        bv = b[sortField]
      }
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [results, sortField, sortDir])

  // Sync state → URL params
  useEffect(() => {
    const params = {}
    if (query) params.q = query
    if (typeFilter) params.type = typeFilter
    if (partyFilter) params.party = partyFilter
    if (yearFilter) params.year = yearFilter
    if (genderFilter) params.gender = genderFilter
    if (stateFilter) params.state = stateFilter
    if (viewMode !== 'table') params.view = viewMode
    setSearchParams(params, { replace: true })
  }, [query, typeFilter, partyFilter, yearFilter, genderFilter, stateFilter, viewMode])

  const clearFilters = () => {
    setQuery(''); setType(''); setParty(''); setYear(''); setGender(''); setState('');
  }

  const hasFilters = query || typeFilter || partyFilter || yearFilter || genderFilter || stateFilter

  return (
    <div className="page-enter" style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 24px 80px' }}>

      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 6px' }}>{t('find.title')}</h1>
        <p style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
          {t('find.subtitle')}
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
        {/* Search input */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--md-sys-color-outline)', pointerEvents: 'none',
          }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder={t('find.search_placeholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
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
              boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--md-sys-color-primary)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--md-sys-color-outline-variant)' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)' }}>
            Filter:
          </span>

          <select value={typeFilter} onChange={e => setType(e.target.value)} style={selectStyle}>
            <option value="">All Types</option>
            <option value="MP">MP</option>
            <option value="ADUN">ADUN</option>
          </select>

          <select value={partyFilter} onChange={e => setParty(e.target.value)} style={selectStyle}>
            <option value="">{t('find.filter_party')}</option>
            {parties.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <select value={stateFilter} onChange={e => setState(e.target.value)} style={selectStyle}>
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={yearFilter} onChange={e => setYear(e.target.value)} style={selectStyle}>
            <option value="">{t('find.filter_year')}</option>
            {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
          </select>

          <select value={genderFilter} onChange={e => setGender(e.target.value)} style={selectStyle}>
            <option value="">{t('find.filter_gender')}</option>
            {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className="btn-outline" style={{ padding: '7px 12px', fontSize: '0.78rem', minHeight: '36px' }}>
              Clear filters
            </button>
          )}

          {/* View toggle */}
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
              <span style={{ fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>{sortedResults.length}</span>
              {' representative'}{sortedResults.length !== 1 ? 's' : ''} found
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
          {sortedResults.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔍</div>
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>{t('find.no_results')}</div>
              {hasFilters && (
                <button onClick={clearFilters} className="btn-tonal" style={{ marginTop: '16px' }}>Clear filters</button>
              )}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    {[
                      ['name', 'Name'],
                      ['seat', 'Seat'],
                      ['type', 'Type'],
                      ['party', 'Party'],
                      ['state', 'State'],
                      ['electedYear', 'Year'],
                      ['contact', 'Contact'],
                    ].map(([field, label]) => (
                      <th
                        key={field}
                        onClick={() => handleSort(field)}
                        title={field === 'contact' ? 'Contact completeness' : undefined}
                        style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                      >
                        {label}<SortIcon field={field} activeField={sortField} dir={sortDir} />
                      </th>
                    ))}
                    <th style={{ width: '56px' }} />
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((rep) => {
                    const seatCode = rep.type === 'MP' ? rep.federalSeatCode : rep.stateSeatCode
                    const seatName = rep.type === 'MP' ? rep.federalSeatName : (rep.stateSeatName || rep.federalSeatName)
                    const completeness = getContactCompleteness(rep)
                    const partyColor = getPartyColor(rep.party)
                    const rowKey = repKey(rep)
                    const profilePath = rep.type === 'MP'
                      ? `/profile/${rep.electedYear}/${rep.federalSeatCode}`
                      : `/profile/${rep.electedYear}/${rep.federalSeatCode}/${rep.stateSeatCode}`
                    return (
                      <tr key={rowKey} style={{ cursor: 'pointer' }} onClick={() => navigate(profilePath)}>
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
                            to={profilePath}
                            onClick={e => e.stopPropagation()}
                            style={{
                              fontSize: '0.75rem', fontWeight: 600,
                              color: 'var(--md-sys-color-on-primary-container)',
                              textDecoration: 'none',
                              padding: '4px 10px', borderRadius: '6px',
                              background: 'var(--md-sys-color-primary-container)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            View →
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
          {sortedResults.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔍</div>
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>{t('find.no_results')}</div>
              {hasFilters && (
                <button onClick={clearFilters} className="btn-tonal" style={{ marginTop: '16px' }}>Clear filters</button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {sortedResults.map(rep => {
                return <PersonRow key={repKey(rep)} rep={rep} />
              })}
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        @media (max-width: 640px) {
          .data-table th:nth-child(5),
          .data-table td:nth-child(5) { display: none; }
        }
      `}</style>
    </div>
  )
}
