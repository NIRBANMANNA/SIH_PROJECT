import React from 'react'
import { useDashboard } from '../context/DashboardContext'
import { mockCrops, mockGrowthStages, getAdvisory } from '../data/mockAdvisory'
import { tabViewBaseStyle } from '../lib/styles'
import { Icon } from '../components/IconSprite'

export default function CropAdvisory() {
  const { 
    weatherData, 
    activeCrop, 
    handleCropChange, 
    activeGrowthStage, 
    setActiveGrowthStage 
  } = useDashboard()

  const advisory = getAdvisory(activeCrop, activeGrowthStage, weatherData)

  return (
    <div style={tabViewBaseStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'calc(20 * var(--u))', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 600, letterSpacing: 'calc(-.4 * var(--u))' }}>Agro-Advisory Services</h2>
          <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.7)', marginTop: 'calc(4 * var(--u))' }}>
            Tailored recommendations based on high-resolution weather data for {weatherData.city}.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'calc(16 * var(--u))', marginBottom: 'calc(24 * var(--u))', flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 'calc(6 * var(--u))' }}>Select Crop</label>
          <select 
            value={activeCrop} 
            onChange={e => handleCropChange(e.target.value)}
            style={{
              width: '100%',
              padding: 'calc(10 * var(--u)) calc(12 * var(--u))',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'calc(8 * var(--u))',
              color: '#fff',
              fontSize: 'calc(14 * var(--u))',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {mockCrops.map(c => <option key={c} value={c} style={{ color: '#000' }}>{c}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 'calc(6 * var(--u))' }}>Growth Stage</label>
          <select 
            value={activeGrowthStage} 
            onChange={e => setActiveGrowthStage(e.target.value)}
            style={{
              width: '100%',
              padding: 'calc(10 * var(--u)) calc(12 * var(--u))',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'calc(8 * var(--u))',
              color: '#fff',
              fontSize: 'calc(14 * var(--u))',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {(mockGrowthStages[activeCrop] || []).map(s => <option key={s} value={s} style={{ color: '#000' }}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Advisory Output */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'calc(16 * var(--u))', overflowY: 'auto' }}>
        
        {/* Warnings */}
        {advisory.warnings.length > 0 && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 'calc(12 * var(--u))',
            padding: 'calc(16 * var(--u))',
            display: 'flex',
            gap: 'calc(12 * var(--u))'
          }}>
            <Icon id="i-bell" width="24" height="24" style={{ color: '#fca5a5', marginTop: 'calc(2 * var(--u))' }} />
            <div>
              <h3 style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 600, color: '#fca5a5', marginBottom: 'calc(4 * var(--u))' }}>Critical Alerts</h3>
              <ul style={{ margin: 0, paddingLeft: 'calc(20 * var(--u))', color: 'rgba(255,255,255,0.9)', fontSize: 'calc(13.5 * var(--u))', lineHeight: 1.5 }}>
                {advisory.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          </div>
        )}

        {/* General Action */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'calc(12 * var(--u))',
          padding: 'calc(16 * var(--u))'
        }}>
          <h3 style={{ fontSize: 'calc(14 * var(--u))', color: 'rgba(255,255,255,0.5)', marginBottom: 'calc(8 * var(--u))', textTransform: 'uppercase', letterSpacing: 'calc(1 * var(--u))' }}>
            Recommended Action
          </h3>
          <p style={{ fontSize: 'calc(16 * var(--u))', lineHeight: 1.5, margin: 0 }}>
            {advisory.action}
          </p>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'calc(16 * var(--u))' }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: 'calc(12 * var(--u))',
            padding: 'calc(16 * var(--u))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', marginBottom: 'calc(8 * var(--u))', color: '#93c5fd' }}>
              <Icon id="i-drop" width="18" height="18" />
              <h3 style={{ fontSize: 'calc(14 * var(--u))', margin: 0, fontWeight: 600 }}>Irrigation</h3>
            </div>
            <p style={{ fontSize: 'calc(14 * var(--u))', lineHeight: 1.5, margin: 0, color: 'rgba(255,255,255,0.9)' }}>
              {advisory.irrigation}
            </p>
          </div>

          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: 'calc(12 * var(--u))',
            padding: 'calc(16 * var(--u))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', marginBottom: 'calc(8 * var(--u))', color: '#86efac' }}>
              <Icon id="i-grid" width="18" height="18" />
              <h3 style={{ fontSize: 'calc(14 * var(--u))', margin: 0, fontWeight: 600 }}>Fertilizer & Pesticide</h3>
            </div>
            <p style={{ fontSize: 'calc(14 * var(--u))', lineHeight: 1.5, margin: 0, color: 'rgba(255,255,255,0.9)' }}>
              {advisory.fertilizer}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
