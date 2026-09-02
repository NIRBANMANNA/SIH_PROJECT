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
      <symbol id="i-gear" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
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

      {/* i-flood: Waterlogging / Flood */}
      <symbol id="i-flood" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 13c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0 3.5 1 5 0" />
        <path d="M2 17c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0 3.5 1 5 0" />
        <path d="M2 21c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0 3.5 1 5 0" />
        <path d="M12 3v6m0 0l-2.5-2.5M12 9l2.5-2.5" />
      </symbol>

      {/* i-flame: Heat Stress */}
      <symbol id="i-flame" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
      </symbol>

      {/* i-thermo */}
      <symbol id="i-thermo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
      </symbol>

      {/* i-drought: Drought / Dry Spell */}
      <symbol id="i-drought" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M12 1v2M12 11v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M1 12h2M21 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        <path d="M3 21h18M6 18l3 3m3-3l3 3m3-3l3 3" />
      </symbol>

      {/* i-wind-strong: Strong Wind */}
      <symbol id="i-wind-strong" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
        <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
        <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
        <path d="M19 14h3" />
      </symbol>

      {/* i-snowflake: Cold Stress */}
      <symbol id="i-snowflake" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
        <path d="M10 4l2-2 2 2m-4 16l2 2 2-2M4 10l-2 2 2 2m16-4l2 2-2 2" />
      </symbol>

      {/* i-alert-triangle */}
      <symbol id="i-alert-triangle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </symbol>

      {/* i-shield-alert */}
      <symbol id="i-shield-alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </symbol>

      {/* i-clock */}
      <symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </symbol>

      {/* i-broadcast */}
      <symbol id="i-broadcast" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.93 19.07A10 10 0 0 1 4.93 4.93m14.14 0a10 10 0 0 1 0 14.14M7.76 16.24a6 6 0 0 1 0-8.48m8.48 0a6 6 0 0 1 0 8.48M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      </symbol>

      {/* i-check-circle */}
      <symbol id="i-check-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </symbol>

      {/* i-filter */}
      <symbol id="i-filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </symbol>

      {/* i-refresh */}
      <symbol id="i-refresh" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </symbol>

      {/* i-send */}
      <symbol id="i-send" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </symbol>
      {/* i-sprout */}
      <symbol id="i-sprout" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 20h10" />
        <path d="M12 20v-8" />
        <path d="M12 12c-3.5 0-6-2.5-6-6 3.5 0 6 2.5 6 6z" />
        <path d="M12 12c3.5 0 6-2.5 6-6-3.5 0-6 2.5-6 6z" />
      </symbol>

      {/* i-x-circle */}
      <symbol id="i-x-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </symbol>

      {/* i-info */}
      <symbol id="i-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </symbol>

      {/* i-sparkles */}
      <symbol id="i-sparkles" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
      </symbol>

      {/* i-volume */}
      <symbol id="i-volume" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </symbol>

      {/* i-printer */}
      <symbol id="i-printer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </symbol>

      {/* i-bot: AI assistant */}
      <symbol id="i-bot" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="3" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="2.5" />
        <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="2.5" />
        <path d="M2 15h1" />
        <path d="M21 15h1" />
      </symbol>

      {/* i-cpu */}
      <symbol id="i-cpu" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
      </symbol>

      {/* i-zap */}
      <symbol id="i-zap" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </symbol>

      {/* i-droplet */}
      <symbol id="i-droplet" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </symbol>

      {/* i-check */}
      <symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </symbol>

      {/* i-cross */}
      <symbol id="i-cross" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
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
