import { useMemo, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useRepresentatives } from '../hooks/useRepresentatives.js'
import { matchesPerson, deriveFilterOptions } from '../lib/search.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useT } from '../i18n/LanguageContext.jsx'
import DecoBlob from '../components/DecoBlob.jsx'

export default function FindPage() {
  const t = useT()
  const { data, loading, error } = useRepresentatives()
  const [params, setParams] = useSearchParams()

  usePageMeta({ title: t('meta.find_title'), description: t('meta.find_desc') })

  const query  = params.get('q')      || ''
  const party  = params.get('party')  || ''
  const year   = params.get('year')   || ''
  const gender = params.get('gender') || ''
  const type   = params.get('type')   || ''
  const state  = params.get('state')  || ''

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const options = useMemo(() => deriveFilterOptions(data), [data])

  const placeholder = useMemo(() => {
    if (!data.length) return 'e.g. Hannah Yeoh, PAS, Padang Besar, P001…'
    const names   = data.map((p) => p.name).filter(Boolean)
    const parties = data.map((p) => p.party).filter(Boolean)
    const seats   = data.map((p) => p.federalSeatName).filter(Boolean)
    const codes   = data.map((p) => p.federalSeatCode).filter(Boolean)
    return `e.g. ${pickRandom(names)}, ${pickRandom(parties)}, ${pickRandom(seats)}, ${pickRandom(codes)}…`
  }, [data])

  const results = useMemo(() => {
    if (loading) return []
    return data.filter((person) => {
      if (type   && person.type          !== type)          return false
      if (party  && person.party         !== party)         return false
      if (year   && person.electedYear   !== Number(year))  return false
      if (gender && person.gender        !== gender)        return false
      if (state  && person.state         !== state)         return false
      if (query.trim()) return matchesPerson(person, query.toLowerCase().trim())
      return true
    })
  }, [data, loading, query, party, year, gender, type, state])

  const clearFilters = () => {
    const next = new URLSearchParams()
    if (query.trim()) next.set('q', query)
    setParams(next, { replace: true })
  }

  return (
    <>
      <FindHero t={t} />
      <SearchZone
        query={query}
        onQueryChange={(v) => setParam('q', v)}
        filters={{ party, year, gender, type, state }}
        options={options}
        onFilterChange={setParam}
        onClear={clearFilters}
        placeholder={placeholder}
        t={t}
      />

      <div className="results-area">
        {loading ? (
          <div className="empty-state">
            <p className="empty-state__title">{t('common.loading')}</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state__icon">⚠️</div>
            <p className="empty-state__title">{t('common.error')}</p>
            <p className="empty-state__body">{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <p className="empty-state__title">{t('search.no_results_title')}</p>
            <p className="empty-state__body">{t('search.no_results_body')}</p>
            <button type="button" className="btn btn--ghost" onClick={clearFilters}>{t('find.clear')}</button>
          </div>
        ) : (
          <>
            <header className="results-header">
              <p className="results-count">
                <strong>{results.length}</strong>{' '}
                {results.length === 1 ? 'representative' : 'representatives'}
              </p>
            </header>
            <ResultsList results={results} />
          </>
        )}
      </div>
    </>
  )
}

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

const SORT_COLS = ['name', 'party', 'seatName', 'state']
const COL_LABELS = { name: 'Name', party: 'Party', seatName: 'Constituency', state: 'State' }

/** Derive 2-letter initials from a name */
function getInitials(name) {
  if (!name) return '??'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Map party to a CSS modifier class */
function getPartyModifier(party) {
  if (!party) return 'other'
  const p = party.toUpperCase()
  if (p === 'PAS') return 'PAS'
  if (p === 'DAP') return 'DAP'
  if (p === 'UMNO') return 'UMNO'
  if (p === 'PKR') return 'PKR'
  if (p === 'BERSATU' || p === 'PPBM') return 'BERSATU'
  return 'other'
}

function ResultsList({ results }) {
  const [sort, setSort] = useState({ key: null, dir: 'asc' })

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'asc' }
      if (prev.dir === 'asc') return { key, dir: 'desc' }
      return { key: null, dir: 'asc' }
    })
  }

  const rows = useMemo(() => {
    const base = results.map((person) => ({
      id: person.type === 'MP'
        ? `${person.federalSeatCode}-mp`
        : `${person.federalSeatCode}-adun-${person.stateSeatCode}`,
      federalSeatCode: person.federalSeatCode,
      stateSeatCode: person.type === 'ADUN' ? (person.stateSeatCode || null) : null,
      seatCode: person.type === 'MP' ? person.federalSeatCode : person.stateSeatCode,
      seatName: person.type === 'MP' ? person.federalSeatName : person.stateSeatName,
      state: person.state,
      kind: person.type === 'MP' ? 'mp' : 'adun',
      name: person.name || null,
      party: person.party || null,
      href: person.type === 'ADUN'
        ? `/representative/${person.electedYear}/${person.federalSeatCode}/${person.stateSeatCode}`
        : `/representative/${person.electedYear}/${person.federalSeatCode}`,
    }))

    if (!sort.key) return base
    return [...base].sort((a, b) => {
      const va = a[sort.key] || ''
      const vb = b[sort.key] || ''
      const cmp = va.localeCompare(vb, undefined, { sensitivity: 'base' })
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [results, sort])

  return (
    <div className="table-wrap">
      <table className="rep-table">
        <thead>
          <tr>
            <th style={{ width: 52 }}></th>
            {SORT_COLS.map((col) => {
              const isActive = sort.key === col
              const arrow = isActive ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'
              return (
                <th
                  key={col}
                  className={isActive ? 'is-active' : ''}
                  onClick={() => toggleSort(col)}
                >
                  {COL_LABELS[col]} <span className="arrow">{arrow}</span>
                </th>
              )
            })}
            <th style={{ width: 80 }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <ResultRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ResultRow({ row }) {
  const isMP = row.kind === 'mp'
  const navigate = useNavigate()
  const partyMod = getPartyModifier(row.party)
  const initials = getInitials(row.name)

  return (
    <tr className="rep-table__row" onClick={() => navigate(row.href)}
      role="link" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(row.href) }}>
      <td>
        <span className={`mono mono--${partyMod}`}>{initials}</span>
      </td>
      <td>
        <div className="cell-name">
          <div>
            <span className="cell-name__text">{row.name || 'Not available'}</span>
            <span className="cell-name__sub">{isMP ? 'MP' : 'ADUN'}</span>
          </div>
        </div>
      </td>
      <td>
        <span className={`cell-party party--${partyMod}`}>{row.party || '—'}</span>
      </td>
      <td>
        <div className="cell-seat">
          <span className="code code--mp">{row.federalSeatCode}</span>
          {row.kind === 'adun' && (
            <span className="code code--adun">{row.stateSeatCode}</span>
          )}
          <span className="seat-name">{row.seatName}</span>
        </div>
      </td>
      <td>
        <span className="cell-state">
          <span className="cell-state__type">{isMP ? 'MP, ' : 'ADUN, '}</span>
          {row.state}
        </span>
      </td>
      <td>
        <Link to={row.href} className="cell-cta" onClick={(e) => e.stopPropagation()}>View</Link>
      </td>
    </tr>
  )
}

function FindHero({ t }) {
  return (
    <header className="page-hero bg-violet-light">
      <DecoBlob tone="violet" size={600} opacity={0.13} top={-220} right={-150} />
      <DecoBlob tone="gold"   size={250} opacity={0.15} bottom={-80} left="5%" />
      <p className="page-hero__eyebrow" style={{ color: 'var(--violet)' }}>{t('find.eyebrow')}</p>
      <h1 className="t-display page-hero__title">
        {t('find.title_lead')}
        <br />
        <span className="kw-violet">{t('find.title_kw')}</span>
      </h1>
      <p className="page-hero__sub">{t('find.sub')}</p>
    </header>
  )
}

function SearchZone({ query, onQueryChange, filters, options, onFilterChange, onClear, placeholder, t }) {
  return (
    <div className="search-zone">
      <div className="search-row">
        <div className="search-violet__wrap">
          <SearchIcon className="search-violet__icon" />
          <label htmlFor="find-search" className="sr-only">{t('search.placeholder')}</label>
          <input
            id="find-search"
            type="text"
            className="search-violet__input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="filters-row">
        <span className="filters-row__label">Filter</span>

        <select
          className={`filter-select ${filters.year ? 'is-active' : ''}`}
          aria-label={t('find.filter_year')}
          value={filters.year}
          onChange={(e) => onFilterChange('year', e.target.value)}
        >
          <option value="">{t('find.filter_year')}</option>
          {options.years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        <select
          className={`filter-select ${filters.type ? 'is-active' : ''}`}
          aria-label={t('find.filter_type')}
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
        >
          <option value="">{t('find.filter_type')}</option>
          <option value="MP">{t('find.type_mp')}</option>
          <option value="ADUN">{t('find.type_adun')}</option>
        </select>

        <select
          className={`filter-select ${filters.gender ? 'is-active' : ''}`}
          aria-label={t('find.filter_gender')}
          value={filters.gender}
          onChange={(e) => onFilterChange('gender', e.target.value)}
        >
          <option value="">{t('find.filter_gender')}</option>
          <option value="M">{t('find.gender_m')}</option>
          <option value="F">{t('find.gender_f')}</option>
        </select>

        <select
          className={`filter-select ${filters.party ? 'is-active' : ''}`}
          aria-label={t('find.filter_party')}
          value={filters.party}
          onChange={(e) => onFilterChange('party', e.target.value)}
        >
          <option value="">{t('find.filter_party')}</option>
          {options.parties.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          className={`filter-select ${filters.state ? 'is-active' : ''}`}
          aria-label={t('find.filter_state')}
          value={filters.state}
          onChange={(e) => onFilterChange('state', e.target.value)}
        >
          <option value="">{t('find.filter_state')}</option>
          {options.states.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <button type="button" className="filter-clear-btn" onClick={onClear}>{t('find.clear')}</button>
      </div>
    </div>
  )
}

function SearchIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}
