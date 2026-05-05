import { Link } from 'react-router-dom'
import { ShieldCheck, MessageSquarePlus, Search, User, PenLine, ArrowRight } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { t } from '../i18n'

const MAINTAINER_DUTIES = [
  t('volunteer.maintainer_duty1'),
  t('volunteer.maintainer_duty2'),
  t('volunteer.maintainer_duty3'),
]

const CONTRIBUTOR_STEPS = [
  {
    number: 1,
    icon: Search,
    label: t('volunteer.contributor_step1_label'),
    body: t('volunteer.contributor_step1_body'),
  },
  {
    number: 2,
    icon: User,
    label: t('volunteer.contributor_step2_label'),
    body: t('volunteer.contributor_step2_body'),
  },
  {
    number: 3,
    icon: PenLine,
    label: t('volunteer.contributor_step3_label'),
    body: t('volunteer.contributor_step3_body'),
  },
]

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function VolunteerPage() {
  usePageMeta({
    title: t('volunteer.page_title'),
    description: t('volunteer.page_description'),
  })

  return (
    <div className="page-enter" style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 88px' }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: '52px', maxWidth: '620px' }}>
        <span className="section-label" style={{ display: 'block', marginBottom: '10px' }}>
          {t('volunteer.section_label')}
        </span>
        <h1 style={{
          margin: '0 0 16px',
          fontFamily: 'Libre Baskerville, Georgia, serif',
          fontSize: 'clamp(1.75rem, 4vw, 2.4rem)',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: 'var(--md-sys-color-on-surface)',
        }}>
          {t('volunteer.heading')}
        </h1>
        <p style={{
          margin: 0,
          fontSize: '0.95rem',
          lineHeight: 1.75,
          color: 'var(--md-sys-color-on-surface-variant)',
          maxWidth: '58ch',
        }}>
          {t('volunteer.subtitle')}
        </p>
      </div>

      {/* ── Why It Matters ── */}
      <div style={{
        marginBottom: '56px',
        padding: '28px 32px',
        background: 'var(--md-sys-color-primary-container)',
        borderRadius: '16px',
        maxWidth: '780px',
      }}>
        <p style={{
          margin: '0 0 6px',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: 'var(--md-sys-color-on-primary-container)',
          opacity: 0.75,
        }}>
          {t('volunteer.why_label')}
        </p>
        <h2 style={{
          margin: '0 0 12px',
          fontFamily: 'Libre Baskerville, Georgia, serif',
          fontSize: '1.15rem',
          fontWeight: 700,
          lineHeight: 1.3,
          color: 'var(--md-sys-color-on-primary-container)',
          letterSpacing: '-0.01em',
        }}>
          {t('volunteer.why_heading')}
        </h2>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          lineHeight: 1.75,
          color: 'var(--md-sys-color-on-primary-container)',
          opacity: 0.85,
          maxWidth: '64ch',
        }}>
          {t('volunteer.why_body')}
        </p>
      </div>

      {/* ── Contribution Paths ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '5fr 4fr',
        gap: '20px',
        alignItems: 'start',
        marginBottom: '64px',
      }} className="volunteer-grid">

        {/* — Maintainer Card (heavier, primary-tinted) — */}
        <div style={{
          background: 'var(--md-sys-color-surface-container-low)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          borderRadius: '20px',
          padding: '36px 36px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '13px',
              background: 'var(--md-sys-color-primary-container)',
              color: 'var(--md-sys-color-on-primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ShieldCheck size={22} strokeWidth={1.75} />
            </div>
            <div style={{ paddingTop: '2px' }}>
              <div style={{ marginBottom: '6px' }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '3px 9px',
                  borderRadius: '999px',
                  background: 'var(--md-sys-color-primary-container)',
                  color: 'var(--md-sys-color-on-primary-container)',
                }}>
                  {t('volunteer.maintainer_effort')}
                </span>
              </div>
              <h2 style={{
                margin: '0 0 2px',
                fontFamily: 'Libre Baskerville, Georgia, serif',
                fontSize: '1.3rem',
                fontWeight: 700,
                lineHeight: 1.2,
                color: 'var(--md-sys-color-on-surface)',
                letterSpacing: '-0.01em',
              }}>
                {t('volunteer.maintainer_heading')}
              </h2>
              <p style={{
                margin: 0,
                fontSize: '0.82rem',
                color: 'var(--md-sys-color-on-surface-variant)',
                lineHeight: 1.4,
              }}>
                {t('volunteer.maintainer_sub')}
              </p>
            </div>
          </div>

          {/* Body */}
          <p style={{
            margin: '0 0 20px',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            color: 'var(--md-sys-color-on-surface-variant)',
            maxWidth: '56ch',
          }}>
            {t('volunteer.maintainer_body')}
          </p>

          {/* Duty list */}
          <ul style={{
            margin: '0 0 20px',
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {MAINTAINER_DUTIES.map((duty, i) => (
              <li key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '0.87rem',
                lineHeight: 1.55,
                color: 'var(--md-sys-color-on-surface)',
              }}>
                <span style={{
                  flexShrink: 0,
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  background: 'var(--md-sys-color-primary-container)',
                  color: 'var(--md-sys-color-on-primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '1px',
                }}>
                  <CheckIcon />
                </span>
                {duty}
              </li>
            ))}
          </ul>

          {/* Who it's for */}
          <p style={{
            margin: '0 0 28px',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            color: 'var(--md-sys-color-on-surface-variant)',
            padding: '12px 14px',
            background: 'var(--md-sys-color-surface-container)',
            borderRadius: '10px',
            maxWidth: 'none',
          }}>
            <strong style={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 600 }}>Who this is for: </strong>
            {t('volunteer.maintainer_who')}
          </p>

          <a
            href="mailto:whoadunit@dontsaybojio.com?subject=Data%20Maintainer%20Application"
            className="btn-primary"
            style={{ textDecoration: 'none', alignSelf: 'flex-start' }}
          >
            <ShieldCheck size={15} strokeWidth={2} />
            {t('volunteer.maintainer_cta')}
          </a>
        </div>

        {/* — Contributor Card (lighter, tertiary-tinted) — */}
        <div style={{
          background: 'var(--md-sys-color-surface-container-low)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          borderRadius: '20px',
          padding: '30px 30px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '18px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--md-sys-color-tertiary-container)',
              color: 'var(--md-sys-color-on-tertiary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <MessageSquarePlus size={20} strokeWidth={1.75} />
            </div>
            <div style={{ paddingTop: '2px' }}>
              <div style={{ marginBottom: '6px' }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '3px 9px',
                  borderRadius: '999px',
                  background: 'var(--md-sys-color-tertiary-container)',
                  color: 'var(--md-sys-color-on-tertiary-container)',
                }}>
                  {t('volunteer.contributor_effort')}
                </span>
              </div>
              <h2 style={{
                margin: '0 0 2px',
                fontFamily: 'Libre Baskerville, Georgia, serif',
                fontSize: '1.2rem',
                fontWeight: 700,
                lineHeight: 1.2,
                color: 'var(--md-sys-color-on-surface)',
                letterSpacing: '-0.01em',
              }}>
                {t('volunteer.contributor_heading')}
              </h2>
              <p style={{
                margin: 0,
                fontSize: '0.82rem',
                color: 'var(--md-sys-color-on-surface-variant)',
                lineHeight: 1.4,
              }}>
                {t('volunteer.contributor_sub')}
              </p>
            </div>
          </div>

          {/* Body */}
          <p style={{
            margin: '0 0 22px',
            fontSize: '0.88rem',
            lineHeight: 1.7,
            color: 'var(--md-sys-color-on-surface-variant)',
            maxWidth: '52ch',
          }}>
            {t('volunteer.contributor_body')}
          </p>

          {/* How it works steps */}
          <div style={{ marginBottom: '26px' }}>
            <p style={{
              margin: '0 0 12px',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--md-sys-color-on-surface-variant)',
            }}>
              How it works
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {CONTRIBUTOR_STEPS.map((step, i) => {
                const Icon = step.icon
                const isLast = i === CONTRIBUTOR_STEPS.length - 1
                return (
                  <div key={step.number} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                    {/* Left rail */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '32px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '9px',
                        background: 'var(--md-sys-color-tertiary-container)',
                        color: 'var(--md-sys-color-on-tertiary-container)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        zIndex: 1,
                        position: 'relative',
                      }}>
                        <Icon size={14} strokeWidth={2} />
                      </div>
                      {!isLast && (
                        <div style={{
                          width: '1px',
                          flex: 1,
                          minHeight: '10px',
                          background: 'var(--md-sys-color-outline-variant)',
                          margin: '3px 0',
                        }} />
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ paddingBottom: isLast ? '0' : '14px', paddingTop: '5px' }}>
                      <p style={{
                        margin: '0 0 2px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--md-sys-color-on-surface)',
                        lineHeight: 1.3,
                      }}>
                        {step.label}
                      </p>
                      <p style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        lineHeight: 1.55,
                        color: 'var(--md-sys-color-on-surface-variant)',
                        maxWidth: '36ch',
                      }}>
                        {step.body}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Link
            to="/directory"
            className="btn-outline"
            style={{ textDecoration: 'none', alignSelf: 'flex-start' }}
          >
            <MessageSquarePlus size={15} strokeWidth={2} />
            {t('volunteer.contributor_cta')}
          </Link>
        </div>
      </div>

      {/* ── Bottom CTA Strip ── */}
      <div style={{
        padding: '36px 40px',
        background: 'var(--md-sys-color-surface-container)',
        border: '1px solid var(--md-sys-color-outline-variant)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '32px',
        flexWrap: 'wrap',
      }}>
        <div style={{ maxWidth: '540px' }}>
          <h2 style={{
            margin: '0 0 8px',
            fontFamily: 'Libre Baskerville, Georgia, serif',
            fontSize: '1.2rem',
            fontWeight: 700,
            lineHeight: 1.3,
            color: 'var(--md-sys-color-on-surface)',
            letterSpacing: '-0.01em',
          }}>
            {t('volunteer.cta_heading')}
          </h2>
          <p style={{
            margin: 0,
            fontSize: '0.88rem',
            lineHeight: 1.65,
            color: 'var(--md-sys-color-on-surface-variant)',
            maxWidth: '56ch',
          }}>
            {t('volunteer.cta_body')}
          </p>
        </div>
        <Link
          to="/data-methodology"
          className="btn-primary"
          style={{ flexShrink: 0, textDecoration: 'none' }}
        >
          {t('volunteer.cta_button')}
          <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .volunteer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
