import React from 'react'
import { tabViewBaseStyle } from '../lib/styles'
import { useDashboard } from '../context/DashboardContext'
import { Icon } from '../components/IconSprite'

export default function Reports() {
  const { activePanchayat, weatherData } = useDashboard()

  const handleDownload = () => {
    alert(`Downloading high-resolution forecast report for ${weatherData.city}...`)
  }

  return (
    <div style={tabViewBaseStyle}>
      <div style={{ marginBottom: 'calc(24 * var(--u))', flexShrink: 0 }}>
        <h2 style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 600, letterSpacing: 'calc(-.4 * var(--u))' }}>Generate Reports</h2>
        <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.7)', marginTop: 'calc(4 * var(--u))' }}>
          Export localized weather data and agro-advisories.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(20 * var(--u))' }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'calc(16 * var(--u))',
          padding: 'calc(24 * var(--u))',
          display: 'flex',
          flexDirection: 'column',
          gap: 'calc(16 * var(--u))'
        }}>
          <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, margin: 0 }}>Select Report Type</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'calc(16 * var(--u))' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', fontSize: 'calc(13.5 * var(--u))', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: 'calc(12 * var(--u))', borderRadius: 'calc(8 * var(--u))' }}>
              <input type="radio" name="reportType" defaultChecked style={{ accentColor: '#fff', width: 'calc(16 * var(--u))', height: 'calc(16 * var(--u))' }} />
              Daily Weather Summary
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', fontSize: 'calc(13.5 * var(--u))', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: 'calc(12 * var(--u))', borderRadius: 'calc(8 * var(--u))' }}>
              <input type="radio" name="reportType" style={{ accentColor: '#fff', width: 'calc(16 * var(--u))', height: 'calc(16 * var(--u))' }} />
              Weekly Agro-Advisory
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', fontSize: 'calc(13.5 * var(--u))', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: 'calc(12 * var(--u))', borderRadius: 'calc(8 * var(--u))' }}>
              <input type="radio" name="reportType" style={{ accentColor: '#fff', width: 'calc(16 * var(--u))', height: 'calc(16 * var(--u))' }} />
              Risk & Alert History
            </label>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'calc(16 * var(--u))',
          padding: 'calc(24 * var(--u))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, margin: 0, marginBottom: 'calc(8 * var(--u))' }}>Report Preview: {weatherData.city}</h3>
            <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              Format: PDF • Size: ~1.2MB • Includes high-res downscaled charts.
            </p>
          </div>
          <button
            onClick={handleDownload}
            style={{
              padding: 'calc(12 * var(--u)) calc(24 * var(--u))',
              background: '#fff',
              color: '#04121b',
              border: 'none',
              borderRadius: 'calc(12 * var(--u))',
              fontSize: 'calc(14 * var(--u))',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(8 * var(--u))',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <Icon id="i-chart" width="18" height="18" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}
