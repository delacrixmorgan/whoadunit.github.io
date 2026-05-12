import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useRepresentatives, getContactCompleteness } from '../hooks/useRepresentatives.js'
import { groupSearch, getRandomTips } from '../lib/search.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useT } from '../i18n/LanguageContext.jsx'
import StepPill from '../components/StepPill.jsx'
import RepCard from '../components/RepCard.jsx'
import ContactCard from '../components/ContactCard.jsx'
import ExplainerPanel from '../components/ExplainerPanel.jsx'
import StatBlock from '../components/StatBlock.jsx'
import DiffGrid from '../components/DiffGrid.jsx'
import DecoBlob from '../components/DecoBlob.jsx'
import Reveal from '../components/Reveal.jsx'
import CopyButton from '../components/CopyButton.jsx'

const SUGGESTION_LIMIT = 6

const EMAIL_TEMPLATE = `Dear YB [Representative Name],

I am writing concerning [the issue]. [One paragraph stating what's happening and why it concerns me.]

I have lived in [your area] for [some time]. [Why this matters to you personally.]

[Your specific ask — what you want them to do.]

A reply to these key questions will be highly appreciated.

Sincerely,
[Your name]`

const EMAIL_BLOCKS = [
  { label: '01 · Greeting',  hint: 'Address the rep with their title and name.',                          example: 'Dear YB [Representative Name],' },
  { label: '02 · The issue', hint: 'State the topic and your concern in one paragraph.',                  example: 'I am writing concerning [the issue]. [What\'s happening and why it matters.]' },
  { label: '03 · Your story',hint: 'Make it personal. Why does this matter to you?',                       example: 'I have lived in [area] for [years]. [Personal stake — family, work, daily life.]' },
  { label: '04 · Your ask',  hint: 'Be specific about what you want them to do.',                          example: '[One clear request — vote against, raise in parliament, pressure the minister.]' },
  { label: '05 · Sign off',  hint: 'Optional thanks, questions, or a request for a reply. Always sign your name.', example: 'A reply to these key questions will be highly appreciated.\n\nSincerely,\n[Your name]' },
]

export default function HomePage() {
  const { seats, loading } = useRepresentatives()
  const [params, setParams] = useSearchParams()
  const t = useT()

  usePageMeta({ title: t('meta.home_title'), description: t('meta.home_desc') })

  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const dropdownRef = useRef(null)

  const seatCode = params.get('seat')
  const selectedSeat = useMemo(
    () => seats.find((s) => s.federalSeatCode === seatCode) || null,
    [seats, seatCode],
  )

  const tips = useMemo(() => getRandomTips(seats), [seats])

  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    return groupSearch(seats, query).slice(0, SUGGESTION_LIMIT)
  }, [seats, query])

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!seatCode || loading) return
    const el = document.getElementById('s2')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [seatCode, loading])

  const handleSelect = (code) => {
    setParams({ seat: code }, { replace: false })
    setShowSuggestions(false)
    setQuery('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (suggestions[0]) handleSelect(suggestions[0].seat.federalSeatCode)
  }

  return (
    <>
      <Step1Search
        query={query}
        onQueryChange={(v) => { setQuery(v); setShowSuggestions(true) }}
        onSubmit={handleSubmit}
        onSelect={handleSelect}
        onFocus={() => setShowSuggestions(true)}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        dropdownRef={dropdownRef}
        tips={tips}
        t={t}
      />

      {selectedSeat && (
        <>
          <SectionDivider seat={selectedSeat} />
          <Step2Mp seat={selectedSeat} t={t} />
          <Step3Aduns seat={selectedSeat} t={t} />
          <Step4Contact seat={selectedSeat} t={t} />
          <Step5Share seat={selectedSeat} t={t} />
        </>
      )}

      {!selectedSeat && !loading && (
        <SuggestedExplorationStrip onSelect={handleSelect} seats={seats} />
      )}
    </>
  )
}

