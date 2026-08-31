import React, { useState } from 'react'
import { tabViewBaseStyle } from '../lib/styles'
import { useDashboard } from '../context/DashboardContext'

export default function Settings() {
  const [profileName, setProfileName] = useState('Nirban Manna')
  const [email, setEmail] = useState('nirban.manna@aurora.com')
  const [toastMessage, setToastMessage] = useState('')
  const [tempUnit, setTempUnit] = useState('C')
  const [windUnit, setWindUnit] = useState('mph')

  const handleSave = () => {
    setToastMessage('Settings saved successfully!')
    setTimeout(() => setToastMessage(''), 3000)
  }

  return (
    <div style={tabViewBaseStyle}>
      <h2 style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 600, letterSpacing: 'calc(-.4 * var(--u))', marginBottom: 'calc(4 * var(--u))', flexShrink: 0 }}>App Settings</h2>
      <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.7)', marginBottom: 'calc(24 * var(--u))', flexShrink: 0 }}>Customize units, profile options, and notifications</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'calc(32 * var(--u))', flex: 1, overflowY: 'auto' }}>
        {/* Left column: Profile & Units */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(20 * var(--u))' }}>
          <div>
            <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, marginBottom: 'calc(12 * var(--u))' }}>Profile Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(10 * var(--u))' }}>
              <div>
                <label style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 'calc(4 * var(--u))' }}>Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'calc(8 * var(--u)) calc(12 * var(--u))',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'calc(8 * var(--u))',
                    color: '#fff',
                    fontSize: 'calc(13 * var(--u))',
                    outline: 'none',
                    transition: 'border-color .2s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>
              <div>
                <label style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 'calc(4 * var(--u))' }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'calc(8 * var(--u)) calc(12 * var(--u))',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'calc(8 * var(--u))',
                    color: '#fff',
                    fontSize: 'calc(13 * var(--u))',
                    outline: 'none',
                    transition: 'border-color .2s'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, marginBottom: 'calc(10 * var(--u))' }}>Measurement Units</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14 * var(--u))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'calc(13.5 * var(--u))' }}>Temperature Unit</span>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 'calc(12 * var(--u))', padding: '2px' }}>
                  <button
                    onClick={() => setTempUnit('C')}
                    style={{
                      padding: 'calc(4 * var(--u)) calc(12 * var(--u))',
                      background: tempUnit === 'C' ? '#fff' : 'none',
                      color: tempUnit === 'C' ? '#04121b' : '#fff',
                      border: 'none',
                      borderRadius: 'calc(10 * var(--u))',
                      cursor: 'pointer',
                      fontSize: 'calc(12 * var(--u))',
                      fontWeight: 600,
                      transition: 'background .2s, color .2s'
                    }}
                  >
                    Celsius (°C)
                  </button>
                  <button
                    onClick={() => setTempUnit('F')}
                    style={{
                      padding: 'calc(4 * var(--u)) calc(12 * var(--u))',
                      background: tempUnit === 'F' ? '#fff' : 'none',
                      color: tempUnit === 'F' ? '#04121b' : '#fff',
                      border: 'none',
                      borderRadius: 'calc(10 * var(--u))',
                      cursor: 'pointer',
                      fontSize: 'calc(12 * var(--u))',
                      fontWeight: 600,
                      transition: 'background .2s, color .2s'
                    }}
                  >
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'calc(13.5 * var(--u))' }}>Wind Speed Unit</span>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 'calc(12 * var(--u))', padding: '2px' }}>
                  <button
                    onClick={() => setWindUnit('mph')}
                    style={{
                      padding: 'calc(4 * var(--u)) calc(12 * var(--u))',
                      background: windUnit === 'mph' ? '#fff' : 'none',
                      color: windUnit === 'mph' ? '#04121b' : '#fff',
                      border: 'none',
                      borderRadius: 'calc(10 * var(--u))',
                      cursor: 'pointer',
                      fontSize: 'calc(12 * var(--u))',
                      fontWeight: 600,
                      transition: 'background .2s, color .2s'
                    }}
                  >
                    mph
                  </button>
                  <button
                    onClick={() => setWindUnit('km/h')}
                    style={{
                      padding: 'calc(4 * var(--u)) calc(12 * var(--u))',
                      background: windUnit === 'km/h' ? '#fff' : 'none',
                      color: windUnit === 'km/h' ? '#04121b' : '#fff',
                      border: 'none',
                      borderRadius: 'calc(10 * var(--u))',
                      cursor: 'pointer',
                      fontSize: 'calc(12 * var(--u))',
                      fontWeight: 600,
                      transition: 'background .2s, color .2s'
                    }}
                  >
                    km/h
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Preferences & Action */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 600, marginBottom: 'calc(12 * var(--u))' }}>Application Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(12 * var(--u))' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', fontSize: 'calc(13.5 * var(--u))', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: '#fff', width: 'calc(16 * var(--u))', height: 'calc(16 * var(--u))' }} />
                Severe Weather Alerts (Push)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', fontSize: 'calc(13.5 * var(--u))', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: '#fff', width: 'calc(16 * var(--u))', height: 'calc(16 * var(--u))' }} />
                Daily Forecast Summaries
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', fontSize: 'calc(13.5 * var(--u))', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: '#fff', width: 'calc(16 * var(--u))', height: 'calc(16 * var(--u))' }} />
                Agro-Advisory Email Bulletins
              </label>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'calc(12 * var(--u))' }}>
            <button
              onClick={handleSave}
              style={{
                padding: 'calc(12 * var(--u))',
                fontSize: 'calc(14 * var(--u))',
                borderRadius: 'calc(16 * var(--u))',
                border: '2px solid #fff',
                background: '#fff',
                color: '#04121b',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              Save Changes
            </button>
            {toastMessage && (
              <div style={{
                background: 'rgba(74, 222, 128, 0.15)',
                border: '1px solid rgba(74, 222, 128, 0.4)',
                color: '#4ade80',
                padding: 'calc(8 * var(--u))',
                borderRadius: 'calc(8 * var(--u))',
                fontSize: 'calc(12.5 * var(--u))',
                textAlign: 'center'
              }}>
                {toastMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
