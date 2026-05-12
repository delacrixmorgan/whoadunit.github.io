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

const SORT_COLS = ['type', 'name', 'party', 'seatName', 'state']
const COL_LABELS = { type: 'Type', name: 'Name', party: 'Party', seatName: 'Seat Name', state: 'State' }

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
      seatName: person.type === 'MP' ? person.federalSeatName : person.stateSeatName,
      state: person.state,
      kind: person.type === 'MP' ? 'mp' : 'adun',
      name: person.name || null,
      party: person.party || null,
      href: `/seat/${person.federalSeatCode}`,
    }))

    if (!sort.key) return base
    return [...base].sort((a, b) => {
      if (sort.key === 'type') {
        const va = a.kind === 'mp' ? 0 : 1
        const vb = b.kind === 'mp' ? 0 : 1
        return sort.dir === 'asc' ? va - vb : vb - va
      }
      const va = a[sort.key] || ''
      const vb = b[sort.key] || ''
      const cmp = va.localeCompare(vb, undefined, { sensitivity: 'base' })
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [results, sort])

  return (
    <ul className="result-list" role="list">
      <li className="result-list__header" aria-hidden="true">
        {SORT_COLS.map((col) => {
          const isActive = sort.key === col
          const arrow = isActive ? (sort.dir === 'asc' ? '↑' : '↓') : null
          return (
            <button
              key={col}
              type="button"
              className={`result-list__header-cell ${isActive ? 'is-active' : ''}`}
              onClick={() => toggleSort(col)}
            >
              {COL_LABELS[col]}
              <span className={`sort-indicator ${isActive ? 'sort-indicator--active' : ''}`}>
                {arrow || '↕'}
              </span>
            </button>
          )
        })}
        <span className="result-list__header-cell result-list__header-cell--spacer" />
      </li>
      {rows.map((row) => (
        <ResultRow key={row.id} row={row} />
      ))}
    </ul>
  )
}

function ResultRow({ row }) {
  const isMP = row.kind === 'mp'
  const navigate = useNavigate()
  return (
    <li className="result-row" onClick={() => navigate(row.href)} role="link" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(row.href) }}>
      <span className={`person-badge person-badge--${row.kind}`}>
        {isMP ? 'MP' : 'ADUN'}
      </span>

      {row.name ? (
        <span className="result-row__rep-name">{row.name}</span>
      ) : (
        <span className="result-row__rep-missing">Not available</span>
      )}

      <span className="result-row__party">{row.party || '—'}</span>

      <span className="result-row__seat">
        <span className="result-row__codes">
          <span className="result-row__code result-row__code--mp">{row.federalSeatCode}</span>
          {row.stateSeatCode && (
            <span className="result-row__code result-row__code--adun">{row.stateSeatCode}</span>
          )}
        </span>
        <span className="result-row__name">{row.seatName}</span>
      </span>

      <span className="result-row__state">{row.state}</span>

      <Link to={row.href} className="result-row__cta" onClick={(e) => e.stopPropagation()}>View</Link>
    </li>
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
