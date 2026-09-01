import React, { useState, useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { 
  mockCropsList, 
  mockCrops, 
  mockGrowthStages, 
  stageMetadata, 
  getAdvisory 
} from '../data/mockAdvisory'
import { mockPanchayatDetails } from '../data/mockPanchayats'
import { tabViewBaseStyle } from '../lib/styles'
import { Icon } from '../components/IconSprite'

export default function CropAdvisory() {
  const { 
    weatherData, 
    activePanchayat, 
    handlePanchayatChange, 
    activeCrop, 
    handleCropChange, 
    activeGrowthStage, 
    setActiveGrowthStage,
    panchayatsInBlock 
  } = useDashboard()

  // UI States
  const [selectedLanguage, setSelectedLanguage] = useState('en') // 'en' | 'bn' | 'hi'
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'fiveday' | 'operations' | 'askai'
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false)
  const [bulletinModalOpen, setBulletinModalOpen] = useState(false)
  const [audioModalOpen, setAudioModalOpen] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioProgress, setAudioProgress] = useState(35)
  const [toastMessage, setToastMessage] = useState(null)
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [broadcastChannel, setBroadcastChannel] = useState('SMS')

  // AI Assistant Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Namaskar! I am your AI Agromet Assistant for ${weatherData.city}. How can I assist you with ${activeCrop} management today?`
    }
  ])
  const [chatInput, setChatInput] = useState('')

  // Current Panchayat Details
  const currentPanchayat = mockPanchayatDetails[activePanchayat] || {
    name: weatherData.city.split(' ')[0],
    block: "Polba-Dadpur",
    district: "Hooghly"
  }

  // Selected crop metadata
  const currentCropMeta = useMemo(() => {
    return mockCropsList.find(c => c.name === activeCrop) || {
      id: "Crop",
      name: activeCrop,
      icon: "🌾",
      season: "Kharif",
      scientific: "Agri Specie",
      duration: "120 Days"
    }
  }, [activeCrop])

  // Growth stages for current crop
  const availableStages = useMemo(() => {
    return mockGrowthStages[activeCrop] || ["Vegetative", "Flowering", "Maturity"]
  }, [activeCrop])

  // Active Stage metadata
  const currentStageMeta = stageMetadata[activeGrowthStage] || {
    das: "Active Phase",
    sensitivity: "High",
    waterNeed: "Standard moisture"
  }

  // Generate dynamic advisory based on user selected Panchayat, Crop & Stage
  const advisory = useMemo(() => {
    return getAdvisory(activeCrop, activeGrowthStage, weatherData, currentPanchayat.name)
  }, [activeCrop, activeGrowthStage, weatherData, currentPanchayat.name])

  // Notification Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Handle Voice Audio Play
  const handleToggleAudio = () => {
    setIsPlayingAudio(prev => !prev)
    if (!isPlayingAudio) {
      showToast(`Playing AI Voice Agromet Bulletin (${selectedLanguage.toUpperCase()})...`)
    }
  }

  // Broadcast Handler
  const handleSendBroadcast = () => {
    setIsBroadcasting(true)
    setTimeout(() => {
      setIsBroadcasting(false)
      setBroadcastModalOpen(false)
      showToast(`Advisory successfully broadcast to 1,420 registered farmers in ${currentPanchayat.name} via ${broadcastChannel}!`)
    }, 1200)
  }

  // Handle AI Chat Submit
  const handleSendChatMessage = (e) => {
    e?.preventDefault()
    if (!chatInput.trim()) return

    const userText = chatInput
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }])
    setChatInput('')

    setTimeout(() => {
      let aiReply = `Based on current weather telemetry in ${currentPanchayat.name} (${weatherData.rainfall} rainfall, ${weatherData.temp}°C), for ${activeCrop} at ${activeGrowthStage} stage: `
      if (userText.toLowerCase().includes("spray") || userText.toLowerCase().includes("pesticide")) {
        aiReply += advisory.operations.sprayingSuitability < 40 
          ? "Chemical spraying is NOT recommended today due to high rain probability/wind. Wait for clear morning skies."
          : "Spraying conditions are favorable. Ensure morning application (7-10 AM) with a silicon sticker."
      } else if (userText.toLowerCase().includes("fertilizer") || userText.toLowerCase().includes("urea")) {
        aiReply += advisory.operations.topDressingSuitability < 40 
          ? "Postpone Urea top-dressing to prevent leaching from expected showers."
          : "You may apply scheduled balanced NPK dosage. Incorporate lightly into moist soil."
      } else if (userText.toLowerCase().includes("water") || userText.toLowerCase().includes("irrigation")) {
        aiReply += advisory.operations.irrigation
      } else {
        aiReply += advisory.reasonForAdvisory
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }])
    }, 700)
  }

  // Current language translation helper
  const t = advisory.translations[selectedLanguage] || advisory.translations.en

  return (
    <div style={{ ...tabViewBaseStyle, display: 'flex', flexDirection: 'column', gap: 'calc(18 * var(--u))', padding: 'calc(24 * var(--u))' }}>
      
      {/* ─── TOAST NOTIFICATION ─── */}
      {toastMessage && (
        <div 
          className="anim-popIn"
          style={{
            position: 'fixed',
            top: 'calc(80 * var(--u))',
            right: 'calc(40 * var(--u))',
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.94)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            boxShadow: '0 calc(10 * var(--u)) calc(30 * var(--u)) rgba(0,0,0,0.5)',
            backdropFilter: 'blur(calc(12 * var(--u)))',
            borderRadius: 'calc(12 * var(--u))',
            padding: 'calc(12 * var(--u)) calc(20 * var(--u))',
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(10 * var(--u))',
            color: '#fff',
            fontSize: 'calc(13.5 * var(--u))'
          }}
        >
          <Icon id="i-check-circle" width="18" height="18" style={{ color: '#38bdf8' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── HEADER / ACTION BAR ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'calc(12 * var(--u))', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'calc(6 * var(--u))',
              padding: 'calc(3 * var(--u)) calc(10 * var(--u))',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: 'calc(20 * var(--u))',
              color: '#38bdf8',
              fontSize: 'calc(11 * var(--u))',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 'calc(0.8 * var(--u))'
            }}>
              <span style={{ width: 'calc(7 * var(--u))', height: 'calc(7 * var(--u))', borderRadius: '50%', background: '#38bdf8', animation: 'pulse 2s infinite' }} />
              Live Agro-Advisory Bulletin
            </div>
            <span style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.45)' }}>
              Bulletin #WB-AGRO-2026/09
            </span>
          </div>

          <h1 style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 700, letterSpacing: 'calc(-.4 * var(--u))', marginTop: 'calc(6 * var(--u))', margin: 0, color: '#fff' }}>
            {t.bulletinTitle}
          </h1>
          <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.65)', marginTop: 'calc(3 * var(--u))', margin: 0 }}>
            Precision agrometeorological recommendations customized for local soil moisture and high-resolution telemetry.
          </p>
        </div>

        {/* Top Tools & Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', flexWrap: 'wrap' }}>
          
          {/* Language Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.08)',
            padding: 'calc(3 * var(--u))',
            borderRadius: 'calc(10 * var(--u))',
            border: '1px solid rgba(255,255,255,0.12)'
          }}>
            {[
              { code: 'en', label: 'English' },
              { code: 'bn', label: 'বাংলা' },
              { code: 'hi', label: 'हिन्दी' }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                style={{
                  padding: 'calc(6 * var(--u)) calc(12 * var(--u))',
                  borderRadius: 'calc(7 * var(--u))',
                  border: 'none',
                  background: selectedLanguage === lang.code ? '#3b82f6' : 'transparent',
                  color: selectedLanguage === lang.code ? '#fff' : 'rgba(255,255,255,0.6)',
                  fontWeight: selectedLanguage === lang.code ? 600 : 400,
                  fontSize: 'calc(12 * var(--u))',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Voice Readout Button */}
          <button
            onClick={() => setAudioModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(6 * var(--u))',
              padding: 'calc(8 * var(--u)) calc(14 * var(--u))',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: 'calc(10 * var(--u))',
              color: '#c084fc',
              fontSize: 'calc(12.5 * var(--u))',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)'}
          >
            <Icon id="i-volume" width="16" height="16" />
            <span>Voice Advisory</span>
          </button>

          {/* Broadcast to Farmers Button */}
          <button
            onClick={() => setBroadcastModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(6 * var(--u))',
              padding: 'calc(8 * var(--u)) calc(14 * var(--u))',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'calc(10 * var(--u))',
              color: '#fff',
              fontSize: 'calc(12.5 * var(--u))',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 calc(4 * var(--u)) calc(12 * var(--u)) rgba(37, 99, 235, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(calc(-1 * var(--u)))'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Icon id="i-send" width="15" height="15" />
            <span>Broadcast SMS</span>
          </button>

          {/* Printable Bulletin Button */}
          <button
            onClick={() => setBulletinModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(6 * var(--u))',
              padding: 'calc(8 * var(--u)) calc(12 * var(--u))',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'calc(10 * var(--u))',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 'calc(12.5 * var(--u))',
              fontWeight: 500,
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            <Icon id="i-printer" width="16" height="16" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* ─── USER-SELECTABLE INPUTS BAR ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 'calc(16 * var(--u))',
        padding: 'calc(16 * var(--u)) calc(20 * var(--u))',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.2fr 1.2fr auto',
        gap: 'calc(16 * var(--u))',
        alignItems: 'center',
        flexShrink: 0
      }}>
        {/* 1. Panchayat Selector */}
        <div>
          <label style={{ 
            fontSize: 'calc(11.5 * var(--u))', 
            fontWeight: 600, 
            color: 'rgba(255,255,255,0.55)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'calc(5 * var(--u))',
            marginBottom: 'calc(6 * var(--u))',
            textTransform: 'uppercase',
            letterSpacing: 'calc(0.5 * var(--u))'
          }}>
            <Icon id="i-pin" width="13" height="13" style={{ color: '#38bdf8' }} />
            Panchayat Location
          </label>
          <select 
            value={activePanchayat} 
            onChange={e => handlePanchayatChange(e.target.value)}
            style={{
              width: '100%',
              padding: 'calc(9 * var(--u)) calc(12 * var(--u))',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'calc(8 * var(--u))',
              color: '#fff',
              fontSize: 'calc(14 * var(--u))',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {panchayatsInBlock.map(p => (
              <option key={p.id} value={p.id} style={{ color: '#000', background: '#fff' }}>
                {p.name} ({currentPanchayat.block || "Polba-Dadpur"})
              </option>
            ))}
          </select>
        </div>

        {/* 2. Crop Selector */}
        <div>
          <label style={{ 
            fontSize: 'calc(11.5 * var(--u))', 
            fontWeight: 600, 
            color: 'rgba(255,255,255,0.55)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'calc(5 * var(--u))',
            marginBottom: 'calc(6 * var(--u))',
            textTransform: 'uppercase',
            letterSpacing: 'calc(0.5 * var(--u))'
          }}>
            <Icon id="i-sprout" width="14" height="14" style={{ color: '#4ade80' }} />
            Crop
          </label>
          <select 
            value={activeCrop} 
            onChange={e => handleCropChange(e.target.value)}
            style={{
              width: '100%',
              padding: 'calc(9 * var(--u)) calc(12 * var(--u))',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'calc(8 * var(--u))',
              color: '#fff',
              fontSize: 'calc(14 * var(--u))',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {mockCrops.map(c => (
              <option key={c} value={c} style={{ color: '#000', background: '#fff' }}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Growth Stage Selector */}
        <div>
          <label style={{ 
            fontSize: 'calc(11.5 * var(--u))', 
            fontWeight: 600, 
            color: 'rgba(255,255,255,0.55)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'calc(5 * var(--u))',
            marginBottom: 'calc(6 * var(--u))',
            textTransform: 'uppercase',
            letterSpacing: 'calc(0.5 * var(--u))'
          }}>
            <Icon id="i-cal" width="13" height="13" style={{ color: '#f59e0b' }} />
            Growth Stage
          </label>
          <select 
            value={activeGrowthStage} 
            onChange={e => setActiveGrowthStage(e.target.value)}
            style={{
              width: '100%',
              padding: 'calc(9 * var(--u)) calc(12 * var(--u))',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'calc(8 * var(--u))',
              color: '#fff',
              fontSize: 'calc(14 * var(--u))',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {availableStages.map(s => (
              <option key={s} value={s} style={{ color: '#000', background: '#fff' }}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Live Weather Telemetry Pill */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'calc(10 * var(--u))',
          padding: 'calc(8 * var(--u)) calc(14 * var(--u))',
          display: 'flex',
          alignItems: 'center',
          gap: 'calc(12 * var(--u))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
            <Icon id={weatherData.conditionId || 'i-cloud'} width="22" height="22" style={{ color: '#38bdf8' }} />
            <div>
              <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
                {weatherData.temp}°C
              </div>
              <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)' }}>
                {weatherData.condition}
              </div>
            </div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: 'calc(10 * var(--u))', fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.7)' }}>
            <div>🌧️ Rain: <strong style={{ color: '#fff' }}>{weatherData.rainfall}</strong></div>
            <div>💧 RH: <strong style={{ color: '#fff' }}>{weatherData.humidity}</strong></div>
          </div>
        </div>
      </div>

      {/* ─── GROWTH STAGE PHENOLOGY PROGRESS BAR ─── */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 'calc(12 * var(--u))',
        padding: 'calc(12 * var(--u)) calc(16 * var(--u))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'calc(12 * var(--u))',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
          <span style={{ fontSize: 'calc(20 * var(--u))' }}>{currentCropMeta.icon}</span>
          <div>
            <span style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 600, color: '#fff' }}>
              {currentCropMeta.name}
            </span>
            <span style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.45)', marginLeft: 'calc(6 * var(--u))', fontStyle: 'italic' }}>
              ({currentCropMeta.scientific}) • {currentCropMeta.season}
            </span>
          </div>
        </div>

        {/* Stage clickable chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', flexWrap: 'wrap' }}>
          {availableStages.map((st, idx) => {
            const isSelected = st === activeGrowthStage
            return (
              <button
                key={st}
                onClick={() => setActiveGrowthStage(st)}
                style={{
                  padding: 'calc(5 * var(--u)) calc(10 * var(--u))',
                  borderRadius: 'calc(6 * var(--u))',
                  border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                  background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: isSelected ? '#93c5fd' : 'rgba(255,255,255,0.6)',
                  fontSize: 'calc(11.5 * var(--u))',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(4 * var(--u))',
                  transition: 'all 0.2s'
                }}
              >
                <span>{idx + 1}.</span>
                <span>{st}</span>
              </button>
            )
          })}
        </div>

        <div style={{ fontSize: 'calc(11.5 * var(--u))', color: '#93c5fd', background: 'rgba(59, 130, 246, 0.15)', padding: 'calc(4 * var(--u)) calc(8 * var(--u))', borderRadius: 'calc(6 * var(--u))' }}>
          Stage Duration: <strong>{currentStageMeta.das}</strong>
        </div>
      </div>

      {/* ─── MAIN ADVISORY DISPLAY AREA ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'calc(16 * var(--u))', overflowY: 'auto', paddingRight: 'calc(4 * var(--u))' }}>
        
        {/* TOP ROW: WEATHER IMPACT & CROP RISK SUMMARY CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'calc(16 * var(--u))' }}>
          
          {/* 1. WEATHER IMPACT CARD */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(15, 23, 42, 0.4) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 'calc(16 * var(--u))',
            padding: 'calc(18 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(10 * var(--u))',
            boxShadow: '0 calc(6 * var(--u)) calc(20 * var(--u)) rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', color: '#60a5fa' }}>
                <Icon id="i-cloud" width="20" height="20" />
                <h3 style={{ fontSize: 'calc(14.5 * var(--u))', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: 'calc(0.6 * var(--u))' }}>
                  {t.impactLabel}
                </h3>
              </div>
              <span style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.45)' }}>
                Next 48h Outlook
              </span>
            </div>

            <p style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 500, color: '#fff', lineHeight: 1.5, margin: 0 }}>
              {t.weatherImpactText}
            </p>

            <div style={{ marginTop: 'auto', display: 'flex', gap: 'calc(10 * var(--u))', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'calc(12 * var(--u))', background: 'rgba(255,255,255,0.08)', padding: 'calc(4 * var(--u)) calc(10 * var(--u))', borderRadius: 'calc(6 * var(--u))', color: 'rgba(255,255,255,0.85)' }}>
                🌧️ Precipitation: <strong>{weatherData.rainfall}</strong>
              </span>
              <span style={{ fontSize: 'calc(12 * var(--u))', background: 'rgba(255,255,255,0.08)', padding: 'calc(4 * var(--u)) calc(10 * var(--u))', borderRadius: 'calc(6 * var(--u))', color: 'rgba(255,255,255,0.85)' }}>
                💨 Wind Gusts: <strong>{weatherData.gusts || weatherData.wind}</strong>
              </span>
            </div>
          </div>

          {/* 2. CROP RISK CARD */}
          <div style={{
            background: advisory.cropRisk.level === 'Critical' || advisory.cropRisk.level === 'High'
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(15, 23, 42, 0.4) 100%)'
              : 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(15, 23, 42, 0.4) 100%)',
            border: `1px solid ${advisory.cropRisk.color}50`,
            borderRadius: 'calc(16 * var(--u))',
            padding: 'calc(18 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(10 * var(--u))',
            boxShadow: '0 calc(6 * var(--u)) calc(20 * var(--u)) rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', color: advisory.cropRisk.color }}>
                <Icon id="i-shield-alert" width="20" height="20" />
                <h3 style={{ fontSize: 'calc(14.5 * var(--u))', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: 'calc(0.6 * var(--u))' }}>
                  {t.riskLabel}
                </h3>
              </div>
              <span style={{
                fontSize: 'calc(11.5 * var(--u))',
                fontWeight: 700,
                color: advisory.cropRisk.color,
                background: `${advisory.cropRisk.color}20`,
                border: `1px solid ${advisory.cropRisk.color}40`,
                padding: 'calc(3 * var(--u)) calc(8 * var(--u))',
                borderRadius: 'calc(12 * var(--u))',
                textTransform: 'uppercase'
              }}>
                {advisory.cropRisk.level} Risk ({advisory.cropRisk.score}%)
              </span>
            </div>

            <div>
              <div style={{ fontSize: 'calc(14.5 * var(--u))', fontWeight: 600, color: '#fff', marginBottom: 'calc(4 * var(--u))' }}>
                {advisory.cropRisk.title}
              </div>
              <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.75)', lineHeight: 1.45, margin: 0 }}>
                {advisory.cropRisk.details}
              </p>
            </div>

            <div style={{ marginTop: 'auto', fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.5)' }}>
              Phenological Stage Sensitivity: <strong style={{ color: '#fff' }}>{currentStageMeta.sensitivity}</strong>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: RECOMMENDED ACTIONS vs ACTIONS TO AVOID (TWO-COLUMN DUAL CARD) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'calc(16 * var(--u))' }}>
          
          {/* RECOMMENDED ACTIONS */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.12) 0%, rgba(20, 83, 45, 0.05) 100%)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            borderRadius: 'calc(16 * var(--u))',
            padding: 'calc(20 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(14 * var(--u))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', color: '#4ade80' }}>
              <Icon id="i-check-circle" width="20" height="20" />
              <h3 style={{ fontSize: 'calc(15.5 * var(--u))', fontWeight: 700, margin: 0, letterSpacing: 'calc(-0.2 * var(--u))' }}>
                {t.recLabel}
              </h3>
            </div>

            <ul style={{ 
              margin: 0, 
              padding: 0, 
              listStyle: 'none', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'calc(10 * var(--u))' 
            }}>
              {advisory.recommendedActions.map((action, idx) => (
                <li 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 'calc(10 * var(--u))',
                    fontSize: 'calc(13.5 * var(--u))',
                    color: 'rgba(255,255,255,0.92)',
                    lineHeight: 1.5
                  }}
                >
                  <span style={{ 
                    width: 'calc(18 * var(--u))', 
                    height: 'calc(18 * var(--u))', 
                    borderRadius: '50%', 
                    background: 'rgba(74, 222, 128, 0.2)', 
                    color: '#4ade80', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: 'calc(11 * var(--u))',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 'calc(2 * var(--u))'
                  }}>
                    ✓
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ACTIONS TO AVOID */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.12) 0%, rgba(127, 29, 29, 0.05) 100%)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: 'calc(16 * var(--u))',
            padding: 'calc(20 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(14 * var(--u))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', color: '#f87171' }}>
              <Icon id="i-x-circle" width="20" height="20" />
              <h3 style={{ fontSize: 'calc(15.5 * var(--u))', fontWeight: 700, margin: 0, letterSpacing: 'calc(-0.2 * var(--u))' }}>
                {t.avoidLabel}
              </h3>
            </div>

            <ul style={{ 
              margin: 0, 
              padding: 0, 
              listStyle: 'none', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'calc(10 * var(--u))' 
            }}>
              {advisory.actionsToAvoid.map((avoidItem, idx) => (
                <li 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 'calc(10 * var(--u))',
                    fontSize: 'calc(13.5 * var(--u))',
                    color: 'rgba(255,255,255,0.92)',
                    lineHeight: 1.5
                  }}
                >
                  <span style={{ 
                    width: 'calc(18 * var(--u))', 
                    height: 'calc(18 * var(--u))', 
                    borderRadius: '50%', 
                    background: 'rgba(239, 68, 68, 0.2)', 
                    color: '#f87171', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: 'calc(11 * var(--u))',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 'calc(2 * var(--u))'
                  }}>
                    ✕
                  </span>
                  <span>{avoidItem}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION: SCIENTIFIC REASON FOR ADVISORY */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'calc(16 * var(--u))',
          padding: 'calc(18 * var(--u)) calc(22 * var(--u))',
          display: 'flex',
          gap: 'calc(14 * var(--u))',
          alignItems: 'flex-start'
        }}>
          <div style={{
            width: 'calc(36 * var(--u))',
            height: 'calc(36 * var(--u))',
            borderRadius: 'calc(10 * var(--u))',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon id="i-info" width="20" height="20" />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ 
              fontSize: 'calc(13.5 * var(--u))', 
              fontWeight: 700, 
              color: '#fbbf24', 
              textTransform: 'uppercase', 
              letterSpacing: 'calc(0.8 * var(--u))',
              marginBottom: 'calc(4 * var(--u))',
              margin: 0
            }}>
              {t.reasonLabel}
            </h3>
            <p style={{ fontSize: 'calc(14 * var(--u))', color: 'rgba(255,255,255,0.85)', lineHeight: 1.55, margin: 0, marginTop: 'calc(4 * var(--u))' }}>
              {t.reasonText}
            </p>
          </div>
        </div>

        {/* ─── TABBED DEEP-DIVE MODULES (5-DAY PLANNER / OPERATIONS / ASK AI) ─── */}
        <div style={{ marginTop: 'calc(8 * var(--u))' }}>
          
          {/* Subtabs Bar */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            marginBottom: 'calc(14 * var(--u))',
            gap: 'calc(16 * var(--u))'
          }}>
            {[
              { id: 'fiveday', label: '📅 5-Day Agromet Action Plan' },
              { id: 'operations', label: '🚜 Field Operations & Spray Feasibility' },
              { id: 'askai', label: '🤖 Ask Agromet AI Assistant' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: 'calc(8 * var(--u)) calc(12 * var(--u))',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #38bdf8' : '2px solid transparent',
                  color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                  fontSize: 'calc(13.5 * var(--u))',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: 5-DAY AGROMET ACTION PLAN */}
          {activeTab === 'fiveday' && (
            <div className="anim-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 'calc(10 * var(--u))' }}>
              {advisory.fiveDayPlan.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(10 * var(--u))',
                    padding: 'calc(12 * var(--u)) calc(16 * var(--u))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'calc(12 * var(--u))'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(12 * var(--u))' }}>
                    <div style={{
                      width: 'calc(30 * var(--u))',
                      height: 'calc(30 * var(--u))',
                      borderRadius: 'calc(8 * var(--u))',
                      background: `${item.statusColor}20`,
                      color: item.statusColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon id={item.icon} width="16" height="16" />
                    </div>
                    <div>
                      <div style={{ fontSize: 'calc(12 * var(--u))', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
                        {item.day}
                      </div>
                      <div style={{ fontSize: 'calc(13.5 * var(--u))', color: '#fff', fontWeight: 500 }}>
                        {item.task}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: 'calc(11.5 * var(--u))',
                    fontWeight: 600,
                    color: item.statusColor,
                    background: `${item.statusColor}15`,
                    padding: 'calc(4 * var(--u)) calc(10 * var(--u))',
                    borderRadius: 'calc(12 * var(--u))',
                    border: `1px solid ${item.statusColor}30`,
                    whiteSpace: 'nowrap'
                  }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: FIELD OPERATIONS & SPRAY FEASIBILITY */}
          {activeTab === 'operations' && (
            <div className="anim-fadeIn" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'calc(14 * var(--u))' }}>
              
              {/* Spray Suitability */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 'calc(12 * var(--u))',
                padding: 'calc(14 * var(--u))'
              }}>
                <div style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 'calc(6 * var(--u))' }}>
                  Chemical Spray Window
                </div>
                <div style={{ fontSize: 'calc(22 * var(--u))', fontWeight: 700, color: advisory.operations.sprayingSuitability > 60 ? '#4ade80' : '#f87171' }}>
                  {advisory.operations.sprayingSuitability}% Feasibility
                </div>
                <p style={{ fontSize: 'calc(12.5 * var(--u))', color: 'rgba(255,255,255,0.7)', marginTop: 'calc(6 * var(--u))', margin: 0 }}>
                  {advisory.operations.sprayingSuitability < 40 
                    ? "High risk of chemical wash-off and drift due to rain/wind."
                    : "Safe spraying window active. Spray during early morning."}
                </p>
              </div>

              {/* Fertilizer Suitability */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 'calc(12 * var(--u))',
                padding: 'calc(14 * var(--u))'
              }}>
                <div style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 'calc(6 * var(--u))' }}>
                  Fertilizer Top-Dressing
                </div>
                <div style={{ fontSize: 'calc(22 * var(--u))', fontWeight: 700, color: advisory.operations.topDressingSuitability > 60 ? '#4ade80' : '#f59e0b' }}>
                  {advisory.operations.topDressingSuitability}% Feasibility
                </div>
                <p style={{ fontSize: 'calc(12.5 * var(--u))', color: 'rgba(255,255,255,0.7)', marginTop: 'calc(6 * var(--u))', margin: 0 }}>
                  {advisory.operations.fertilizer}
                </p>
              </div>

              {/* Drainage Priority */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 'calc(12 * var(--u))',
                padding: 'calc(14 * var(--u))'
              }}>
                <div style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 'calc(6 * var(--u))' }}>
                  Drainage Trench Priority
                </div>
                <div style={{ fontSize: 'calc(22 * var(--u))', fontWeight: 700, color: advisory.operations.drainagePriority === 'Critical' ? '#ef4444' : '#38bdf8' }}>
                  {advisory.operations.drainagePriority} Priority
                </div>
                <p style={{ fontSize: 'calc(12.5 * var(--u))', color: 'rgba(255,255,255,0.7)', marginTop: 'calc(6 * var(--u))', margin: 0 }}>
                  {advisory.operations.irrigation}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ASK AGROMET AI ASSISTANT */}
          {activeTab === 'askai' && (
            <div className="anim-fadeIn" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(16 * var(--u))',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(12 * var(--u))'
            }}>
              <div style={{ maxHeight: 'calc(160 * var(--u))', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'calc(8 * var(--u))' }}>
                {chatMessages.map((msg, i) => (
                  <div 
                    key={i}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'user' ? '#2563eb' : 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      padding: 'calc(8 * var(--u)) calc(12 * var(--u))',
                      borderRadius: 'calc(10 * var(--u))',
                      maxWidth: '80%',
                      fontSize: 'calc(13 * var(--u))',
                      lineHeight: 1.45
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: 'calc(8 * var(--u))' }}>
                <input
                  type="text"
                  placeholder={`Ask a question about ${activeCrop} in ${currentPanchayat.name} (e.g. "Can I spray today?")`}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: 'calc(9 * var(--u)) calc(14 * var(--u))',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 'calc(8 * var(--u))',
                    color: '#fff',
                    fontSize: 'calc(13 * var(--u))',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: 'calc(9 * var(--u)) calc(16 * var(--u))',
                    background: '#38bdf8',
                    border: 'none',
                    borderRadius: 'calc(8 * var(--u))',
                    color: '#000',
                    fontWeight: 600,
                    fontSize: 'calc(13 * var(--u))',
                    cursor: 'pointer'
                  }}
                >
                  Ask AI
                </button>
              </form>
            </div>
          )}
        </div>

      </div>

      {/* ─── MODAL 1: VOICE ADVISORY AUDIO PLAYER ─── */}
      {audioModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(calc(8 * var(--u)))',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'calc(20 * var(--u))'
        }}>
          <div 
            className="anim-popIn"
            style={{
              background: '#0f172a',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: 'calc(20 * var(--u))',
              width: '100%',
              maxWidth: 'calc(480 * var(--u))',
              padding: 'calc(24 * var(--u))',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(16 * var(--u))',
              boxShadow: '0 calc(20 * var(--u)) calc(50 * var(--u)) rgba(0,0,0,0.7)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', color: '#c084fc' }}>
                <Icon id="i-volume" width="22" height="22" />
                <h3 style={{ margin: 0, fontSize: 'calc(18 * var(--u))', fontWeight: 600 }}>
                  AI Voice Agromet Bulletin
                </h3>
              </div>
              <button 
                onClick={() => setAudioModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 'calc(18 * var(--u))', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'calc(12 * var(--u))', padding: 'calc(16 * var(--u))' }}>
              <div style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.5)', marginBottom: 'calc(6 * var(--u))' }}>
                Spoken Script ({selectedLanguage.toUpperCase()}):
              </div>
              <p style={{ fontSize: 'calc(13.5 * var(--u))', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, margin: 0 }}>
                "{t.audioScript}"
              </p>
            </div>

            {/* Waveform Animation Simulation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'calc(4 * var(--u))', height: 'calc(40 * var(--u))', margin: 'calc(10 * var(--u)) 0' }}>
              {[12, 24, 36, 20, 32, 16, 28, 40, 22, 18, 34, 26, 14].map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 'calc(4 * var(--u))',
                    height: isPlayingAudio ? `calc(${h} * var(--u))` : 'calc(6 * var(--u))',
                    background: '#c084fc',
                    borderRadius: 'calc(2 * var(--u))',
                    transition: 'height 0.2s ease',
                    animation: isPlayingAudio ? `pulse ${0.4 + (idx % 4) * 0.2}s infinite alternate` : 'none'
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'calc(16 * var(--u))' }}>
              <button
                onClick={handleToggleAudio}
                style={{
                  padding: 'calc(10 * var(--u)) calc(24 * var(--u))',
                  background: '#a855f7',
                  border: 'none',
                  borderRadius: 'calc(20 * var(--u))',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 'calc(14 * var(--u))',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(8 * var(--u))'
                }}
              >
                <Icon id="i-volume" width="16" height="16" />
                <span>{isPlayingAudio ? "Pause Audio" : "Play Voice Readout"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: FARMER BROADCAST DISSEMINATION ─── */}
      {broadcastModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(calc(8 * var(--u)))',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'calc(20 * var(--u))'
        }}>
          <div 
            className="anim-popIn"
            style={{
              background: '#0f172a',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: 'calc(20 * var(--u))',
              width: '100%',
              maxWidth: 'calc(520 * var(--u))',
              padding: 'calc(24 * var(--u))',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(16 * var(--u))',
              boxShadow: '0 calc(20 * var(--u)) calc(50 * var(--u)) rgba(0,0,0,0.7)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', color: '#60a5fa' }}>
                <Icon id="i-send" width="22" height="22" />
                <h3 style={{ margin: 0, fontSize: 'calc(18 * var(--u))', fontWeight: 600 }}>
                  Broadcast Farmer Advisory
                </h3>
              </div>
              <button 
                onClick={() => setBroadcastModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 'calc(18 * var(--u))', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div>
              <label style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 'calc(6 * var(--u))' }}>
                Dissemination Channel
              </label>
              <div style={{ display: 'flex', gap: 'calc(8 * var(--u))' }}>
                {['SMS', 'WhatsApp', 'IVR Voice Call'].map(ch => (
                  <button
                    key={ch}
                    onClick={() => setBroadcastChannel(ch)}
                    style={{
                      flex: 1,
                      padding: 'calc(8 * var(--u))',
                      borderRadius: 'calc(8 * var(--u))',
                      border: broadcastChannel === ch ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                      background: broadcastChannel === ch ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.04)',
                      color: broadcastChannel === ch ? '#fff' : 'rgba(255,255,255,0.6)',
                      fontSize: 'calc(12.5 * var(--u))',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'calc(12 * var(--u))', padding: 'calc(14 * var(--u))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginBottom: 'calc(6 * var(--u))' }}>
                <span>Message Preview ({selectedLanguage.toUpperCase()})</span>
                <span>Target: 1,420 registered farmers</span>
              </div>
              <textarea
                readOnly
                value={`[WB-AGROMET] ${t.bulletinTitle} (${activeCrop} - ${activeGrowthStage}): ${t.weatherImpactText} ${advisory.recommendedActions[0] || ""} ${advisory.actionsToAvoid[0] || ""}`}
                style={{
                  width: '100%',
                  height: 'calc(80 * var(--u))',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: 'calc(13 * var(--u))',
                  lineHeight: 1.4,
                  resize: 'none',
                  outline: 'none',
                  padding: 0
                }}
              />
            </div>

            <button
              disabled={isBroadcasting}
              onClick={handleSendBroadcast}
              style={{
                padding: 'calc(11 * var(--u))',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                border: 'none',
                borderRadius: 'calc(10 * var(--u))',
                color: '#fff',
                fontWeight: 600,
                fontSize: 'calc(14 * var(--u))',
                cursor: isBroadcasting ? 'wait' : 'pointer'
              }}
            >
              {isBroadcasting ? "Dispatching Broadcast..." : `Send Broadcast via ${broadcastChannel}`}
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: PRINTABLE OFFICIAL BULLETIN ─── */}
      {bulletinModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(calc(8 * var(--u)))',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'calc(20 * var(--u))'
        }}>
          <div 
            className="anim-popIn"
            style={{
              background: '#fff',
              color: '#0f172a',
              borderRadius: 'calc(16 * var(--u))',
              width: '100%',
              maxWidth: 'calc(650 * var(--u))',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 'calc(28 * var(--u))',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(16 * var(--u))',
              boxShadow: '0 calc(20 * var(--u)) calc(50 * var(--u)) rgba(0,0,0,0.5)'
            }}
          >
            {/* Bulletin Official Header */}
            <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: 'calc(12 * var(--u))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 'calc(11 * var(--u))', fontWeight: 700, letterSpacing: 'calc(1 * var(--u))', color: '#0369a1', textTransform: 'uppercase' }}>
                  District Agromet Unit (DAMU) • Hooghly, West Bengal
                </div>
                <h2 style={{ fontSize: 'calc(20 * var(--u))', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Official Agromet Advisory Bulletin
                </h2>
                <div style={{ fontSize: 'calc(12 * var(--u))', color: '#64748b', marginTop: 'calc(2 * var(--u))' }}>
                  Panchayat: <strong>{currentPanchayat.name}</strong> | Block: <strong>{currentPanchayat.block}</strong> | Date: <strong>September 2026</strong>
                </div>
              </div>
              <button 
                onClick={() => setBulletinModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 'calc(20 * var(--u))', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Target Crop & Phenology */}
            <div style={{ background: '#f1f5f9', padding: 'calc(12 * var(--u)) calc(16 * var(--u))', borderRadius: 'calc(8 * var(--u))', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 'calc(12 * var(--u))', color: '#64748b' }}>Target Crop: </span>
                <strong style={{ fontSize: 'calc(14 * var(--u))', color: '#0f172a' }}>{activeCrop}</strong>
              </div>
              <div>
                <span style={{ fontSize: 'calc(12 * var(--u))', color: '#64748b' }}>Growth Stage: </span>
                <strong style={{ fontSize: 'calc(14 * var(--u))', color: '#0f172a' }}>{activeGrowthStage}</strong>
              </div>
              <div>
                <span style={{ fontSize: 'calc(12 * var(--u))', color: '#64748b' }}>Risk Level: </span>
                <strong style={{ fontSize: 'calc(14 * var(--u))', color: advisory.cropRisk.color }}>{advisory.cropRisk.level}</strong>
              </div>
            </div>

            {/* Weather Impact */}
            <div>
              <h4 style={{ margin: 0, fontSize: 'calc(14 * var(--u))', fontWeight: 700, color: '#1e3a8a', marginBottom: 'calc(4 * var(--u))' }}>
                1. Weather Impact & Synopsis
              </h4>
              <p style={{ fontSize: 'calc(13 * var(--u))', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                {advisory.weatherImpact}
              </p>
            </div>

            {/* Recommended Actions */}
            <div>
              <h4 style={{ margin: 0, fontSize: 'calc(14 * var(--u))', fontWeight: 700, color: '#166534', marginBottom: 'calc(6 * var(--u))' }}>
                2. Recommended Agricultural Practices
              </h4>
              <ul style={{ margin: 0, paddingLeft: 'calc(18 * var(--u))', fontSize: 'calc(13 * var(--u))', color: '#334155', lineHeight: 1.5 }}>
                {advisory.recommendedActions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>

            {/* Actions to Avoid */}
            <div>
              <h4 style={{ margin: 0, fontSize: 'calc(14 * var(--u))', fontWeight: 700, color: '#991b1b', marginBottom: 'calc(6 * var(--u))' }}>
                3. Critical Precautions & Actions to Avoid
              </h4>
              <ul style={{ margin: 0, paddingLeft: 'calc(18 * var(--u))', fontSize: 'calc(13 * var(--u))', color: '#334155', lineHeight: 1.5 }}>
                {advisory.actionsToAvoid.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>

            {/* Scientific Rationale */}
            <div>
              <h4 style={{ margin: 0, fontSize: 'calc(14 * var(--u))', fontWeight: 700, color: '#854d0e', marginBottom: 'calc(4 * var(--u))' }}>
                4. Scientific Agromet Rationale
              </h4>
              <p style={{ fontSize: 'calc(12.5 * var(--u))', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                {advisory.reasonForAdvisory}
              </p>
            </div>

            {/* Footer Seal & Print Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #cbd5e1', paddingTop: 'calc(12 * var(--u))', marginTop: 'calc(8 * var(--u))' }}>
              <div style={{ fontSize: 'calc(11 * var(--u))', color: '#64748b' }}>
                Authorized by Regional Agrometeorological Field Unit (AMFU)
              </div>
              <button
                onClick={() => {
                  window.print()
                  showToast("Sending Agro-Advisory Bulletin to printer...")
                }}
                style={{
                  padding: 'calc(8 * var(--u)) calc(18 * var(--u))',
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'calc(6 * var(--u))',
                  fontSize: 'calc(13 * var(--u))',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🖨️ Print Bulletin
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
