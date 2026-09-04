import React, { useState, useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { tabViewBaseStyle } from '../lib/styles'
import { Icon } from '../components/IconSprite'
import { 
  getRisksForPanchayat, 
  riskCategoryConfig, 
  riskLevelColors 
} from '../data/mockRisks'

export default function RiskAlerts() {
  const { 
    weatherData, 
    activePanchayat, 
    handlePanchayatChange,
    activeBlock, 
    handleBlockChange,
    activeDistrict,
    activeState,
    activeCrop,
    activeGrowthStage,
    panchayatsInBlock,
    blocksInDistrict,
    mockBlocks
  } = useDashboard()

  const blocksList = useMemo(() => {
    const list = [...(blocksInDistrict || [])]
    if (activeBlock && !list.includes(activeBlock)) {
      list.unshift(activeBlock)
    }
    return list.length > 0 ? list : ["Polba-Dadpur", "Chinsurah-Mogra", "Singur", "Haripal"]
  }, [blocksInDistrict, activeBlock])

  const currentPanchayat = useMemo(() => {
    return panchayatsInBlock.find(p => p.id === activePanchayat) || panchayatsInBlock[0]
  }, [panchayatsInBlock, activePanchayat])

  // Dynamic risk calculation based on active Panchayat and Weather Telemetry
  const riskData = useMemo(() => {
    return getRisksForPanchayat(activePanchayat, weatherData)
  }, [activePanchayat, weatherData])

  const dominantHazard = useMemo(() => {
    if (!riskData?.risks || riskData.risks.length === 0) return null
    const scoreMap = { CRITICAL: 4, HIGH: 3, MODERATE: 2, LOW: 1 }
    const sorted = [...riskData.risks].sort((a, b) => {
      const diff = (scoreMap[b.riskLevel] || 0) - (scoreMap[a.riskLevel] || 0)
      if (diff !== 0) return diff
      return (b.probability || 0) - (a.probability || 0)
    })
    return sorted[0]
  }, [riskData.risks])

  // UI state
  const [levelFilter, setLevelFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [dismissedAlerts, setDismissedAlerts] = useState([])
  const [expandedRiskId, setExpandedRiskId] = useState(null)
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false)
  const [broadcastLanguage, setBroadcastLanguage] = useState('Bengali')
  const [broadcastChannel, setBroadcastChannel] = useState('SMS')
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filter alerts (excluding dismissed)
  const visibleAlerts = useMemo(() => {
    return riskData.alerts.filter(a => !dismissedAlerts.includes(a.id))
  }, [riskData.alerts, dismissedAlerts])

  // Filter risk cards
  const filteredRisks = useMemo(() => {
    return riskData.risks.filter(risk => {
      const matchesLevel = levelFilter === 'ALL' || risk.riskLevel === levelFilter
      const matchesSearch = searchQuery.trim() === '' || 
        risk.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.severity.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesLevel && matchesSearch
    })
  }, [riskData.risks, levelFilter, searchQuery])

  // Counts for filter pills
  const levelCounts = useMemo(() => {
    const counts = { ALL: riskData.risks.length, CRITICAL: 0, HIGH: 0, MODERATE: 0, LOW: 0 }
    riskData.risks.forEach(r => {
      if (counts[r.riskLevel] !== undefined) {
        counts[r.riskLevel]++
      }
    })
    return counts
  }, [riskData.risks])

  // Trigger simulated refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      showToast(`Real-time sensor telemetry and hazard forecasts for ${currentPanchayat?.name || activeBlock} updated successfully.`)
    }, 600)
  }

  // Dismiss an alert
  const handleDismissAlert = (id) => {
    setDismissedAlerts(prev => [...prev, id])
    showToast("Alert bulletin archived.")
  }

  // Helper for notification toast
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Broadcast dispatch handler
  const handleSendBroadcast = () => {
    setIsBroadcasting(true)
    setTimeout(() => {
      setIsBroadcasting(false)
      setBroadcastModalOpen(false)
      showToast(`Agromet Bulletin successfully broadcast to 1,420 registered farmers in ${currentPanchayat?.name || activeBlock} via ${broadcastChannel} (${broadcastLanguage})!`)
    }, 1200)
  }

  const overallTheme = riskLevelColors[riskData.overallThreatLevel] || riskLevelColors.MODERATE

  return (
    <div style={{ ...tabViewBaseStyle, display: 'flex', flexDirection: 'column', gap: 'calc(20 * var(--u))' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            top: 'calc(24 * var(--u))',
            right: 'calc(40 * var(--u))',
            zIndex: 1000,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
            color: '#fff',
            padding: 'calc(12 * var(--u)) calc(20 * var(--u))',
            borderRadius: 'calc(14 * var(--u))',
            boxShadow: '0 calc(10 * var(--u)) calc(30 * var(--u)) rgba(0, 0, 0, 0.4), 0 0 calc(20 * var(--u)) rgba(16, 185, 129, 0.4)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(10 * var(--u))',
            fontSize: 'calc(13.5 * var(--u))',
            fontWeight: 500,
            animation: 'riseIn 0.3s ease-out'
          }}
        >
          <Icon id="i-check-circle" width="20" height="20" style={{ color: '#fff' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, flexWrap: 'wrap', gap: 'calc(16 * var(--u))' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))' }}>
            <h2 style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 700, letterSpacing: 'calc(-.4 * var(--u))', margin: 0 }}>
              Risk Dashboard & Alert Center
            </h2>
            <span style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'calc(6 * var(--u))',
              padding: 'calc(4 * var(--u)) calc(12 * var(--u))',
              borderRadius: 'calc(20 * var(--u))',
              background: overallTheme.bg,
              border: `1px solid ${overallTheme.border}`,
              color: overallTheme.text,
              fontSize: 'calc(12 * var(--u))',
              fontWeight: 700,
              letterSpacing: 'calc(0.5 * var(--u))'
            }}>
              <span style={{ 
                width: 'calc(7 * var(--u))', 
                height: 'calc(7 * var(--u))', 
                borderRadius: '50%', 
                background: overallTheme.solidBorder,
                boxShadow: `0 0 calc(8 * var(--u)) ${overallTheme.solidBorder}`,
                animation: riskData.overallThreatLevel === 'CRITICAL' ? 'arrowBounce 1s infinite alternate' : 'none'
              }} />
              {riskData.overallThreatLevel} THREAT LEVEL
            </span>
          </div>
          <p style={{ fontSize: 'calc(13.5 * var(--u))', color: 'rgba(255,255,255,0.75)', marginTop: 'calc(6 * var(--u))', margin: 'calc(4 * var(--u)) 0 0 0' }}>
            High-resolution multi-hazard vulnerability assessment for <strong style={{ color: '#fff' }}>{currentPanchayat?.name || weatherData.city}</strong> ({activeBlock} Block, {activeDistrict}).
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))' }}>
          <button
            onClick={handleRefresh}
            title="Refresh hazard sensors"
            style={{
              padding: 'calc(8 * var(--u)) calc(14 * var(--u))',
              borderRadius: 'calc(10 * var(--u))',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontSize: 'calc(13 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(6 * var(--u))',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
          >
            <Icon 
              id="i-refresh" 
              width="15" 
              height="15" 
              style={{ 
                transform: isRefreshing ? 'rotate(360deg)' : 'none', 
                transition: 'transform 0.6s ease' 
              }} 
            />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>

          <button
            onClick={() => setBroadcastModalOpen(true)}
            style={{
              padding: 'calc(8 * var(--u)) calc(16 * var(--u))',
              borderRadius: 'calc(10 * var(--u))',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: '1px solid rgba(96, 165, 250, 0.4)',
              color: '#fff',
              fontSize: 'calc(13 * var(--u))',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(8 * var(--u))',
              cursor: 'pointer',
              boxShadow: '0 calc(4 * var(--u)) calc(14 * var(--u)) rgba(37, 99, 235, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(calc(-1 * var(--u)))'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Icon id="i-broadcast" width="16" height="16" />
            <span>Broadcast Alert (SMS/IVR)</span>
          </button>
        </div>
      </div>

      {/* ─── LOCATION & PANCHAYAT SELECTION HUB ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: 'calc(16 * var(--u))',
        padding: 'calc(14 * var(--u)) calc(18 * var(--u))',
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(12 * var(--u))',
        flexShrink: 0
      }}>
        {/* Row 1: Dropdown Selectors & Active Panchayat Live Snapshot */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'calc(12 * var(--u))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(14 * var(--u))', flexWrap: 'wrap' }}>
            
            {/* Block Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
              <label style={{ 
                fontSize: 'calc(11.5 * var(--u))', 
                fontWeight: 700, 
                color: 'rgba(255,255,255,0.6)', 
                textTransform: 'uppercase', 
                letterSpacing: 'calc(0.6 * var(--u))', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'calc(4 * var(--u))' 
              }}>
                <Icon id="i-globe" width="13" height="13" style={{ color: '#38bdf8' }} />
                Block
              </label>
              <select
                value={activeBlock}
                onChange={e => handleBlockChange(e.target.value)}
                style={{
                  padding: 'calc(7 * var(--u)) calc(12 * var(--u))',
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: 'calc(8 * var(--u))',
                  color: '#fff',
                  fontSize: 'calc(13 * var(--u))',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {blocksList.map(b => (
                  <option key={b} value={b} style={{ color: '#000', background: '#fff' }}>{b}</option>
                ))}
              </select>
            </div>

            {/* Panchayat Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
              <label style={{ 
                fontSize: 'calc(11.5 * var(--u))', 
                fontWeight: 700, 
                color: 'rgba(255,255,255,0.6)', 
                textTransform: 'uppercase', 
                letterSpacing: 'calc(0.6 * var(--u))', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'calc(4 * var(--u))' 
              }}>
                <Icon id="i-pin" width="13" height="13" style={{ color: '#f59e0b' }} />
                Panchayat Location
              </label>
              <select
                value={activePanchayat}
                onChange={e => handlePanchayatChange(e.target.value)}
                style={{
                  padding: 'calc(7 * var(--u)) calc(14 * var(--u))',
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: 'calc(8 * var(--u))',
                  color: '#fff',
                  fontSize: 'calc(13 * var(--u))',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: 'calc(180 * var(--u))'
                }}
              >
                {panchayatsInBlock.map(p => (
                  <option key={p.id} value={p.id} style={{ color: '#000', background: '#fff' }}>
                    {p.name} — {p.riskLevel} Risk ({p.rainfallStatus?.split('(')[0]?.trim() || p.rainfall + ' mm'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Real-time telemetry snapshot for current panchayat */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(10 * var(--u))',
            fontSize: 'calc(12 * var(--u))',
            color: 'rgba(255,255,255,0.9)',
            background: 'rgba(255,255,255,0.06)',
            padding: 'calc(6 * var(--u)) calc(14 * var(--u))',
            borderRadius: 'calc(10 * var(--u))',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'calc(4 * var(--u))' }}>
              <Icon id="i-cloud" width="13" height="13" style={{ color: '#38bdf8' }} /> {weatherData.rainfall}
            </span>
            <span style={{ opacity: 0.35 }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'calc(4 * var(--u))' }}>
              <Icon id="i-sun" width="13" height="13" style={{ color: '#fca5a5' }} /> {weatherData.temp}°C
            </span>
            <span style={{ opacity: 0.35 }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'calc(4 * var(--u))' }}>
              <Icon id="i-drop" width="13" height="13" style={{ color: '#60a5fa' }} /> {weatherData.humidity}
            </span>
            <span style={{ opacity: 0.35 }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'calc(4 * var(--u))' }}>
              <Icon id="i-wind" width="13" height="13" style={{ color: '#c084fc' }} /> {weatherData.wind}
            </span>
          </div>
        </div>

        {/* Row 2: One-click Quick Switch Panchayat Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 'calc(0.6 * var(--u))', fontWeight: 600 }}>
            Quick Switch ({activeBlock}):
          </span>
          {panchayatsInBlock.map(p => {
            const isSelected = p.id === activePanchayat
            const pTheme = riskLevelColors[p.riskLevel?.toUpperCase()] || riskLevelColors.MODERATE
            return (
              <button
                key={p.id}
                onClick={() => handlePanchayatChange(p.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'calc(6 * var(--u))',
                  padding: 'calc(5 * var(--u)) calc(12 * var(--u))',
                  borderRadius: 'calc(20 * var(--u))',
                  border: isSelected ? `1.5px solid ${pTheme.solidBorder}` : '1px solid rgba(255,255,255,0.12)',
                  background: isSelected ? pTheme.bg : 'rgba(255,255,255,0.05)',
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)',
                  fontSize: 'calc(12 * var(--u))',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 calc(12 * var(--u)) ${pTheme.glow}` : 'none'
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                    e.currentTarget.style.color = '#fff'
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }
                }}
              >
                <span style={{
                  width: 'calc(6 * var(--u))',
                  height: 'calc(6 * var(--u))',
                  borderRadius: '50%',
                  background: pTheme.solidBorder,
                  boxShadow: `0 0 calc(6 * var(--u)) ${pTheme.solidBorder}`
                }} />
                <span>{p.name}</span>
                <span style={{ fontSize: 'calc(10.5 * var(--u))', opacity: 0.8, fontWeight: 600 }}>
                  {p.riskLevel}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Top 4 KPI Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(calc(210 * var(--u)), 1fr))', gap: 'calc(14 * var(--u))', flexShrink: 0 }}>
        
        {/* KPI 1: Vulnerability Index */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'calc(16 * var(--u))',
          padding: 'calc(14 * var(--u)) calc(18 * var(--u))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 'calc(0.8 * var(--u))' }}>
              Vulnerability Index
            </span>
            <Icon id="i-shield-alert" width="16" height="16" style={{ color: overallTheme.text }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'calc(8 * var(--u))', marginTop: 'calc(8 * var(--u))' }}>
            <span style={{ fontSize: 'calc(26 * var(--u))', fontWeight: 800, color: overallTheme.text, lineHeight: 1 }}>
              {riskData.threatScore}
            </span>
            <span style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.5)' }}>/ 100 Index</span>
          </div>
          <div style={{ width: '100%', height: 'calc(5 * var(--u))', background: 'rgba(255,255,255,0.1)', borderRadius: 'calc(3 * var(--u))', marginTop: 'calc(10 * var(--u))', overflow: 'hidden' }}>
            <div style={{ width: `${riskData.threatScore}%`, height: '100%', background: overallTheme.solidBorder, borderRadius: 'calc(3 * var(--u))', transition: 'width 0.8s ease' }} />
          </div>
        </div>

        {/* KPI 2: Active Bulletins */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'calc(16 * var(--u))',
          padding: 'calc(14 * var(--u)) calc(18 * var(--u))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 'calc(0.8 * var(--u))' }}>
              Active Hazard Warnings
            </span>
            <Icon id="i-bell" width="16" height="16" style={{ color: '#fca5a5' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'calc(8 * var(--u))', marginTop: 'calc(8 * var(--u))' }}>
            <span style={{ fontSize: 'calc(26 * var(--u))', fontWeight: 800, color: visibleAlerts.length > 0 ? '#fca5a5' : '#86efac', lineHeight: 1 }}>
              {visibleAlerts.length}
            </span>
            <span style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.7)' }}>
              {visibleAlerts.length === 1 ? 'Bulletin Active' : 'Bulletins Active'}
            </span>
          </div>
          <div style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(10 * var(--u))' }}>
            Last Run: {riskData.lastUpdated}
          </div>
        </div>

        {/* KPI 3: Dominant Hazard Vector */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'calc(16 * var(--u))',
          padding: 'calc(14 * var(--u)) calc(18 * var(--u))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 'calc(0.8 * var(--u))' }}>
              Dominant Hazard
            </span>
            <Icon id="i-alert-triangle" width="16" height="16" style={{ color: '#fde047' }} />
          </div>
          <div style={{ marginTop: 'calc(6 * var(--u))' }}>
            <div style={{ fontSize: 'calc(17 * var(--u))', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {dominantHazard?.category || 'Atmospheric Balance'}
            </div>
            <div style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.7)', marginTop: 'calc(2 * var(--u))' }}>
              {dominantHazard?.severity || 'Normal Parameters'}
            </div>
          </div>
          <div style={{ fontSize: 'calc(11.5 * var(--u))', color: '#93c5fd', marginTop: 'calc(8 * var(--u))' }}>
            Probability: <strong>{dominantHazard?.probability || 0}%</strong>
          </div>
        </div>

      </div>

      {/* ─── SECTION 1: ALERTS SECTION (PROMINENT ACTIVE BULLETINS) ─── */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'calc(12 * var(--u))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
            <div style={{ 
              width: 'calc(8 * var(--u))', 
              height: 'calc(8 * var(--u))', 
              borderRadius: '50%', 
              background: '#ef4444', 
              boxShadow: '0 0 calc(10 * var(--u)) #ef4444' 
            }} />
            <h3 style={{ fontSize: 'calc(18 * var(--u))', fontWeight: 700, margin: 0, letterSpacing: 'calc(-0.2 * var(--u))' }}>
              Active Weather Alerts & Bulletins
            </h3>
          </div>
          <span style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.5)' }}>
            Official Agromet Advisory Bulletin No. 42
          </span>
        </div>

        {visibleAlerts.length === 0 ? (
          <div style={{
            background: 'rgba(34, 197, 94, 0.06)',
            border: '1px dashed rgba(34, 197, 94, 0.3)',
            borderRadius: 'calc(14 * var(--u))',
            padding: 'calc(20 * var(--u))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'calc(12 * var(--u))'
          }}>
            <Icon id="i-check-circle" width="24" height="24" style={{ color: '#86efac' }} />
            <div>
              <div style={{ fontSize: 'calc(14.5 * var(--u))', fontWeight: 600, color: '#86efac' }}>
                All Clear — No Active Severe Weather Alerts
              </div>
              <div style={{ fontSize: 'calc(12.5 * var(--u))', color: 'rgba(255,255,255,0.6)', marginTop: 'calc(2 * var(--u))' }}>
                Hydrometeorological variables are within acceptable seasonal deviations for {weatherData.city}.
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(12 * var(--u))' }}>
            {visibleAlerts.map(alert => {
              const alertLevelStyle = riskLevelColors[alert.level] || riskLevelColors.HIGH
              return (
                <div 
                  key={alert.id}
                  style={{
                    background: alertLevelStyle.bg,
                    border: `1px solid ${alertLevelStyle.border}`,
                    borderLeft: `calc(5 * var(--u)) solid ${alertLevelStyle.solidBorder}`,
                    borderRadius: 'calc(14 * var(--u))',
                    padding: 'calc(18 * var(--u)) calc(20 * var(--u))',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'calc(12 * var(--u))',
                    boxShadow: `0 calc(4 * var(--u)) calc(20 * var(--u)) ${alertLevelStyle.glow}`,
                    position: 'relative',
                    transition: 'all 0.25s'
                  }}
                >
                  {/* Alert Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'calc(10 * var(--u))' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'calc(12 * var(--u))' }}>
                      <div style={{ 
                        background: alertLevelStyle.border, 
                        padding: 'calc(8 * var(--u))', 
                        borderRadius: 'calc(10 * var(--u))',
                        color: alertLevelStyle.text,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon id={alert.level === 'CRITICAL' ? 'i-alert-triangle' : 'i-bell'} width="22" height="22" />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', flexWrap: 'wrap' }}>
                          <span style={{ 
                            fontSize: 'calc(11 * var(--u))', 
                            fontWeight: 700, 
                            color: alertLevelStyle.text, 
                            background: 'rgba(0,0,0,0.3)', 
                            padding: 'calc(3 * var(--u)) calc(8 * var(--u))', 
                            borderRadius: 'calc(6 * var(--u))',
                            textTransform: 'uppercase'
                          }}>
                            {alert.level} ALERT
                          </span>
                          <h4 style={{ fontSize: 'calc(17 * var(--u))', fontWeight: 700, color: '#fff', margin: 0 }}>
                            {alert.title}
                          </h4>
                        </div>
                        <p style={{ fontSize: 'calc(14.5 * var(--u))', fontWeight: 500, color: 'rgba(255,255,255,0.95)', marginTop: 'calc(4 * var(--u))', margin: 'calc(4 * var(--u)) 0 0 0' }}>
                          {alert.headline}
                        </p>
                      </div>
                    </div>

                    {/* Valid Until Pill & Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'calc(6 * var(--u))', 
                        background: 'rgba(0,0,0,0.35)', 
                        padding: 'calc(6 * var(--u)) calc(12 * var(--u))', 
                        borderRadius: 'calc(20 * var(--u))',
                        border: '1px solid rgba(255,255,255,0.12)'
                      }}>
                        <Icon id="i-clock" width="14" height="14" style={{ color: '#fde047' }} />
                        <div style={{ fontSize: 'calc(12 * var(--u))' }}>
                          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Valid until: </span>
                          <strong style={{ color: '#fff' }}>{alert.validUntil}</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDismissAlert(alert.id)}
                        title="Archive bulletin"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: 'none',
                          color: 'rgba(255,255,255,0.6)',
                          width: 'calc(28 * var(--u))',
                          height: 'calc(28 * var(--u))',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: 'calc(16 * var(--u))',
                          lineHeight: 1
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Bulletin Details & Actions Checklist */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(calc(280 * var(--u)), 1fr))', 
                    gap: 'calc(14 * var(--u))',
                    background: 'rgba(0,0,0,0.2)',
                    padding: 'calc(12 * var(--u)) calc(16 * var(--u))',
                    borderRadius: 'calc(10 * var(--u))'
                  }}>
                    <div>
                      <div style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 'calc(0.5 * var(--u))', marginBottom: 'calc(4 * var(--u))' }}>
                        Situation Report
                      </div>
                      <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: 0 }}>
                        {alert.bulletinText}
                      </p>
                      {alert.affectedZones && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', marginTop: 'calc(8 * var(--u))', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.5)' }}>Affected:</span>
                          {alert.affectedZones.map((zone, zi) => (
                            <span key={zi} style={{ fontSize: 'calc(11 * var(--u))', background: 'rgba(255,255,255,0.1)', padding: 'calc(2 * var(--u)) calc(8 * var(--u))', borderRadius: 'calc(6 * var(--u))', color: '#fff' }}>
                              {zone}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 'calc(0.5 * var(--u))', marginBottom: 'calc(4 * var(--u))' }}>
                        Mandatory Action Items
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 'calc(16 * var(--u))', color: 'rgba(255,255,255,0.9)', fontSize: 'calc(12.5 * var(--u))', lineHeight: 1.5 }}>
                        {alert.actions.map((act, ai) => (
                          <li key={ai} style={{ marginBottom: 'calc(3 * var(--u))' }}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ─── SECTION 2: 6 RISK CATEGORIES COMPLETE DASHBOARD ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        
        {/* Controls Bar: Title, Search, and Risk Level Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'calc(14 * var(--u))', flexWrap: 'wrap', gap: 'calc(10 * var(--u))' }}>
          <div>
            <h3 style={{ fontSize: 'calc(18 * var(--u))', fontWeight: 700, margin: 0, letterSpacing: 'calc(-0.2 * var(--u))' }}>
              Risk Categories Assessment
            </h3>
            <span style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.6)' }}>
              Evaluation across 6 micro-climatic hazard dimensions
            </span>
          </div>

          {/* Level Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', background: 'rgba(0,0,0,0.3)', padding: 'calc(4 * var(--u))', borderRadius: 'calc(10 * var(--u))', border: '1px solid rgba(255,255,255,0.08)' }}>
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map(lvl => {
              const isActive = levelFilter === lvl
              const colorConfig = lvl === 'ALL' ? { text: '#fff' } : riskLevelColors[lvl]
              return (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  style={{
                    padding: 'calc(5 * var(--u)) calc(12 * var(--u))',
                    borderRadius: 'calc(7 * var(--u))',
                    border: 'none',
                    background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                    color: isActive ? colorConfig.text : 'rgba(255,255,255,0.6)',
                    fontSize: 'calc(12 * var(--u))',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'calc(5 * var(--u))',
                    transition: 'all 0.15s'
                  }}
                >
                  <span>{lvl}</span>
                  <span style={{ 
                    fontSize: 'calc(10 * var(--u))', 
                    padding: 'calc(1 * var(--u)) calc(5 * var(--u))', 
                    borderRadius: 'calc(10 * var(--u))', 
                    background: isActive ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.08)',
                    color: '#fff'
                  }}>
                    {levelCounts[lvl]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Risk Grid Container: 6 Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(calc(320 * var(--u)), 1fr))', 
          gap: 'calc(16 * var(--u))',
          paddingBottom: 'calc(20 * var(--u))'
        }}>
          {filteredRisks.map(risk => {
            const catConfig = riskCategoryConfig[risk.id] || { icon: 'i-cloud', color: '#3b82f6' }
            const lvlStyle = riskLevelColors[risk.riskLevel] || riskLevelColors.LOW
            const isExpanded = expandedRiskId === risk.id

            return (
              <div 
                key={risk.id}
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  border: `1px solid ${risk.riskLevel === 'CRITICAL' || risk.riskLevel === 'HIGH' ? lvlStyle.border : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: 'calc(16 * var(--u))',
                  padding: 'calc(18 * var(--u))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'calc(12 * var(--u))',
                  boxShadow: risk.riskLevel === 'CRITICAL' ? `0 0 calc(20 * var(--u)) ${lvlStyle.glow}` : 'none',
                  transition: 'transform 0.2s, border-color 0.2s',
                  position: 'relative'
                }}
              >
                {/* Card Top: Category Icon, Name, and Risk Level Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))' }}>
                    <div style={{
                      width: 'calc(36 * var(--u))',
                      height: 'calc(36 * var(--u))',
                      borderRadius: 'calc(10 * var(--u))',
                      background: catConfig.badgeBg || 'rgba(255,255,255,0.08)',
                      border: `1px solid ${catConfig.border || 'rgba(255,255,255,0.15)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: catConfig.color || '#fff'
                    }}>
                      <Icon id={catConfig.icon} width="20" height="20" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, margin: 0, color: '#fff' }}>
                        {risk.category}
                      </h4>
                      <span style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.5)' }}>
                        {catConfig.parameter}
                      </span>
                    </div>
                  </div>

                  {/* Risk Level Badge */}
                  <span style={{
                    padding: 'calc(4 * var(--u)) calc(10 * var(--u))',
                    borderRadius: 'calc(8 * var(--u))',
                    background: lvlStyle.bg,
                    border: `1px solid ${lvlStyle.border}`,
                    color: lvlStyle.text,
                    fontSize: 'calc(11.5 * var(--u))',
                    fontWeight: 700,
                    letterSpacing: 'calc(0.5 * var(--u))'
                  }}>
                    {risk.riskLevel}
                  </span>
                </div>

                {/* Primary Metrics Grid: Severity & Expected Time */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: 'calc(8 * var(--u))',
                  background: 'rgba(0,0,0,0.25)',
                  padding: 'calc(10 * var(--u)) calc(12 * var(--u))',
                  borderRadius: 'calc(10 * var(--u))'
                }}>
                  <div>
                    <div style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                      Severity
                    </div>
                    <div style={{ fontSize: 'calc(13 * var(--u))', fontWeight: 600, color: '#fff', marginTop: 'calc(2 * var(--u))' }}>
                      {risk.severity}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                      Expected Time
                    </div>
                    <div style={{ fontSize: 'calc(13 * var(--u))', fontWeight: 600, color: '#fde047', marginTop: 'calc(2 * var(--u))', display: 'flex', alignItems: 'center', gap: 'calc(4 * var(--u))' }}>
                      <Icon id="i-clock" width="12" height="12" />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {risk.expectedTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Probability Progress Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'calc(4 * var(--u))' }}>
                    <span style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.6)' }}>
                      Occurrence Probability
                    </span>
                    <strong style={{ fontSize: 'calc(13 * var(--u))', color: lvlStyle.text }}>
                      {risk.probability}%
                    </strong>
                  </div>
                  <div style={{ width: '100%', height: 'calc(6 * var(--u))', background: 'rgba(255,255,255,0.08)', borderRadius: 'calc(3 * var(--u))', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${risk.probability}%`, 
                      height: '100%', 
                      background: lvlStyle.solidBorder,
                      borderRadius: 'calc(3 * var(--u))',
                      boxShadow: `0 0 calc(6 * var(--u)) ${lvlStyle.solidBorder}`,
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>

                {/* Description */}
                <p style={{ 
                  fontSize: 'calc(13 * var(--u))', 
                  color: 'rgba(255,255,255,0.85)', 
                  lineHeight: 1.5, 
                  margin: 0,
                  flexGrow: 1 
                }}>
                  {risk.description}
                </p>

                {/* Key Sub-metrics */}
                {risk.metrics && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'calc(4 * var(--u))', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 'calc(8 * var(--u))' }}>
                    {Object.entries(risk.metrics).map(([key, val], mi) => (
                      <div key={mi} style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: 'calc(10 * var(--u))', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>{key}</div>
                        <div style={{ fontSize: 'calc(12 * var(--u))', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginTop: 'calc(2 * var(--u))' }}>{val}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mitigation Expandable Toggle */}
                <div>
                  <button
                    onClick={() => setExpandedRiskId(isExpanded ? null : risk.id)}
                    style={{
                      width: '100%',
                      padding: 'calc(6 * var(--u)) calc(10 * var(--u))',
                      background: isExpanded ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 'calc(8 * var(--u))',
                      color: '#fff',
                      fontSize: 'calc(12 * var(--u))',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    <span>{isExpanded ? 'Hide Mitigation Strategy' : 'View Recommended Farmer Action'}</span>
                    <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                  </button>

                  {isExpanded && (
                    <div style={{
                      marginTop: 'calc(8 * var(--u))',
                      padding: 'calc(10 * var(--u)) calc(12 * var(--u))',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: 'calc(8 * var(--u))',
                      borderLeft: `calc(3 * var(--u)) solid ${lvlStyle.solidBorder}`,
                      fontSize: 'calc(12 * var(--u))',
                      color: 'rgba(255,255,255,0.9)',
                      lineHeight: 1.45,
                      animation: 'riseIn 0.2s ease-out'
                    }}>
                      <div style={{ fontWeight: 600, color: lvlStyle.text, marginBottom: 'calc(4 * var(--u))' }}>
                        Field Advisory for {activeCrop || 'Target Crop'}:
                      </div>
                      <div>{risk.mitigation}</div>
                      {risk.affectedCrops && (
                        <div style={{ marginTop: 'calc(6 * var(--u))', fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.5)' }}>
                          Vulnerable Crops: {risk.affectedCrops.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            )
          })}
        </div>

      </div>

      {/* ─── MODAL: BROADCAST ADVISORY TO FARMERS (SMS / WHATSAPP / IVR) ─── */}
      {broadcastModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(calc(8 * var(--u)))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'calc(20 * var(--u))'
        }}>
          <div style={{
            background: '#041824',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 'calc(20 * var(--u))',
            width: '100%',
            maxWidth: 'calc(540 * var(--u))',
            padding: 'calc(24 * var(--u))',
            boxShadow: '0 calc(20 * var(--u)) calc(50 * var(--u)) rgba(0, 0, 0, 0.6), 0 0 calc(30 * var(--u)) rgba(59, 130, 246, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(18 * var(--u))',
            animation: 'popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: 'calc(8 * var(--u))', borderRadius: 'calc(10 * var(--u))' }}>
                  <Icon id="i-broadcast" width="20" height="20" />
                </div>
                <div>
                  <h3 style={{ fontSize: 'calc(18 * var(--u))', fontWeight: 700, margin: 0, color: '#fff' }}>
                    Agromet Emergency Broadcast
                  </h3>
                  <p style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.6)', margin: 'calc(2 * var(--u)) 0 0 0' }}>
                    Disseminating instant advisory to farmers in {currentPanchayat?.name || activeBlock} ({activeDistrict})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setBroadcastModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 'calc(20 * var(--u))', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Target Audience Count Banner */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(12 * var(--u)) calc(16 * var(--u))',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: 'calc(11.5 * var(--u))', color: '#93c5fd', textTransform: 'uppercase' }}>Target Reach</span>
                <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: '#fff' }}>
                  1,420 Registered Farmers
                </div>
              </div>
              <span style={{ fontSize: 'calc(12 * var(--u))', background: '#2563eb', color: '#fff', padding: 'calc(4 * var(--u)) calc(10 * var(--u))', borderRadius: 'calc(20 * var(--u))', fontWeight: 600 }}>
                {currentPanchayat?.name || activeBlock}
              </span>
            </div>

            {/* Channel and Language Selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'calc(12 * var(--u))' }}>
              <div>
                <label style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 'calc(6 * var(--u))' }}>
                  Broadcast Channel
                </label>
                <select 
                  value={broadcastChannel}
                  onChange={e => setBroadcastChannel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'calc(8 * var(--u)) calc(10 * var(--u))',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 'calc(8 * var(--u))',
                    color: '#fff',
                    fontSize: 'calc(13 * var(--u))'
                  }}
                >
                  <option value="SMS" style={{ color: '#000' }}>SMS (Fastest 99.4% Delivery)</option>
                  <option value="WhatsApp" style={{ color: '#000' }}>WhatsApp Audio & Infographic</option>
                  <option value="IVR Call" style={{ color: '#000' }}>Automated Voice Call (IVR)</option>
                  <option value="Loudspeaker Siren" style={{ color: '#000' }}>Panchayat Siren / Loudspeaker</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 'calc(6 * var(--u))' }}>
                  Advisory Language
                </label>
                <select 
                  value={broadcastLanguage}
                  onChange={e => setBroadcastLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'calc(8 * var(--u)) calc(10 * var(--u))',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 'calc(8 * var(--u))',
                    color: '#fff',
                    fontSize: 'calc(13 * var(--u))'
                  }}
                >
                  <option value="Bengali" style={{ color: '#000' }}>Bengali (বাংলা)</option>
                  <option value="English" style={{ color: '#000' }}>English</option>
                  <option value="Hindi" style={{ color: '#000' }}>Hindi (हिंदी)</option>
                </select>
              </div>
            </div>

            {/* Message Preview Box */}
            <div>
              <label style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 'calc(6 * var(--u))' }}>
                Transmitted Bulletin Preview
              </label>
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'calc(10 * var(--u))',
                padding: 'calc(12 * var(--u)) calc(14 * var(--u))',
                fontSize: 'calc(12.5 * var(--u))',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.5,
                fontFamily: 'monospace'
              }}>
                {broadcastLanguage === 'Bengali' ? (
                  <>
                    ⚠️ <strong>{currentPanchayat?.name || activeBlock} কৃষি আবহাওয়া সতর্কতা:</strong> আগামী ২৪ ঘণ্টার মধ্যে {dominantHazard?.category || 'আবহাওয়া'} সংক্রান্ত সমস্যা ({dominantHazard?.severity || 'ভারী বৃষ্টি'})। {activeCrop || 'ফসল'} জমিতে অতিরিক্ত জল নিষ্কাশনের ব্যবস্থা রাখুন। সার ও কীটনাশক স্প্রে সতর্কতার সাথে পরিচালনা করুন।
                  </>
                ) : broadcastLanguage === 'Hindi' ? (
                  <>
                    ⚠️ <strong>{currentPanchayat?.name || activeBlock} कृषि मौसम चेतावनी:</strong> अगले 24 घंटों में {dominantHazard?.category || 'मौसम'} चेतावनी ({dominantHazard?.severity || 'भारी वर्षा'}) की संभावना। {activeCrop || 'फसल'} के खेतों में जल निकासी की व्यवस्था करें। कीटनाशक छिड़काव स्थगित रखें।
                  </>
                ) : (
                  <>
                    ⚠️ <strong>{currentPanchayat?.name || activeBlock} AGROMET ALERT:</strong> {dominantHazard?.category || 'Weather hazard'} warning in effect ({dominantHazard?.severity || 'Moderate to heavy conditions'}). Inspect field drainage for {activeCrop || 'crops'}. Postpone chemical spraying until winds and showers stabilize.
                  </>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'calc(10 * var(--u))', marginTop: 'calc(8 * var(--u))' }}>
              <button
                onClick={() => setBroadcastModalOpen(false)}
                style={{
                  padding: 'calc(10 * var(--u)) calc(16 * var(--u))',
                  borderRadius: 'calc(8 * var(--u))',
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#fff',
                  fontSize: 'calc(13 * var(--u))',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendBroadcast}
                disabled={isBroadcasting}
                style={{
                  padding: 'calc(10 * var(--u)) calc(20 * var(--u))',
                  borderRadius: 'calc(8 * var(--u))',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: '1px solid rgba(248, 113, 113, 0.4)',
                  color: '#fff',
                  fontSize: 'calc(13 * var(--u))',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(8 * var(--u))',
                  cursor: isBroadcasting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 calc(4 * var(--u)) calc(14 * var(--u)) rgba(220, 38, 38, 0.4)'
                }}
              >
                <Icon id="i-send" width="16" height="16" />
                <span>{isBroadcasting ? 'Dispatching to 1,420 Devices...' : 'Dispatch Emergency Broadcast'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
