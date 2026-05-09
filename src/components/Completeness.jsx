import { getContactCompleteness } from '../hooks/useRepresentatives.js'

const FIELDS = [
  { key: 'email', label: 'Email' },
  { key: 'phoneNumber', label: 'Phone' },
  { key: 'address', label: 'Office address' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'twitter', label: 'X / Twitter' },
]

const isFilled = (rep, key) => {
  const v = rep[key]
  if (Array.isArray(v)) return v.length > 0
  return v && String(v).trim() !== ''
}

export default function Completeness({ person, label = 'Profile completeness' }) {
  if (!person) return null
  const pct = getContactCompleteness(person)
  const missing = FIELDS.filter((f) => !isFilled(person, f.key))
  const fillTone = pct >= 75 ? 'leaf' : pct >= 50 ? '' : 'rose'

  return (
    <div className="completeness">
      <div className="completeness__row">
        <span className="completeness__label">{label}</span>
        <span className="completeness__pct">{pct}%</span>
      </div>
      <div className="bar-track">
        <div
          className={`bar-fill ${fillTone ? `bar-fill--${fillTone}` : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {missing.length > 0 && (
        <>
          <div className="completeness__missing">
            {missing.map((f) => (
              <span className="missing-tag" key={f.key}>{f.label}</span>
            ))}
          </div>
          <p className="completeness__copy">
            Help us make this profile more complete — every contact detail makes the directory more useful.
          </p>
        </>
      )}
    </div>
  )
}
