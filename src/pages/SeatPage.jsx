import { useMemo } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useRepresentatives } from '../hooks/useRepresentatives.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useT } from '../i18n/LanguageContext.jsx'
import StepPill from '../components/StepPill.jsx'
import RepCard from '../components/RepCard.jsx'
import ContactCard from '../components/ContactCard.jsx'
import Completeness from '../components/Completeness.jsx'
import ExplainerPanel from '../components/ExplainerPanel.jsx'
import StatBlock from '../components/StatBlock.jsx'
import DiffGrid from '../components/DiffGrid.jsx'
import DecoBlob from '../components/DecoBlob.jsx'
import Reveal from '../components/Reveal.jsx'
import CopyButton from '../components/CopyButton.jsx'
import SideDots from '../components/SideDots.jsx'

const SECTIONS = [
  { id: 's1', tone: 'rose',   label: 'Your area' },
  { id: 's2', tone: 'leaf',   label: 'Your MP' },
  { id: 's3', tone: 'violet', label: 'Your ADUNs' },
  { id: 's4', tone: 'gold',   label: 'Reach out' },
]

export default function SeatPage() {
  const { federalSeatCode } = useParams()
  const { seats, loading, error } = useRepresentatives()
  const t = useT()

  const seat = useMemo(
    () => seats.find((s) => s.federalSeatCode === federalSeatCode),
    [seats, federalSeatCode],
  )

  usePageMeta({
    title: seat ? `${seat.federalSeatName} — Whoadunit` : 'Constituency — Whoadunit',
    description: seat
      ? `Find your MP and ADUNs for ${seat.federalSeatName} (${seat.federalSeatCode}, ${seat.state}). Contact details, parties, and how to reach them.`
      : t('meta.find_desc'),
  })

  if (loading) {
    return <div className="empty-state"><p className="empty-state__title">{t('common.loading')}</p></div>
  }
  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">⚠️</div>
        <p className="empty-state__title">{t('common.error')}</p>
        <p className="empty-state__body">{error}</p>
      </div>
    )
  }
  if (!seat) {
    return (
      <section className="page-hero bg-rose-light">
        <DecoBlob tone="rose" size={400} opacity={0.15} top={-150} right={-100} />
        <h1 className="t-display">{t('seat.not_found_title')}</h1>
        <p className="page-hero__sub">{t('seat.not_found_body')}</p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/find" className="btn btn--rose">Search again</Link>
          <Link to="/" className="btn btn--ghost">Back to home</Link>
        </div>
      </section>
    )
  }

  const aduns = seat.aduns || []
  const isFT = aduns.length === 0
  const sectionsForNav = isFT ? SECTIONS.filter((s) => s.id !== 's3') : SECTIONS

  return (
    <>
      <SideDots sections={sectionsForNav} />

      <SectionArea seat={seat} isFT={isFT} />
      <SectionMp seat={seat} />
      {!isFT && <SectionAduns seat={seat} />}
      <SectionContact seat={seat} />
    </>
  )
}

function SectionArea({ seat, isFT }) {
  const titleParts = seat.federalSeatName.split(' ')
  const lead = titleParts.slice(0, -1).join(' ')
  const last = titleParts[titleParts.length - 1]

  return (
    <section className="step-section step-section--rose" id="s1" style={{ paddingTop: 'clamp(7rem, 11vw, 11rem)' }}>
      <DecoBlob tone="rose" size={600} opacity={0.13} top={-200} right={-150} />
      <DecoBlob tone="gold" size={300} opacity={0.15} bottom={-100} left="10%" />

      <div className="section-inner">
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <Link to="/find" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-faint)' }}>← Back to search</Link>
          <span style={{ color: 'var(--ink-faint)' }}>/</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--rose)' }}>
            {seat.federalSeatCode} {seat.federalSeatName}
          </span>
        </div>

        <StepPill tone="rose" num={1}>YOUR AREA</StepPill>

        <h1 className="t-display" style={{ marginTop: '1.5rem', position: 'relative', zIndex: 1 }}>
          {lead && <>{lead}<br /></>}
          <span className="kw-rose">{last}</span>
        </h1>
        <p className="t-body" style={{ color: 'var(--ink-soft)', margin: '1.25rem 0 0', position: 'relative', zIndex: 1 }}>
          {seat.federalSeatCode} · {seat.state}
          {isFT
            ? ' · Federal Territory (no state assembly)'
            : ` · ${seat.aduns.length} ADUN${seat.aduns.length === 1 ? '' : 's'} under this federal seat`}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '3rem', position: 'relative', zIndex: 1 }}>
          <FactTile label="Federal code" value={seat.federalSeatCode} tone="rose" />
          <FactTile label="State seats"  value={seat.aduns.length}    tone="violet" />
          <FactTile label="State"        value={seat.state}           tone="leaf" />
        </div>
      </div>
    </section>
  )
}

function FactTile({ label, value, tone }) {
  const colorMap = { rose: 'var(--rose)', leaf: 'var(--leaf)', violet: 'var(--violet)', gold: 'var(--gold)' }
  return (
    <div style={{
      background: 'white', borderRadius: 14,
      padding: '1rem 1.5rem',
      border: '2px solid rgba(26, 23, 20, 0.07)',
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1, color: colorMap[tone] }}>{value}</div>
      <div className="t-label" style={{ color: 'var(--ink-faint)', marginTop: '0.2rem' }}>{label}</div>
    </div>
  )
}

