import React from 'react'
import { useDashboard } from '../context/DashboardContext'
import { tabViewBaseStyle } from '../lib/styles'
import { Icon } from '../components/IconSprite'

export default function RiskAlerts() {
  const { weatherData } = useDashboard()
  
  // Basic mock logic to show alerts based on rainfall
  const isHighRisk = parseFloat(weatherData.rainfall) > 10
  const isMedRisk = parseFloat(weatherData.rainfall) > 3 && parseFloat(weatherData.rainfall) <= 10

  return (
    <div style={tabViewBaseStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'calc(24 * var(--u))', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 600, letterSpacing: 'calc(-.4 * var(--u))' }}>Risk & Alerts</h2>
          <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.7)', marginTop: 'calc(4 * var(--u))' }}>
            Active hazard warnings for {weatherData.city}.
          </p>
        </div>
        <div style={{ 
          background: isHighRisk ? 'rgba(239, 68, 68, 0.2)' : isMedRisk ? 'rgba(234, 179, 8, 0.2)' : 'rgba(34, 197, 94, 0.2)', 
          color: isHighRisk ? '#fca5a5' : isMedRisk ? '#fde047' : '#86efac',
          padding: 'calc(8 * var(--u)) calc(16 * var(--u))', 
          borderRadius: 'calc(20 * var(--u))', 
          fontSize: 'calc(13 * var(--u))', 
          fontWeight: 600 
        }}>
          Status: {isHighRisk ? 'SEVERE' : isMedRisk ? 'MODERATE' : 'CLEAR'}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(16 * var(--u))', flex: 1, overflowY: 'auto' }}>
        
        {isHighRisk && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderLeft: '4px solid #ef4444',
            borderRadius: 'calc(12 * var(--u))',
            padding: 'calc(16 * var(--u))',
            display: 'flex',
            gap: 'calc(16 * var(--u))'
          }}>
            <Icon id="i-bell" width="28" height="28" style={{ color: '#ef4444', marginTop: 'calc(2 * var(--u))' }} />
            <div>
              <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, color: '#fca5a5', marginBottom: 'calc(8 * var(--u))' }}>Red Alert: Heavy Rainfall</h3>
              <p style={{ fontSize: 'calc(14 * var(--u))', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, margin: 0 }}>
                {weatherData.detail} Immediate action is advised to prevent crop damage due to potential waterlogging.
              </p>
            </div>
          </div>
        )}

        {isMedRisk && (
          <div style={{
            background: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.4)',
            borderLeft: '4px solid #eab308',
            borderRadius: 'calc(12 * var(--u))',
            padding: 'calc(16 * var(--u))',
            display: 'flex',
            gap: 'calc(16 * var(--u))'
          }}>
            <Icon id="i-cloud" width="28" height="28" style={{ color: '#eab308', marginTop: 'calc(2 * var(--u))' }} />
            <div>
              <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, color: '#fde047', marginBottom: 'calc(8 * var(--u))' }}>Yellow Alert: Impending Showers</h3>
              <p style={{ fontSize: 'calc(14 * var(--u))', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, margin: 0 }}>
                Moderate rainfall expected. Delay any pesticide spraying activities for the next 24 hours.
              </p>
            </div>
          </div>
        )}

        {!isHighRisk && !isMedRisk && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.05)',
            border: '1px dashed rgba(34, 197, 94, 0.3)',
            borderRadius: 'calc(12 * var(--u))',
            padding: 'calc(24 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'calc(12 * var(--u))',
            minHeight: 'calc(150 * var(--u))'
          }}>
            <Icon id="i-sun" width="32" height="32" style={{ color: '#86efac' }} />
            <p style={{ fontSize: 'calc(15 * var(--u))', color: '#86efac', fontWeight: 600, margin: 0 }}>
              No Active Alerts
            </p>
            <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.6)', margin: 0, textAlign: 'center' }}>
              Conditions are stable. Continue normal operations.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
