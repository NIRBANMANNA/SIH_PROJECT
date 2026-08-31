import { useState, useRef, useEffect } from 'react'
import { Icon } from './IconSprite'

export default function Header({
  activeCity,
  setActiveCity,
  searchOpen,
  setSearchOpen,
  notificationsOpen,
  setNotificationsOpen,
  notifications,
  setNotifications,
  weatherData
}) {
  const [imgError, setImgError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  // Filter cities for search dropdown
  const cities = Object.keys(weatherData)
  const filteredSearch = searchQuery.trim() === ''
    ? cities.slice(0, 4) // Show standard 4 cities as quick suggestions
    : cities.filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()))

  const unreadCount = notifications.filter(n => n.unread).length

  // Focus input when search panel opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const handleNotificationClick = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  const handleAddLocationClick = () => {
    alert("Location added to your regional network database.")
  }

  return (
    <header
      style={{
        position: 'absolute',
        top: 'calc(22 * var(--u))',
        left: 'calc(126 * var(--u))',
        right: 'calc(37 * var(--u))',
        height: 'calc(52 * var(--u))',
        zIndex: 20,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
    >
      {/* Left: greeting */}
      <div>
        <div
          className="anim-hello"
          style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 400, color: 'rgba(255,255,255,.93)', lineHeight: 1 }}
        >
          Welcome
        </div>
        <div
          className="anim-who"
          style={{ fontSize: 'calc(19.5 * var(--u))', fontWeight: 700, letterSpacing: 'calc(-.35 * var(--u))', color: '#fff', marginTop: 'calc(13 * var(--u))' }}
        >
          Nirban Manna
        </div>
      </div>

      {/* Right: tools */}
      <div
        role="toolbar"
        aria-label="Quick actions"
        style={{ display: 'flex', alignItems: 'center', gap: 'calc(16 * var(--u))', position: 'relative' }}
      >
        {/* Add location */}
        <button
          onClick={handleAddLocationClick}
          className="anim-tool1 rounded-2xl border-2 border-dashed border-white/80 bg-white/12 text-white backdrop-blur-md transition-all duration-300 hover:translate-x-[-3px] hover:translate-y-[-3px] hover:rounded-md hover:bg-white/22 hover:border-white hover:shadow-[3px_3px_0px_white] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer flex items-center justify-center"
          aria-label="Add location"
          style={{ width: 'calc(52 * var(--u))', height: 'calc(52 * var(--u))', flexShrink: 0 }}
        >
          <Icon id="i-plus" width="20" height="20" />
        </button>

        {/* Search button */}
        <button
          onClick={() => {
            setSearchOpen(!searchOpen)
            setNotificationsOpen(false)
          }}
          className="anim-tool2 rounded-2xl border-2 border-dashed border-white/80 bg-white/12 text-white backdrop-blur-md transition-all duration-300 hover:translate-x-[-3px] hover:translate-y-[-3px] hover:rounded-md hover:bg-white/22 hover:border-white hover:shadow-[3px_3px_0px_white] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer flex items-center justify-center"
          aria-label="Search"
          style={{
            width: 'calc(52 * var(--u))',
            height: 'calc(52 * var(--u))',
            flexShrink: 0,
            background: searchOpen ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.12)',
            borderColor: searchOpen ? '#fff' : 'rgba(255,255,255,0.80)'
          }}
        >
          <Icon id="i-search" width="20" height="20" />
        </button>

        {/* Notifications button */}
        <button
          onClick={() => {
            setNotificationsOpen(!notificationsOpen)
            setSearchOpen(false)
          }}
          className="anim-tool3 rounded-2xl border-2 border-dashed border-white/80 bg-white/12 text-white backdrop-blur-md transition-all duration-300 hover:translate-x-[-3px] hover:translate-y-[-3px] hover:rounded-md hover:bg-white/22 hover:border-white hover:shadow-[3px_3px_0px_white] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer flex items-center justify-center relative"
          aria-label="Notifications"
          style={{
            width: 'calc(52 * var(--u))',
            height: 'calc(52 * var(--u))',
            flexShrink: 0,
            background: notificationsOpen ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.12)',
            borderColor: notificationsOpen ? '#fff' : 'rgba(255,255,255,0.80)'
          }}
        >
          <Icon id="i-bell" width="20" height="20" />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 'calc(-2 * var(--u))',
                right: 'calc(-2 * var(--u))',
                background: '#ef4444',
                color: '#fff',
                fontSize: 'calc(10 * var(--u))',
                fontWeight: 700,
                width: 'calc(18 * var(--u))',
                height: 'calc(18 * var(--u))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 calc(6 * var(--u)) rgba(239, 68, 68, 0.6)'
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div
          className="anim-tool4"
          role="img"
          aria-label="Nirban Manna profile"
          style={{
            width: 'calc(52 * var(--u))', height: 'calc(52 * var(--u))',
            borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
          }}
        >
          {imgError ? (
            <svg width="52" height="52" aria-hidden="true"><use href="#i-avatar"/></svg>
          ) : (
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces&q=80&auto=format"
              alt="Nirban Manna"
              loading="eager"
              decoding="async"
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
            />
          )}
        </div>

        {/* ─── Search Auto-complete Dropdown ─── */}
        {searchOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(62 * var(--u))',
              right: 'calc(120 * var(--u))',
              width: 'calc(280 * var(--u))',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.18) 100%)',
              backdropFilter: 'blur(calc(20 * var(--u))) saturate(115%)',
              WebkitBackdropFilter: 'blur(calc(20 * var(--u))) saturate(115%)',
              border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: 'calc(18 * var(--u))',
              boxShadow: '0 calc(10 * var(--u)) calc(30 * var(--u)) rgba(4, 16, 24, 0.4)',
              padding: 'calc(12 * var(--u))',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(8 * var(--u))',
              zIndex: 30
            }}
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: 'calc(8 * var(--u)) calc(12 * var(--u))',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 'calc(10 * var(--u))',
                color: '#fff',
                fontSize: 'calc(13 * var(--u))',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(2 * var(--u))', maxHeight: 'calc(180 * var(--u))', overflowY: 'auto' }}>
              {filteredSearch.length > 0 ? (
                filteredSearch.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setActiveCity(city)
                      setSearchOpen(false)
                      setSearchQuery('')
                    }}
                    style={{
                      width: '100%',
                      padding: 'calc(7 * var(--u)) calc(10 * var(--u))',
                      background: activeCity === city ? 'rgba(255,255,255,0.18)' : 'transparent',
                      border: 'none',
                      borderRadius: 'calc(8 * var(--u))',
                      color: '#fff',
                      fontSize: 'calc(13 * var(--u))',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = activeCity === city ? 'rgba(255,255,255,0.18)' : 'transparent'}
                  >
                    <span>{city}</span>
                    <span style={{ fontSize: 'calc(11 * var(--u))', opacity: 0.5 }}>{weatherData[city].region}</span>
                  </button>
                ))
              ) : (
                <div style={{ padding: 'calc(10 * var(--u))', fontSize: 'calc(12 * var(--u))', opacity: 0.5, textAlign: 'center' }}>
                  No matching locations
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Notifications Dropdown ─── */}
        {notificationsOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(62 * var(--u))',
              right: 'calc(60 * var(--u))',
              width: 'calc(320 * var(--u))',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.18) 100%)',
              backdropFilter: 'blur(calc(20 * var(--u))) saturate(115%)',
              WebkitBackdropFilter: 'blur(calc(20 * var(--u))) saturate(115%)',
              border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: 'calc(18 * var(--u))',
              boxShadow: '0 calc(10 * var(--u)) calc(30 * var(--u)) rgba(4, 16, 24, 0.4)',
              padding: 'calc(14 * var(--u))',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(10 * var(--u))',
              zIndex: 30
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 'calc(8 * var(--u))' }}>
              <span style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 600 }}>Alerts & Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 'calc(11.5 * var(--u))',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(8 * var(--u))', maxHeight: 'calc(220 * var(--u))', overflowY: 'auto' }}>
              {notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id)}
                  style={{
                    padding: 'calc(8 * var(--u)) calc(10 * var(--u))',
                    background: n.unread ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${n.unread ? 'rgba(255,255,255,0.15)' : 'transparent'}`,
                    borderRadius: 'calc(8 * var(--u))',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'calc(3 * var(--u))',
                    position: 'relative'
                  }}
                >
                  {n.unread && (
                    <span style={{ position: 'absolute', top: 'calc(8 * var(--u))', right: 'calc(8 * var(--u))', width: 'calc(6 * var(--u))', height: 'calc(6 * var(--u))', borderRadius: '50%', background: '#4ade80' }} />
                  )}
                  <span style={{ fontSize: 'calc(12 * var(--u))', fontWeight: n.unread ? 600 : 400, color: n.type === 'warning' ? '#fca5a5' : '#fff', lineHeight: 1.3 }}>
                    {n.text}
                  </span>
                  <span style={{ fontSize: 'calc(10 * var(--u))', opacity: 0.5 }}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
