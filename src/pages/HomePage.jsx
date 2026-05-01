import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRepresentatives, computeStats } from '../hooks/useRepresentatives'
import { t } from '../i18n'
import RepCard from '../components/RepCard'

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}

function ContactBar({ label, pct }) {
  const color = pct >= 75
    ? 'var(--md-sys-color-tertiary)'
    : pct >= 50
    ? 'var(--md-sys-color-primary)'
    : 'var(--md-sys-color-outline)'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-on-surface-variant)', minWidth: '72px' }}>{label}</span>
      <div style={{
        flex: 1,
        height: '6px',
        borderRadius: '999px',
        background: 'var(--md-sys-color-surface-container-high)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: '999px',
          background: color,
          transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
      <span style={{ fontSize: '0.78rem', fontWeight: 600, color, minWidth: '36px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {pct}%
      </span>
    </div>
  )
}

export default function HomePage() {
  const { data, loading } = useRepresentatives()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const stats = useMemo(() => data.length ? computeStats(data) : null, [data])
  const featured = useMemo(() => data.slice(0, 5), [data])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/directory?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="page-enter">

      {/* Hero */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--md-sys-color-outline-variant)',
        padding: '80px 24px 72px',
        background: 'var(--md-sys-color-surface)',
      }}>
        {/* Subtle dot-grid texture */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, var(--md-sys-color-outline-variant) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.45,
        }} />
        {/* Soft sage glow behind heading */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, var(--md-sys-color-primary-container) 0%, transparent 70%)',
          opacity: 0.55,
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>

          {/* Eyebrow pill — pastel, outlined */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--md-sys-color-primary-container)',
            color: 'var(--md-sys-color-on-primary-container)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: '999px', padding: '5px 16px',
            fontSize: '0.70rem', fontWeight: '600', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: '28px',
            fontFamily: 'Inter, sans-serif',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--md-sys-color-primary)', flexShrink: 0 }} />
            Malaysia · Dewan Rakyat & DUN
          </div>

          <h1 style={{
            fontFamily: 'Libre Baskerville, Georgia, serif',
            fontSize: 'clamp(1.9rem, 5vw, 2.75rem)',
            fontWeight: '700', margin: '0 0 18px',
            color: 'var(--md-sys-color-on-surface)',
            lineHeight: 1.14,
            letterSpacing: '-0.025em',
          }}>
            {t('home.hero_title')}
          </h1>

          <p style={{
            fontSize: '1rem',
            color: 'var(--md-sys-color-on-surface-variant)',
            margin: '0 auto 44px',
            lineHeight: 1.75,
            maxWidth: '52ch',
          }}>
            {t('home.hero_subtitle')}
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', maxWidth: '520px', margin: '0 auto 24px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--md-sys-color-outline)', pointerEvents: 'none',
              }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder={t('home.search_placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--md-sys-color-surface-container-lowest)',
                  border: '1.5px solid var(--md-sys-color-outline-variant)',
                  borderRadius: '14px',
                  color: 'var(--md-sys-color-on-surface)',
                  padding: '13px 16px 13px 46px',
                  fontSize: '0.95rem',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'border-color 0.18s, box-shadow 0.18s',
                  outline: 'none',
                  boxShadow: '0 1px 4px oklch(22% 0.006 148 / 0.05)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--md-sys-color-primary)'
                  e.target.style.boxShadow = '0 0 0 3px oklch(52% 0.065 148 / 0.12)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--md-sys-color-outline-variant)'
                  e.target.style.boxShadow = '0 1px 4px oklch(22% 0.006 148 / 0.05)'
                }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ borderRadius: '14px', padding: '13px 22px', fontSize: '0.88rem', flexShrink: 0 }}
            >
              {t('home.search_btn')}
            </button>
          </form>

          {/* Quick party filters */}
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['PKR', 'DAP', 'UMNO', 'BERSATU', 'PAS'].map((party) => (
              <Link
                key={party}
                to={`/directory?party=${encodeURIComponent(party)}`}
                style={{
                  padding: '5px 14px', borderRadius: '999px',
                  fontSize: '0.73rem', fontWeight: 600,
                  background: 'var(--md-sys-color-surface-container-low)',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  border: '1px solid var(--md-sys-color-outline-variant)',
                  textDecoration: 'none',
                  transition: 'background 0.12s, color 0.12s',
                  letterSpacing: '0.03em',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--md-sys-color-primary-container)'
                  e.currentTarget.style.color = 'var(--md-sys-color-on-primary-container)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--md-sys-color-surface-container-low)'
                  e.currentTarget.style.color = 'var(--md-sys-color-on-surface-variant)'
                }}
              >
                {party}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Summary cards */}
      {stats && (
        <div style={{
          background: 'var(--md-sys-color-surface)',
          borderBottom: '1px solid var(--md-sys-color-outline-variant)',
          padding: '28px 24px',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="stats-grid">
              {[
                {
                  value: stats.total,
                  label: 'Representatives',
                  sublabel: 'Federal & state seats',
                  href: '/directory',
                  accent: 'primary',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  ),
                },
                {
                  value: stats.mps,
                  label: 'MPs',
                  sublabel: 'Federal (Dewan Rakyat)',
                  href: '/directory?type=MP',
                  accent: 'mp',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  ),
                },
                {
                  value: stats.aduns,
                  label: 'ADUNs',
                  sublabel: 'State assembly members',
                  href: '/directory?type=ADUN',
                  accent: 'adun',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  ),
                },
                {
                  value: stats.partyCount,
                  label: 'Parties',
                  sublabel: 'Political parties',
                  href: '/directory',
                  accent: 'secondary',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ),
                },
                {
                  value: stats.stateCount,
                  label: 'States',
                  sublabel: 'States & territories',
                  href: '/directory',
                  accent: 'tertiary',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  ),
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`stat-card-link stat-card-link--${item.accent}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="stat-card-modern">
                    <div className={`stat-card-icon stat-card-icon--${item.accent}`}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'Libre Baskerville, Georgia, serif',
                        fontSize: '1.85rem',
                        fontWeight: 700,
                        lineHeight: 1,
                        letterSpacing: '-0.025em',
                        fontVariantNumeric: 'tabular-nums',
                      }} className={`stat-card-value--${item.accent}`}>
                        {item.value}
                      </div>
                      <div style={{
                        marginTop: '5px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--md-sys-color-on-surface)',
                        lineHeight: 1.2,
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        marginTop: '2px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.72rem',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        lineHeight: 1.3,
                      }}>
                        {item.sublabel}
                      </div>
                    </div>
                    <div className="stat-card-arrow">
                      <ArrowRightIcon />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <section style={{ padding: '48px 24px 72px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', alignItems: 'start' }} className="home-grid">

          {/* Left: recent reps */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>{t('home.recent_title')}</h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--md-sys-color-on-surface-variant)', maxWidth: 'none' }}>
                  A selection from the directory
                </p>
              </div>
              <Link
                to="/directory"
                style={{
                  fontSize: '0.82rem', color: 'var(--md-sys-color-primary)',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px',
                  fontWeight: 600, flexShrink: 0,
                }}
              >
                {t('home.view_all')} <ArrowRightIcon />
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gap: '8px' }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{
                    height: '76px', borderRadius: '14px',
                    background: 'var(--md-sys-color-surface-container)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.1}s`,
                  }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '8px' }}>
                {featured.map((rep) => (
                  <RepCard key={rep.federalSeatCode || rep.stateSeatCode} rep={rep} />
                ))}
              </div>
            )}
          </div>

          {/* Right: contact transparency scorecard */}
          {stats && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Scorecard */}
              <div style={{
                background: 'var(--md-sys-color-surface-container-low)',
                border: '1px solid var(--md-sys-color-outline-variant)',
                borderRadius: '16px',
                padding: '24px',
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: 'var(--text-md)', margin: '0 0 4px' }}>{t('home.scorecard_title')}</h2>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--md-sys-color-on-surface-variant)', maxWidth: 'none' }}>
                    {t('home.scorecard_subtitle')}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <ContactBar label={t('home.scorecard_email')} pct={stats.contact.email.pct} />
                  <ContactBar label={t('home.scorecard_phone')} pct={stats.contact.phone.pct} />
                  <ContactBar label={t('home.scorecard_facebook')} pct={stats.contact.facebook.pct} />
                  <ContactBar label={t('home.scorecard_twitter')} pct={stats.contact.twitter.pct} />
                </div>

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                  <Link
                    to="/statistics"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontSize: '0.82rem', color: 'var(--md-sys-color-primary)',
                      textDecoration: 'none', fontWeight: 600,
                    }}
                  >
                    {t('home.view_stats')} <ArrowRightIcon />
                  </Link>
                </div>
              </div>

              {/* Browse by party */}
              <div style={{
                background: 'var(--md-sys-color-surface-container-low)',
                border: '1px solid var(--md-sys-color-outline-variant)',
                borderRadius: '16px',
                padding: '20px 24px',
              }}>
                <h3 style={{ fontSize: '0.88rem', margin: '0 0 14px', fontFamily: 'Inter, sans-serif', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Browse by Party
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['PKR', 'DAP', 'Amanah', 'UMNO', 'BERSATU', 'PAS', 'MCA', 'GPS'].map((party) => (
                    <Link
                      key={party}
                      to={`/directory?party=${encodeURIComponent(party)}`}
                      style={{
                        padding: '6px 12px', borderRadius: '999px',
                        fontSize: '0.78rem', fontWeight: 600,
                        background: 'var(--md-sys-color-surface-container)',
                        color: 'var(--md-sys-color-on-surface)',
                        border: '1px solid var(--md-sys-color-outline-variant)',
                        textDecoration: 'none',
                        transition: 'background 0.1s, border-color 0.1s',
                      }}
                    >
                      {party}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .home-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  )
}
