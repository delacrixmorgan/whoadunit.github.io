import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useRepresentatives } from '../hooks/useRepresentatives.js'
import { individualSearch, deriveFilterOptions } from '../lib/search.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useT } from '../i18n/LanguageContext.jsx'
import SeatCard from '../components/SeatCard.jsx'
import DecoBlob from '../components/DecoBlob.jsx'

const QUICK_TIPS = ['Padang Besar', 'Hannah Yeoh', 'PAS', 'Selangor', 'P051']

export default function FindPage() {
  const t = useT()
  const { seats, data, loading, error } = useRepresentatives()
  const [params, setParams] = useSearchParams()

  usePageMeta({ title: t('meta.find_title'), description: t('meta.find_desc') })

  const query  = params.get('q')      || ''
  const party  = params.get('party')  || ''
  const year   = params.get('year')   || ''
  const gender = params.get('gender') || ''
  const type   = params.get('type')   || ''

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const options = useMemo(() => deriveFilterOptions(data), [data])

  const isPristine = !query.trim() && !party && !year && !gender && !type

  const results = useMemo(() => {
    if (loading || isPristine) return []
    return individualSearch(seats, query, {
      party: party || undefined,
      electedYear: year ? Number(year) : undefined,
      gender: gender || undefined,
      type: type || undefined,
    })
  }, [seats, loading, isPristine, query, party, year, gender, type])

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
        filters={{ party, year, gender, type }}
        options={options}
        onFilterChange={setParam}
        onClear={clearFilters}
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
        ) : isPristine ? (
          <PromptState onPick={(v) => setParam('q', v)} t={t} />
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
                {results.length === 1 ? 'constituency' : 'constituencies'} match
              </p>
            </header>

            {results.map(({ seat, mpMatched, matchedAdunIndices, matchedIn }) => (
              <SeatCard
                key={seat.federalSeatCode}
                seat={seat}
                showMpTab={mpMatched}
                visibleAdunIndices={matchedAdunIndices}
                defaultTab={matchedIn === 'adun' ? 'adun' : 'mp'}
              />
            ))}
          </>
        )}
      </div>
    </>
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

function SearchZone({ query, onQueryChange, filters, options, onFilterChange, onClear, t }) {
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
            placeholder="e.g. Padang Besar, P001, Hannah Yeoh, PAS…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="filters-row">
        <span className="filters-row__label">Filter</span>

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
          className={`filter-select ${filters.year ? 'is-active' : ''}`}
          aria-label={t('find.filter_year')}
          value={filters.year}
          onChange={(e) => onFilterChange('year', e.target.value)}
        >
          <option value="">{t('find.filter_year')}</option>
          {options.years.map((y) => <option key={y} value={y}>{y}</option>)}
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
          className={`filter-select ${filters.type ? 'is-active' : ''}`}
          aria-label={t('find.filter_type')}
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
        >
          <option value="">{t('find.filter_type')}</option>
          <option value="MP">{t('find.type_mp')}</option>
          <option value="ADUN">{t('find.type_adun')}</option>
        </select>

        <button type="button" className="filter-clear-btn" onClick={onClear}>{t('find.clear')}</button>
      </div>
    </div>
  )
}

function PromptState({ onPick, t }) {
  return (
    <div className="prompt-state">
      <div style={{ textAlign: 'center', maxWidth: 540 }}>
        <p className="t-label" style={{ color: 'var(--violet)', marginBottom: '0.875rem' }}>Start here</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '0.625rem' }}>
          {t('search.prompt_title')}
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
          {t('search.prompt_body')}
        </p>
      </div>

      <div className="prompt-divider">or try</div>

      <div>
        <p className="prompt-tips__heading">Quick searches</p>
        <div className="prompt-tips">
          {QUICK_TIPS.map((tip) => (
            <button key={tip} type="button" className="prompt-tip" onClick={() => onPick(tip)}>{tip}</button>
          ))}
        </div>
      </div>

      <Link to="/" className="walkthrough-cta-link" style={{ textDecoration: 'none' }}>
        <div className="walkthrough-cta">
          <span className="walkthrough-cta__blob" aria-hidden="true" />
          <p className="walkthrough-cta__eyebrow">New here?</p>
          <h3 className="walkthrough-cta__title">Take the guided walkthrough →</h3>
          <p className="walkthrough-cta__sub">A 5-step tour that finds your area, your MP, your ADUNs, and how to reach them.</p>
        </div>
      </Link>
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
