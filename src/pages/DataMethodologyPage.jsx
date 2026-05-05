import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { t } from '../i18n'

const STEPS = [
  {
    number: 1,
    title: t('methodology.step1_title'),
    body: t('methodology.step1_body'),
    badge: null,
  },
  {
    number: 2,
    title: t('methodology.step2_title'),
    body: t('methodology.step2_body'),
    badge: null,
  },
  {
    number: 3,
    title: t('methodology.step3_title'),
    body: t('methodology.step3_body'),
    badge: 'representative_year.xlsx',
  },
  {
    number: 4,
    title: t('methodology.step4_title'),
    body: t('methodology.step4_body'),
    badge: null,
  },
  {
    number: 5,
    title: t('methodology.step5_title'),
    body: t('methodology.step5_body'),
    badge: 'representatives_YEAR.json',
  },
]

const TRUST_SIGNALS = [
  t('methodology.trust1'),
  t('methodology.trust2'),
  t('methodology.trust3'),
]

function StepCard({ step, index }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const isLast = index === STEPS.length - 1

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(16px)',
        transition: `opacity 280ms ease-out ${index * 60}ms, transform 280ms ease-out ${index * 60}ms`,
        display: 'flex',
        gap: '0',
        position: 'relative',
      }}
    >
      {/* Left rail */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0,
        width: '48px',
        marginRight: '28px',
      }}>
        {/* Step circle */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'var(--md-sys-color-primary-container)',
          border: '2px solid var(--md-sys-color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          zIndex: 1,
          position: 'relative',
        }}>
          <span style={{
            fontFamily: 'Libre Baskerville, Georgia, serif',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: 'var(--md-sys-color-on-primary-container)',
            lineHeight: 1,
          }}>
            {step.number}
          </span>
        </div>

        {/* Connector line */}
        {!isLast && (
          <div style={{
            width: '1px',
            flex: 1,
            minHeight: '32px',
            background: 'var(--md-sys-color-outline-variant)',
            margin: '6px 0',
          }} />
        )}
      </div>

      {/* Content card */}
      <div style={{
        marginBottom: isLast ? '0' : '16px',
        flex: 1,
        minWidth: 0,
        background: 'var(--md-sys-color-surface-container-low)',
        border: '1px solid var(--md-sys-color-outline-variant)',
        borderRadius: '14px',
        padding: '20px 24px',
        transition: 'box-shadow 150ms ease-out, transform 150ms ease-out',
        cursor: 'default',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 2px 12px oklch(18% 0.008 148 / 0.08)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {/* Title */}
        <h3 style={{
          margin: '0 0 12px',
          fontFamily: 'Libre Baskerville, Georgia, serif',
          fontWeight: 700,
          fontSize: '1.05rem',
          color: 'var(--md-sys-color-on-surface)',
          lineHeight: 1.3,
        }}>
          {step.title}
        </h3>

        {/* Body */}
        <p style={{
          margin: '0 0 12px',
          fontSize: '0.9rem',
          lineHeight: 1.7,
          color: 'var(--md-sys-color-on-surface-variant)',
          maxWidth: '64ch',
        }}>
          {step.body}
        </p>

        {/* Badge */}
        {step.badge && (
          <code style={{
            display: 'inline-block',
            fontSize: '0.78rem',
            fontFamily: '"JetBrains Mono", "Fira Mono", "Consolas", monospace',
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: '6px',
            background: 'var(--md-sys-color-surface-container-highest)',
            color: 'var(--md-sys-color-on-surface)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            letterSpacing: '0.01em',
          }}>
            {step.badge}
          </code>
        )}
      </div>
    </div>
  )
}

