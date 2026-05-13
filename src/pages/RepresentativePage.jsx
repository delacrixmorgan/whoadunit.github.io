import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRepresentatives } from '../hooks/useRepresentatives.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import DecoBlob from '../components/DecoBlob.jsx'
import CopyButton from '../components/CopyButton.jsx'
import ContactCard from '../components/ContactCard.jsx'

// ─── Email templates ──────────────────────────────────────────────────────────

const MP_TEMPLATES = [
  {
    emoji: '🧾',
    topic: 'Cost of Living & Taxes',
    hint: 'Rising prices, GST/SST concerns, household expenses.',
    text: (name, seat) =>
      `Dear YB ${name},\n\nI am writing to express concern about the rising cost of living affecting families in ${seat}.\n\nSince [recent policy/price change], my household has experienced [specific impact — groceries, fuel, utility bills].\n\nI urge you to raise this issue in Parliament and push for [specific measure — tax relief, subsidy review, price cap].\n\nA reply to these questions will be highly appreciated.\n\nSincerely,\n[Your name]`,
  },
  {
    emoji: '🏫',
    topic: 'Education Policy',
    hint: 'Curriculum changes, school funding, university access.',
    text: (name, seat) =>
      `Dear YB ${name},\n\nI am a [parent/student/teacher] in ${seat} and I am writing regarding [specific education issue].\n\nThe recent [policy/change] has affected [who and how].\n\nI would like you to [raise this in Parliament / question the Minister of Education / advocate for...].\n\nA reply will be much appreciated.\n\nSincerely,\n[Your name]`,
  },
  {
    emoji: '📶',
    topic: 'Internet & Digital Access',
    hint: 'Broadband coverage, digital equity, online services.',
    text: (name, seat) =>
      `Dear YB ${name},\n\nI am writing about inadequate internet connectivity in [area within ${seat}].\n\nResidents here face [slow speeds / no coverage / unaffordable plans], which affects [work / school / daily services].\n\nI urge you to raise this with MCMC and push for [rural broadband expansion / affordable data plans].\n\nSincerely,\n[Your name]`,
  },
  {
    emoji: '⚕️',
    topic: 'Healthcare Access',
    hint: 'Hospital capacity, medicine shortages, rural clinics.',
    text: (name, seat) =>
      `Dear YB ${name},\n\nI am writing to raise concerns about healthcare access in ${seat}, specifically [long waiting times / medicine shortage / lack of specialists].\n\nThis affects [elderly residents / children / chronic illness patients] in our community.\n\nI request that you bring this matter to the Health Ministry and advocate for [specific remedy].\n\nSincerely,\n[Your name]`,
  },
  {
    emoji: '⚖️',
    topic: 'Law & Public Safety',
    hint: 'Federal crime law, police presence, justice issues.',
    text: (name, seat) =>
      `Dear YB ${name},\n\nI am concerned about [specific safety/legal issue] in our constituency.\n\n[Describe the situation and its impact on residents.]\n\nI urge you to [raise in Parliament / push for law reform / request increased police presence].\n\nSincerely,\n[Your name]`,
  },
]

