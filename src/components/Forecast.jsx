import { Icon } from './IconSprite'

const DEFAULT_WAVE_PATH = "M0,79 C30,79 50,64 80,62 C110,60 135,75 165,78 C195,81 220,58 255,55 C290,52 315,68 350,72 C385,76 410,52 445,48 C480,44 505,62 540,65 C575,68 600,46 635,44 C670,42 700,62 735,68 C770,74 805,62 835,60"

export default function Forecast({ cityData, tempUnit, style }) {
  const wavePath = cityData.wavePath || DEFAULT_WAVE_PATH

  const convertTemp = (tempStr) => {
    if (tempUnit === 'C') return tempStr
    const num = parseInt(tempStr)
    if (isNaN(num)) return tempStr
    const fahr = Math.round(num * 9/5 + 32)
    return `${fahr}°`
  }

  return (
    <section
      aria-label="Hourly forecast"
      style={{
        position: 'absolute',
        left: 'calc(126 * var(--u))',
        right: 'calc(396 * var(--u))',
        bottom: 'calc(99 * var(--u))',
        zIndex: 10,
        ...style
      }}
    >
      {/* Temps row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {cityData.temps.map(({ val, icon, cls }) => (
          <div
            key={val + icon}
            className={cls}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'calc(8 * var(--u))' }}
          >
            <span style={{ fontSize: 'calc(37 * var(--u))', fontWeight: 400, letterSpacing: 'calc(-.7 * var(--u))', color: '#fff', lineHeight: 1 }}>
              {convertTemp(val)}
            </span>
            <Icon id={icon} width="32" height="32" style={{ opacity: 0.9 }} />
          </div>
        ))}
      </div>

      {/* Wave chart SVG — draws stroke then wipes fill */}
      <svg
        viewBox="0 0 835 230"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ width: '100%', height: 'calc(230 * var(--u))', marginTop: 'calc(43 * var(--u))', display: 'block' }}
      >
        <defs>
          {/* horizontal opacity gradient for stroke */}
          <linearGradient id="wg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#fff" stopOpacity="0"/>
            <stop offset="8%"   stopColor="#fff" stopOpacity="1"/>
            <stop offset="92%"  stopColor="#fff" stopOpacity="1"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
          {/* vertical fade for fill */}
          <linearGradient id="wf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#fff" stopOpacity=".32"/>
            <stop offset="100%" stopColor="#fff" stopOpacity=".04"/>
          </linearGradient>
          {/* mask to fade fill bottom */}
          <linearGradient id="wfade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#fff"/>
            <stop offset="100%" stopColor="#fff" stopOpacity=".2"/>
          </linearGradient>
          <mask id="fillMask">
            <rect x="0" y="0" width="835" height="230" fill="url(#wfade)"/>
          </mask>
          {/* clip rect for fill wipe-in left→right */}
          <clipPath id="wclip">
            <rect id="wclipr" x="0" y="0" width="835" height="230"/>
          </clipPath>
        </defs>

        {/* fill — clipped by wipe animation */}
        <g clipPath="url(#wclip)">
          <path
            d={`${wavePath} L835,230 L0,230 Z`}
            fill="url(#wf)"
            mask="url(#fillMask)"
          />
        </g>

        {/* 3 layered strokes: shadow → mid → crisp */}
        <path className="wline" d={wavePath} fill="none" stroke="url(#wg)" strokeWidth="6.2" strokeLinecap="round" opacity=".17" pathLength="1" strokeDasharray="1"/>
        <path className="wline" d={wavePath} fill="none" stroke="url(#wg)" strokeWidth="4.6" strokeLinecap="round" opacity=".26" pathLength="1" strokeDasharray="1"/>
        <path className="wline" d={wavePath} fill="none" stroke="url(#wg)" strokeWidth="3.4" strokeLinecap="round" opacity="1"   pathLength="1" strokeDasharray="1"/>
      </svg>

      {/* Days row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'calc(-31 * var(--u))' }}>
        {cityData.days.map(({ label, cls, active }) => (
          <span
            key={label}
            className={cls}
            style={{
              fontSize: 'calc(18 * var(--u))',
              fontWeight: active ? 600 : 500,
              color: active ? '#fff' : 'rgba(255,255,255,.88)',
              letterSpacing: 'calc(-.2 * var(--u))',
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  )
}