function Step1Search({
  query, onQueryChange, onSubmit, onSelect, onFocus,
  suggestions, showSuggestions, dropdownRef, tips, t,
}) {
  return (
    <section className="step-search" id="s1">
      <DecoBlob tone="rose" size={520} opacity={0.18} top={-200} right={-100} />
      <DecoBlob tone="gold" size={280} opacity={0.16} bottom={-80} left="6%" />

      <StepPill tone="rose" num={1}>{t('home.step1')}</StepPill>

      <h1 className="t-display" style={{ marginTop: '1.5rem' }}>
        {t('home.title_lead')}
        <br />
        <span className="kw-rose">{t('home.title_kw')}</span>
      </h1>
      <p className="page-hero__sub" style={{ marginTop: '1.5rem' }}>{t('home.sub')}</p>

      <form className="search-rose" onSubmit={onSubmit} ref={dropdownRef}>
        <label htmlFor="home-search" className="sr-only">{t('search.placeholder')}</label>
        <div className="search-rose__form">
          <div className="search-rose__wrap">
            <SearchIcon className="search-rose__icon" />
            <input
              id="home-search"
              type="text"
              className="search-rose__input"
              placeholder={t('search.placeholder')}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={onFocus}
              autoComplete="off"
            />
          </div>
          <button type="submit" className="search-rose__btn">{t('search.button')}</button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="search-dropdown" role="listbox">
            {suggestions.map(({ seat }) => (
              <button
                key={seat.federalSeatCode}
                type="button"
                role="option"
                aria-selected="false"
                className="search-suggestion"
                onClick={() => onSelect(seat.federalSeatCode)}
              >
                <span className="search-suggestion__code">{seat.federalSeatCode}</span>
                <strong>{seat.federalSeatName}</strong>
                <span className="search-suggestion__meta"> · {seat.state}</span>
              </button>
            ))}
          </div>
        )}
        {showSuggestions && query.trim() && suggestions.length === 0 && (
          <div className="search-dropdown">
            <div className="search-suggestion__empty">No matches. Try a place, party, or seat code like P001.</div>
          </div>
        )}
      </form>

      {tips.length > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="t-label" style={{ color: 'var(--ink-faint)' }}>{t('search.quick_label')}:</span>
          {tips.map((tip, i) => (
            <button
              key={tip}
              type="button"
              className="prompt-tip"
              style={{ '--tip-i': i }}
              onClick={() => { onQueryChange(tip); onFocus(); }}
            >{tip}</button>
          ))}
        </div>
      )}
    </section>
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

function SectionDivider({ seat }) {
  return (
    <div className="section-divider">
      <div className="section-divider__num" style={{ background: 'var(--rose)', color: 'white' }}>📍</div>
      <div>
        <div className="section-divider__text">
          Showing results for <strong>{seat.federalSeatName}</strong>
        </div>
        <div className="section-divider__sub">
          {seat.federalSeatCode} · {seat.state}
        </div>
      </div>
    </div>
  )
}

function Step2Mp({ seat, t }) {
  return (
    <section className="step-section step-section--leaf" id="s2">
      <DecoBlob tone="leaf" size={500} opacity={0.14} top={-180} right={-100} />
      <div className="section-inner">
        <StepPill tone="leaf" num={2}>{t('home.step2')}</StepPill>
        <Reveal>
          <h2 className="t-headline" style={{ marginTop: '1.5rem' }}>
            Meet your<br />
            <span className="kw-leaf">Member of Parliament</span>
          </h2>
        </Reveal>

        <div style={{ marginTop: '2rem' }}>
          {seat.mp ? (
            <Reveal><RepCard person={seat.mp} kind="mp" /></Reveal>
          ) : (
            <p className="contact-row__missing" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--r-card)' }}>
              MP data not yet available for this constituency.
            </p>
          )}
        </div>

        <Reveal delay={1} style={{ display: 'block', marginTop: '1.75rem' }}>
          <ExplainerPanel
            question="What does your MP do?"
            answer="Your MP votes on national laws at Parliament in Kuala Lumpur. They raise questions directly to ministers and shape policy that affects every Malaysian — not just your area."
            chips={[
              { tone: 'rose',   label: '🧾 GST & national tax' },
              { tone: 'leaf',   label: '🏫 Education curriculum' },
              { tone: 'violet', label: '📶 Internet regulation' },
              { tone: 'gold',   label: '⚖️ Federal crime law' },
            ]}
          />
        </Reveal>

        <Reveal delay={2} style={{ display: 'block', marginTop: '2rem', maxWidth: 480 }}>
          <StatBlock
            tone="gold"
            label="Did you know?"
            num="222"
            caption="MPs represent Malaysia's 222 federal constituencies in Dewan Rakyat."
          />
        </Reveal>
      </div>
    </section>
  )
}

