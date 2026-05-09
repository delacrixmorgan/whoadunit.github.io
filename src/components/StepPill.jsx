export default function StepPill({ tone = 'rose', num, children }) {
  return (
    <div className={`step-pill step-pill--${tone}`}>
      <span className="step-pill__num">{num}</span>
      <span className="step-pill__text">{children}</span>
    </div>
  )
}
