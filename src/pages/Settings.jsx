import React, { useState, useEffect } from 'react'
import { tabViewBaseStyle } from '../lib/styles'
import { useDashboard } from '../context/DashboardContext'
import { useAuth } from '../context/AuthContext'
import { mockStates, mockDistricts, mockBlocks, getPanchayatsForBlock } from '../data/mockPanchayats'
import { Icon } from '../components/IconSprite'

export default function Settings() {
  const { user, updateUserProfile } = useAuth()
  const {
    activeState,
    activeDistrict,
    activeBlock,
    activePanchayat,
    setCustomLocation,
    tempUnit,
    windUnit,
    updateUnits,
    preferences,
    updatePreferences,
  } = useDashboard()

  // 1. User Profile State (Dynamic from logged-in user)
  const initialName = user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Farmer Partner')
  const initialEmail = user?.email || ''
  const [profileName, setProfileName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)

  useEffect(() => {
    if (user) {
      if (user.user_metadata?.full_name) {
        setProfileName(user.user_metadata.full_name)
      } else if (user.email) {
        setProfileName(user.email.split('@')[0])
      }
      if (user.email) {
        setEmail(user.email)
      }
    }
  }, [user])

  // 2. Regional Address & Telemetry Location State
  const [locState, setLocState] = useState(activeState || 'West Bengal')
  const [locDistrict, setLocDistrict] = useState(activeDistrict || 'Hooghly')
  const [locBlock, setLocBlock] = useState(activeBlock || 'Polba-Dadpur')
  const [locPanchayat, setLocPanchayat] = useState(activePanchayat || 'p1')

  useEffect(() => {
    if (activeState) setLocState(activeState)
    if (activeDistrict) setLocDistrict(activeDistrict)
    if (activeBlock) setLocBlock(activeBlock)
    if (activePanchayat) setLocPanchayat(activePanchayat)
  }, [activeState, activeDistrict, activeBlock, activePanchayat])

  // 3. Measurement Units State
  const [currentTempUnit, setCurrentTempUnit] = useState(tempUnit || 'C')
  const [currentWindUnit, setCurrentWindUnit] = useState(windUnit || 'km/h')

  useEffect(() => {
    if (tempUnit) setCurrentTempUnit(tempUnit)
    if (windUnit) setCurrentWindUnit(windUnit)
  }, [tempUnit, windUnit])

  // 4. Application Preferences State
  const [prefs, setPrefs] = useState({
    severeAlerts: preferences?.severeAlerts ?? true,
    dailyForecast: preferences?.dailyForecast ?? true,
    agroEmail: preferences?.agroEmail ?? true,
  })

  useEffect(() => {
    if (preferences) {
      setPrefs({
        severeAlerts: preferences.severeAlerts ?? true,
        dailyForecast: preferences.dailyForecast ?? true,
        agroEmail: preferences.agroEmail ?? true,
      })
    }
  }, [preferences])

  // Feedback states
  const [saving, setSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Cascading helpers for address selection
  const availableDistricts = mockDistricts[locState] || Object.keys(mockBlocks)
  const availableBlocks = mockBlocks[locDistrict] || [
    'Polba-Dadpur', 'Chinsurah-Mogra', 'Singur', 'Haripal', 'Mahishadal', 'Tamluk', 'Haldia'
  ]
  const availablePanchayats = getPanchayatsForBlock(locBlock) || []

  const handleDistrictChange = (e) => {
    const newDist = e.target.value
    setLocDistrict(newDist)
    const nextBlocks = mockBlocks[newDist] || []
    if (nextBlocks.length > 0) {
      setLocBlock(nextBlocks[0])
      const nextPanchayats = getPanchayatsForBlock(nextBlocks[0]) || []
      if (nextPanchayats.length > 0) {
        setLocPanchayat(nextPanchayats[0].id)
      }
    }
  }

  const handleBlockChange = (e) => {
    const newBlock = e.target.value
    setLocBlock(newBlock)
    const nextPanchayats = getPanchayatsForBlock(newBlock) || []
    if (nextPanchayats.length > 0) {
      setLocPanchayat(nextPanchayats[0].id)
    }
  }

  const handleSave = async (e) => {
    e?.preventDefault()
    setSaving(true)
    setErrorMessage('')
    setToastMessage('')

    try {
      // 1. Update Profile (Local storage & Supabase)
      await updateUserProfile({
        fullName: profileName.trim() || initialName,
        email: email.trim() || initialEmail,
      })

      // 2. Update Units across the app
      updateUnits(currentTempUnit, currentWindUnit)

      // 3. Update Preferences across the app
      updatePreferences(prefs)

      // 4. Update Regional Address & Location Telemetry across the entire app
      setCustomLocation(locState, locDistrict, locBlock, locPanchayat)

      setToastMessage('Settings and regional address updated successfully!')
      setTimeout(() => setToastMessage(''), 4000)
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: 'calc(10 * var(--u)) calc(12 * var(--u))',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.16)',
    borderRadius: 'calc(10 * var(--u))',
    color: '#fff',
    fontSize: 'calc(13.5 * var(--u))',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color .2s, background .2s'
  }

  const labelStyle = {
    fontSize: 'calc(12 * var(--u))',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    display: 'block',
    marginBottom: 'calc(5 * var(--u))',
    textTransform: 'uppercase',
    letterSpacing: 'calc(0.4 * var(--u))'
  }

  return (
    <div style={{ ...tabViewBaseStyle, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 'calc(20 * var(--u))', flexShrink: 0 }}>
        <h2 style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 700, letterSpacing: 'calc(-.4 * var(--u))', margin: 0, color: '#fff' }}>
          Platform Settings
        </h2>
        <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.7)', margin: 'calc(4 * var(--u)) 0 0 0' }}>
          Customize your profile credentials, registered farm address, telemetry units, and alert notifications
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div
          className="responsive-two-col-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(calc(300 * var(--u)), 1fr))',
            gap: 'calc(24 * var(--u))',
            paddingBottom: 'calc(20 * var(--u))'
          }}
        >
          {/* ─── Card 1: Profile Credentials ─── */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'calc(18 * var(--u))',
              padding: 'calc(20 * var(--u))',
              backdropFilter: 'blur(calc(12 * var(--u)))',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(14 * var(--u))'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
              <div style={{ width: 'calc(28 * var(--u))', height: 'calc(28 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <Icon id="i-gear" width="16" height="16" />
              </div>
              <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, color: '#fff', margin: 0 }}>
                Profile Credentials
              </h3>
            </div>

            <div>
              <label style={labelStyle}>Full Name / Display Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your name"
                required
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'}
              />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'}
              />
            </div>
          </div>

          {/* ─── Card 2: Registered Farm Address & Location Telemetry ─── */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'calc(18 * var(--u))',
              padding: 'calc(20 * var(--u))',
              backdropFilter: 'blur(calc(12 * var(--u)))',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(14 * var(--u))'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
                <div style={{ width: 'calc(28 * var(--u))', height: 'calc(28 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(74, 222, 128, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>
                  <Icon id="i-pin" width="16" height="16" />
                </div>
                <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, color: '#fff', margin: 0 }}>
                  Address & Regional Location
                </h3>
              </div>
              <span style={{ fontSize: 'calc(11.5 * var(--u))', color: '#7dd3fc', background: 'rgba(56, 189, 248, 0.15)', padding: 'calc(3 * var(--u)) calc(8 * var(--u))', borderRadius: 'calc(10 * var(--u))' }}>
                Active Telemetry
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'calc(12 * var(--u))' }}>
              <div>
                <label style={labelStyle}>State</label>
                <select
                  value={locState}
                  onChange={(e) => setLocState(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer', background: 'rgba(10, 24, 38, 0.9)' }}
                >
                  {mockStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>District</label>
                <select
                  value={locDistrict}
                  onChange={handleDistrictChange}
                  style={{ ...inputStyle, cursor: 'pointer', background: 'rgba(10, 24, 38, 0.9)' }}
                >
                  {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'calc(12 * var(--u))' }}>
              <div>
                <label style={labelStyle}>Administrative Block</label>
                <select
                  value={locBlock}
                  onChange={handleBlockChange}
                  style={{ ...inputStyle, cursor: 'pointer', background: 'rgba(10, 24, 38, 0.9)' }}
                >
                  {availableBlocks.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Gram Panchayat</label>
                <select
                  value={locPanchayat}
                  onChange={(e) => setLocPanchayat(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer', background: 'rgba(10, 24, 38, 0.9)' }}
                >
                  {availablePanchayats.length > 0 ? (
                    availablePanchayats.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))
                  ) : (
                    <option value="p1">Default Panchayat</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* ─── Card 3: Measurement Units ─── */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'calc(18 * var(--u))',
              padding: 'calc(20 * var(--u))',
              backdropFilter: 'blur(calc(12 * var(--u)))',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(16 * var(--u))'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
              <div style={{ width: 'calc(28 * var(--u))', height: 'calc(28 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(250, 204, 21, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15' }}>
                <Icon id="i-wind" width="16" height="16" />
              </div>
              <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, color: '#fff', margin: 0 }}>
                Measurement Units
              </h3>
            </div>

            {/* Temperature Unit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 500, color: '#fff' }}>Temperature Scale</div>
                <div style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.6)' }}>Applied to Overview, Forecast & Rail</div>
              </div>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 'calc(12 * var(--u))', padding: '3px' }}>
                <button
                  type="button"
                  onClick={() => setCurrentTempUnit('C')}
                  style={{
                    padding: 'calc(5 * var(--u)) calc(12 * var(--u))',
                    background: currentTempUnit === 'C' ? '#38bdf8' : 'none',
                    color: currentTempUnit === 'C' ? '#04121b' : '#fff',
                    border: 'none',
                    borderRadius: 'calc(9 * var(--u))',
                    cursor: 'pointer',
                    fontSize: 'calc(12 * var(--u))',
                    fontWeight: 700,
                    transition: 'all .2s'
                  }}
                >
                  Celsius (°C)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTempUnit('F')}
                  style={{
                    padding: 'calc(5 * var(--u)) calc(12 * var(--u))',
                    background: currentTempUnit === 'F' ? '#38bdf8' : 'none',
                    color: currentTempUnit === 'F' ? '#04121b' : '#fff',
                    border: 'none',
                    borderRadius: 'calc(9 * var(--u))',
                    cursor: 'pointer',
                    fontSize: 'calc(12 * var(--u))',
                    fontWeight: 700,
                    transition: 'all .2s'
                  }}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>

            {/* Wind Speed Unit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 500, color: '#fff' }}>Wind Speed Scale</div>
                <div style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.6)' }}>Applied to Telemetry and Maps</div>
              </div>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 'calc(12 * var(--u))', padding: '3px' }}>
                <button
                  type="button"
                  onClick={() => setCurrentWindUnit('km/h')}
                  style={{
                    padding: 'calc(5 * var(--u)) calc(14 * var(--u))',
                    background: currentWindUnit === 'km/h' ? '#38bdf8' : 'none',
                    color: currentWindUnit === 'km/h' ? '#04121b' : '#fff',
                    border: 'none',
                    borderRadius: 'calc(9 * var(--u))',
                    cursor: 'pointer',
                    fontSize: 'calc(12 * var(--u))',
                    fontWeight: 700,
                    transition: 'all .2s'
                  }}
                >
                  km/h
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentWindUnit('mph')}
                  style={{
                    padding: 'calc(5 * var(--u)) calc(14 * var(--u))',
                    background: currentWindUnit === 'mph' ? '#38bdf8' : 'none',
                    color: currentWindUnit === 'mph' ? '#04121b' : '#fff',
                    border: 'none',
                    borderRadius: 'calc(9 * var(--u))',
                    cursor: 'pointer',
                    fontSize: 'calc(12 * var(--u))',
                    fontWeight: 700,
                    transition: 'all .2s'
                  }}
                >
                  mph
                </button>
              </div>
            </div>
          </div>

          {/* ─── Card 4: Application Preferences ─── */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'calc(18 * var(--u))',
              padding: 'calc(20 * var(--u))',
              backdropFilter: 'blur(calc(12 * var(--u)))',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(14 * var(--u))'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
              <div style={{ width: 'calc(28 * var(--u))', height: 'calc(28 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
                <Icon id="i-bell" width="16" height="16" />
              </div>
              <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, color: '#fff', margin: 0 }}>
                Notifications & Broadcasts
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(12 * var(--u))' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', fontSize: 'calc(13.5 * var(--u))', cursor: 'pointer', color: '#fff' }}>
                <input
                  type="checkbox"
                  checked={prefs.severeAlerts}
                  onChange={e => setPrefs(p => ({ ...p, severeAlerts: e.target.checked }))}
                  style={{ accentColor: '#38bdf8', width: 'calc(16 * var(--u))', height: 'calc(16 * var(--u))' }}
                />
                Severe Weather & Cyclonic Alerts (Push Broadcasts)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', fontSize: 'calc(13.5 * var(--u))', cursor: 'pointer', color: '#fff' }}>
                <input
                  type="checkbox"
                  checked={prefs.dailyForecast}
                  onChange={e => setPrefs(p => ({ ...p, dailyForecast: e.target.checked }))}
                  style={{ accentColor: '#38bdf8', width: 'calc(16 * var(--u))', height: 'calc(16 * var(--u))' }}
                />
                Daily Block & Panchayat Forecast Summaries
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', fontSize: 'calc(13.5 * var(--u))', cursor: 'pointer', color: '#fff' }}>
                <input
                  type="checkbox"
                  checked={prefs.agroEmail}
                  onChange={e => setPrefs(p => ({ ...p, agroEmail: e.target.checked }))}
                  style={{ accentColor: '#38bdf8', width: 'calc(16 * var(--u))', height: 'calc(16 * var(--u))' }}
                />
                Agro-Advisory Email Bulletins & Spray Recommendations
              </label>
            </div>
          </div>
        </div>

        {/* Action Controls & Notification Banner */}
        <div style={{ marginTop: 'auto', paddingTop: 'calc(14 * var(--u))', display: 'flex', flexDirection: 'column', gap: 'calc(10 * var(--u))' }}>
          {toastMessage && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#86efac',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              borderRadius: 'calc(10 * var(--u))',
              fontSize: 'calc(13 * var(--u))',
              textAlign: 'center',
              fontWeight: 600,
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>
              ✓ {toastMessage}
            </div>
          )}

          {errorMessage && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              borderRadius: 'calc(10 * var(--u))',
              fontSize: 'calc(13 * var(--u))',
              textAlign: 'center',
              fontWeight: 600,
            }}>
              ⚠ {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'calc(12 * var(--u))' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: 'calc(11 * var(--u)) calc(28 * var(--u))',
                fontSize: 'calc(14 * var(--u))',
                borderRadius: 'calc(14 * var(--u))',
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#fff',
                fontWeight: 700,
                cursor: saving ? 'wait' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'calc(8 * var(--u))'
              }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.filter = 'brightness(1.15)' }}
              onMouseLeave={e => { if (!saving) e.currentTarget.style.filter = 'brightness(1)' }}
            >
              {saving ? 'Saving Changes...' : 'Save Settings & Address'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
