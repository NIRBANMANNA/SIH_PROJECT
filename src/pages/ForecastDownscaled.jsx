import React, { useEffect, useState } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { tabViewBaseStyle } from '../lib/styles'
import { Icon } from '../components/IconSprite'
import { fetchDownscaledForecast } from '../lib/api'
import { Loader2, WifiOff } from 'lucide-react'

export default function ForecastDownscaled() {
  const { weatherData, activeBlock, activePanchayat } = useDashboard()
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setApiError(false)

    fetchDownscaledForecast(activeBlock, activePanchayat, today)
      .then((data) => { if (alive) { setApiData(data); setLoading(false) } })
      .catch(() => { if (alive) { setApiError(true); setLoading(false) } })

    return () => { alive = false }
  }, [activeBlock, activePanchayat])

  // Low-res block: slightly blurred "raw WRF" approximation
  const blockData = {
    temp: Math.round(weatherData.temp - 1.5),
    rainfall: '10.0 mm',
    condition: 'Rain Showers',
    conditionId: 'i-cloud'
  }

  // High-res panchayat: from live API when available, falls back to weatherData
  const tp = apiData?.variables?.tp
  const hrRainfall = tp && !tp.error
    ? `${tp.avg.toFixed(2)} mm`
    : weatherData.rainfall
  const hrTempMin = tp && !tp.error ? tp.min.toFixed(1) : null
  const hrTempMax = tp && !tp.error ? tp.max.toFixed(1) : null

  return (
    <div style={tabViewBaseStyle}>
      <div style={{ marginBottom: 'calc(24 * var(--u))', flexShrink: 0 }}>
        <h2 style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 600, letterSpacing: 'calc(-.4 * var(--u))' }}>Downscaled Forecast Analysis</h2>
        <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.7)', marginTop: 'calc(4 * var(--u))' }}>
          Comparing low-resolution WRF block data with high-resolution ML-downscaled Panchayat data.
        </p>
      </div>

      {/* API error banner */}
      {apiError && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))',
          padding: 'calc(12 * var(--u)) calc(16 * var(--u))',
          borderRadius: 'calc(12 * var(--u))',
          border: '1px solid rgba(251,191,36,0.3)',
          background: 'rgba(245,158,11,0.08)',
          color: '#fcd34d',
          fontSize: 'calc(13 * var(--u))',
          marginBottom: 'calc(16 * var(--u))',
          flexShrink: 0,
        }}>
          <WifiOff size={16} />
          API unavailable — showing dashboard fallback values. Start the inference server on port 8001.
        </div>
      )}

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
              WRF 9km Input
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
              <h3 style={{ fontSize: 'calc(20 * var(--u))', fontWeight: 600, marginTop: 'calc(4 * var(--u))', color: '#fff' }}>
                Panchayat: {weatherData.city.split(' ')[0]}
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
              {loading && <Loader2 size={14} className="animate-spin" style={{ color: '#93c5fd' }} />}
              <div style={{ padding: 'calc(6 * var(--u)) calc(12 * var(--u))', background: apiError ? 'rgba(251,191,36,0.3)' : '#3b82f6', color: '#fff', borderRadius: 'calc(20 * var(--u))', fontSize: 'calc(12 * var(--u))', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
                <Icon id="i-pin" width="12" height="12" />
                ~3km Grid
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'calc(16 * var(--u))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'calc(14 * var(--u))', color: 'rgba(255,255,255,0.9)' }}>Temperature</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 'calc(28 * var(--u))', fontWeight: 700, color: '#fff' }}>{weatherData.temp}°C</span>
                {hrTempMin && hrTempMax && (
                  <div style={{ fontSize: 'calc(11 * var(--u))', color: '#93c5fd', marginTop: 'calc(2 * var(--u))' }}>
                    range {hrTempMin} – {hrTempMax} (tp grid)
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'calc(14 * var(--u))', color: 'rgba(255,255,255,0.9)' }}>Precipitation (tp)</span>
              <div style={{ textAlign: 'right' }}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" style={{ color: '#93c5fd' }} />
                ) : (
                  <span style={{ fontSize: 'calc(20 * var(--u))', fontWeight: 600, color: apiError ? '#fcd34d' : '#93c5fd' }}>
                    {hrRainfall}
                  </span>
                )}
                {!loading && !apiError && (
                  <div style={{ fontSize: 'calc(11 * var(--u))', color: '#86efac', marginTop: 'calc(2 * var(--u))', fontWeight: 600 }}>
                    ✓ Real WRF data · Aurora ML
                  </div>
                )}
              </div>
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
      
      {/* Live metadata strip */}
      {apiData && !apiError && (
        <div style={{
          marginTop: 'calc(24 * var(--u))',
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(96,165,250,0.2)',
          borderRadius: 'calc(12 * var(--u))',
          padding: 'calc(12 * var(--u)) calc(16 * var(--u))',
          fontSize: 'calc(12 * var(--u))',
          color: '#93c5fd',
          display: 'flex',
          gap: 'calc(24 * var(--u))',
          flexShrink: 0,
        }}>
          <span>🛰 Source: {apiData.downscaled_from}</span>
          <span>📍 Resolution: {apiData.resolution_km} km</span>
          <span>📅 Date: {apiData.date}</span>
          <span>🏘 Panchayat: {apiData.panchayat}</span>
        </div>
      )}

      {/* Chart placeholder */}
      {(!apiData || apiError) && (
        <div style={{ marginTop: 'calc(24 * var(--u))', background: 'rgba(255,255,255,0.04)', borderRadius: 'calc(16 * var(--u))', padding: 'calc(20 * var(--u))', height: 'calc(80 * var(--u))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'calc(13 * var(--u))', display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
            <Icon id="i-chart" width="16" height="16" /> Time-series downscaling comparison charts will be rendered here.
          </p>
        </div>
      )}
    </div>
  )
}

