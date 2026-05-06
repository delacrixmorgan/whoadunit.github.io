import { useMemo, useState, useEffect } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { Link, useParams } from 'react-router-dom'
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

const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/>
  </svg>
)
const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

function ContactRow({ icon, label, values, makeHref }) {
  // values is always an array
  const arr = Array.isArray(values) ? values : (values ? [values] : [])
  const has = arr.length > 0
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '14px',
      padding: '13px 0',
      borderBottom: '1px solid var(--md-sys-color-outline-variant)',
    }}>
      <div style={{
        width: '34px', height: '34px', borderRadius: '9px',
        background: has ? 'var(--md-sys-color-tertiary-container)' : 'var(--md-sys-color-surface-container-high)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '1px',
        color: has ? 'var(--md-sys-color-on-tertiary-container)' : 'var(--md-sys-color-outline)',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>
          {label}
        </div>
        {has ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {arr.map((v, i) => {
              const href = makeHref ? makeHref(v) : null
              return href ? (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--md-sys-color-primary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.88rem' }}>
                  {v}
                </a>
              ) : (
                <span key={i} style={{ fontWeight: 500, fontSize: '0.88rem', color: 'var(--md-sys-color-on-surface)' }}>{v}</span>
              )
            })}
          </div>
        ) : (
          <span style={{ fontSize: '0.82rem', color: 'var(--md-sys-color-outline)', fontStyle: 'italic' }}>{t('profile.not_available')}</span>
        )}
      </div>
      <span style={{
        fontSize: '0.7rem', fontWeight: 600,
        color: has ? 'var(--md-sys-color-tertiary)' : 'var(--md-sys-color-outline-variant)',
        marginTop: '1px',
      }}>
        {has ? '✓' : '–'}
      </span>
    </div>
  )
}

function InfoRow({ label, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '11px 0',
      borderBottom: '1px solid var(--md-sys-color-outline-variant)',
    }}>
      <span style={{
        fontSize: '0.68rem', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)',
        textTransform: 'uppercase', letterSpacing: '0.07em',
        width: '100px', flexShrink: 0,
      }}>
        {label}
      </span>
      <div style={{ flex: 1, fontSize: '0.88rem' }}>{children}</div>
    </div>
  )
}

