import CopyButton from './CopyButton.jsx'

const ROW_DEFS = [
  { key: 'email',       label: 'Email',  iconTone: 'rose',   icon: '✉' },
  { key: 'phoneNumber', label: 'Phone',  iconTone: 'leaf',   icon: '☎' },
  { key: 'address',     label: 'Office', iconTone: 'violet', icon: '⌂' },
  { key: 'facebook',    label: 'Facebook', iconTone: 'violet', icon: 'f' },
  { key: 'twitter',     label: 'X / Twitter', iconTone: 'gold', icon: '𝕏' },
]

const firstValue = (v) => {
  if (v == null) return null
  if (Array.isArray(v)) return v.find((x) => x && String(x).trim()) ?? null
  const s = String(v).trim()
  return s ? s : null
}

export default function ContactCard({ person, kind = 'mp' }) {
  if (!person) return null
  const tone = kind === 'mp' ? 'leaf' : 'violet'
  const roleLabel = kind === 'mp' ? 'Member of Parliament' : 'State Assemblyman'

  return (
    <article className="contact-card">
      <header className={`contact-card__header contact-card__header--${tone}`}>
        <div className="contact-card__role">{roleLabel}</div>
        <div className="contact-card__name">{person.name}</div>
        <div style={{ marginTop: '0.25rem', fontSize: '0.8125rem', opacity: 0.85 }}>
          {person.party}
          {kind === 'mp'
            ? ` · ${person.federalSeatCode} ${person.federalSeatName}`
            : ` · ${person.stateSeatCode} ${person.stateSeatName}`}
        </div>
      </header>

      <div className="contact-card__body">
        {ROW_DEFS.map((def) => {
          const value = firstValue(person[def.key])
          return (
            <div className="contact-row" key={def.key}>
              <div className={`contact-row__icon contact-row__icon--${def.iconTone}`} aria-hidden="true">
                {def.icon}
              </div>
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
