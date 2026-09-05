export default function Hero({ cityData, tempUnit, chipText, style }) {
  // Format temperature in description details if Fahrenheit is active
  let detailText = cityData?.detail || ''
  if (tempUnit === 'F') {
    detailText = detailText.replace('50°F', '50°F').replace('10°C', '50°F')
  }

  const badgeTitle = chipText || (cityData?.block ? `Block Forecast • ${cityData.block}` : 'Weather Forecast')

  return (
    <section
      className="hero-section"
      aria-label="Current weather"
      style={{
        position: 'absolute',
        left: 'calc(126 * var(--u))',
        top: 'calc(136 * var(--u))',
        maxWidth: 'calc(560 * var(--u))',
        zIndex: 10,
        ...style
      }}
    >
      {/* Chip */}
      <div
        className="anim-chip sheen"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: 'calc(36 * var(--u))',
          borderRadius: 'calc(18 * var(--u))',
          padding: '0 calc(15 * var(--u))',
          background: 'rgba(255,255,255,.175)',
          backdropFilter: 'blur(calc(16 * var(--u))) saturate(115%)',
          WebkitBackdropFilter: 'blur(calc(16 * var(--u))) saturate(115%)',
          fontSize: 'calc(13 * var(--u))',
          fontWeight: 600,
          letterSpacing: 'calc(.2 * var(--u))',
          color: 'rgba(255,255,255,.95)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 calc(2 * var(--u)) calc(8 * var(--u)) rgba(0,0,0,0.1)'
        }}
      >
        {badgeTitle}
      </div>

      {/* H1 with mask-reveal lines */}
      <h1
        className="hero-title"
        style={{
          fontFamily: "'Inter Tight', 'Inter', sans-serif",
          fontWeight: 500,
          fontSize: 'calc(63 * var(--u))',
          lineHeight: 'calc(78 * var(--u))',
          letterSpacing: 'calc(.25 * var(--u))',
          color: '#fff',
          marginTop: 'calc(18 * var(--u))',
          overflow: 'hidden',
          textTransform: 'capitalize'
        }}
      >
        <span style={{ overflow: 'hidden', display: 'block' }}>
          <span className="anim-h1l1" style={{ display: 'block' }}>{cityData?.condition}</span>
        </span>
      </h1>

      {/* Blurb */}
      <p
        className="anim-blurb"
        style={{
          width: 'calc(480 * var(--u))',
          fontSize: 'calc(15.2 * var(--u))',
          lineHeight: 'calc(24 * var(--u))',
          fontWeight: 500,
          letterSpacing: 'calc(-.3 * var(--u))',
          color: 'rgba(255,255,255,.95)',
          marginTop: 'calc(20 * var(--u))',
        }}
      >
        {detailText}
      </p>
    </section>
  )
}
