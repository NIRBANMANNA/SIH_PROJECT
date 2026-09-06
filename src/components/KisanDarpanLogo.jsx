import React from 'react'

/**
 * KisanDarpanLogo — Official Brand Logo for Kisan Darpan AI (Concept 3: Golden Wheat Infinity Loop + Dynamic Effects)
 *
 * Enhanced for high visibility, vivid luminosity, and rich dynamic effects:
 * - Concentric radar scanning waves with glowing cyan pulses
 * - Radiant 24K Golden Wheat stalk with flowing gleam
 * - Vivid Electric Cyan Infinity Loop with neon Darpan mirror reflections
 * - Supernova AI Intelligence Star with breathing flares & rotating lens flare
 */
export default function KisanDarpanLogo({
  size = 40,
  animated = true,
  variant = 'card', // 'card' | 'bare'
  className = '',
  style = {},
  onClick,
  showText = false
}) {
  const uId = React.useId().replace(/:/g, '')

  const content = (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'visible',
        filter: 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.45))'
      }}
    >
      <defs>
        {/* Luminous 24K Gold Gradient */}
        <linearGradient id={`kdGoldVivid-${uId}`} x1="12" y1="8" x2="48" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>

        {/* Luminous Electric Cyan-Teal Infinity Gradient */}
        <linearGradient id={`kdInfinityVivid-${uId}`} x1="12" y1="36" x2="54" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="25%" stopColor="#00f2fe" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="75%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>

        {/* Inner Mirror Gleam Gradient */}
        <linearGradient id={`kdMirrorGleam-${uId}`} x1="20" y1="32" x2="46" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fef08a" stopOpacity="0.9" />
        </linearGradient>

        {/* Supernova AI Core Radial Glow */}
        <radialGradient id={`kdAiCoreVivid-${uId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#7dd3fc" />
          <stop offset="70%" stopColor="#00f2fe" />
          <stop offset="100%" stopColor="#0284c7" />
        </radialGradient>

        {/* Core Flare Filter for high-impact neon brightness */}
        <filter id={`kdGlowFilter-${uId}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dynamic Background Radar Pulse Ripples */}
      {animated && (
        <g style={{ transformOrigin: '34px 36px' }}>
          <circle
            cx="34"
            cy="36"
            r="4"
            stroke="#00f2fe"
            strokeWidth="1.8"
            fill="none"
            opacity="0.9"
            style={{
              animation: 'kdRadarPulseVivid 2.4s infinite cubic-bezier(0.1, 0.7, 0.1, 1)',
              transformOrigin: '34px 36px'
            }}
          />
          <circle
            cx="34"
            cy="36"
            r="4"
            stroke="#38bdf8"
            strokeWidth="1.5"
            fill="none"
            opacity="0.8"
            style={{
              animation: 'kdRadarPulseVivid 2.4s infinite cubic-bezier(0.1, 0.7, 0.1, 1) 0.8s',
              transformOrigin: '34px 36px'
            }}
          />
          <circle
            cx="34"
            cy="36"
            r="4"
            stroke="#34d399"
            strokeWidth="1.2"
            fill="none"
            opacity="0.7"
            style={{
              animation: 'kdRadarPulseVivid 2.4s infinite cubic-bezier(0.1, 0.7, 0.1, 1) 1.6s',
              transformOrigin: '34px 36px'
            }}
          />
        </g>
      )}

      {/* Ambient Radial Backlight Glow */}
      <circle
        cx="34"
        cy="36"
        r="14"
        fill="url(#kdAiCoreVivid-${uId})"
        opacity={animated ? "0.22" : "0.15"}
        style={animated ? { animation: 'kdAmbientAura 3s infinite ease-in-out' } : {}}
      />

      {/* Golden Wheat Stalk (Kisan Harvest) */}
      <g style={animated ? { animation: 'kdWheatSwayVivid 3.6s ease-in-out infinite', transformOrigin: '14px 46px' } : {}}>
        {/* Main bold golden wheat arc */}
        <path
          d="M 14 47 C 15 32, 20 18, 36 10 C 41 8, 46 8, 51 8"
          stroke={`url(#kdGoldVivid-${uId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
          filter={`url(#kdGlowFilter-${uId})`}
        />
        {/* Golden wheat awns / trailing rays */}
        <path d="M 38 10 C 43 8, 48 7, 54 7" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
        <path d="M 33 13 C 39 11, 44 11, 50 12" stroke="#fef08a" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
        <path d="M 28 17 C 33 15, 39 15, 45 17" stroke="#facc15" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />

        {/* Individual Bold Golden Wheat Grains */}
        <path d="M 18 37 C 15 33, 17 29, 22 32 C 25 34, 23 38, 18 37 Z" fill={`url(#kdGoldVivid-${uId})`} stroke="#ffffff" strokeWidth="0.6" />
        <path d="M 21 30 C 18 25, 21 21, 26 25 C 29 27, 27 32, 21 30 Z" fill={`url(#kdGoldVivid-${uId})`} stroke="#ffffff" strokeWidth="0.6" />
        <path d="M 26 23 C 23 18, 27 15, 32 19 C 34 21, 33 26, 26 23 Z" fill={`url(#kdGoldVivid-${uId})`} stroke="#ffffff" strokeWidth="0.6" />
        <path d="M 32 17 C 30 12, 35 10, 39 14 C 42 16, 39 21, 32 17 Z" fill={`url(#kdGoldVivid-${uId})`} stroke="#ffffff" strokeWidth="0.7" />
        <path d="M 38 13 C 38 8, 43 7, 47 11 C 49 13, 46 17, 38 13 Z" fill={`url(#kdGoldVivid-${uId})`} stroke="#ffffff" strokeWidth="0.8" />
        <path d="M 45 10 C 46 6, 51 6, 53 10 C 54 12, 51 15, 45 10 Z" fill={`url(#kdGoldVivid-${uId})`} stroke="#ffffff" strokeWidth="0.8" />
      </g>

      {/* Infinity Darpan Loop: The Continuous Mirror of Agri-Intelligence */}
      {/* Outer Neon Glow Path */}
      <path
        d="M 34 36 
           C 27 25, 14 25, 14 36 
           C 14 47, 27 47, 34 36 
           C 41 25, 54 25, 54 36 
           C 54 47, 41 47, 34 36 Z"
        stroke={`url(#kdInfinityVivid-${uId})`}
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#kdGlowFilter-${uId})`}
        style={animated ? { animation: 'kdInfinityGleamVivid 2.8s ease-in-out infinite' } : {}}
      />

      {/* Inner Crisp Reflective Darpan Highlight Line */}
      <path
        d="M 34 36 
           C 28 28, 17 28, 17 36 
           C 17 44, 28 44, 34 36 
           C 40 28, 51 28, 51 36 
           C 51 44, 40 44, 34 36 Z"
        stroke={`url(#kdMirrorGleam-${uId})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.95"
      />

      {/* Dynamic Supernova AI Intelligence Star (Center Nexus at 34, 36) */}
      <g
        style={
          animated
            ? {
                animation: 'kdStarGlowVivid 2s infinite ease-in-out',
                transformOrigin: '34px 36px'
              }
            : {}
        }
      >
        {/* Subtle Rotating Cross Flare */}
        <g style={animated ? { animation: 'kdFlareSpin 8s infinite linear', transformOrigin: '34px 36px' } : {}}>
          <line x1="34" y1="23" x2="34" y2="49" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.65" />
          <line x1="21" y1="36" x2="47" y2="36" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.65" />
          <line x1="26" y1="28" x2="42" y2="44" stroke="#38bdf8" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
          <line x1="42" y1="28" x2="26" y2="44" stroke="#38bdf8" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        </g>

        {/* 4-pointed Radiant Supernova AI Star */}
        <path
          d="M 34 25.5
             C 34 32.5, 29 36, 23.5 36
             C 29 36, 34 39.5, 34 46.5
             C 34 39.5, 39 36, 44.5 36
             C 39 36, 34 32.5, 34 25.5 Z"
          fill={`url(#kdAiCoreVivid-${uId})`}
          filter={`url(#kdGlowFilter-${uId})`}
        />

        {/* Inner Brilliant Diamond Spark */}
        <path
          d="M 34 29
             C 34 33.5, 31.5 36, 27 36
             C 31.5 36, 34 38.5, 34 43
             C 34 38.5, 36.5 36, 41 36
             C 36.5 36, 34 33.5, 34 29 Z"
          fill="#ffffff"
        />
        {/* Center Pulsing White Hotspot */}
        <circle cx="34" cy="36" r="2.2" fill="#ffffff" filter={`url(#kdGlowFilter-${uId})`} />
      </g>
    </svg>
  )

  return (
    <div
      className={`kisan-darpan-logo-wrap ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'calc(10 * var(--u, 1px))',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        ...style
      }}
    >
      <style>{`
        @keyframes kdRadarPulseVivid {
          0% {
            r: 3px;
            opacity: 1;
            stroke-width: 2.2px;
          }
          40% {
            opacity: 0.85;
          }
          100% {
            r: 16px;
            opacity: 0;
            stroke-width: 0.5px;
          }
        }
        @keyframes kdStarGlowVivid {
          0%, 100% {
            transform: scale(0.9);
            filter: drop-shadow(0 0 4px #00f2fe) drop-shadow(0 0 10px #06b6d4);
            opacity: 0.92;
          }
          50% {
            transform: scale(1.22);
            filter: drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 16px #38bdf8) drop-shadow(0 0 24px #00f2fe);
            opacity: 1;
          }
        }
        @keyframes kdFlareSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes kdWheatSwayVivid {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-2deg);
          }
        }
        @keyframes kdInfinityGleamVivid {
          0%, 100% {
            stroke-opacity: 0.9;
            filter: drop-shadow(0 0 4px rgba(6, 182, 212, 0.6));
          }
          50% {
            stroke-opacity: 1;
            filter: drop-shadow(0 0 8px rgba(0, 242, 254, 0.9)) drop-shadow(0 0 14px rgba(250, 204, 21, 0.5));
          }
        }
        @keyframes kdAmbientAura {
          0%, 100% {
            transform: scale(0.85);
            opacity: 0.18;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.38;
          }
        }
      `}</style>

      {variant === 'bare' ? (
        <div
          style={{
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative'
          }}
        >
          {content}
        </div>
      ) : (
        <div
          className="kd-logo-container"
          style={{
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.28),
            background: 'linear-gradient(145deg, rgba(8, 28, 42, 0.95) 0%, rgba(2, 14, 22, 0.98) 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.55)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.55), 0 0 16px rgba(6, 182, 212, 0.4), inset 0 1.5px 2px rgba(255, 255, 255, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
            padding: Math.round(size * 0.08),
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {content}
        </div>
      )}

      {/* Optional Brand Text */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span
            style={{
              fontSize: 'calc(16 * var(--u, 1px))',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #ffffff 0%, #7dd3fc 60%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 12px rgba(56, 189, 248, 0.35)'
            }}
          >
            Kisan Darpan
          </span>
          <span
            style={{
              fontSize: 'calc(10.5 * var(--u, 1px))',
              fontWeight: 700,
              color: '#38bdf8',
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}
          >
            AI Intelligence
          </span>
        </div>
      )}
    </div>
  )
}
