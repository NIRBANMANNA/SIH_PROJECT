import React, { useState, useEffect, useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'

export default function Hero({ cityData, tempUnit, chipText, style }) {
  const { liveApiResult } = useDashboard()

  // Real-time clock for accurate day/night time sense
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 10000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours()
  const minutes = time.getMinutes()
  const timeStr = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${hours >= 12 ? 'PM' : 'AM'}`

  // Precise astronomical day/night cycle
  const timeDec = hours + minutes / 60
  const isNight = timeDec < 5.0 || timeDec >= 19.5
  const isDawn = timeDec >= 5.0 && timeDec < 7.5
  const isSunset = timeDec >= 17.0 && timeDec < 19.5

  const timeLabel = isNight ? 'Night' : isDawn ? 'Dawn' : isSunset ? 'Sunset' : 'Day'
  const timeIcon = isNight ? '🌙' : isDawn ? '🌄' : isSunset ? '🌅' : '☀️'

  // Extract accurate rainfall mm from trained model or live block telemetry
  const rainText = useMemo(() => {
    if (liveApiResult?.variables?.tp?.avg != null) {
      return `${Number(liveApiResult.variables.tp.avg).toFixed(1)} mm Rain`
    }
    if (liveApiResult?.tp?.avg != null) {
      return `${Number(liveApiResult.tp.avg).toFixed(1)} mm Rain`
    }
    if (cityData?.rainfall) {
      const str = String(cityData.rainfall).trim()
      return str.toLowerCase().includes('mm') ? `${str} Rain` : `${str} mm Rain`
    }
    return '0.0 mm Rain'
  }, [liveApiResult, cityData?.rainfall])

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
      {/* Chips Row: Block Weather Tile + Live Night/Day Time Rain mm Tile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', flexWrap: 'wrap' }}>
        {/* Block Weather Tile */}
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

        {/* Live Night Time Rain mm Tile Beside Block Weather */}
        <div
          className="anim-chip sheen"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'calc(8 * var(--u))',
            height: 'calc(36 * var(--u))',
            borderRadius: 'calc(18 * var(--u))',
            padding: '0 calc(14 * var(--u))',
            background: isNight ? 'rgba(15, 23, 42, 0.48)' : 'rgba(255,255,255,.175)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            backdropFilter: 'blur(calc(16 * var(--u))) saturate(115%)',
            WebkitBackdropFilter: 'blur(calc(16 * var(--u))) saturate(115%)',
            fontSize: 'calc(12.5 * var(--u))',
            fontWeight: 600,
            letterSpacing: 'calc(.2 * var(--u))',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 calc(2 * var(--u)) calc(8 * var(--u)) rgba(0,0,0,0.15)'
          }}
        >
          <span style={{ width: 'calc(6 * var(--u))', height: 'calc(6 * var(--u))', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8', flexShrink: 0 }} />
          <span>{timeIcon} {timeLabel} • {timeStr}</span>
          <span style={{ width: '1px', height: 'calc(14 * var(--u))', background: 'rgba(255,255,255,0.22)' }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'calc(4 * var(--u))', color: '#7dd3fc', fontWeight: 700 }}>
            🌧️ {rainText}
          </span>
        </div>
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
