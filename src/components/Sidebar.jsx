import { Icon } from './IconSprite'
import { useNavigate, useLocation, Link } from 'react-router-dom'

const navItems = [
  { id: 'i-grid',  label: 'Overview',          path: '/dashboard/overview' },
  { id: 'i-globe', label: 'Weather Map',       path: '/dashboard/map' },
  { id: 'i-wind',  label: 'Forecast',          path: '/dashboard/forecast' },
  { id: 'i-bell',  label: 'Risk & Alerts',     path: '/dashboard/alerts' },
  { id: 'i-drop',  label: 'Crop Advisory',     path: '/dashboard/cropadvisory' },
  { id: 'i-cal',   label: 'Historical Trends', path: '/dashboard/historical' },
  { id: 'i-pin',   label: 'Accuracy',          path: '/dashboard/accuracy' },
  { id: 'i-chart', label: 'Reports',           path: '/dashboard/reports' },
  { id: 'i-gear',  label: 'Settings',          path: '/dashboard/settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Find index of active tab for the sliding pip animation
  const getActiveIndex = () => {
    const p = location.pathname.toLowerCase()
    if (p.includes('cropadvisory') || p.includes('crop-advisory') || p.includes('/advisory')) {
      return navItems.findIndex(item => item.path === '/dashboard/cropadvisory')
    }
    return navItems.findIndex(item => p.includes(item.path.toLowerCase()))
  }

  const activeIndex = getActiveIndex()

  return (
    <nav
      className="anim-slideL"
      aria-label="Main navigation"
      style={{
        position: 'absolute',
        left: 'calc(16 * var(--u))',
        top: 'calc(14 * var(--u))',
        bottom: 'calc(7 * var(--u))',
        width: 'calc(72 * var(--u))',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 'calc(22 * var(--u))',
        paddingBottom: 'calc(52 * var(--u))',
        background: 'linear-gradient(180deg, rgba(255,255,255,.125) 0%, rgba(255,255,255,.135) 13%, rgba(255,255,255,.098) 34%, rgba(255,255,255,.092) 100%)',
        backdropFilter: 'blur(calc(18 * var(--u))) saturate(115%)',
        WebkitBackdropFilter: 'blur(calc(18 * var(--u))) saturate(115%)',
        borderRadius: 'calc(26 * var(--u))',
      }}
    >
      {/* Active sliding illuminated bar */}
      {activeIndex !== -1 && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            // Top padding (22) + Logo (40) + Nav marginTop (45) = 107. Item center is 107 + 53*i + 11.5 = 118.5 + 53*i.
            // Half-height of 26px bar is 13. Top = 118.5 - 13 + 53*i = 105.5 + 53*i.
            top: `calc((${105.5 + 53 * activeIndex}) * var(--u))`,
            width: 'calc(4.5 * var(--u))',
            height: 'calc(26 * var(--u))',
            borderTopRightRadius: 'calc(4 * var(--u))',
            borderBottomRightRadius: 'calc(4 * var(--u))',
            background: '#ffffff',
            boxShadow: '0 0 calc(12 * var(--u)) rgba(255,255,255,0.95), 0 0 calc(4 * var(--u)) #ffffff',
            transition: 'top 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      )}

      {/* Logo */}
      <div
        className="anim-popIn"
        aria-label="Aurora Weather"
        style={{ width: 'calc(40 * var(--u))', height: 'calc(40 * var(--u))', flexShrink: 0, cursor: 'pointer' }}
        onClick={() => navigate('/dashboard/overview')}
      >
        <svg viewBox="0 0 40 40" fill="none" style={{ width: '100%', height: '100%' }} aria-hidden="true">
          <rect x="0" y="0" width="40" height="40" rx="12" fill="rgba(255,255,255,.18)"/>
          <polyline points="7,13 12,11 17,14 22,11 27,13 33,11" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".6"/>
          <polyline points="7,17 12,15 17,18 22,15 27,17 33,15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".75"/>
          <polyline points="7,21 12,19 17,22 22,19 27,21 33,19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".9"/>
          <polyline points="7,25 12,23 17,26 22,23 27,25 33,23" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".75"/>
          <polyline points="7,29 12,27 17,30 22,27 27,29 33,27" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".6"/>
        </svg>
      </div>

      {/* Nav links */}
      <div
        role="list"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'calc(30 * var(--u))',
          marginTop: 'calc(45 * var(--u))',
        }}
      >
        {navItems.map((item, i) => {
          const isActive = i === activeIndex
          return (
            <Link
              to={item.path}
              key={item.id}
              role="listitem"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'calc(23 * var(--u))',
                height: 'calc(23 * var(--u))',
                opacity: isActive ? 1 : 0.55,
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
                filter: isActive ? 'drop-shadow(0 0 calc(6 * var(--u)) rgba(255,255,255,0.65))' : 'none',
                transition: 'opacity .2s, transform .2s, filter .2s',
                color: '#fff',
                textDecoration: 'none'
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.opacity = '1'; 
                e.currentTarget.style.transform = isActive ? 'scale(1.12)' : 'translateY(calc(-1 * var(--u)))'; 
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.opacity = isActive ? '1' : '0.55'; 
                e.currentTarget.style.transform = isActive ? 'scale(1.08)' : 'scale(1)'; 
              }}
            >
              <Icon id={item.id} width="23" height="23" />
            </Link>
          )
        })}
      </div>

      {/* Logout */}
      <button
        className="anim-logout"
        aria-label="Sign out"
        onClick={() => navigate('/')}
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'calc(23 * var(--u))',
          height: 'calc(23 * var(--u))',
          opacity: 0.45,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#fff',
          transition: 'opacity .2s, transform .2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(calc(-1 * var(--u)))'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '0.45'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <Icon id="i-out" width="23" height="23" />
      </button>
    </nav>
  )
}
