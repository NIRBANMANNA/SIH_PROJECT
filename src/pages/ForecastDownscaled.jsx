import React from 'react'
import { useDashboard } from '../context/DashboardContext'
import { tabViewBaseStyle } from '../lib/styles'
import { Icon } from '../components/IconSprite'

export default function ForecastDownscaled() {
  const { weatherData, activeBlock } = useDashboard()

  // Mock low-res block data
  const blockData = {
    temp: Math.round(weatherData.temp - 1.5),
    rainfall: '10.0mm',
    condition: 'Rain Showers',
    conditionId: 'i-cloud'
  }

  return (
    <div style={tabViewBaseStyle}>
      <div style={{ marginBottom: 'calc(24 * var(--u))', flexShrink: 0 }}>
        <h2 style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 600, letterSpacing: 'calc(-.4 * var(--u))' }}>Downscaled Forecast Analysis</h2>
        <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.7)', marginTop: 'calc(4 * var(--u))' }}>
          Comparing low-resolution WRF block data with high-resolution ML-downscaled Panchayat data.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'calc(24 * var(--u))', flex: 1 }}>
        {/* Low Res Block Level */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px dashed rgba(255,255,255,0.2)',
          borderRadius: 'calc(16 * var(--u))',
          padding: 'calc(24 * var(--u))',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 'calc(1 * var(--u))' }}>Low Resolution</div>
              <h3 style={{ fontSize: 'calc(20 * var(--u))', fontWeight: 600, marginTop: 'calc(4 * var(--u))' }}>Block: {activeBlock}</h3>
            </div>
            <div style={{ padding: 'calc(6 * var(--u)) calc(12 * var(--u))', background: 'rgba(255,255,255,0.1)', borderRadius: 'calc(20 * var(--u))', fontSize: 'calc(12 * var(--u))' }}>
              ~9km Grid
            </div>
          </div>
          
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'calc(16 * var(--u))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'calc(14 * var(--u))', color: 'rgba(255,255,255,0.7)' }}>Temperature</span>
              <span style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 600, filter: 'blur(1px)' }}>{blockData.temp}°C</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'calc(14 * var(--u))', color: 'rgba(255,255,255,0.7)' }}>Rainfall</span>
              <span style={{ fontSize: 'calc(18 * var(--u))', fontWeight: 600, filter: 'blur(1px)' }}>{blockData.rainfall}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'calc(14 * var(--u))', color: 'rgba(255,255,255,0.7)' }}>Condition</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', filter: 'blur(1px)' }}>
                <span>{blockData.condition}</span>
                <Icon id={blockData.conditionId} width="20" height="20" />
              </div>
            </div>
          </div>
        </div>

        {/* High Res Panchayat Level */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%)',
          border: '1px solid rgba(96, 165, 250, 0.4)',
          borderRadius: 'calc(16 * var(--u))',
          padding: 'calc(24 * var(--u))',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 calc(30 * var(--u)) rgba(59, 130, 246, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 'calc(11 * var(--u))', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: 'calc(1 * var(--u))', fontWeight: 600 }}>High Resolution (Downscaled)</div>
              <h3 style={{ fontSize: 'calc(20 * var(--u))', fontWeight: 600, marginTop: 'calc(4 * var(--u))', color: '#fff' }}>Panchayat: {weatherData.city.split(' ')[0]}</h3>
            </div>
            <div style={{ padding: 'calc(6 * var(--u)) calc(12 * var(--u))', background: '#3b82f6', color: '#fff', borderRadius: 'calc(20 * var(--u))', fontSize: 'calc(12 * var(--u))', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
              <Icon id="i-pin" width="12" height="12" />
              ~3km Grid
            </div>
          </div>
          
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'calc(16 * var(--u))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'calc(14 * var(--u))', color: 'rgba(255,255,255,0.9)' }}>Temperature</span>
              <span style={{ fontSize: 'calc(28 * var(--u))', fontWeight: 700, color: '#fff' }}>{weatherData.temp}°C</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'calc(14 * var(--u))', color: 'rgba(255,255,255,0.9)' }}>Rainfall</span>
              <span style={{ fontSize: 'calc(20 * var(--u))', fontWeight: 600, color: '#93c5fd' }}>{weatherData.rainfall}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'calc(14 * var(--u))', color: 'rgba(255,255,255,0.9)' }}>Condition</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
                <span style={{ fontWeight: 600 }}>{weatherData.condition}</span>
                <Icon id={weatherData.conditionId} width="24" height="24" style={{ color: '#fff' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual Chart Placeholder */}
      <div style={{ marginTop: 'calc(24 * var(--u))', background: 'rgba(255,255,255,0.04)', borderRadius: 'calc(16 * var(--u))', padding: 'calc(20 * var(--u))', height: 'calc(180 * var(--u))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'calc(13 * var(--u))', display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
          <Icon id="i-chart" width="16" height="16" /> Time-series downscaling comparison charts will be rendered here.
        </p>
      </div>
    </div>
  )
}
