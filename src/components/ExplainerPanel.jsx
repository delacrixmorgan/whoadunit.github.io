export default function ExplainerPanel({ question, answer, chips }) {
  return (
    <div className="explainer-panel">
      <h3 className="explainer-panel__q">{question}</h3>
      <p className="explainer-panel__a">{answer}</p>
      {chips && chips.length > 0 && (
        <div className="chips">
          {chips.map((c, i) => (
            <span key={i} className={`chip chip--${c.tone || 'rose'}`}>{c.label}</span>
          ))}
        </div>
      )}
    </div>
  )
}