const ADUN_TEMPLATES = [
  {
    emoji: '🚰',
    topic: 'Blocked Drain or Flooding',
    hint: 'Monsoon drain, flash flood, waterlogged road.',
    text: (name, seat) =>
      `Dear YB ${name},\n\nI am a resident of [your area] in ${seat} and I am writing about a blocked drain at [location].\n\nThe blockage has caused [flooding / mosquito breeding / road damage] and has been unresolved for [duration].\n\nI request that you arrange for the drain to be cleared and inspected regularly.\n\nSincerely,\n[Your name]`,
  },
  {
    emoji: '🛣️',
    topic: 'Road Damage or Potholes',
    hint: 'Potholes, cracked pavement, unlit roads.',
    text: (name, seat) =>
      `Dear YB ${name},\n\nI am writing to report a road condition issue at [specific road / junction / area].\n\nThe [pothole / damaged surface / missing signage] poses a danger to [motorists / cyclists / pedestrians] and has been present for [duration].\n\nI urge you to escalate this to the relevant authority and arrange for repair.\n\nSincerely,\n[Your name]`,
  },
  {
    emoji: '🌳',
    topic: 'Park or Green Space',
    hint: 'Neglected parks, broken facilities, tree trimming.',
    text: (name, seat) =>
      `Dear YB ${name},\n\nI am writing about the condition of [park name / public space] in [area].\n\nThe facility has [broken equipment / overgrown grass / no lighting] which makes it unsafe, especially for children.\n\nI request that maintenance be arranged as soon as possible.\n\nSincerely,\n[Your name]`,
  },
  {
    emoji: '💡',
    topic: 'Street Lighting',
    hint: 'Broken lampposts, dark roads, safety concerns.',
    text: (name, seat) =>
      `Dear YB ${name},\n\nSeveral streetlights along [road / area] in ${seat} have been out for [duration], making the area unsafe at night.\n\nThis is particularly concerning for [residents walking home / school children / elderly].\n\nI request that you coordinate with TNB or the council to restore lighting urgently.\n\nSincerely,\n[Your name]`,
  },
  {
    emoji: '🏗️',
    topic: 'Local Development Issue',
    hint: 'Construction impact, land use, new project concerns.',
    text: (name, seat) =>
      `Dear YB ${name},\n\nI am a resident of [area] and I am concerned about [development/construction project] at [location].\n\nThe project has caused [noise / dust / traffic / access issues] affecting our community.\n\nI request that you look into this matter and ensure residents are informed and consulted.\n\nSincerely,\n[Your name]`,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RepresentativePage() {
  const { year, federalSeatCode, stateSeatCode } = useParams()
  const { seats, loading, error } = useRepresentatives()
  const isAdun = !!stateSeatCode

  const seat = useMemo(
    () => seats.find((s) => s.federalSeatCode === federalSeatCode),
    [seats, federalSeatCode],
  )

  const person = useMemo(() => {
    if (!seat) return null
    if (isAdun) return seat.aduns?.find((a) => a.stateSeatCode === stateSeatCode) ?? null
    return seat.mp ?? null
  }, [seat, isAdun, stateSeatCode])

  const kind = isAdun ? 'adun' : 'mp'

  usePageMeta({
    title: person
      ? `${person.name} — ${isAdun ? `ADUN ${stateSeatCode}` : `MP ${federalSeatCode}`} · Whoadunit`
      : 'Representative — Whoadunit',
    description: person
      ? `Contact details and profile for ${person.name}, ${isAdun ? 'State Assemblyman' : 'Member of Parliament'} for ${isAdun ? `${stateSeatCode} ${person.stateSeatName}` : `${federalSeatCode} ${person.federalSeatName}`}, ${person.state}.`
      : 'Representative profile on Whoadunit.',
  })

  if (loading) {
    return <div className="empty-state"><p className="empty-state__title">Loading…</p></div>
  }
  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">⚠️</div>
        <p className="empty-state__title">Error loading data</p>
        <p className="empty-state__body">{error}</p>
      </div>
    )
  }
  if (!seat || !person) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">🔍</div>
        <p className="empty-state__title">Representative not found</p>
        <p className="empty-state__body">We couldn't find this representative. Try searching again.</p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/find" className="btn btn--rose">Search again</Link>
          <Link to="/" className="btn btn--ghost">Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Hero person={person} kind={kind} seat={seat} year={year} />
      <SectionContact person={person} kind={kind} />
      <SectionTemplates person={person} kind={kind} seat={seat} />
      <SectionRelated person={person} kind={kind} seat={seat} year={year} />
    </>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ person, kind, seat, year }) {
  const isAdun = kind === 'adun'
  const tone = isAdun ? 'violet' : 'leaf'
  const bgVar = isAdun ? 'var(--violet-light)' : 'var(--leaf-light)'
  const roleLabel = isAdun ? 'State Assemblyman · DUN' : 'Member of Parliament · Federal'
  const roleInitial = isAdun ? (person.stateSeatCode || 'N') : 'MP'
  const seatLabel = isAdun
    ? `${person.stateSeatCode} ${person.stateSeatName}`
    : `${seat.federalSeatCode} ${seat.federalSeatName}`

  const nameParts = (person.name || '').trim().split(' ')
  const nameFirst = nameParts.slice(0, -1).join(' ')
  const nameLast = nameParts[nameParts.length - 1]

  const backHref = `/representative/${year}/${seat.federalSeatCode}`
  const backLabel = `← Back to ${seat.federalSeatCode} ${seat.federalSeatName}`

  return (
    <section
      className="rep-hero"
      style={{ background: bgVar, paddingTop: 'clamp(7rem, 12vw, 11rem)', paddingBottom: 'clamp(3rem, 6vw, 5rem)', position: 'relative', overflow: 'hidden' }}
    >
      <DecoBlob tone={tone} size={520} opacity={0.09} top={-200} right={-150} />
      <DecoBlob tone={tone} size={280} opacity={0.10} bottom={-100} left="5%" />

      <div className="rep-hero__inner">
        {/* Role pill */}
        <div className={`rep-role-pill rep-role-pill--${tone}`}>
          <span className={`rep-role-pill__dot rep-role-pill__dot--${tone}`}>{roleInitial}</span>
          <span className="rep-role-pill__text">{roleLabel}</span>
        </div>

        {/* Name */}
        <h1 className="rep-hero__name">
          {nameFirst && <>{nameFirst}<br /></>}
          <span style={{ color: `var(--${tone})` }}>{nameLast}</span>
        </h1>

        {/* Chips */}
        <div className="rep-hero__chips">
          <span className={`rep-chip rep-chip--party rep-chip--${tone}`}>{person.party}</span>
          <span className="rep-chip rep-chip--seat">{seatLabel}</span>
        </div>

        {/* Scorecard */}
        <ScorecardRing person={person} />
      </div>
    </section>
  )
}