function Step3Aduns({ seat, t }) {
  const aduns = seat.aduns || []
  const isFT = aduns.length === 0

  return (
    <section className="step-section step-section--violet" id="s3">
      <DecoBlob tone="violet" size={550} opacity={0.14} top={-200} right={-120} />
      <div className="section-inner">
        <StepPill tone="violet" num={3}>{t('home.step3')}</StepPill>
        <Reveal>
          <h2 className="t-headline" style={{ marginTop: '1.5rem' }}>
            Meet your<br />
            <span className="kw-violet">State Assembly Members</span>
          </h2>
        </Reveal>

        {isFT ? (
          <Reveal delay={1} style={{ display: 'block', marginTop: '2rem' }}>
            <div className="explainer-panel">
              <h3 className="explainer-panel__q">Federal Territory — no state assembly</h3>
              <p className="explainer-panel__a">
                {seat.federalSeatName} is in a Federal Territory (KL, Putrajaya, or Labuan), which is administered by the federal government rather than a state. There are no ADUNs here — your MP handles both federal and local matters.
              </p>
            </div>
          </Reveal>
        ) : (
          <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
            {aduns.map((adun, i) => (
              <Reveal key={`${adun.federalSeatCode}-${adun.stateSeatCode}`} delay={Math.min(i + 1, 3)}>
                <RepCard person={adun} kind="adun" />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={2} style={{ display: 'block', marginTop: '1.75rem' }}>
          <ExplainerPanel
            question="What does your ADUN do?"
            answer="Your ADUN sits in the state assembly and handles local governance — the neighbourhood-level things you actually see and feel every day."
            chips={[
              { tone: 'rose',   label: '🚰 Blocked drains' },
              { tone: 'leaf',   label: '🌳 Park & road maintenance' },
              { tone: 'violet', label: '🏗️ Local development' },
              { tone: 'gold',   label: '📋 State land matters' },
            ]}
          />
        </Reveal>

        {!isFT && (
          <Reveal delay={3} style={{ display: 'block', marginTop: '2rem' }}>
            <DiffGrid mp={seat.mp} adun={aduns[0]} />
          </Reveal>
        )}
      </div>
    </section>
  )
}

function Step4Contact({ seat, t }) {
  const reps = [seat.mp, ...(seat.aduns || [])].filter(Boolean)
  const overall = reps.length === 0
    ? 0
    : Math.round(reps.reduce((s, r) => s + getContactCompleteness(r), 0) / reps.length)

  return (
    <section className="step-section step-section--gold" id="s4">
      <DecoBlob tone="gold" size={500} opacity={0.14} top={-180} right={-100} />
      <div className="section-inner section-inner--wide">
        <StepPill tone="gold" num={4}>{t('home.step4')}</StepPill>
        <Reveal>
          <h2 className="t-headline" style={{ marginTop: '1.5rem' }}>
            Now <span className="kw-gold">contact them</span>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="t-body" style={{ color: 'var(--ink-soft)', margin: '1rem 0 2rem' }}>
            Copy what you need. Then actually send that message. Your representative is accountable to you — not the other way around.
          </p>
        </Reveal>

        <div className="contact-grid">
          <div className="contact-grid__col contact-grid__col--cards">
            {seat.mp && <Reveal style={{ display: 'block' }}><ContactCard person={seat.mp} kind="mp" /></Reveal>}
            {(seat.aduns || []).map((adun) => (
              <Reveal key={`${adun.federalSeatCode}-${adun.stateSeatCode}`} delay={1} style={{ display: 'block' }}>
                <ContactCard person={adun} kind="adun" />
              </Reveal>
            ))}

            <Reveal delay={2} style={{ display: 'block' }}>
              <div className="completeness">
                <div className="completeness__row">
                  <div>
                    <div className="completeness__label">Profile completeness for {seat.federalSeatName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-faint)', marginTop: '0.25rem' }}>
                      Across {reps.length} representative{reps.length === 1 ? '' : 's'}
                    </div>
                  </div>
                  <span className="completeness__pct">{overall}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${overall}%` }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '1.25rem' }}>
                  {reps.map((r) => (
                    <RepScoreRow key={`${r.type}-${r.stateSeatCode}-${r.name}`} rep={r} />
                  ))}
                </div>
                <p className="completeness__copy" style={{ marginTop: '1rem' }}>
                  Spotted something missing?{' '}
                  <Link to="/volunteer" style={{ color: 'var(--rose)', fontWeight: 700 }}>Suggest a correction →</Link>
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={2} style={{ display: 'block' }}>
            <aside className="email-template" aria-label="Sample email template">
              <div className="email-template__topbar" />
              <div className="email-template__head">
                <div className="email-template__icon" aria-hidden="true">✉️</div>
                <div>
                  <div className="email-template__eyebrow">Sample email</div>
                  <div className="email-template__title">Stuck? Borrow this template.</div>
                </div>
              </div>
              <ol className="email-template__blocks">
                {EMAIL_BLOCKS.map((b) => (
                  <li className="etb" key={b.label}>
                    <div className="etb__label">{b.label}</div>
                    <div className="etb__hint">{b.hint}</div>
                    <div className="etb__example">{b.example}</div>
                  </li>
                ))}
              </ol>
              <div className="email-template__btn-row">
                <CopyButton value={EMAIL_TEMPLATE} label="Copy template" copiedLabel="✓ Copied template" />
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function RepScoreRow({ rep }) {
  const pct = getContactCompleteness(rep)
  const tone = pct >= 75 ? 'leaf' : pct >= 50 ? '' : 'rose'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, flex: '0 0 auto', minWidth: 84 }}>
        {rep.type === 'MP' ? 'MP' : `ADUN ${rep.stateSeatCode}`}
      </span>
      <div className="bar-track" style={{ flex: 1, height: 6 }}>
        <div className={`bar-fill ${tone ? `bar-fill--${tone}` : ''}`} style={{ width: `${pct}%` }} />
      </div>
      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold)', minWidth: 36, textAlign: 'right' }}>{pct}%</span>
    </div>
  )
}

function Step5Share({ seat }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Find out who represents you in Malaysia — ${seat.federalSeatName} (${seat.federalSeatCode}). Whoadunit.`

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="step-section step-section--paper" id="s5">
      <div className="section-inner">
        <StepPill tone="rose" num={5}>SPREAD THE WORD</StepPill>
        <Reveal style={{ display: 'block', marginTop: '2rem' }}>
          <div className="share-card">
            <span className="share-card__blob" aria-hidden="true" />
            <h3>Now share it with<br />the people around you.</h3>
            <p>You now know who represents you. Most Malaysians still don't. A message from you is more powerful than any campaign. Share Whoadunit and help build a more accountable democracy.</p>
            <div className="share-card__btns">
              <button type="button" className="btn btn--white" onClick={handleWhatsApp}>
                Share on WhatsApp
              </button>
              <CopyButton value={shareUrl} label="Copy link" copiedLabel="✓ Link copied" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={1} style={{ display: 'block', marginTop: '3rem' }}>
          <p className="t-label" style={{ color: 'var(--ink-faint)', marginBottom: '1rem' }}>Want to go deeper?</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link className="btn btn--ghost" to="/learn">Full civic explainer →</Link>
            <Link className="btn btn--ghost" to="/volunteer">Help improve the data →</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function SuggestedExplorationStrip({ onSelect, seats }) {
  const featured = ['P001', 'P104', 'P051', 'P124', 'P148']
    .map((code) => seats.find((s) => s.federalSeatCode === code))
    .filter(Boolean)
  if (featured.length === 0) return null

  return (
    <section className="section bg-paper">
      <div className="section-inner section-inner--wide">
        <p className="t-label" style={{ color: 'var(--ink-faint)', marginBottom: '0.875rem' }}>
          Or explore a few seats
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {featured.map((s) => (
            <button
              key={s.federalSeatCode}
              type="button"
              onClick={() => onSelect(s.federalSeatCode)}
              className="prompt-tip"
            >
              <strong>{s.federalSeatCode}</strong> {s.federalSeatName} · {s.state}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