function SuggestChangesModal({ rep, onClose }) {
  const [fields, setFields] = useState({
    field: 'email',
    currentValue: '',
    suggestedValue: '',
    comment: '',
    submitterName: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const editableFields = [
    { value: 'email', label: 'Email Address' },
    { value: 'phoneNumber', label: 'Phone Number' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter / X' },
    { value: 'name', label: 'Representative Name' },
    { value: 'party', label: 'Party' },
    { value: 'other', label: 'Other' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // In production this would POST to an API. For now we just show success.
    setSubmitted(true)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      background: 'oklch(0% 0 0 / 0.45)',
      backdropFilter: 'blur(4px)',
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: 'var(--md-sys-color-surface)',
        border: '1px solid var(--md-sys-color-outline-variant)',
        borderRadius: '20px',
        padding: '32px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 8px 40px oklch(0% 0 0 / 0.18)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '12px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              Suggest a Correction
            </h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              For <strong>{rep.name}</strong> · {rep.federalSeatCode || rep.stateSeatCode}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--md-sys-color-surface-container)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '8px', padding: '7px', cursor: 'pointer',
            color: 'var(--md-sys-color-on-surface-variant)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <CloseIcon />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✅</div>
            <h3 style={{ margin: '0 0 8px', fontFamily: 'Inter, sans-serif' }}>Thank you!</h3>
            <p style={{ margin: '0 0 24px', color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.88rem' }}>
              Your suggestion has been noted. We'll review it and update the record if confirmed.
            </p>
            <button onClick={onClose} className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Field selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '6px' }}>
                Which field needs correcting?
              </label>
              <select
                value={fields.field}
                onChange={e => setFields(f => ({ ...f, field: e.target.value }))}
                required
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '9px',
                  border: '1px solid var(--md-sys-color-outline-variant)',
                  background: 'var(--md-sys-color-surface-container)',
                  color: 'var(--md-sys-color-on-surface)',
                  fontSize: '0.88rem', fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                }}
              >
                {editableFields.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Current value */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '6px' }}>
                Current value (optional)
              </label>
              <input
                type="text"
                placeholder="What's currently shown (if wrong)…"
                value={fields.currentValue}
                onChange={e => setFields(f => ({ ...f, currentValue: e.target.value }))}
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            {/* Suggested value */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '6px' }}>
                Suggested correct value *
              </label>
              <input
                type="text"
                placeholder="What it should be…"
                value={fields.suggestedValue}
                onChange={e => setFields(f => ({ ...f, suggestedValue: e.target.value }))}
                required
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            {/* Comment */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '6px' }}>
                Additional context (optional)
              </label>
              <textarea
                placeholder="Any sources, links, or notes to support your correction…"
                value={fields.comment}
                onChange={e => setFields(f => ({ ...f, comment: e.target.value }))}
                rows={3}
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5 }}
              />
            </div>

            {/* Submitter name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '6px' }}>
                Your name (optional)
              </label>
              <input
                type="text"
                placeholder="Anonymous"
                value={fields.submitterName}
                onChange={e => setFields(f => ({ ...f, submitterName: e.target.value }))}
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button type="button" onClick={onClose} style={{
                flex: 1, padding: '11px', borderRadius: '9px',
                border: '1px solid var(--md-sys-color-outline-variant)',
                background: 'var(--md-sys-color-surface-container)',
                color: 'var(--md-sys-color-on-surface)', fontWeight: 600,
                fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{
                flex: 2, border: 'none', cursor: 'pointer',
                borderRadius: '9px', padding: '11px',
                fontSize: '0.88rem',
              }}>
                Submit Suggestion
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { year, seatCode, federalSeatCode: fscParam, stateSeatCode: sscParam } = useParams()
  const { data, loading } = useRepresentatives()
  const [showSuggestForm, setShowSuggestForm] = useState(false)

  const rep = useMemo(() => {
    if (sscParam) {
      return data.find(r =>
        String(r.electedYear) === String(year) &&
        r.federalSeatCode === fscParam &&
        r.stateSeatCode === sscParam
      )
    }
    return data.find(r =>
      String(r.electedYear) === String(year) &&
      (r.federalSeatCode === seatCode || r.stateSeatCode === seatCode)
    )
  }, [data, year, seatCode, fscParam, sscParam])

  const repSeatName = rep ? (rep.federalSeatName || rep.stateSeatName || '') : ''
  const displayCode = sscParam ?? seatCode ?? ''
  usePageMeta({
    title: rep ? `${rep.name} (${sscParam ?? seatCode})` : displayCode,
    description: rep
      ? `${rep.name} is the ${rep.type} for ${repSeatName}, ${rep.state}, representing ${rep.party}.`
      : `View representative profile for seat ${displayCode}.`,
  })

  useEffect(() => {
    if (!rep) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'ld-person'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: rep.name,
      jobTitle: rep.type === 'MP' ? 'Member of Parliament' : 'State Assemblyperson',
      memberOf: { '@type': 'PoliticalParty', name: rep.party },
      workLocation: { '@type': 'Place', name: rep.state },
    })
    document.head.appendChild(script)
    return () => { document.getElementById('ld-person')?.remove() }
  }, [rep])

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ height: '220px', borderRadius: '20px', background: 'var(--md-sys-color-surface-container)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }`}</style>
      </div>
    )
  }

  if (!rep) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
        <h2 style={{ margin: '0 0 8px' }}>Representative not found</h2>
        <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '24px' }}>
          No representative found for seat code <strong>{displayCode}</strong>.
        </p>
        <Link to="/directory" className="btn-primary" style={{ textDecoration: 'none' }}>
          Back to Directory
        </Link>
      </div>
    )
  }

  const seatName = rep.federalSeatName || rep.stateSeatName
  const completeness = getContactCompleteness(rep)
  const partyColor = getPartyColor(rep.party)

  const completenessColor = completeness >= 75
    ? 'var(--md-sys-color-tertiary)'
    : completeness >= 50
    ? 'var(--md-sys-color-primary)'
    : 'var(--md-sys-color-outline)'

  const contactFields = [
    { label: t('profile.email'), values: rep.email, makeHref: (v) => `mailto:${v}`, icon: <EmailIcon /> },
    { label: t('profile.phone'), values: rep.phoneNumber, makeHref: (v) => `tel:${v}`, icon: <PhoneIcon /> },
    { label: t('profile.facebook'), values: rep.facebook, makeHref: (v) => `https://facebook.com/${v}`, icon: <FacebookIcon /> },
    { label: t('profile.twitter'), values: rep.twitter, makeHref: (v) => `https://x.com/${v.replace(/^@/, '')}`, icon: <TwitterIcon /> },
  ]

  return (
    <div className="page-enter" style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px 72px' }}>

      {showSuggestForm && <SuggestChangesModal rep={rep} onClose={() => setShowSuggestForm(false)} />}

      {/* Top bar: back + suggest */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', gap: '12px', flexWrap: 'wrap' }}>
        <Link
          to="/directory"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: 'var(--md-sys-color-on-surface-variant)',
            textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
            padding: '7px 13px', borderRadius: '8px',
            border: '1px solid var(--md-sys-color-outline-variant)',
            background: 'var(--md-sys-color-surface-container-low)',
          }}
        >
          <BackIcon /> Back to Directory
        </Link>
        <button
          onClick={() => setShowSuggestForm(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            fontSize: '0.82rem', fontWeight: 600,
            padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
            border: '1px solid var(--md-sys-color-outline-variant)',
            background: 'var(--md-sys-color-surface-container-low)',
            color: 'var(--md-sys-color-on-surface-variant)',
            fontFamily: 'Inter, sans-serif',
            transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--md-sys-color-surface-container)'
            e.currentTarget.style.borderColor = 'var(--md-sys-color-outline)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--md-sys-color-surface-container-low)'
            e.currentTarget.style.borderColor = 'var(--md-sys-color-outline-variant)'
          }}
        >
          <EditIcon /> Suggest a Correction
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }} className="profile-grid">

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Hero card */}
          <div style={{
            background: `${partyColor}0e`,
            border: `1px solid ${partyColor}28`,
            borderRadius: '20px',
            padding: '32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              {/* Avatar */}
              <div style={{
                width: '68px', height: '68px', borderRadius: '16px', flexShrink: 0,
                background: `${partyColor}20`,
                border: `2px solid ${partyColor}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '1.35rem', fontWeight: '700', color: partyColor, fontFamily: 'Inter, sans-serif' }}>
                  {getInitials(rep.name)}
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', margin: '0 0 6px', letterSpacing: '-0.015em' }}>
                  {rep.name}
                </h1>
                <div style={{ fontSize: '0.88rem', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '14px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--md-sys-color-primary)', marginRight: '6px' }}>{displayCode}</span>
                  {seatName}
                </div>
                <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                  <span className={`badge badge-${rep.type?.toLowerCase()}`}>{rep.type}</span>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700, padding: '3px 11px',
                    borderRadius: '999px',
                    background: `${partyColor}20`,
                    color: partyColor,
                    border: `1px solid ${partyColor}40`,
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {rep.party}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seat details */}
          <div style={{
            background: 'var(--md-sys-color-surface-container-low)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '16px',
            padding: '22px 24px',
          }}>
            <h2 style={{ fontSize: '0.88rem', margin: '0 0 12px', fontFamily: 'Inter, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Seat Details
            </h2>

            {rep.federalSeatCode && (
              <InfoRow label={t('profile.federal_seat')}>
                <span style={{ fontWeight: 700, color: 'var(--md-sys-color-primary)', marginRight: '6px' }}>{rep.federalSeatCode}</span>
                <span style={{ color: 'var(--md-sys-color-on-surface)' }}>{rep.federalSeatName}</span>
              </InfoRow>
            )}
            {rep.stateSeatCode && (
              <InfoRow label={t('profile.state_seat')}>
                <span style={{ fontWeight: 700, color: 'var(--md-sys-color-primary)', marginRight: '6px' }}>{rep.stateSeatCode}</span>
                <span style={{ color: 'var(--md-sys-color-on-surface)' }}>{rep.stateSeatName}</span>
              </InfoRow>
            )}
            <InfoRow label={t('profile.party')}>
              <span style={{ fontWeight: 700, color: partyColor }}>{rep.party}</span>
            </InfoRow>
            <InfoRow label={t('profile.state')}>
              <span style={{ color: 'var(--md-sys-color-on-surface)' }}>{rep.state}</span>
            </InfoRow>
            <InfoRow label="Gender">
              <span style={{ color: 'var(--md-sys-color-on-surface)' }}>
                {rep.gender === 'M' ? 'Male' : rep.gender === 'F' ? 'Female' : '—'}
              </span>
            </InfoRow>
          </div>

          {/* Contact */}
          <div style={{
            background: 'var(--md-sys-color-surface-container-low)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '16px',
            padding: '22px 24px',
          }}>
            <h2 style={{ fontSize: '0.88rem', margin: '0 0 4px', fontFamily: 'Inter, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--md-sys-color-on-surface-variant)' }}>
              {t('profile.contact_title')}
            </h2>
            <div>
              {contactFields.map(({ label, values, makeHref, icon }) => (
                <ContactRow key={label} icon={icon} label={label} values={values} makeHref={makeHref} />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Completeness */}
          <div style={{
            background: 'var(--md-sys-color-surface-container-low)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '16px',
            padding: '22px 24px',
          }}>
            <h3 style={{ fontSize: '0.88rem', margin: '0 0 18px', fontFamily: 'Inter, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--md-sys-color-on-surface-variant)' }}>
              {t('profile.contact_completeness')}
            </h3>

            {/* Donut */}
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <svg width="96" height="96" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="36" fill="none" stroke="var(--md-sys-color-surface-container-high)" strokeWidth="9" />
                  <circle
                    cx="48" cy="48" r="36"
                    fill="none"
                    stroke={completenessColor}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - completeness / 100)}`}
                    transform="rotate(-90 48 48)"
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 700, color: completenessColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{completeness}%</span>
                </div>
              </div>
            </div>

            {contactFields.map(({ label, values }) => {
              const has = Array.isArray(values) ? values.length > 0 : values && values.trim()
              return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '9px', cursor: 'default' }}>
                  <span style={{
                    width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                    background: has ? 'var(--md-sys-color-tertiary)' : 'var(--md-sys-color-outline-variant)',
                  }} />
                  <span style={{ flex: 1, fontSize: '0.82rem', color: 'var(--md-sys-color-on-surface)' }}>{label}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: has ? 'var(--md-sys-color-tertiary)' : 'var(--md-sys-color-outline)' }}>
                    {has ? '✓' : '–'}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Party */}
          <div style={{
            background: `${partyColor}0e`,
            border: `1px solid ${partyColor}28`,
            borderRadius: '16px',
            padding: '20px 22px',
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: partyColor, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', opacity: 0.7 }}>
              Party
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'Libre Baskerville, serif', color: partyColor, marginBottom: '12px' }}>
              {rep.party}
            </div>
            <Link
              to={`/directory?party=${encodeURIComponent(rep.party)}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '0.78rem', color: partyColor,
                textDecoration: 'none', fontWeight: 600,
                padding: '6px 12px', borderRadius: '8px',
                background: `${partyColor}16`,
                border: `1px solid ${partyColor}28`,
              }}
            >
              All {rep.party} reps →
            </Link>
          </div>

          {/* State */}
          <div style={{
            background: 'var(--md-sys-color-primary-container)',
            borderRadius: '16px',
            padding: '20px 22px',
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--md-sys-color-on-primary-container)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', opacity: 0.65 }}>
              State
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Libre Baskerville, serif', color: 'var(--md-sys-color-on-primary-container)', marginBottom: '12px' }}>
              {rep.state}
            </div>
            <Link
              to={`/directory?state=${encodeURIComponent(rep.state)}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '0.78rem', color: 'var(--md-sys-color-on-primary-container)',
                textDecoration: 'none', fontWeight: 600,
                padding: '6px 12px', borderRadius: '8px',
                background: 'oklch(from var(--md-sys-color-on-primary-container) l c h / 0.1)',
                border: '1px solid oklch(from var(--md-sys-color-on-primary-container) l c h / 0.2)',
              }}
            >
              All {rep.state} reps →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
      `}</style>
    </div>
  )
}
