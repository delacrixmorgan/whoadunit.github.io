/**
 * Vivid full-bleed representative card. Leaf for MP, violet for ADUN.
 * Used on `/` (Step 2/3) and `/seat/:code`.
 */
export default function RepCard({ person, kind = 'mp' }) {
  const tone = kind === 'mp' ? 'leaf' : 'violet'
  const role = kind === 'mp' ? 'Member of Parliament' : 'State Assemblyman'
  const emoji = person.gender === 'F' ? '👩' : person.gender === 'M' ? '👨' : '👤'

  return (
    <div className={`rep-card rep-card--${tone}`}>
      <div className="rep-card__avatar" aria-hidden="true">{emoji}</div>
      <span className="rep-card__role">{role}</span>
      <h3 className="rep-card__name">{person.name}</h3>
      <p className="rep-card__meta">
        <strong style={{ fontWeight: 700 }}>{person.party}</strong>
        {kind === 'mp'
          ? ` · ${person.federalSeatCode} ${person.federalSeatName} · ${person.state}`
          : ` · ${person.stateSeatCode} ${person.stateSeatName} · ${person.state}`}
        <br />
        Elected {person.electedYear}
      </p>
    </div>
  )
}
