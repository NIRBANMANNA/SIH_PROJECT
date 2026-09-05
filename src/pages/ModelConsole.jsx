import { useMemo, useState, useEffect } from 'react'
import { CloudRain, Loader2, RefreshCcw, Send, ShieldAlert } from 'lucide-react'
import { tabViewBaseStyle } from '../lib/styles'
import { useDashboard } from '../context/DashboardContext'

function StatCard({ label, value, tone = 'default' }) {
  const toneStyle = {
    default: { borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' },
    blue: { borderColor: 'rgba(96,165,250,0.35)', background: 'rgba(59,130,246,0.12)' },
    amber: { borderColor: 'rgba(251,191,36,0.35)', background: 'rgba(245,158,11,0.12)' },
  }[tone]

  return (
    <div style={{
      padding: 'calc(16 * var(--u))',
      borderRadius: 'calc(16 * var(--u))',
      border: '1px solid',
      ...toneStyle,
    }}>
      <div style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.58)', textTransform: 'uppercase', letterSpacing: 'calc(1 * var(--u))' }}>{label}</div>
      <div style={{ fontSize: 'calc(18 * var(--u))', fontWeight: 700, marginTop: 'calc(6 * var(--u))', color: '#fff' }}>{value}</div>
    </div>
  )
}

