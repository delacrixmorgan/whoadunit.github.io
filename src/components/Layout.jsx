import { useEffect, useMemo, useState } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { LanguageProvider, useLanguage, useT } from '../i18n/LanguageContext.jsx'

const NAV_LINKS = [
  { to: '/learn',        labelKey: 'nav.learn',        tone: 'rose'   },
  { to: '/find',         labelKey: 'nav.find',         tone: 'violet' },
  { to: '/methodology',  labelKey: 'nav.methodology',  tone: 'gold'   },
  { to: '/volunteer',    labelKey: 'nav.volunteer',    tone: 'rose'   },
]

function NavBar() {
  const t = useT()
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Close mobile menu on navigation
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <nav className="nav">
        <Link to="/" className="nav__logo">Who<span className="kw-rose">adun</span>it</Link>

        <ul className="nav__links">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => isActive ? `is-active tone-${l.tone}` : ''}
              >
                {t(l.labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="lang-toggle" role="group" aria-label="Language">
          <button
            type="button"
            className={`lang-btn ${lang === 'en' ? 'is-active' : ''}`}
            aria-pressed={lang === 'en'}
            onClick={() => setLang('en')}
          >EN</button>
          <button
            type="button"
            className={`lang-btn ${lang === 'ms' ? 'is-active' : ''}`}
            aria-pressed={lang === 'ms'}
            onClick={() => setLang('ms')}
          >BM</button>
        </div>

        <Link to="/find" className="nav__cta">{t('nav.cta')}</Link>

        <button
          type="button"
          className="nav__menu-btn"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && <MobileMenu close={() => setOpen(false)} />}
    </>
  )
}

function MobileMenu({ close }) {
  const t = useT()
  return (
    <div
      style={{
        position: 'fixed', inset: '56px 0 0 0', zIndex: 99,
        background: 'var(--paper)', padding: '2rem 1.5rem',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        borderTop: '1px solid rgba(26,23,20,0.08)',
      }}
    >
      {NAV_LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          onClick={close}
          style={({ isActive }) => ({
            fontSize: '1.25rem', fontWeight: 800,
            color: isActive ? 'var(--ink)' : 'var(--ink-soft)',
            padding: '0.5rem 0',
          })}
        >
          {t(l.labelKey)}
        </NavLink>
      ))}
      <Link to="/find" className="btn btn--rose" onClick={close} style={{ marginTop: '1rem' }}>
        {t('nav.cta')}
      </Link>
    </div>
  )
}

function Footer() {
  const t = useT()
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="footer-logo">Who<span className="kw-rose">adun</span>it</div>
          <div className="footer-tagline">{t('nav.tagline')}</div>
        </div>
        <div className="footer-links">
          <Link to="/learn">{t('nav.learn')}</Link>
          <Link to="/find">{t('nav.find')}</Link>
          <Link to="/methodology">{t('nav.methodology')}</Link>
          <Link to="/volunteer">{t('nav.volunteer')}</Link>
          <a href="https://github.com/delacrixmorgan/whoadunit-www" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>{t('footer.copyright')}</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/methodology">{t('footer.privacy')}</Link>
          <Link to="/methodology">{t('footer.licence')}</Link>
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  return (
    <LanguageProvider>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </LanguageProvider>
  )
}

// Re-export for downstream uses
export { useT, useLanguage }
