import React from 'react'
import { tabViewBaseStyle } from '../lib/styles'
import { mockHistorical } from '../data/mockHistorical'
import { useDashboard } from '../context/DashboardContext'

export default function HistoricalTrends() {
  const { activePanchayat, weatherData } = useDashboard()

  const maxRainfall = Math.max(...mockHistorical.rainfall.map(d => Math.max(d.actual, d.predicted)))
  const maxTemp = Math.max(...mockHistorical.temp.map(d => Math.max(d.actual, d.predicted)))

  return (
    <div style={tabViewBaseStyle}>
      <div style={{ marginBottom: 'calc(24 * var(--u))', flexShrink: 0 }}>
        <h2 style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 600, letterSpacing: 'calc(-.4 * var(--u))' }}>Historical Trends</h2>
        <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.7)', marginTop: 'calc(4 * var(--u))' }}>
          Past 7 days analysis for {weatherData.city}.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(24 * var(--u))', flex: 1 }}>
        
        {/* Rainfall Chart */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 'calc(16 * var(--u))',
          padding: 'calc(20 * var(--u))',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, marginBottom: 'calc(16 * var(--u))' }}>Rainfall Comparison (Actual vs Predicted)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, paddingTop: 'calc(20 * var(--u))' }}>
            {mockHistorical.rainfall.map((d, i) => {
              const actualH = (d.actual / maxRainfall) * 100
              const predH = (d.predicted / maxRainfall) * 100
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'calc(8 * var(--u))', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'calc(4 * var(--u))', height: 'calc(120 * var(--u))', width: '100%', justifyContent: 'center' }}>
                    <div style={{ width: 'calc(12 * var(--u))', height: `${predH}%`, background: 'rgba(255,255,255,0.2)', borderRadius: 'calc(2 * var(--u)) calc(2 * var(--u)) 0 0', transition: 'height 0.5s ease-in-out' }} />
                    <div style={{ width: 'calc(12 * var(--u))', height: `${actualH}%`, background: '#3b82f6', borderRadius: 'calc(2 * var(--u)) calc(2 * var(--u)) 0 0', transition: 'height 0.5s ease-in-out' }} />
                  </div>
                  <span style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.6)' }}>{d.day}</span>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 'calc(16 * var(--u))', justifyContent: 'center', marginTop: 'calc(16 * var(--u))', fontSize: 'calc(12 * var(--u))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}><div style={{ width: 'calc(12 * var(--u))', height: 'calc(12 * var(--u))', background: '#3b82f6', borderRadius: '2px' }}/> Actual</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}><div style={{ width: 'calc(12 * var(--u))', height: 'calc(12 * var(--u))', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}/> Predicted</div>
          </div>
        </div>

        {/* Temperature Chart */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 'calc(16 * var(--u))',
          padding: 'calc(20 * var(--u))',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, marginBottom: 'calc(16 * var(--u))' }}>Temperature Trend (°C)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, paddingTop: 'calc(20 * var(--u))', position: 'relative' }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
              <path 
                d={`M ${mockHistorical.temp.map((d, i) => `${(i / (mockHistorical.temp.length - 1)) * 100}% ${100 - ((d.actual / maxTemp) * 100)}%`).join(' L ')}`}
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="2" 
              />
              <path 
                d={`M ${mockHistorical.temp.map((d, i) => `${(i / (mockHistorical.temp.length - 1)) * 100}% ${100 - ((d.predicted / maxTemp) * 100)}%`).join(' L ')}`}
                fill="none" 
                stroke="rgba(255,255,255,0.3)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
              {mockHistorical.temp.map((d, i) => (
                <circle key={i} cx={`${(i / (mockHistorical.temp.length - 1)) * 100}%`} cy={`${100 - ((d.actual / maxTemp) * 100)}%`} r="4" fill="#f59e0b" />
              ))}
            </svg>
            {mockHistorical.temp.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 0 }}>
                <span style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.6)', transform: 'translateY(calc(125 * var(--u)))' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