export default function ModelConsole() {
  const {
    activeBlock,
    activePanchayat,
    activeDistrict,
    activeState,
    weatherData,
    liveApiResult,
    liveApiLoading,
    liveApiError,
    runPrediction
  } = useDashboard()

  const [block, setBlock] = useState(activeBlock)
  const [panchayat, setPanchayat] = useState(activePanchayat)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [localError, setLocalError] = useState('')

  // Keep in sync whenever activeBlock or activePanchayat changes from modal or header
  useEffect(() => {
    if (activeBlock) setBlock(activeBlock)
  }, [activeBlock])

  useEffect(() => {
    if (activePanchayat) setPanchayat(activePanchayat)
  }, [activePanchayat])

  const result = liveApiResult
  const loading = liveApiLoading
  const error = localError || liveApiError

  const baseSummary = useMemo(() => ({
    location: `${activeState} • ${activeDistrict} • ${block}`,
    temp: liveApiResult?.variables?.t2m?.avg !== undefined ? liveApiResult.variables.t2m.avg : weatherData.temp,
    rainfall: liveApiResult?.variables?.tp?.avg !== undefined ? `${liveApiResult.variables.tp.avg} mm` : weatherData.rainfall,
    condition: weatherData.condition,
  }), [block, activeDistrict, activeState, weatherData, liveApiResult])

  const handleRun = async (event) => {
    event.preventDefault()
    setLocalError('')
    try {
      await runPrediction(block, panchayat, date)
    } catch (err) {
      setLocalError(err?.message || 'Unable to run prediction')
    }
  }

  return (
    <div style={tabViewBaseStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'calc(18 * var(--u))', flexWrap: 'wrap', marginBottom: 'calc(24 * var(--u))' }}>
        <div>
          <h2 style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 700, letterSpacing: 'calc(-.4 * var(--u))' }}>Model Console</h2>
          <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.7)', marginTop: 'calc(6 * var(--u))' }}>
            Run the downscaling API against a block, panchayat, and date.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(140px, 1fr))', gap: 'calc(12 * var(--u))', minWidth: 'min(100%, 520px)' }}>
          <StatCard label="Current Block" value={baseSummary.location} tone="blue" />
          <StatCard label="Surface Temp" value={`${baseSummary.temp}°C`} />
          <StatCard label="Rainfall" value={baseSummary.rainfall} tone="amber" />
        </div>
      </div>

      <form className="responsive-grid-4col" onSubmit={handleRun} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 'calc(16 * var(--u))',
        padding: 'calc(18 * var(--u))',
        borderRadius: 'calc(18 * var(--u))',
        border: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(255,255,255,0.04)',
        marginBottom: 'calc(18 * var(--u))',
      }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 'calc(6 * var(--u))' }}>
          <span style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.58)', textTransform: 'uppercase', letterSpacing: 'calc(1 * var(--u))' }}>Block</span>
          <input value={block} onChange={(e) => setBlock(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 'calc(6 * var(--u))' }}>
          <span style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.58)', textTransform: 'uppercase', letterSpacing: 'calc(1 * var(--u))' }}>Panchayat</span>
          <input value={panchayat} onChange={(e) => setPanchayat(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 'calc(6 * var(--u))' }}>
          <span style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.58)', textTransform: 'uppercase', letterSpacing: 'calc(1 * var(--u))' }}>Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{
            alignSelf: 'end',
            height: 'calc(48 * var(--u))',
            borderRadius: 'calc(14 * var(--u))',
            border: '1px solid rgba(255,255,255,0.18)',
            background: loading ? 'rgba(255,255,255,0.12)' : 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(14,165,233,0.75))',
            color: '#fff',
            fontWeight: 700,
            letterSpacing: 'calc(.4 * var(--u))',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'calc(8 * var(--u))',
            cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Run Prediction
        </button>
      </form>

      {error && (
        <div style={{
          marginBottom: 'calc(16 * var(--u))',
          padding: 'calc(14 * var(--u)) calc(16 * var(--u))',
          borderRadius: 'calc(14 * var(--u))',
          border: '1px solid rgba(248,113,113,0.35)',
          background: 'rgba(239,68,68,0.12)',
          color: '#fecaca',
          display: 'flex',
          alignItems: 'center',
          gap: 'calc(10 * var(--u))',
        }}>
          <ShieldAlert size={16} />
          {error}
        </div>
      )}

      <div className="responsive-two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 'calc(16 * var(--u))' }}>
        <div style={{
          borderRadius: 'calc(18 * var(--u))',
          padding: 'calc(18 * var(--u))',
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.03)',
          minHeight: 'calc(280 * var(--u))',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'calc(12 * var(--u))', marginBottom: 'calc(14 * var(--u))' }}>
            <h3 style={{ margin: 0, fontSize: 'calc(18 * var(--u))', fontWeight: 700 }}>Prediction Output</h3>
            {result && <span style={{ fontSize: 'calc(11 * var(--u))', color: '#86efac', textTransform: 'uppercase', letterSpacing: 'calc(1 * var(--u))' }}>Live response</span>}
          </div>
          {!result && (
            <div style={{ display: 'grid', placeItems: 'center', minHeight: 'calc(220 * var(--u))', color: 'rgba(255,255,255,0.48)', textAlign: 'center' }}>
              <div>
                <CloudRain size={28} style={{ marginBottom: 'calc(12 * var(--u))' }} />
                <div>Run the console to see the API response for each weather variable.</div>
              </div>
            </div>
          )}
          {result && (
            <div style={{ display: 'grid', gap: 'calc(12 * var(--u))' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'calc(12 * var(--u))' }}>
                {Object.entries(result.variables || {}).map(([key, value]) => (
                  <div key={key} style={{
                    padding: 'calc(12 * var(--u))',
                    borderRadius: 'calc(14 * var(--u))',
                    background: value.error
                      ? 'rgba(239,68,68,0.08)'
                      : value.source === 'synthetic_estimate'
                        ? 'rgba(245,158,11,0.08)'
                        : 'rgba(59,130,246,0.08)',
                    border: `1px solid ${
                      value.error
                        ? 'rgba(239,68,68,0.25)'
                        : value.source === 'synthetic_estimate'
                          ? 'rgba(245,158,11,0.25)'
                          : 'rgba(96,165,250,0.3)'
                    }`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'calc(6 * var(--u))' }}>
                      <div style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 'calc(1 * var(--u))' }}>{key}</div>
                      {value.source === 'WRF_9km_real' && (
                        <span style={{ fontSize: 'calc(9 * var(--u))', color: '#86efac', fontWeight: 700, textTransform: 'uppercase' }}>✓ Real</span>
                      )}
                      {value.source === 'synthetic_estimate' && (
                        <span style={{ fontSize: 'calc(9 * var(--u))', color: '#fcd34d', fontWeight: 700, textTransform: 'uppercase' }}>~ Est.</span>
                      )}
                    </div>
                    {value.error ? (
                      <div style={{ color: '#fca5a5', fontWeight: 600, fontSize: 'calc(12 * var(--u))' }}>{value.error}</div>
                    ) : (
                      <div style={{ display: 'grid', gap: 'calc(4 * var(--u))', color: '#fff' }}>
                        <div>Min: <strong>{value.min?.toFixed?.(2) ?? value.min}</strong></div>
                        <div>Max: <strong>{value.max?.toFixed?.(2) ?? value.max}</strong></div>
                        <div>Avg: <strong>{value.avg?.toFixed?.(2) ?? value.avg}</strong>
                          {value.units && <span style={{ fontSize: 'calc(10 * var(--u))', color: 'rgba(255,255,255,0.45)', marginLeft: 'calc(4 * var(--u))' }}>{value.units}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.68)', display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', flexWrap: 'wrap' }}>
                <span>{result.downscaled_from} • {result.resolution_km} km output for {result.panchayat} on {result.date}</span>
                {result.data_source === 'real' && (
                  <span style={{ padding: 'calc(2 * var(--u)) calc(8 * var(--u))', borderRadius: 'calc(6 * var(--u))', background: 'rgba(134,239,172,0.15)', border: '1px solid rgba(134,239,172,0.3)', color: '#86efac', fontWeight: 600, fontSize: 'calc(11 * var(--u))' }}>
                    ✓ Real WRF Data
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{
          borderRadius: 'calc(18 * var(--u))',
          padding: 'calc(18 * var(--u))',
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', marginBottom: 'calc(14 * var(--u))' }}>
            <RefreshCcw size={16} />
            <h3 style={{ margin: 0, fontSize: 'calc(18 * var(--u))', fontWeight: 700 }}>Runtime Notes</h3>
          </div>
          <ul style={{ margin: 0, paddingLeft: 'calc(18 * var(--u))', display: 'grid', gap: 'calc(10 * var(--u))', color: 'rgba(255,255,255,0.78)', lineHeight: 1.55 }}>
            <li><span style={{ color: '#86efac', fontWeight: 600 }}>✓ Real WRF data active</span> — precipitation patches are loaded from the WRF 9 km NetCDF dataset.</li>
            <li>Dates are mapped to a 2020 climatological analog (same month-day) since the training data covers Jan–Dec 2020.</li>
            <li>Only <code>tp</code> (rainfall) has a trained ONNX model. <code>t2m</code>, <code>rh</code>, <code>ws</code> will show "model missing" until those checkpoints are exported.</li>
            <li>Output grid is 72×72 at ~3 km resolution, upscaled from a 32×32 WRF patch.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  height: 'calc(48 * var(--u))',
  borderRadius: 'calc(14 * var(--u))',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  padding: '0 calc(14 * var(--u))',
  outline: 'none',
  fontSize: 'calc(14 * var(--u))',
}