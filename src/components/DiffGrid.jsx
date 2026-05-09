export default function DiffGrid({ mp, adun }) {
  return (
    <div className="diff-grid">
      <Tile tone="leaf" label="Member of Parliament" name={mp?.name} scope="National · Dewan Rakyat" bullets={[
        'Federal laws and budgets',
        'National policy (taxes, education, internet)',
        'Raises questions in Parliament',
        'One MP per federal seat (222 total)',
      ]} />
      <Tile tone="violet" label="State Assemblyman" name={adun?.name || '— ADUN —'} scope="State · Dewan Undangan Negeri" bullets={[
        'State laws and budgets',
        'Local issues (drains, roads, parks)',
        'Service centre office hours',
        'Multiple ADUNs per federal seat (576 total)',
      ]} />
    </div>
  )
}

function Tile({ tone, label, name, scope, bullets }) {
  return (
    <div className={`diff-tile diff-tile--${tone}`}>
      <div className="diff-tile__label">{label}</div>
      <div className="diff-tile__name">{name}</div>
      <div className="diff-tile__scope">{scope}</div>
      <ul className="diff-tile__list">
        {bullets.map((b) => <li key={b}>{b}</li>)}
      </ul>
    </div>
  )
}