// ─── Scorecard ring ───────────────────────────────────────────────────────────

function ScorecardRing({ person }) {
  const FIELDS = [
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'address', label: 'Office' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'twitter', label: 'X / Twitter' },
  ]

  const isFilled = (key) => {
    const v = person[key]
    if (Array.isArray(v)) return v.length > 0
    return v && String(v).trim() !== ''
  }

  const results = FIELDS.map((f) => ({
    label: f.label,
    done: isFilled(f.key) || (f.checkAlt ? isFilled(f.checkAlt) : false),
  }))
  const doneCount = results.filter((r) => r.done).length
  const pct = Math.round((doneCount / FIELDS.length) * 100)

  // SVG ring: r=26, circumference ≈ 163
  const CIRC = 163
  const offset = CIRC - (pct / 100) * CIRC

  return (
    <div className="scorecard">
      <div className="scorecard__ring" aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
          <circle className="scorecard__ring-track" cx="32" cy="32" r="26" />
          <circle
            className="scorecard__ring-fill"
            cx="32" cy="32" r="26"
            style={{ strokeDashoffset: offset }}
          />
        </svg>
        <div className="scorecard__ring-label">{pct}%</div>
      </div>
      <div className="scorecard__text">
        <div className="scorecard__pct">Profile score: {pct}%</div>
        <div className="scorecard__sub">{doneCount} of {FIELDS.length} fields complete</div>
        <div className="scorecard__fields">
          {results.map((r) => (
            <span key={r.label} className={`scorecard__tag scorecard__tag--${r.done ? 'done' : 'missing'}`}>
              {r.done ? '✓' : '✗'} {r.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Contact section ──────────────────────────────────────────────────────────

function SectionContact({ person, kind }) {
  const isAdun = kind === 'adun'
  const tone = isAdun ? 'violet' : 'leaf'
  const [showModal, setShowModal] = useState(false)

  return (
    <section className="rep-section rep-section--paper">
      <div className="rep-sec-inner">
        <p className={`rep-eyebrow rep-eyebrow--${tone}`}>Contact details</p>
        <h2 className="rep-sec-title">
          Reach <span style={{ color: `var(--${tone})` }}>{person.name}</span>
        </h2>
        <p className="rep-sec-sub">
          {isAdun
            ? 'Copy any detail and send your message. For local issues like roads and drains, the office phone is often fastest.'
            : 'Copy any detail and send your message. Email is best for formal requests; phone for urgent matters.'}
        </p>

        <ContactCard person={person} kind={kind} asLink={false} />

        <button className="suggest-btn" onClick={() => setShowModal(true)}>
          <span>✏️</span>
          <span>Suggest a correction</span>
        </button>

        {showModal && (
          <SuggestModal
            person={person}
            kind={kind}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </section>
  )
}

// ─── Suggest correction modal ─────────────────────────────────────────────────

const EDITABLE_FIELDS = [
  { value: 'name',        label: 'Name' },
  { value: 'party',       label: 'Party' },
  { value: 'gender',      label: 'Gender' },
  { value: 'address',     label: 'Address / Service Centre' },
  { value: 'email',       label: 'Email' },
  { value: 'phoneNumber', label: 'Phone Number' },
  { value: 'facebook',    label: 'Facebook' },
  { value: 'twitter',     label: 'Twitter / X' },
]

function SuggestModal({ person, kind, onClose }) {
  const [field, setField] = useState('')
  const [suggestedValue, setSuggestedValue] = useState('')
  const [source, setSource] = useState('')
  const [yourEmail, setYourEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const seatLabel = kind === 'adun'
    ? `${person.stateSeatCode} ${person.stateSeatName}`
    : `${person.federalSeatCode ?? ''} ${person.federalSeatName ?? ''}`

  const handleSubmit = (e) => {
    e.preventDefault()

    const fieldLabel = EDITABLE_FIELDS.find((f) => f.value === field)?.label ?? field
    const title = encodeURIComponent(`[Correction] ${person.name} — ${fieldLabel}`)
    const body = encodeURIComponent(
      `## Correction suggestion\n\n` +
      `**Representative:** ${person.name}\n` +
      `**Seat:** ${seatLabel}\n` +
      `**Field:** ${fieldLabel}\n` +
      `**Suggested value:** ${suggestedValue}\n` +
      (source ? `**Source / evidence:** ${source}\n` : '') +
      (yourEmail ? `**Submitted by:** ${yourEmail}\n` : '') +
      `\n---\n_Submitted via Whoadunit representative page._`
    )
    const githubUrl = `https://github.com/delacrixmorgan/whoadunit-www/issues/new?title=${title}&body=${body}`
    window.open(githubUrl, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  return (
    <div className="suggest-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="suggest-modal" role="dialog" aria-modal="true" aria-labelledby="suggest-modal-title">
        <div className="suggest-modal__header">
          <h3 id="suggest-modal-title" className="suggest-modal__title">Suggest a correction</h3>
          <button className="suggest-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {submitted ? (
          <div className="suggest-modal__success">
            <div className="suggest-modal__success-icon">✓</div>
            <p className="suggest-modal__success-title">Thanks for the tip!</p>
            <p className="suggest-modal__success-body">
              Your suggestion has been opened as a GitHub issue. We'll review and update the data soon.
            </p>
            <button className="suggest-modal__done-btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form className="suggest-modal__form" onSubmit={handleSubmit}>
            <div className="suggest-modal__rep-badge">
              <span className="suggest-modal__rep-name">{person.name}</span>
              <span className="suggest-modal__rep-seat">{seatLabel}</span>
            </div>

            <div className="suggest-modal__group">
              <label className="suggest-modal__label" htmlFor="suggest-field">Field to correct *</label>
              <select
                id="suggest-field"
                className="suggest-modal__select"
                value={field}
                onChange={(e) => setField(e.target.value)}
                required
              >
                <option value="">Select a field…</option>
                {EDITABLE_FIELDS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <div className="suggest-modal__group">
              <label className="suggest-modal__label" htmlFor="suggest-value">Suggested value *</label>
              <input
                id="suggest-value"
                type="text"
                className="suggest-modal__input"
                placeholder="Enter the correct value"
                value={suggestedValue}
                onChange={(e) => setSuggestedValue(e.target.value)}
                required
              />
            </div>

            <div className="suggest-modal__group">
              <label className="suggest-modal__label" htmlFor="suggest-source">Source / evidence <span className="suggest-modal__optional">(optional)</span></label>
              <input
                id="suggest-source"
                type="text"
                className="suggest-modal__input"
                placeholder="URL or brief description of your source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>

            <div className="suggest-modal__group">
              <label className="suggest-modal__label" htmlFor="suggest-email">Your email <span className="suggest-modal__optional">(optional)</span></label>
              <input
                id="suggest-email"
                type="email"
                className="suggest-modal__input"
                placeholder="so we can follow up if needed"
                value={yourEmail}
                onChange={(e) => setYourEmail(e.target.value)}
              />
            </div>

            <div className="suggest-modal__footer">
              <button type="button" className="suggest-modal__cancel-btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="suggest-modal__submit-btn">Open GitHub issue →</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── Templates section ────────────────────────────────────────────────────────

function SectionTemplates({ person, kind, seat }) {
  const isAdun = kind === 'adun'
  const tone = isAdun ? 'violet' : 'leaf'
  const templates = isAdun ? ADUN_TEMPLATES : MP_TEMPLATES
  const seatName = isAdun ? person.stateSeatName : seat.federalSeatName
  const bgVar = isAdun ? 'var(--violet-light)' : 'var(--leaf-light)'
  const eyebrow = isAdun ? 'Email templates · Local topics' : 'Email templates · National topics'

  return (
    <section className="rep-section" style={{ background: bgVar }}>
      <div className="rep-sec-inner">
        <p className={`rep-eyebrow rep-eyebrow--${tone}`}>{eyebrow}</p>
        <h2 className="rep-sec-title">
          Not sure what to <span style={{ color: `var(--${tone})` }}>write?</span>
        </h2>
        <p className="rep-sec-sub">
          {isAdun
            ? 'Your ADUN handles local, everyday issues. Pick a topic below, copy the template, and fill in the brackets.'
            : 'Pick a topic, copy the template, and fill in the brackets. Each card covers a real issue your MP can act on.'}
        </p>
      </div>
      <div className="tmpl-track">
        {templates.map((tmpl) => {
          const body = tmpl.text(person.name, seatName)
          return (
            <div className="tmpl-card" key={tmpl.topic}>
              <div className="tmpl-card__top">
                <div className="tmpl-card__emoji">{tmpl.emoji}</div>
                <div className="tmpl-card__topic">{tmpl.topic}</div>
                <div className="tmpl-card__hint">{tmpl.hint}</div>
              </div>
              <div className="tmpl-card__body">
                <div className={`tmpl-card__label tmpl-card__label--${tone}`}>Template</div>
                <div className={`tmpl-card__text tmpl-card__text--${tone}`}>{body}</div>
              </div>
              <div className="tmpl-card__foot">
                <CopyButton
                  value={body}
                  label="📋 Copy template"
                  copiedLabel="✓ Copied!"
                  className={`copy-tmpl-btn copy-tmpl-btn--${tone}`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Related section ──────────────────────────────────────────────────────────

function SectionRelated({ person, kind, seat, year }) {
  const isAdun = kind === 'adun'
  const tone = isAdun ? 'violet' : 'leaf'
  const eyebrow = isAdun
    ? 'Related representatives'
    : 'Related representatives'
  const title = isAdun
    ? `Others in`
    : `ADUNs under`
  const titleKw = `${seat.federalSeatCode} ${seat.federalSeatName}`

  return (
    <section className="rep-section rep-section--paper">
      <div className="rep-sec-inner">
        <p className={`rep-eyebrow rep-eyebrow--${tone}`}>{eyebrow}</p>
        <h2 className="rep-sec-title">
          {title} <span style={{ color: `var(--${tone})` }}>{titleKw}</span>
        </h2>
        <p className="rep-sec-sub">
          {isAdun
            ? 'Your MP covers the full federal constituency. The other ADUNs below share the same federal seat.'
            : 'These state assembly members serve constituencies that fall within this federal seat. They handle local matters — drains, parks, roads — at state level.'}
        </p>
      </div>
      <div className="related-track">
        {isAdun ? (
            <>
              {/* MP card */}
              {seat.mp && (
                <Link
                  to={`/representative/${year}/${seat.federalSeatCode}`}
                  className="related-rep-card related-rep-card--leaf"
                >
                  <span className="related-rep-card__badge">{seat.federalSeatCode} · MP</span>
                  <span className="related-rep-card__name">{seat.mp.name}</span>
                  <span className="related-rep-card__seat">{seat.federalSeatName}</span>
                  <span className="related-rep-card__party">{seat.mp.party} · Elected {seat.mp.electedYear}</span>
                  <span className="related-rep-card__link">View MP profile →</span>
                </Link>
              )}
              {/* Sibling ADUNs */}
              {(seat.aduns || [])
                .filter((a) => a.stateSeatCode !== person.stateSeatCode)
                .map((adun) => (
                  <Link
                    key={adun.stateSeatCode}
                    to={`/representative/${year}/${seat.federalSeatCode}/${adun.stateSeatCode}`}
                    className="related-rep-card related-rep-card--violet"
                  >
                    <span className="related-rep-card__badge">{adun.stateSeatCode} · ADUN</span>
                    <span className="related-rep-card__name">{adun.name}</span>
                    <span className="related-rep-card__seat">{adun.stateSeatName}</span>
                    <span className="related-rep-card__party">{adun.party} · Elected {adun.electedYear}</span>
                    <span className="related-rep-card__link">View profile →</span>
                  </Link>
                ))}
            </>
          ) : (
            /* MP view: show ADUNs */
            (seat.aduns || []).map((adun) => (
              <Link
                key={adun.stateSeatCode}
                to={`/representative/${year}/${seat.federalSeatCode}/${adun.stateSeatCode}`}
                className="related-rep-card related-rep-card--leaf"
              >
                <span className="related-rep-card__badge">{adun.stateSeatCode} · ADUN</span>
                <span className="related-rep-card__name">{adun.name}</span>
                <span className="related-rep-card__seat">{adun.stateSeatName}</span>
                <span className="related-rep-card__party">{adun.party} · Elected {adun.electedYear}</span>
                <span className="related-rep-card__link">View profile →</span>
              </Link>
            ))
          )}
      </div>
    </section>
  )
}
