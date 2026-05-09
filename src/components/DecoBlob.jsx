const TONE = {
  rose: 'var(--rose)',
  leaf: 'var(--leaf)',
  violet: 'var(--violet)',
  gold: 'var(--gold)',
}

export default function DecoBlob({
  tone = 'rose',
  size = 480,
  opacity = 0.13,
  top,
  right,
  bottom,
  left,
  style,
}) {
  return (
    <span
      aria-hidden="true"
      className="deco-blob"
      style={{
        width: size,
        height: size,
        background: TONE[tone] || tone,
        opacity,
        top,
        right,
        bottom,
        left,
        ...style,
      }}
    />
  )
}
