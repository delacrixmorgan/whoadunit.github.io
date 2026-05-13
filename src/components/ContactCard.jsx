import { Link } from 'react-router-dom'
import CopyButton from './CopyButton.jsx'

const ROW_DEFS = [
  { key: 'email',       label: 'Email' },
  { key: 'phoneNumber', label: 'Phone' },
  { key: 'address',     label: 'Service Centre' },
  { key: 'facebook',    label: 'Facebook' },
  { key: 'twitter',     label: 'X / Twitter' },
]

const firstValue = (v) => {
  if (v == null) return null
  if (Array.isArray(v)) return v.find((x) => x && String(x).trim()) ?? null
  const s = String(v).trim()
  return s ? s : null
}

export default function ContactCard({ person, kind = 'mp', asLink = true }) {
  if (!person) return null
  const tone = kind === 'mp' ? 'leaf' : 'violet'
  const roleLabel = kind === 'mp' ? 'Member of Parliament' : 'State Assemblyman'
  const profilePath = kind === 'mp'
    ? `/representative/2022/${person.federalSeatCode}`
    : `/representative/2022/${person.federalSeatCode}/${person.stateSeatCode}`

  const subLabel = `${person.party}${
    kind === 'mp'
      ? ` · ${person.federalSeatCode} ${person.federalSeatName}`
      : ` · ${person.stateSeatCode} ${person.stateSeatName}`
  }`

  const headerInner = (
    <>
      <div className="contact-card__role">{roleLabel}</div>
      <div className="contact-card__name">
        {person.name}
        {asLink && <span className="contact-card__header-arrow" aria-hidden="true">→</span>}
      </div>
      <div style={{ marginTop: '0.25rem', fontSize: '0.8125rem', opacity: 0.85 }}>
        {subLabel}
      </div>
    </>
  )

  return (
    <article className="contact-card">
      {asLink ? (
        <Link
          to={profilePath}
          className={`contact-card__header contact-card__header--${tone} contact-card__header--link`}
        >
          {headerInner}
        </Link>
      ) : (
        <div className={`contact-card__header contact-card__header--${tone}`}>
          {headerInner}
        </div>
      )}

      <div className="contact-card__body">
        {ROW_DEFS.map((def) => {
          const value = firstValue(person[def.key])
          return (
            <div className="contact-row" key={def.key}>
              <div className="contact-row__main">
                <div className="contact-row__label">{def.label}</div>
                {value ? (
                  <div className="contact-row__value">{value}</div>
                ) : (
                  <div className="contact-row__missing">Not yet available</div>
                )}
              </div>
              {value && (
                <div className="contact-row__action">
                  <CopyButton value={value} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </article>
  )
}
