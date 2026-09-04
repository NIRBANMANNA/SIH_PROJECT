import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from './IconSprite'
import { useDashboard } from '../context/DashboardContext'

export default function LocationSelectorModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const {
    activeState,
    activeDistrict,
    activeBlock,
    activePanchayat,
    setLocationAndPredict
  } = useDashboard()

  // 4 user input fields with defaults from active context
  const [state, setState] = useState(activeState || 'West Bengal')
  const [district, setDistrict] = useState(activeDistrict || 'PurbaMedinipur')
  const [block, setBlock] = useState(activeBlock || 'Mahishadal')
  const [panchayat, setPanchayat] = useState(activePanchayat || 'champi')

  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Sync with context whenever modal opens
  useEffect(() => {
    if (isOpen) {
      if (activeState) setState(activeState)
      if (activeDistrict) setDistrict(activeDistrict)
      if (activeBlock) setBlock(activeBlock)
      if (activePanchayat) setPanchayat(activePanchayat)
    }
  }, [isOpen, activeState, activeDistrict, activeBlock, activePanchayat])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Execute the downscaling prediction for this specific location
      await setLocationAndPredict({
        state,
        district,
        block,
        panchayat,
        date: new Date().toISOString().slice(0, 10)
      })

      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        onClose()
      }, 500)
    } catch (err) {
      console.error("Downscaling prediction error:", err)
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        onClose()
      }, 500)
    } finally {
      setIsProcessing(false)
    }
  }

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'calc(7 * var(--u))',
    marginBottom: 'calc(16 * var(--u))',
  }

  const labelStyle = {
    fontSize: 'calc(13 * var(--u))',
    fontWeight: 700,
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: 'calc(8 * var(--u))',
    textTransform: 'uppercase',
    letterSpacing: 'calc(0.6 * var(--u))',
    textShadow: '0 1px 3px rgba(0,0,0,0.4)',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
  }

  const inputStyle = {
    width: '100%',
    padding: 'calc(12 * var(--u)) calc(16 * var(--u))',
    background: 'rgba(255, 255, 255, 0.14)',
    backdropFilter: 'blur(calc(16 * var(--u)))',
    WebkitBackdropFilter: 'blur(calc(16 * var(--u)))',
    border: '1px solid rgba(255, 255, 255, 0.35)',
    borderRadius: 'calc(14 * var(--u))',
    color: '#ffffff',
    fontSize: 'calc(15 * var(--u))',
    fontWeight: 600,
    letterSpacing: 'calc(0.3 * var(--u))',
    outline: 'none',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15)',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(10, 25, 45, 0.28)',
        backdropFilter: 'blur(calc(20 * var(--u))) saturate(160%)',
        WebkitBackdropFilter: 'blur(calc(20 * var(--u))) saturate(160%)',
        padding: 'calc(20 * var(--u))',
        animation: 'backdropFade 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes backdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalPopUp {
          0% { opacity: 0; transform: scale(0.92) translateY(18px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.8)); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 16px rgba(56, 189, 248, 1)); }
        }
        @keyframes shimmerLine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .loc-glass-input:focus {
          border-color: #38bdf8 !important;
          background: rgba(255, 255, 255, 0.25) !important;
          box-shadow: 0 0 0 calc(3.5 * var(--u)) rgba(56, 189, 248, 0.45), inset 0 1px 2px rgba(255,255,255,0.4) !important;
        }
        .loc-glass-input:hover {
          border-color: rgba(255, 255, 255, 0.55);
          background: rgba(255, 255, 255, 0.2);
        }
        .loc-glass-input::placeholder {
          color: rgba(255, 255, 255, 0.55);
        }
      `}</style>

      {/* Pure Luminous Glassmorphic Modal Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 'calc(520 * var(--u))',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.12) 50%, rgba(255, 255, 255, 0.06) 100%)',
          backdropFilter: 'blur(calc(42 * var(--u))) saturate(220%)',
          WebkitBackdropFilter: 'blur(calc(42 * var(--u))) saturate(220%)',
          border: '1px solid rgba(255, 255, 255, 0.38)',
          borderRadius: 'calc(26 * var(--u))',
          boxShadow: '0 calc(25 * var(--u)) calc(60 * var(--u)) rgba(0, 0, 0, 0.35), inset 0 1.5px 2px rgba(255, 255, 255, 0.6), 0 0 calc(40 * var(--u)) rgba(56, 189, 248, 0.22)',
          padding: 'calc(30 * var(--u))',
          position: 'relative',
          overflow: 'hidden',
          animation: 'modalPopUp 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Animated Light Shimmer Top Edge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 'calc(2.5 * var(--u))',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), #38bdf8, rgba(255, 255, 255, 0.9), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmerLine 2.8s infinite linear'
          }}
        />

        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'calc(22 * var(--u))' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', marginBottom: 'calc(5 * var(--u))' }}>
              <div 
                style={{ 
                  width: 'calc(36 * var(--u))', 
                  height: 'calc(36 * var(--u))', 
                  borderRadius: 'calc(12 * var(--u))', 
                  background: 'rgba(255, 255, 255, 0.22)', 
                  backdropFilter: 'blur(calc(12 * var(--u)))',
                  border: '1px solid rgba(255, 255, 255, 0.5)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                  animation: 'pulseGlow 2.8s infinite ease-in-out'
                }}
              >
                <Icon id="i-pin" width="18" height="18" />
              </div>
              <h3 style={{ fontSize: 'calc(22 * var(--u))', fontWeight: 800, color: '#ffffff', letterSpacing: 'calc(-0.4 * var(--u))', lineHeight: 1.15, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                Set Prediction Location
              </h3>
            </div>
            <p style={{ fontSize: 'calc(13.5 * var(--u))', color: 'rgba(255, 255, 255, 0.88)', lineHeight: 1.4, fontWeight: 500, textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
              Enter the 4-tier location parameters for Panchayat-level weather prediction downscaling.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(calc(10 * var(--u)))',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: 'calc(12 * var(--u))',
              color: '#ffffff',
              width: 'calc(34 * var(--u))',
              height: 'calc(34 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 'calc(17 * var(--u))',
              fontWeight: 700,
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.65)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)' }}
          >
            ✕
          </button>
        </div>

        {/* 4 Location Input Fields */}
        <form onSubmit={handleSubmit}>
          {/* 1. STATE */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <span style={{ color: '#38bdf8', fontWeight: 900, fontSize: 'calc(13.5 * var(--u))', textShadow: '0 0 8px rgba(56,189,248,0.6)' }}>1.</span> State
            </label>
            <input
              type="text"
              className="loc-glass-input"
              list="wb-states-list"
              placeholder="e.g. West Bengal"
              value={state}
              onChange={e => setState(e.target.value)}
              style={inputStyle}
              required
            />
            <datalist id="wb-states-list">
              <option value="West Bengal" />
              <option value="Odisha" />
              <option value="Bihar" />
            </datalist>
          </div>

          {/* 2. DISTRICT */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <span style={{ color: '#38bdf8', fontWeight: 900, fontSize: 'calc(13.5 * var(--u))', textShadow: '0 0 8px rgba(56,189,248,0.6)' }}>2.</span> District
            </label>
            <input
              type="text"
              className="loc-glass-input"
              list="wb-districts-list"
              placeholder="e.g. PurbaMedinipur, Hooghly, Nadia"
              value={district}
              onChange={e => setDistrict(e.target.value)}
              style={inputStyle}
              required
            />
            <datalist id="wb-districts-list">
              <option value="PurbaMedinipur" />
              <option value="Hooghly" />
              <option value="Nadia" />
              <option value="Burdwan" />
              <option value="Howrah" />
              <option value="North 24 Parganas" />
              <option value="South 24 Parganas" />
              <option value="Bankura" />
              <option value="Murshidabad" />
              <option value="Malda" />
            </datalist>
          </div>

          {/* 3. BLOCK */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <span style={{ color: '#38bdf8', fontWeight: 900, fontSize: 'calc(13.5 * var(--u))', textShadow: '0 0 8px rgba(56,189,248,0.6)' }}>3.</span> Block
            </label>
            <input
              type="text"
              className="loc-glass-input"
              list="wb-blocks-list"
              placeholder="e.g. Mahishadal, Polba-Dadpur, Singur"
              value={block}
              onChange={e => setBlock(e.target.value)}
              style={inputStyle}
              required
            />
            <datalist id="wb-blocks-list">
              <option value="Mahishadal" />
              <option value="Tamluk" />
              <option value="Haldia" />
              <option value="Nandigram-I" />
              <option value="Polba-Dadpur" />
              <option value="Chinsurah-Mogra" />
              <option value="Singur" />
              <option value="Haripal" />
              <option value="Krishnanagar-I" />
              <option value="Burdwan-I" />
            </datalist>
          </div>

          {/* 4. PANCHAYAT */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <span style={{ color: '#38bdf8', fontWeight: 900, fontSize: 'calc(13.5 * var(--u))', textShadow: '0 0 8px rgba(56,189,248,0.6)' }}>4.</span> Panchayat
            </label>
            <input
              type="text"
              className="loc-glass-input"
              placeholder="e.g. XYZ Panchayat"
              value={panchayat}
              onChange={e => setPanchayat(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* Live Hierarchy Path Preview Card (Pure Glass) */}
          <div
            style={{
              marginTop: 'calc(18 * var(--u))',
              marginBottom: 'calc(24 * var(--u))',
              padding: 'calc(14 * var(--u)) calc(18 * var(--u))',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(56, 189, 248, 0.16) 100%)',
              backdropFilter: 'blur(calc(20 * var(--u)))',
              WebkitBackdropFilter: 'blur(calc(20 * var(--u)))',
              border: '1px solid rgba(255, 255, 255, 0.45)',
              borderRadius: 'calc(16 * var(--u))',
              boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.5), 0 6px 16px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(6 * var(--u))'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'calc(11.5 * var(--u))', fontWeight: 800, color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: 'calc(0.7 * var(--u))', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                Target Location Hierarchy
              </span>
              <span style={{ fontSize: 'calc(11 * var(--u))', padding: 'calc(3 * var(--u)) calc(10 * var(--u))', background: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255, 255, 255, 0.55)', borderRadius: 'calc(10 * var(--u))', color: '#ffffff', fontWeight: 800, letterSpacing: 'calc(0.2 * var(--u))', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                ~3km Downscaling
              </span>
            </div>
            <div style={{ fontSize: 'calc(14.5 * var(--u))', color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'calc(6 * var(--u))', letterSpacing: 'calc(0.25 * var(--u))', textShadow: '0 1px 3px rgba(0,0,0,0.35)' }}>
              <span>{state || 'State'}</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 400 }}>›</span>
              <span>{district || 'District'}</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 400 }}>›</span>
              <span>{block || 'Block'}</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 400 }}>›</span>
              <span style={{ color: '#bae6fd', fontWeight: 900, textShadow: '0 0 10px rgba(56,189,248,0.8)' }}>{panchayat || 'Panchayat'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'calc(12 * var(--u))', justifyContent: 'flex-end', alignItems: 'center' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              style={{
                padding: 'calc(11 * var(--u)) calc(20 * var(--u))',
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(calc(12 * var(--u)))',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderRadius: 'calc(14 * var(--u))',
                color: '#ffffff',
                fontSize: 'calc(14 * var(--u))',
                fontWeight: 700,
                letterSpacing: 'calc(0.2 * var(--u))',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={e => { if (!isProcessing) { e.currentTarget.style.background = 'rgba(255,255,255,0.28)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)' } }}
              onMouseLeave={e => { if (!isProcessing) { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)' } }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing || isSubmitted}
              style={{
                padding: 'calc(11 * var(--u)) calc(24 * var(--u))',
                background: isSubmitted
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)'
                  : isProcessing
                  ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.8) 0%, rgba(3, 105, 161, 0.8) 100%)'
                  : 'linear-gradient(135deg, rgba(2, 132, 199, 0.88) 0%, rgba(14, 165, 233, 0.82) 100%)',
                backdropFilter: 'blur(calc(12 * var(--u)))',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                borderRadius: 'calc(14 * var(--u))',
                color: '#ffffff',
                fontSize: 'calc(14.5 * var(--u))',
                fontWeight: 800,
                letterSpacing: 'calc(0.3 * var(--u))',
                cursor: isProcessing ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(9 * var(--u))',
                boxShadow: isSubmitted 
                  ? '0 6px 20px rgba(16, 185, 129, 0.45), inset 0 1.5px 2px rgba(255,255,255,0.6)' 
                  : '0 6px 20px rgba(2, 132, 199, 0.45), inset 0 1.5px 2px rgba(255,255,255,0.6)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isProcessing ? 'scale(0.98)' : 'scale(1)'
              }}
            >
              {isSubmitted ? (
                <>
                  <span style={{ fontSize: 'calc(16 * var(--u))' }}>✓</span> Location Applied
                </>
              ) : isProcessing ? (
                <>
                  <span style={{ display: 'inline-block', animation: 'spin 1s infinite linear', fontSize: 'calc(16 * var(--u))' }}>◌</span> Downscaling...
                </>
              ) : (
                <>
                  <Icon id="i-search" width="16" height="16" />
                  Predict Weather for Panchayat
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