function SectionMp({ seat }) {
  return (
    <section className="step-section step-section--leaf" id="s2">
      <DecoBlob tone="leaf" size={500} opacity={0.14} top={-180} right={-100} />
      <DecoBlob tone="gold" size={250} opacity={0.12} bottom={-80} right="20%" />

      <div className="section-inner">
        <StepPill tone="leaf" num={2}>YOUR MP — NATIONAL</StepPill>
        <Reveal>
          <h2 className="t-headline" style={{ marginTop: '1.5rem' }}>
            Meet your<br />
            <span className="kw-leaf">Member of Parliament</span>
          </h2>
        </Reveal>

        <div style={{ marginTop: '2rem' }}>
          {seat.mp ? (
            <Reveal style={{ display: 'block' }}><RepCard person={seat.mp} kind="mp" /></Reveal>
          ) : (
            <div className="paper-card">
              <p className="contact-row__missing">MP data not yet available for this constituency.</p>
            </div>
          )}
        </div>

        <Reveal delay={1} style={{ display: 'block', marginTop: '1.75rem' }}>
          <ExplainerPanel
            question="What does an MP do?"
            answer="Votes on national laws at Parliament in Kuala Lumpur. Raises questions to ministers. Shapes policy that affects every Malaysian — not just your area."
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

function SectionAduns({ seat }) {
  return (
    <section className="step-section step-section--violet" id="s3">
      <DecoBlob tone="violet" size={550} opacity={0.14} top={-200} right={-120} />
      <DecoBlob tone="rose"   size={300} opacity={0.10} bottom={-100} left="5%" />

      <div className="section-inner">
        <StepPill tone="violet" num={3}>YOUR ADUNS — STATE</StepPill>
        <Reveal>
          <h2 className="t-headline" style={{ marginTop: '1.5rem' }}>
            Meet your<br />
            <span className="kw-violet">State Assembly Members</span>
          </h2>
        </Reveal>

        <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
          {seat.aduns.map((adun, i) => (
            <Reveal key={`${adun.federalSeatCode}-${adun.stateSeatCode}`} delay={Math.min(i + 1, 3)}>
              <RepCard person={adun} kind="adun" />
            </Reveal>
          ))}
        </div>

        <Reveal delay={2} style={{ display: 'block', marginTop: '1.75rem' }}>
          <ExplainerPanel
            question="What does an ADUN do?"
            answer="Handles local governance in your neighbourhood — the things you actually see and feel every day. Closer to you than Parliament."
            chips={[
              { tone: 'rose',   label: '🚰 Blocked drains' },
              { tone: 'leaf',   label: '🌳 Park maintenance' },
              { tone: 'violet', label: '🏗️ Local development' },
              { tone: 'gold',   label: '📋 State land matters' },
            ]}
          />
        </Reveal>

        <Reveal delay={3} style={{ display: 'block', marginTop: '2rem' }}>
          <DiffGrid mp={seat.mp} adun={seat.aduns[0]} />
        </Reveal>
      </div>
    </section>
  )
}

function SectionContact({ seat }) {
  const reps = [seat.mp, ...(seat.aduns || [])].filter(Boolean)

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(
      `Find your representative in ${seat.federalSeatName} (${seat.federalSeatCode}). Whoadunit. ${window.location.href}`,
    )}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <section className="step-section step-section--gold" id="s4">
      <DecoBlob tone="gold" size={500} opacity={0.14} top={-180} right={-100} />
      <DecoBlob tone="leaf" size={280} opacity={0.10} bottom={-80} left="8%" />

      <div className="section-inner">
        <StepPill tone="gold" num={4}>REACH OUT — TAKE ACTION</StepPill>
        <Reveal>
          <h2 className="t-headline" style={{ marginTop: '1.5rem' }}>
            Now <span className="kw-gold">contact them</span>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="t-body" style={{ color: 'var(--ink-soft)', margin: '1rem 0 2rem' }}>
            Copy what you need. Then actually send that message.
          </p>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {seat.mp && (
            <Reveal style={{ display: 'block' }}>
              <ContactCard person={seat.mp} kind="mp" />
              <div style={{ marginTop: '1rem' }}><Completeness person={seat.mp} label={`MP profile completeness — ${seat.mp.name}`} /></div>
            </Reveal>
          )}
          {(seat.aduns || []).map((adun) => (
            <Reveal key={`${adun.federalSeatCode}-${adun.stateSeatCode}`} delay={1} style={{ display: 'block' }}>
              <ContactCard person={adun} kind="adun" />
              <div style={{ marginTop: '1rem' }}>
                <Completeness person={adun} label={`ADUN profile completeness — ${adun.name}`} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={2} style={{ display: 'block', marginTop: '2.5rem' }}>
          <div className="share-card">
            <span className="share-card__blob" aria-hidden="true" />
            <h3>Know someone who should find theirs?</h3>
            <p>Share Whoadunit. More Malaysians knowing their representative means more accountability.</p>
            <div className="share-card__btns">
              <button type="button" className="btn btn--white" onClick={handleWhatsApp}>Share on WhatsApp</button>
              <CopyButton value={shareUrl} label="Copy link" copiedLabel="✓ Link copied" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
