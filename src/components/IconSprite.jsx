// Inline SVG icon sprite — all symbols rendered via <use href="#symbol-id">
export default function IconSprite() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }} aria-hidden="true">
      {/* i-grid: dashboard */}
      <symbol id="i-grid" viewBox="0 0 23 23" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="8.5" height="8.5" rx="2"/>
        <rect x="12.5" y="2" width="8.5" height="8.5" rx="2"/>
        <rect x="2" y="12.5" width="8.5" height="8.5" rx="2"/>
        <rect x="12.5" y="12.5" width="8.5" height="8.5" rx="2"/>
      </symbol>

      {/* i-chart: reports */}
      <symbol id="i-chart" viewBox="0 0 23 23" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="2,17 7,10 12,13 17,5 21,8"/>
        <line x1="2" y1="20" x2="21" y2="20"/>
      </symbol>

      {/* i-globe: explore */}
      <symbol id="i-globe" viewBox="0 0 23 23" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11.5" cy="11.5" r="9"/>
        <ellipse cx="11.5" cy="11.5" rx="4" ry="9"/>
        <line x1="2.5" y1="11.5" x2="20.5" y2="11.5"/>
      </symbol>

      {/* i-cal: calendar */}
      <symbol id="i-cal" viewBox="0 0 23 23" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="19" height="17" rx="2.5"/>
        <line x1="7" y1="2" x2="7" y2="6"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="2" y1="10" x2="21" y2="10"/>
      </symbol>

      {/* i-gear: settings */}
      <symbol id="i-gear" viewBox="0 0 23 23" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11.5" cy="11.5" r="3"/>
        <path d="M11.5 2.5v2M11.5 18.5v2M2.5 11.5h2M18.5 11.5h2M4.7 4.7l1.4 1.4M16.9 16.9l1.4 1.4M4.7 18.3l1.4-1.4M16.9 6.1l1.4-1.4"/>
      </symbol>

      {/* i-out: sign out */}
      <symbol id="i-out" viewBox="0 0 23 23" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H4a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h5"/>
        <polyline points="16,7 21,11.5 16,16"/>
        <line x1="21" y1="11.5" x2="8" y2="11.5"/>
      </symbol>

      {/* i-plus */}
      <symbol id="i-plus" viewBox="0 0 23 23" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="11.5" y1="3" x2="11.5" y2="20"/>
        <line x1="3" y1="11.5" x2="20" y2="11.5"/>
      </symbol>

      {/* i-search */}
      <symbol id="i-search" viewBox="0 0 23 23" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="10" cy="10" r="7"/>
        <line x1="15.5" y1="15.5" x2="21" y2="21"/>
      </symbol>

      {/* i-bell */}
      <symbol id="i-bell" viewBox="0 0 23 23" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11.5 2.5a7 7 0 0 1 7 7v4.5l1.5 2H3l1.5-2V9.5a7 7 0 0 1 7-7z"/>
        <path d="M9 18.5a2.5 2.5 0 0 0 5 0"/>
      </symbol>

      {/* i-pin */}
      <symbol id="i-pin" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 1a3.5 3.5 0 0 1 3.5 3.5c0 3-3.5 7-3.5 7S3 7.5 3 4.5A3.5 3.5 0 0 1 6.5 1z"/>
        <circle cx="6.5" cy="4.5" r="1.2" fill="currentColor" stroke="none"/>
      </symbol>

      {/* i-wind */}
      <symbol id="i-wind" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M2 5.5h7.5a2.5 2.5 0 1 0 0-5"/>
        <path d="M2 8.5h10a2 2 0 1 1 0 4"/>
        <line x1="2" y1="8.5" x2="2" y2="5.5"/>
      </symbol>

      {/* i-drop */}
      <symbol id="i-drop" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.5 1.5C7.5 1.5 3 6.5 3 9.5a4.5 4.5 0 0 0 9 0c0-3-4.5-8-4.5-8z"/>
      </symbol>

      {/* i-gust */}
      <symbol id="i-gust" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M2 4.5h5a2 2 0 0 0 0-4"/>
        <line x1="2" y1="7.5" x2="11" y2="7.5"/>
        <path d="M2 10.5h8.5a2.5 2.5 0 1 1 0 5"/>
      </symbol>

      {/* i-cloud: rain drops */}
      <symbol id="i-cloud" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 24H9a7 7 0 0 1-1-13.93A10 10 0 0 1 27 14a5 5 0 0 1-4 10z"/>
        <line x1="9" y1="28" x2="9" y2="25"/>
        <line x1="14" y1="29" x2="14" y2="26"/>
        <line x1="19" y1="28" x2="19" y2="25"/>
        <line x1="24" y1="29" x2="24" y2="26"/>
      </symbol>

      {/* i-cloud2: lighter cloud */}
      <symbol id="i-cloud2" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 22H10a6 6 0 0 1-1-11.93 9 9 0 0 1 17.73 2 4 4 0 0 1-4.73 9.93z"/>
        <line x1="12" y1="26" x2="12" y2="23"/>
        <line x1="17" y1="27" x2="17" y2="24"/>
        <line x1="22" y1="26" x2="22" y2="23"/>
      </symbol>

      {/* i-hail */}
      <symbol id="i-hail" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 22H10a6 6 0 0 1-1-11.93 9 9 0 0 1 17.73 2 4 4 0 0 1-4.73 9.93z"/>
        <circle cx="10" cy="27" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="16" cy="29" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="22" cy="27" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="13" cy="25" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="19" cy="25" r="1.5" fill="currentColor" stroke="none"/>
      </symbol>

      {/* i-sun */}
      <symbol id="i-sun" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="16" cy="16" r="5.5"/>
        <line x1="16" y1="3" x2="16" y2="7"/>
        <line x1="16" y1="25" x2="16" y2="29"/>
        <line x1="3" y1="16" x2="7" y2="16"/>
        <line x1="25" y1="16" x2="29" y2="16"/>
        <line x1="7.1" y1="7.1" x2="9.9" y2="9.9"/>
        <line x1="22.1" y1="22.1" x2="24.9" y2="24.9"/>
        <line x1="7.1" y1="24.9" x2="9.9" y2="22.1"/>
        <line x1="22.1" y1="9.9" x2="24.9" y2="7.1"/>
      </symbol>

      {/* i-avatar: vector fallback portrait */}
      <symbol id="i-avatar" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="26" fill="rgba(255,255,255,.2)"/>
        <circle cx="26" cy="21" r="9" fill="rgba(255,255,255,.7)"/>
        <path d="M6 48c0-11 9-18 20-18s20 7 20 18" fill="rgba(255,255,255,.7)"/>
      </symbol>
    </svg>
  )
}

// Convenience component to use an icon
export function Icon({ id, width = 23, height = 23, className = '', style = {}, ...props }) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0, ...style }}
      {...props}
    >
      <use href={`#${id}`} />
    </svg>
  )
}
