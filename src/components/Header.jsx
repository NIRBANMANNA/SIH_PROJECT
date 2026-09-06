import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from './IconSprite'
import { useDashboard } from '../context/DashboardContext'
import { useAuth } from '../context/AuthContext'
import { mockBlockWeather, getBlockWeatherData } from '../data/mockWeather'
import { mockBlocks } from '../data/mockPanchayats'
import LocationSelectorModal from './LocationSelectorModal'
import KisanDarpanAiModal from './KisanDarpanAiModal'

export default function Header({
  searchOpen,
  setSearchOpen,
  notificationsOpen,
  setNotificationsOpen,
  notifications,
  setNotifications,
}) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    activeBlock,
    handleBlockChange,
    blocksInDistrict,
    activeDistrict,
    activePanchayat,
    handlePanchayatChange,
    panchayatsInBlock
  } = useDashboard()

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Farmer Partner'
  const userInitial = displayName.charAt(0).toUpperCase()

  const [imgError, setImgError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  // Search list prioritizing all authentic Blocks in network
  const allKnownBlocks = Object.values(mockBlocks || {}).flat()
  const allBlocks = Array.from(new Set([...Object.keys(mockBlockWeather || {}), ...allKnownBlocks]))

  const blockSuggestions = allBlocks.map(blk => {
    const data = getBlockWeatherData(blk)
    return {
      id: blk,
      type: 'block',
      name: `${blk} Block`,
      region: `${data?.district || activeDistrict}, West Bengal`,
      temp: `${data?.temp || 31}°C`,
      rainfall: data?.rainfall || '20mm',
      active: activeBlock?.toLowerCase() === blk.toLowerCase()
    }
  })

  const filteredItems = searchQuery.trim() === ''
    ? blockSuggestions
    : blockSuggestions.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const unreadCount = (notifications || []).filter(n => n.unread).length

  // Focus input when search panel opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const handleMarkAllRead = () => {
    setNotifications?.(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const handleNotificationClick = (id) => {
    setNotifications?.(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  const handleAddLocationClick = () => {
    alert("Location added to your regional network database.")
  }

  return (
    <header
      className="dashboard-header"
      style={{
        position: 'absolute',
        top: 'calc(22 * var(--u))',
        left: 'calc(100 * var(--u))',
        right: 'calc(37 * var(--u))',
        height: 'calc(52 * var(--u))',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Left: greeting with active block context */}
      <div className="header-greeting-container" style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', flexWrap: 'nowrap' }}>
        <div
          className="header-greeting-text anim-hello"
          style={{ fontSize: 'calc(18 * var(--u))', fontWeight: 400, color: 'rgba(255,255,255,.93)', lineHeight: 1 }}
        >
          Welcome,
        </div>
        <div
          className="header-greeting-name anim-who"
          style={{ fontSize: 'calc(19.5 * var(--u))', fontWeight: 700, letterSpacing: 'calc(-.35 * var(--u))', color: '#fff', lineHeight: 1, whiteSpace: 'nowrap' }}
        >
          {displayName}
        </div>
        <div
          className="header-location-badge"
          style={{
            marginLeft: 'calc(10 * var(--u))',
            padding: 'calc(4 * var(--u)) calc(10 * var(--u))',
            background: 'rgba(255,255,255,0.14)',
            backdropFilter: 'blur(calc(12 * var(--u)))',
            borderRadius: 'calc(12 * var(--u))',
            fontSize: 'calc(12 * var(--u))',
            color: '#7dd3fc',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(5 * var(--u))',
            whiteSpace: 'nowrap'
          }}
        >
          <Icon id="i-pin" width="12" height="12" />
          <span>{activeBlock} Block</span>
          <span className="badge-subtext">• {activeDistrict}</span>
        </div>
      </div>

      {/* Right: tools */}
      <div
        role="toolbar"
        aria-label="Quick actions"
        style={{ display: 'flex', alignItems: 'center', gap: 'calc(12 * var(--u))', position: 'relative' }}
      >
        {/* Kisan Darpan AI Intelligence Quick Launcher (Global) */}
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="anim-tool-ai rounded-2xl border-2 border-dashed border-emerald-400/80 bg-emerald-500/15 text-emerald-300 backdrop-blur-md transition-all duration-300 hover:translate-x-[-3px] hover:translate-y-[-3px] hover:rounded-md hover:bg-emerald-500/25 hover:border-emerald-300 hover:shadow-[3px_3px_0px_#10b981] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer flex items-center justify-center relative group"
          aria-label="Kisan Darpan AI Intelligence"
          title="Kisan Darpan AI Intelligence"
          style={{ width: 'clamp(36px, calc(40 * var(--u)), 44px)', height: 'clamp(36px, calc(40 * var(--u)), 44px)', flexShrink: 0 }}
        >
          <Icon id="i-kisan-ai" width="20" height="20" />
          <span
            style={{
              position: 'absolute',
              top: 'calc(2 * var(--u))',
              right: 'calc(2 * var(--u))',
              width: 'calc(6 * var(--u))',
              height: 'calc(6 * var(--u))',
              borderRadius: '50%',
              background: '#34d399',
              boxShadow: '0 0 calc(6 * var(--u)) #34d399'
            }}
          />
        </button>

        {/* Add location (Opens 4-Tier Location Input Modal) */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="anim-tool1 rounded-2xl border-2 border-dashed border-white/80 bg-white/12 text-white backdrop-blur-md transition-all duration-300 hover:translate-x-[-3px] hover:translate-y-[-3px] hover:rounded-md hover:bg-white/22 hover:border-white hover:shadow-[3px_3px_0px_white] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer flex items-center justify-center"
          aria-label="Set prediction location"
          title="Set State, District, Block, and Panchayat"
          style={{ width: 'clamp(36px, calc(40 * var(--u)), 44px)', height: 'clamp(36px, calc(40 * var(--u)), 44px)', flexShrink: 0 }}
        >
          <Icon id="i-plus" width="18" height="18" />
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
            width: 'clamp(36px, calc(40 * var(--u)), 44px)',
            height: 'clamp(36px, calc(40 * var(--u)), 44px)',
            flexShrink: 0,
            background: searchOpen ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.12)',
            borderColor: searchOpen ? '#fff' : 'rgba(255,255,255,0.80)'
          }}
        >
          <Icon id="i-search" width="18" height="18" />
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
            width: 'clamp(36px, calc(40 * var(--u)), 44px)',
            height: 'clamp(36px, calc(40 * var(--u)), 44px)',
            flexShrink: 0,
            background: notificationsOpen ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.12)',
            borderColor: notificationsOpen ? '#fff' : 'rgba(255,255,255,0.80)'
          }}
        >
          <Icon id="i-bell" width="18" height="18" />
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
          className="anim-tool4 cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/dashboard/settings')}
          aria-label={`${displayName} profile & settings`}
          title="Profile & Settings"
          style={{
            width: 'clamp(36px, calc(40 * var(--u)), 44px)',
            height: 'clamp(36px, calc(40 * var(--u)), 44px)',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            cursor: 'pointer',
            border: '2px solid rgba(255,255,255,0.35)',
            transition: 'border-color 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {user?.user_metadata?.avatar_url && !imgError ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={displayName}
              loading="eager"
              decoding="async"
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 'clamp(14px, calc(16 * var(--u)), 18px)',
              letterSpacing: '0.02em',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}>
              {userInitial}
            </div>
          )}
        </div>

        {/* ─── Search Auto-complete Dropdown (Blocks) ─── */}
        {searchOpen && (
          <div
            className="header-dropdown-search"
            style={{
              position: 'absolute',
              top: 'calc(62 * var(--u))',
              right: 'calc(120 * var(--u))',
              width: 'calc(300 * var(--u))',
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
              placeholder="Search administrative block..."
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
            <div style={{ fontSize: 'calc(11 * var(--u))', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 'calc(.5 * var(--u))', paddingLeft: 'calc(4 * var(--u))' }}>
              Blocks in Network
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(3 * var(--u))', maxHeight: 'calc(200 * var(--u))', overflowY: 'auto' }}>
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleBlockChange(item.id)
                      setSearchOpen(false)
                      setSearchQuery('')
                    }}
                    style={{
                      width: '100%',
                      padding: 'calc(8 * var(--u)) calc(10 * var(--u))',
                      background: item.active ? 'rgba(255,255,255,0.22)' : 'transparent',
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
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                    onMouseLeave={e => e.currentTarget.style.background = item.active ? 'rgba(255,255,255,0.22)' : 'transparent'}
                  >
                    <div>
                      <div style={{ fontWeight: item.active ? 600 : 500 }}>{item.name}</div>
                      <div style={{ fontSize: 'calc(11 * var(--u))', opacity: 0.6 }}>{item.region}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 600 }}>{item.temp}</div>
                      <div style={{ fontSize: 'calc(10.5 * var(--u))', color: '#93c5fd' }}>{item.rainfall}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div style={{ padding: 'calc(10 * var(--u))', fontSize: 'calc(12 * var(--u))', opacity: 0.5, textAlign: 'center' }}>
                  No matching blocks found
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Notifications Dropdown ─── */}
        {notificationsOpen && (
          <div
            className="header-dropdown-notifications"
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
              {(notifications || []).map(n => (
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

      {/* Animated 4-Tier Location Input Modal (State > District > Block > Panchayat) */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      {/* Global Kisan Darpan AI Intelligence Assistant Modal */}
      <KisanDarpanAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </header>
  )
}