export default function DataMethodologyPage() {
  usePageMeta({
    title: t('methodology.page_title'),
    description: t('methodology.page_description'),
  })

  return (
    <div className="page-enter" style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 80px' }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: '52px', maxWidth: '640px' }}>
        <span className="section-label" style={{ display: 'block', marginBottom: '10px' }}>
          {t('methodology.section_label')}
        </span>
        <h1 style={{
          margin: '0 0 14px',
          fontFamily: 'Libre Baskerville, Georgia, serif',
          fontSize: 'clamp(1.75rem, 4vw, 2.4rem)',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: 'var(--md-sys-color-on-surface)',
        }}>
          {t('methodology.heading')}
        </h1>
        <p style={{
          margin: '0 0 24px',
          fontSize: '0.95rem',
          lineHeight: 1.7,
          color: 'var(--md-sys-color-on-surface-variant)',
          maxWidth: '60ch',
        }}>
          {t('methodology.intro')}
        </p>

        {/* Trust signals */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {TRUST_SIGNALS.map((signal) => (
            <span
              key={signal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                padding: '5px 12px',
                borderRadius: '999px',
                background: 'var(--md-sys-color-primary-container)',
                color: 'var(--md-sys-color-on-primary-container)',
                border: '1px solid transparent',
              }}
            >
              {signal}
            </span>
          ))}
        </div>
      </div>

      {/* ── 5-Step Timeline ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr clamp(280px, 34%, 380px)',
        gap: '0 64px',
        alignItems: 'start',
      }} className="methodology-grid">

        {/* Timeline column */}
        <div>
          {STEPS.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>

        {/* Side callout */}
        <aside style={{
          position: 'sticky',
          top: '88px',
          background: 'var(--md-sys-color-surface-container-low)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          borderRadius: '16px',
          padding: '24px 26px',
        }} className="methodology-aside">
          <p style={{
            margin: '0 0 6px',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--md-sys-color-primary)',
          }}>
            {t('methodology.aside_label')}
          </p>
          <h2 style={{
            margin: '0 0 12px',
            fontFamily: 'Libre Baskerville, Georgia, serif',
            fontSize: '1.1rem',
            fontWeight: 700,
            lineHeight: 1.35,
            color: 'var(--md-sys-color-on-surface)',
          }}>
            {t('methodology.aside_heading')}
          </h2>
          <p style={{
            margin: '0 0 20px',
            fontSize: '0.85rem',
            lineHeight: 1.65,
            color: 'var(--md-sys-color-on-surface-variant)',
          }}>
            {t('methodology.aside_body')}
          </p>

          <div style={{
            borderTop: '1px solid var(--md-sys-color-outline-variant)',
            paddingTop: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                {t('methodology.aside_stat1_label')}
              </span>
              <span style={{
                fontFamily: 'Libre Baskerville, serif',
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--md-sys-color-on-surface)',
              }}>2</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                {t('methodology.aside_stat2_label')}
              </span>
              <span style={{
                fontFamily: 'Libre Baskerville, serif',
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--md-sys-color-on-surface)',
              }}>Wikipedia</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                {t('methodology.aside_stat3_label')}
              </span>
              <span style={{
                fontFamily: 'Libre Baskerville, serif',
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--md-sys-color-on-surface)',
              }}>JSON</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Contribute CTA Strip ── */}
      <div style={{
        marginTop: '64px',
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
        <div style={{ maxWidth: '560px' }}>
          <h2 style={{
            margin: '0 0 8px',
            fontFamily: 'Libre Baskerville, Georgia, serif',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--md-sys-color-on-surface)',
          }}>
            {t('methodology.cta_heading')}
          </h2>
          <p style={{
            margin: 0,
            fontSize: '0.88rem',
            lineHeight: 1.65,
            color: 'var(--md-sys-color-on-surface-variant)',
          }}>
            {t('methodology.cta_body')}
          </p>
        </div>
        <Link
          to="/directory"
          className="btn-primary"
          style={{ flexShrink: 0, textDecoration: 'none' }}
        >
          {t('methodology.cta_button')}
        </Link>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .methodology-grid {
            grid-template-columns: 1fr !important;
          }
          .methodology-aside {
            position: static !important;
            order: -1;
            margin-bottom: 40px;
          }
        }
        @media (max-width: 480px) {
          .methodology-grid > div > div {
            gap: 0 16px !important;
          }
        }
      `}</style>
    </div>
  )
}
