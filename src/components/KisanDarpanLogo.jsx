import React from 'react'

/**
 * KisanDarpanLogo — Official Brand Logo for Kisan Darpan AI (Concept 3: Golden Wheat Infinity Loop + Dynamic Effects)
 *
 * Features:
 * - Golden wheat / paddy arching over the infinity Darpan loop
 * - Concentric meteorological radar ripple scanning waves (Dynamic)
 * - Pulsing cyan-emerald AI Intelligence Star at the nexus (Dynamic)
 * - Shimmering ambient glow and interactive hover physics
 */
export default function KisanDarpanLogo({
  size = 40,
  animated = true,
  className = '',
  style = {},
  onClick,
  showText = false
}) {
  const uId = React.useId().replace(/:/g, '')

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
      <div
        className="kd-logo-container"
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.28),
          background: 'linear-gradient(145deg, rgba(8, 26, 38, 0.95) 0%, rgba(3, 15, 23, 0.98) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45), 0 0 12px rgba(6, 182, 212, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <style>{`
          @keyframes kdRadarPulse {
            0% {
              r: 2.5px;
              opacity: 0.95;
              stroke-width: 1.4px;
            }
            50% {
              opacity: 0.55;
            }
            100% {
              r: 10.5px;
              opacity: 0;
              stroke-width: 0.4px;
            }
          }
          @keyframes kdStarGlow {
            0%, 100% {
              transform: scale(0.92);
              filter: drop-shadow(0 0 3px #38bdf8) drop-shadow(0 0 6px #06b6d4);
              opacity: 0.88;
            }
            50% {
              transform: scale(1.16);
              filter: drop-shadow(0 0 6px #7dd3fc) drop-shadow(0 0 12px #38bdf8);
              opacity: 1;
            }
          }
          @keyframes kdWheatSway {
            0%, 100% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(-1.5deg);
            }
          }
          @keyframes kdInfinityGleam {
            0%, 100% {
              stroke-opacity: 0.85;
              filter: drop-shadow(0 0 2px rgba(56, 189, 248, 0.4));
            }
            50% {
              stroke-opacity: 1;
              filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.8));
            }
          }
          .kd-logo-container:hover {
            transform: translateY(-2px) scale(1.04);
            border-color: rgba(56, 189, 248, 0.65) !important;
            box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.4) !important;
          }
          .kd-logo-container:active {
            transform: translateY(0px) scale(0.98);
          }
        `}</style>

        {/* Ambient background light flare */}
        <div
          style={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(245, 158, 11, 0.12) 60%, transparent 80%)',
            pointerEvents: 'none'
          }}
        />

        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '84%', height: '84%', overflow: 'visible' }}
        >
          <defs>
            {/* Golden Wheat Gradient */}
            <linearGradient id={`kdGold-${uId}`} x1="12" y1="8" x2="38" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Infinity Darpan Gradient */}
            <linearGradient id={`kdInfinity-${uId}`} x1="16" y1="36" x2="52" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="30%" stopColor="#06b6d4" />
              <stop offset="70%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* AI Center Core Glow */}
            <radialGradient id={`kdAiCore-${uId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>
          </defs>

          {/* Dynamic Radar Wave Rings radiating from center (34, 36) */}
          {animated && (
            <g opacity="0.75">
              <circle
                cx="34"
                cy="36"
                r="3"
                stroke="#38bdf8"
                fill="none"
                style={{
                  animation: 'kdRadarPulse 2.6s infinite cubic-bezier(0.215, 0.61, 0.355, 1)',
                  transformOrigin: '34px 36px'
                }}
              />
              <circle
                cx="34"
                cy="36"
                r="3"
                stroke="#38bdf8"
                fill="none"
                style={{
                  animation: 'kdRadarPulse 2.6s infinite cubic-bezier(0.215, 0.61, 0.355, 1) 0.85s',
                  transformOrigin: '34px 36px'
                }}
              />
              <circle
                cx="34"
                cy="36"
                r="3"
                stroke="#38bdf8"
                fill="none"
                style={{
                  animation: 'kdRadarPulse 2.6s infinite cubic-bezier(0.215, 0.61, 0.355, 1) 1.7s',
                  transformOrigin: '34px 36px'
                }}
              />
            </g>
          )}

          {/* Golden Wheat Stalk (Arching over left & top) */}
          <g
            style={animated ? { animation: 'kdWheatSway 4s ease-in-out infinite', transformOrigin: '14px 44px' } : {}}
          >
            {/* Main curved wheat stem */}
            <path
              d="M15 45 C 16 33, 20 20, 36 12 C 40 10, 44 9, 48 9"
              stroke={`url(#kdGold-${uId})`}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Wheat awns / trailing rays */}
            <path d="M38 11 C 42 10, 47 9, 52 9" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            <path d="M34 14 C 38 12, 43 12, 48 13" stroke="#fef08a" strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />

            {/* Individual Golden Wheat Grains (Kisan Harvest) */}
            <path d="M19 36 C 17 33, 18 30, 22 32 C 24 33, 23 37, 19 36 Z" fill={`url(#kdGold-${uId})`} />
            <path d="M22 30 C 20 26, 22 23, 26 26 C 28 27, 27 31, 22 30 Z" fill={`url(#kdGold-${uId})`} />
            <path d="M26 24 C 24 20, 27 17, 31 20 C 33 21, 32 25, 26 24 Z" fill={`url(#kdGold-${uId})`} />
            <path d="M31 18 C 30 14, 34 12, 37 15 C 39 17, 37 21, 31 18 Z" fill={`url(#kdGold-${uId})`} />
            <path d="M37 14 C 37 10, 41 9, 44 12 C 45 14, 43 17, 37 14 Z" fill={`url(#kdGold-${uId})`} />
            <path d="M43 11 C 44 8, 48 8, 50 11 C 51 13, 49 15, 43 11 Z" fill={`url(#kdGold-${uId})`} />
          </g>

          {/* Infinity Loop: The Darpan Mirror of Continuous Intelligence */}
          <path
            d="M 34 36 
               C 28 27, 16 27, 16 36 
               C 16 45, 28 45, 34 36 
               C 40 27, 52 27, 52 36 
               C 52 45, 40 45, 34 36 Z"
            stroke={`url(#kdInfinity-${uId})`}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={animated ? { animation: 'kdInfinityGleam 3s ease-in-out infinite' } : {}}
          />

          {/* Inner Golden Rim Reflection for Infinity Darpan */}
          <path
            d="M 34 36 
               C 29 29, 19 29, 19 36 
               C 19 43, 29 43, 34 36 
               C 39 29, 49 29, 49 36 
               C 49 43, 39 43, 34 36 Z"
            stroke="#fbbf24"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.85"
          />

          {/* Dynamic AI Intelligence Core Star (Center Nexus at 34, 36) */}
          <g
            style={
              animated
                ? {
                    animation: 'kdStarGlow 2.2s infinite ease-in-out',
                    transformOrigin: '34px 36px'
                  }
                : {}
            }
          >
            {/* 4-pointed radiant intelligence spark star */}
            <path
              d="M 34 27.5
                 C 34 33, 30.5 36, 25.5 36
                 C 30.5 36, 34 39, 34 44.5
                 C 34 39, 37.5 36, 42.5 36
                 C 37.5 36, 34 33, 34 27.5 Z"
              fill={`url(#kdAiCore-${uId})`}
            />
            {/* Center diamond flare */}
            <circle cx="34" cy="36" r="1.8" fill="#ffffff" />
          </g>
        </svg>
      </div>

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
              textShadow: '0 2px 10px rgba(56, 189, 248, 0.25)'
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
