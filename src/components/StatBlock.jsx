export default function StatBlock({ tone = 'gold', label, num, caption }) {
  return (
    <div className={`stat-block stat-block--${tone}`}>
      <div className="stat-block__label">{label}</div>
      <div className="stat-block__num">{num}</div>
      {caption && <div className="stat-block__caption">{caption}</div>}
    </div>
  )
}
