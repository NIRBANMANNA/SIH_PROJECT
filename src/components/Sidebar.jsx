import { useState } from 'react'
import { Icon } from './IconSprite'
import { useNavigate, useLocation, Link } from 'react-router-dom'

const navItems = [
  { id: 'i-grid',  label: 'Overview',          path: '/dashboard/overview' },
  { id: 'i-globe', label: 'Weather Map',       path: '/dashboard/map' },
  { id: 'i-wind',  label: 'Forecast',          path: '/dashboard/forecast' },
  { id: 'i-send',  label: 'Model Console',     path: '/dashboard/console' },
  { id: 'i-bell',  label: 'Risk & Alerts',     path: '/dashboard/alerts' },
  { id: 'i-drop',  label: 'Crop Advisory',     path: '/dashboard/cropadvisory' },
  { id: 'i-cal',   label: 'Historical Trends', path: '/dashboard/historical' },
  { id: 'i-pin',   label: 'Accuracy',          path: '/dashboard/accuracy' },
  { id: 'i-chart', label: 'Reports',           path: '/dashboard/reports' },
  { id: 'i-gear',  label: 'Settings',          path: '/dashboard/settings' },
]

// Primary items displayed in the mobile bottom bar
const mobilePrimaryItems = [
  { id: 'i-grid',  label: 'Overview', path: '/dashboard/overview' },
  { id: 'i-globe', label: 'Map',      path: '/dashboard/map' },
  { id: 'i-wind',  label: 'Forecast', path: '/dashboard/forecast' },
  { id: 'i-drop',  label: 'Advisory', path: '/dashboard/cropadvisory' },
  { id: 'i-bell',  label: 'Alerts',   path: '/dashboard/alerts' },
]

// Secondary items shown in the "More" slide-up drawer
const mobileSecondaryItems = [
  { id: 'i-send',  label: 'Model Console',     desc: 'Downscaling API runner & logs',  path: '/dashboard/console' },
  { id: 'i-cal',   label: 'Historical Trends', desc: 'Climatological historical data',  path: '/dashboard/historical' },
  { id: 'i-pin',   label: 'Model Accuracy',    desc: 'MAE, RMSE, and R² metrics',       path: '/dashboard/accuracy' },
  { id: 'i-chart', label: 'Regional Reports',  desc: 'Export official weather bulletins', path: '/dashboard/reports' },
  { id: 'i-gear',  label: 'Settings',          desc: 'Units & profile preferences',     path: '/dashboard/settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  // Find index of active tab for the sliding pip animation
  const getActiveIndex = () => {
    const p = location.pathname.toLowerCase()
    if (p.includes('cropadvisory') || p.includes('crop-advisory') || p.includes('/advisory')) {
      return navItems.findIndex(item => item.path === '/dashboard/cropadvisory')
    }
    return navItems.findIndex(item => p.includes(item.path.toLowerCase()))
  }

  const activeIndex = getActiveIndex()
  const currentPath = location.pathname.toLowerCase()

  const isMoreActive = mobileSecondaryItems.some(item => currentPath.includes(item.path.toLowerCase()))

  return (
    <>
      {/* ─── Desktop Sidebar (Floating Left, >900px) ─── */}
      <nav
        className="desktop-sidebar anim-slideL"
        aria-label="Desktop main navigation"
        style={{
          position: 'absolute',
          left: 'calc(16 * var(--u))',
          top: 'calc(14 * var(--u))',
          bottom: 'calc(7 * var(--u))',
          width: 'calc(72 * var(--u))',
          zIndex: 10,
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

      {/* ─── Mobile Bottom Navigation Bar (Sticky Bottom, ≤900px) ─── */}
      <nav
        className="mobile-bottom-nav"
        aria-label="Mobile bottom navigation"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'calc(62px + env(safe-area-inset-bottom, 0px))',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          zIndex: 60,
          background: 'linear-gradient(180deg, rgba(6, 20, 31, 0.88) 0%, rgba(2, 13, 20, 0.96) 100%)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.45)',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingLeft: '6px',
          paddingRight: '6px',
        }}
      >
        {mobilePrimaryItems.map(item => {
          const isActive = currentPath.includes(item.path.toLowerCase())
          return (
            <Link
              key={item.id}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                padding: '6px 8px',
                borderRadius: '12px',
                color: isActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.65)',
                textDecoration: 'none',
                position: 'relative',
                transition: 'all 0.2s ease',
                flex: 1,
                minWidth: 0,
              }}
            >
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    width: '18px',
                    height: '3px',
                    borderRadius: '3px',
                    background: '#38bdf8',
                    boxShadow: '0 0 8px #38bdf8',
                  }}
                />
              )}
              <div style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s ease' }}>
                <Icon id={item.id} width="20" height="20" />
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: isActive ? 600 : 500, letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* 6th Tab: More Button (Opens slide-up action drawer) */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="More navigation modules"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            padding: '6px 8px',
            borderRadius: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: (isMoreActive || drawerOpen) ? '#38bdf8' : 'rgba(255, 255, 255, 0.65)',
            position: 'relative',
            flex: 1,
            minWidth: 0,
            transition: 'all 0.2s ease',
          }}
        >
          {(isMoreActive || drawerOpen) && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                width: '18px',
                height: '3px',
                borderRadius: '3px',
                background: '#38bdf8',
                boxShadow: '0 0 8px #38bdf8',
              }}
            />
          )}
          <div style={{ transform: drawerOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.25s ease' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </div>
          <span style={{ fontSize: '10.5px', fontWeight: (isMoreActive || drawerOpen) ? 600 : 500, letterSpacing: '-0.2px' }}>
            More
          </span>
        </button>
      </nav>

      {/* ─── Mobile "More" Slide-up Drawer ─── */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 90,
            backgroundColor: 'rgba(2, 8, 14, 0.72)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: 'backdropFade 0.2s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, rgba(15, 30, 45, 0.98) 0%, rgba(6, 18, 28, 0.99) 100%)',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '18px 20px calc(80px + env(safe-area-inset-bottom, 0px)) 20px',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.6)',
              maxHeight: '80vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Grab Handle & Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ width: '40px', height: '4px', background: 'rgba(255, 255, 255, 0.3)', borderRadius: '2px', marginBottom: '14px' }} />
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>Aurora Modules</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', margin: '2px 0 0 0' }}>Access all platform tools & settings</p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* List of Secondary Modules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {mobileSecondaryItems.map(item => {
                const isActive = currentPath.includes(item.path.toLowerCase())
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigate(item.path)
                      setDrawerOpen(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.07)',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: isActive ? '#0284c7' : 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      flexShrink: 0,
                    }}>
                      <Icon id={item.id} width="20" height="20" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: isActive ? '#7dd3fc' : '#fff' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.desc}
                      </div>
                    </div>
                    {isActive && (
                      <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, background: 'rgba(56, 189, 248, 0.2)', padding: '2px 8px', borderRadius: '8px' }}>
                        Active
                      </span>
                    )}
                  </div>
                )
              })}

              {/* Sign Out Action in Drawer */}
              <div
                onClick={() => {
                  setDrawerOpen(false)
                  navigate('/')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f87171',
                  flexShrink: 0,
                }}>
                  <Icon id="i-out" width="20" height="20" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#fca5a5' }}>
                    Sign Out & Exit
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.5)' }}>
                    Return to landing portal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

