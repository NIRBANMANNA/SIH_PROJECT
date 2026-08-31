import React from 'react'
import { useDashboard } from '../context/DashboardContext'
import { tabViewBaseStyle } from '../lib/styles'
import { Icon } from '../components/IconSprite'

export default function WeatherMap() {
  const { panchayatsInBlock, activePanchayat, handlePanchayatChange, activeBlock, weatherData } = useDashboard()

  // Find min/max lat/lng to create a normalized grid
  const lats = panchayatsInBlock.map(p => p.lat)
  const lngs = panchayatsInBlock.map(p => p.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  const latRange = maxLat - minLat || 0.1
  const lngRange = maxLng - minLng || 0.1

  return (
    <div style={tabViewBaseStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'calc(20 * var(--u))', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 600, letterSpacing: 'calc(-.4 * var(--u))' }}>Panchayat Network Map</h2>
          <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.7)', marginTop: 'calc(4 * var(--u))' }}>
            High-resolution geospatial view for Block: {activeBlock}
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: 'calc(8 * var(--u)) calc(16 * var(--u))', borderRadius: 'calc(20 * var(--u))', fontSize: 'calc(13 * var(--u))', fontWeight: 600 }}>
          {panchayatsInBlock.length} Active Nodes
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        position: 'relative', 
        background: 'rgba(0,0,0,0.2)', 
        borderRadius: 'calc(16 * var(--u))',
        border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden'
      }}>
        {/* Mock Grid Lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: 'calc(40 * var(--u)) calc(40 * var(--u))' }} />

        {/* Nodes */}
        {panchayatsInBlock.map(p => {
          // Normalize coordinates to percentages (with some padding)
          const x = ((p.lng - minLng) / lngRange) * 80 + 10
          const y = ((maxLat - p.lat) / latRange) * 80 + 10 // Invert Y for latitude
          
          const isActive = p.id === activePanchayat
          
          return (
            <div 
              key={p.id}
              onClick={() => handlePanchayatChange(p.id)}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
            >
              {/* Radar pulse effect if active */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  width: 'calc(40 * var(--u))',
                  height: 'calc(40 * var(--u))',
                  background: 'rgba(74, 222, 128, 0.2)',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
              )}
              
              <div style={{
                width: isActive ? 'calc(20 * var(--u))' : 'calc(14 * var(--u))',
                height: isActive ? 'calc(20 * var(--u))' : 'calc(14 * var(--u))',
                background: isActive ? '#4ade80' : 'rgba(255,255,255,0.4)',
                border: `calc(2 * var(--u)) solid ${isActive ? '#fff' : 'transparent'}`,
                borderRadius: '50%',
                boxShadow: isActive ? '0 0 calc(15 * var(--u)) rgba(74, 222, 128, 0.6)' : 'none',
                zIndex: 2,
                transition: 'all 0.3s'
              }} />
              
              <div style={{
                marginTop: 'calc(6 * var(--u))',
                background: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.6)',
                color: isActive ? '#000' : '#fff',
                padding: 'calc(4 * var(--u)) calc(8 * var(--u))',
                borderRadius: 'calc(6 * var(--u))',
                fontSize: 'calc(11 * var(--u))',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(4px)',
                zIndex: 2,
                boxShadow: '0 calc(4 * var(--u)) calc(10 * var(--u)) rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(4 * var(--u))'
              }}>
                {isActive && <Icon id="i-pin" width="12" height="12" />}
                {p.name}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Node Details */}
      <div style={{
        marginTop: 'calc(20 * var(--u))',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 'calc(16 * var(--u))',
        padding: 'calc(16 * var(--u))',
        display: 'flex',
        alignItems: 'center',
        gap: 'calc(20 * var(--u))'
      }}>
        <div style={{ width: 'calc(50 * var(--u))', height: 'calc(50 * var(--u))', background: 'rgba(74, 222, 128, 0.2)', borderRadius: 'calc(12 * var(--u))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>
          <Icon id={weatherData.conditionId} width="28" height="28" />
        </div>
        <div>
          <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, margin: 0 }}>{weatherData.city} (Selected)</h3>
          <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.7)', margin: 'calc(4 * var(--u)) 0 0 0' }}>
            {weatherData.condition} • {weatherData.temp}°C • Rainfall: {weatherData.rainfall}
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}} />
    </div>
  )
}
