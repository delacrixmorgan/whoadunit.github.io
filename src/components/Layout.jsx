import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { t } from '../i18n'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

export default function Layout() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/learn?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMenuOpen(false)
    }
  }

  const navLinks = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/learn', label: 'Learn' },
    { to: '/find', label: 'Find' },
    { to: '/directory', label: t('nav.directory') },
    { to: '/statistics', label: t('nav.statistics') },
    { to: '/data-methodology', label: t('methodology.heading') },
    { to: '/volunteer', label: 'Volunteer' },
    { to: '/about', label: 'About' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'var(--md-sys-color-surface-container-low)',
        borderBottom: '1px solid var(--md-sys-color-outline-variant)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '24px' }}>

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'var(--md-sys-color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{
                  color: 'var(--md-sys-color-on-primary)',
                  fontWeight: '700', fontSize: '15px',
                  fontFamily: 'Libre Baskerville, Georgia, serif',
                  letterSpacing: '-0.02em',
                }}>W</span>
              </div>
              <div style={{ lineHeight: 1.15 }}>
                <div style={{
                  fontFamily: 'Libre Baskerville, Georgia, serif',
                  fontWeight: '700', fontSize: '1rem',
                  color: 'var(--md-sys-color-on-surface)',
                  letterSpacing: '-0.01em',
                }}>
                  Whoadunit
                </div>
                <div style={{
                  fontSize: '0.6rem',
                  color: 'var(--md-sys-color-primary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  opacity: 0.75,
                }}>
                  MY · Rep Directory
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1, justifyContent: 'center' }} className="desktop-nav">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="desktop-search">
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--md-sys-color-outline)', pointerEvents: 'none',
                  }}>
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="Search…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'var(--md-sys-color-surface-container)',
                      border: '1px solid var(--md-sys-color-outline-variant)',
                      borderRadius: '999px',
                      color: 'var(--md-sys-color-on-surface)',
                      padding: '7px 14px 7px 30px',
                      fontSize: '0.82rem',
                      fontFamily: 'Inter, sans-serif',
                      width: '160px',
                      transition: 'width 0.2s cubic-bezier(0.16,1,0.3,1), border-color 0.15s',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.width = '220px'
                      e.target.style.borderColor = 'var(--md-sys-color-primary)'
                    }}
                    onBlur={(e) => {
                      e.target.style.width = '160px'
                      e.target.style.borderColor = 'var(--md-sys-color-outline-variant)'
                    }}
                  />
                </div>
              </form>

              {/* Dark mode toggle */}
              <button
                onClick={() => setDark(!dark)}
                style={{
                  background: 'var(--md-sys-color-surface-container)',
                  border: '1px solid var(--md-sys-color-outline-variant)',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s, color 0.15s',
                  minWidth: '36px',
                  minHeight: '36px',
                }}
                aria-label="Toggle dark mode"
                title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: menuOpen ? 'var(--md-sys-color-surface-container)' : 'none',
                  border: '1px solid ' + (menuOpen ? 'var(--md-sys-color-outline-variant)' : 'transparent'),
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  color: 'var(--md-sys-color-on-surface)',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '36px',
                  minHeight: '36px',
                }}
                className="mobile-menu-btn"
                aria-label="Menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            background: 'var(--md-sys-color-surface-container-low)',
            borderTop: '1px solid var(--md-sys-color-outline-variant)',
            padding: '16px 24px 20px',
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' }}>
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) => ({
                    padding: '11px 14px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.95rem',
                    color: isActive ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
                    background: isActive ? 'var(--md-sys-color-primary-container)' : 'transparent',
                    transition: 'background 0.1s',
                  })}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Search representatives…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary" style={{ flexShrink: 0, padding: '10px 18px' }}>
                Go
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--md-sys-color-surface-container)',
        borderTop: '1px solid var(--md-sys-color-outline-variant)',
        padding: '48px 24px 0',
        marginTop: 'auto',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Main footer grid */}
          <div className="footer-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 1fr',
            gap: '48px',
            alignItems: 'start',
            paddingBottom: '40px',
          }}>

            {/* Brand column */}
            <div>
              <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '9px',
                  background: 'var(--md-sys-color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ color: 'var(--md-sys-color-on-primary)', fontWeight: '700', fontSize: '14px', fontFamily: 'Libre Baskerville, serif' }}>W</span>
                </div>
                <span style={{ fontFamily: 'Libre Baskerville, serif', fontWeight: '700', fontSize: '1rem', color: 'var(--md-sys-color-on-surface)', letterSpacing: '-0.01em' }}>
                  Whoadunit
                </span>
              </Link>
              <p style={{
                margin: '0 0 10px',
                fontFamily: 'Libre Baskerville, Georgia, serif',
                fontStyle: 'italic',
                fontSize: '0.95rem',
                color: 'var(--md-sys-color-on-surface)',
                lineHeight: 1.4,
                letterSpacing: '-0.005em',
              }}>
                Know who represents you.
              </p>
              <p style={{
                margin: 0,
                fontSize: '0.82rem',
                color: 'var(--md-sys-color-on-surface-variant)',
                maxWidth: '300px',
                lineHeight: 1.65,
              }}>
                An open directory of Malaysian elected representatives at federal and state level.
              </p>
            </div>

            {/* Navigate column */}
            <div>
              <p style={{
                margin: '0 0 14px',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: 'var(--md-sys-color-outline)',
                fontFamily: 'Inter, sans-serif',
              }}>
                Navigate
              </p>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="footer-link"
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--md-sys-color-on-surface-variant)',
                      textDecoration: 'none',
                      padding: '5px 0',
                      transition: 'color 0.15s',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 450,
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contribute column */}
            <div>
              <p style={{
                margin: '0 0 14px',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: 'var(--md-sys-color-outline)',
                fontFamily: 'Inter, sans-serif',
              }}>
                Contribute
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Link
                  to="/volunteer"
                  className="footer-link"
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    textDecoration: 'none',
                    padding: '5px 0',
                    transition: 'color 0.15s',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 450,
                  }}
                >
                  Volunteer
                </Link>
                <Link
                  to="/data-methodology"
                  className="footer-link"
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    textDecoration: 'none',
                    padding: '5px 0',
                    transition: 'color 0.15s',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 450,
                  }}
                >
                  Data Methodology
                </Link>
                <a
                  href="https://github.com/delacrixmorgan/whoadunit.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    textDecoration: 'none',
                    padding: '5px 0',
                    transition: 'color 0.15s',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 450,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  GitHub
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid var(--md-sys-color-outline-variant)',
            padding: '16px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-outline)', fontFamily: 'Inter, sans-serif' }}>
              © {new Date().getFullYear()} Whoadunit
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-outline)', fontFamily: 'Inter, sans-serif' }}>
              Open data for the Rakyat
            </span>
          </div>

        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-search { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 640px) {
          .footer-grid { gap: 28px !important; }
        }
        .footer-link:hover {
          color: var(--md-sys-color-on-surface) !important;
        }
      `}</style>
    </div>
  )
}
