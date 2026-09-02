import React, { useState, useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { 
  mockCropsList, 
  mockGrowthStages, 
  stageMetadata, 
  stageTranslations,
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
    activeBlock,
    handleBlockChange,
    activeCrop, 
    handleCropChange, 
    activeGrowthStage, 
    setActiveGrowthStage,
    panchayatsInBlock,
    mockBlocks
  } = useDashboard()

  // UI States
  const [selectedLanguage, setSelectedLanguage] = useState('en') // 'en' | 'bn' | 'hi'
  const [activeTab, setActiveTab] = useState('fiveday') // 'fiveday' | 'operations' | 'askai'
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false)
  const [bulletinModalOpen, setBulletinModalOpen] = useState(false)
  const [audioModalOpen, setAudioModalOpen] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [broadcastChannel, setBroadcastChannel] = useState('SMS')

  // AI Assistant Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Namaskar! I am your AI Agromet Intelligence Assistant for ${weatherData.city}. How can I assist you with ${activeCrop} management and weather telemetry today?`
    }
  ])
  const [chatInput, setChatInput] = useState('')

  // Current Panchayat Details
  const currentPanchayat = mockPanchayatDetails[activePanchayat] || {
    name: weatherData.city.split(' ')[0],
    block: "Polba-Dadpur",
    district: "Hooghly"
  }

  const blocksList = (mockBlocks && mockBlocks[currentPanchayat.district || "Hooghly"]) || ["Polba-Dadpur", "Chinsurah-Mogra", "Singur", "Haripal"]

  // Selected crop metadata
  const currentCropMeta = useMemo(() => {
    return mockCropsList.find(c => c.name === activeCrop) || {
      id: "Crop",
      name: activeCrop,
      bnName: "ধান",
      hiName: "धान",
      icon: "🌾",
      season: "Kharif",
      scientific: "Oryza sativa",
      duration: "120-140 Days"
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

  // Current language translation helper
  const t = advisory.translations[selectedLanguage] || advisory.translations.en

  // Notification Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Handle Voice Audio Play using Web Speech API
  const handleToggleAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel()
        setIsPlayingAudio(false)
        showToast(selectedLanguage === 'bn' ? "ভয়েস বার্তা থামানো হয়েছে" : selectedLanguage === 'hi' ? "ध्वनि संदेश रोक दिया गया" : "Voice Bulletin Paused")
      } else {
        window.speechSynthesis.cancel()
        const textToSpeak = t?.audioScript || advisory.translations.en.audioScript
        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        utterance.lang = selectedLanguage === 'bn' ? 'bn-IN' : selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN'
        utterance.rate = 0.95
        utterance.pitch = 1.0

        utterance.onstart = () => setIsPlayingAudio(true)
        utterance.onend = () => setIsPlayingAudio(false)
        utterance.onerror = () => setIsPlayingAudio(false)

        window.speechSynthesis.speak(utterance)
        showToast(selectedLanguage === 'bn' ? "ভয়েস বার্তা প্লে করা হচ্ছে..." : selectedLanguage === 'hi' ? "ध्वनि संदेश चलाया जा रहा है..." : "Playing Agromet Voice Bulletin...")
      }
    } else {
      setIsPlayingAudio(prev => !prev)
      if (!isPlayingAudio) {
        showToast(selectedLanguage === 'bn' ? "ভয়েস বার্তা প্লে করা হচ্ছে..." : selectedLanguage === 'hi' ? "ध्वनि संदेश चलाया जा रहा है..." : "Playing Agromet Voice Bulletin...")
      }
    }
  }

  // Broadcast Handler
  const handleSendBroadcast = () => {
    setIsBroadcasting(true)
    setTimeout(() => {
      setIsBroadcasting(false)
      setBroadcastModalOpen(false)
      const successMsg = selectedLanguage === 'bn'
        ? `${currentPanchayat.name} পঞ্চায়েতের ১,৪২০ জন নিবন্ধিত কৃষকের কাছে ${broadcastChannel} মাধ্যমে সফলভাবে বার্তা পাঠানো হয়েছে!`
        : selectedLanguage === 'hi'
        ? `${currentPanchayat.name} के 1,420 पंजीकृत किसानों को ${broadcastChannel} द्वारा संदेश प्रसारित किया गया!`
        : `Advisory successfully broadcast to 1,420 registered farmers in ${currentPanchayat.name} via ${broadcastChannel}!`
      showToast(successMsg)
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
      let aiReply = ""
      if (selectedLanguage === 'bn') {
        aiReply = `${currentPanchayat.name} অঞ্চলে বর্তমান আবহাওয়ায় (${weatherData.rainfall} বৃষ্টি, ${weatherData.temp}°C) ${activeCrop} ফসলের ${activeGrowthStage} পর্যায়ে: `
        if (userText.includes("স্প্রে") || userText.includes("কীটনাশক") || userText.toLowerCase().includes("spray")) {
          aiReply += t.operations.sprayText
        } else if (userText.includes("সার") || userText.includes("ইউরিয়া") || userText.toLowerCase().includes("fertilizer")) {
          aiReply += t.operations.fertilizerText
        } else if (userText.includes("জল") || userText.includes("সেচ") || userText.toLowerCase().includes("water")) {
          aiReply += t.operations.irrigationText
        } else {
          aiReply += t.reasonText
        }
      } else if (selectedLanguage === 'hi') {
        aiReply = `${currentPanchayat.name} में वर्तमान मौसम (${weatherData.rainfall} बारिश, ${weatherData.temp}°C) के आधार पर ${activeCrop} की ${activeGrowthStage} अवस्था पर: `
        if (userText.includes("छिड़काव") || userText.includes("कीटनाशक") || userText.toLowerCase().includes("spray")) {
          aiReply += t.operations.sprayText
        } else if (userText.includes("खाद") || userText.includes("यूरिया") || userText.toLowerCase().includes("fertilizer")) {
          aiReply += t.operations.fertilizerText
        } else if (userText.includes("पानी") || userText.includes("सिंचाई") || userText.toLowerCase().includes("water")) {
          aiReply += t.operations.irrigationText
        } else {
          aiReply += t.reasonText
        }
      } else {
        aiReply = `Based on current weather telemetry in ${currentPanchayat.name} (${weatherData.rainfall} rainfall, ${weatherData.temp}°C), for ${activeCrop} at ${activeGrowthStage} stage: `
        if (userText.toLowerCase().includes("spray") || userText.toLowerCase().includes("pesticide")) {
          aiReply += t.operations.sprayText
        } else if (userText.toLowerCase().includes("fertilizer") || userText.toLowerCase().includes("urea")) {
          aiReply += t.operations.fertilizerText
        } else if (userText.toLowerCase().includes("water") || userText.toLowerCase().includes("irrigation")) {
          aiReply += t.operations.irrigationText
        } else {
          aiReply += t.reasonText
        }
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }])
    }, 600)
  }

  // Display crop name based on language
  const getDisplayCropName = (c) => {
    if (selectedLanguage === 'bn' && c.bnName) return `${c.bnName} (${c.name})`
    if (selectedLanguage === 'hi' && c.hiName) return `${c.hiName} (${c.name})`
    return c.name
  }

  // Display stage name based on language
  const getDisplayStageName = (s) => {
    if (selectedLanguage === 'bn' && stageTranslations[s]?.bn) return `${stageTranslations[s].bn}`
    if (selectedLanguage === 'hi' && stageTranslations[s]?.hi) return `${stageTranslations[s].hi}`
    return s
  }

  // Smart prompt recommendations
  const smartPrompts = [
    { label: "Optimal Spray Window", query: "What is the optimal spray window for the next 48 hours?" },
    { label: "Fertilizer Guidance", query: "Can I apply nitrogen top-dressing in current soil moisture conditions?" },
    { label: "Moisture & Drainage", query: "What are the drainage requirements for current rainfall forecast?" },
    { label: "Pest Risk Profile", query: "What are the active pest and disease surveillance alerts for this stage?" }
  ]

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
            border: '1px solid rgba(56, 189, 248, 0.5)',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'calc(14 * var(--u))', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'calc(6 * var(--u))',
              padding: 'calc(4 * var(--u)) calc(10 * var(--u))',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 'calc(20 * var(--u))',
              color: '#38bdf8',
              fontSize: 'calc(11 * var(--u))',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 'calc(0.8 * var(--u))'
            }}>
              <span style={{ width: 'calc(7 * var(--u))', height: 'calc(7 * var(--u))', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 calc(6 * var(--u)) #38bdf8' }} />
              {t.liveBadge}
            </div>
            <span style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
              {t.bulletinNo}
            </span>
          </div>

          <h1 style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 700, letterSpacing: 'calc(-.4 * var(--u))', marginTop: 'calc(6 * var(--u))', margin: 0, color: '#fff' }}>
            {t.bulletinTitle}
          </h1>
          <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.65)', marginTop: 'calc(3 * var(--u))', margin: 0 }}>
            {t.subtitle}
          </p>
        </div>

        {/* Top Tools & Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', flexWrap: 'wrap' }}>
          
          {/* Language Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.06)',
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
                  background: selectedLanguage === lang.code ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                  color: selectedLanguage === lang.code ? '#fff' : 'rgba(255,255,255,0.6)',
                  fontWeight: selectedLanguage === lang.code ? 600 : 400,
                  fontSize: 'calc(12 * var(--u))',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: selectedLanguage === lang.code ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent'
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
              background: 'rgba(168, 85, 247, 0.12)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              borderRadius: 'calc(10 * var(--u))',
              color: '#c084fc',
              fontSize: 'calc(12.5 * var(--u))',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.12)'}
          >
            <Icon id="i-volume" width="16" height="16" />
            <span>{t.buttons.voice}</span>
          </button>

          {/* Broadcast to Farmers Button */}
          <button
            onClick={() => setBroadcastModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(6 * var(--u))',
              padding: 'calc(8 * var(--u)) calc(14 * var(--u))',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.85) 0%, rgba(29, 78, 216, 0.85) 100%)',
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
            <span>{t.buttons.broadcast}</span>
          </button>

          {/* Printable Bulletin Button */}
          <button
            onClick={() => setBulletinModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(6 * var(--u))',
              padding: 'calc(8 * var(--u)) calc(12 * var(--u))',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 'calc(10 * var(--u))',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 'calc(12.5 * var(--u))',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            <Icon id="i-printer" width="16" height="16" />
            <span>{t.buttons.print}</span>
          </button>
        </div>
      </div>

      {/* ─── USER-SELECTABLE INPUTS BAR ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 'calc(16 * var(--u))',
        padding: 'calc(16 * var(--u)) calc(20 * var(--u))',
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(14 * var(--u))',
        flexShrink: 0
      }}>
        {/* Row 1: Selectors & Live Telemetry */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(calc(140 * var(--u)), 1fr)) minmax(calc(240 * var(--u)), 1.2fr)',
          gap: 'calc(14 * var(--u))',
          alignItems: 'center'
        }}>
          {/* 1. Block Selector */}
          <div>
            <label style={{ 
              fontSize: 'calc(11.5 * var(--u))', 
              fontWeight: 600, 
              color: 'rgba(255,255,255,0.55)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'calc(6 * var(--u))',
              marginBottom: 'calc(6 * var(--u))',
              textTransform: 'uppercase',
              letterSpacing: 'calc(0.5 * var(--u))'
            }}>
              <Icon id="i-globe" width="13" height="13" style={{ color: '#38bdf8' }} />
              {t.selectors.block}
            </label>
            <select 
              value={activeBlock} 
              onChange={e => handleBlockChange(e.target.value)}
              style={{
                width: '100%',
                padding: 'calc(8 * var(--u)) calc(12 * var(--u))',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 'calc(8 * var(--u))',
                color: '#fff',
                fontSize: 'calc(13 * var(--u))',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {blocksList.map(b => (
                <option key={b} value={b} style={{ color: '#000', background: '#fff' }}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Panchayat Selector */}
          <div>
            <label style={{ 
              fontSize: 'calc(11.5 * var(--u))', 
              fontWeight: 600, 
              color: 'rgba(255,255,255,0.55)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'calc(6 * var(--u))',
              marginBottom: 'calc(6 * var(--u))',
              textTransform: 'uppercase',
              letterSpacing: 'calc(0.5 * var(--u))'
            }}>
              <Icon id="i-pin" width="13" height="13" style={{ color: '#f59e0b' }} />
              {t.selectors.panchayat}
            </label>
            <select 
              value={activePanchayat} 
              onChange={e => handlePanchayatChange(e.target.value)}
              style={{
                width: '100%',
                padding: 'calc(8 * var(--u)) calc(12 * var(--u))',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 'calc(8 * var(--u))',
                color: '#fff',
                fontSize: 'calc(13 * var(--u))',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {panchayatsInBlock.map(p => (
                <option key={p.id} value={p.id} style={{ color: '#000', background: '#fff' }}>
                  {p.name} ({p.rainfallStatus?.split('(')[0]?.trim() || p.rainfall + ' mm'})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Crop Selector */}
          <div>
            <label style={{ 
              fontSize: 'calc(11.5 * var(--u))', 
              fontWeight: 600, 
              color: 'rgba(255,255,255,0.55)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'calc(6 * var(--u))',
              marginBottom: 'calc(6 * var(--u))',
              textTransform: 'uppercase',
              letterSpacing: 'calc(0.5 * var(--u))'
            }}>
              <Icon id="i-sprout" width="14" height="14" style={{ color: '#4ade80' }} />
              {t.selectors.crop}
            </label>
            <select 
              value={activeCrop} 
              onChange={e => handleCropChange(e.target.value)}
              style={{
                width: '100%',
                padding: 'calc(8 * var(--u)) calc(12 * var(--u))',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 'calc(8 * var(--u))',
                color: '#fff',
                fontSize: 'calc(13 * var(--u))',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {mockCropsList.map(c => (
                <option key={c.id} value={c.name} style={{ color: '#000', background: '#fff' }}>
                  {getDisplayCropName(c)}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Growth Stage Selector */}
          <div>
            <label style={{ 
              fontSize: 'calc(11.5 * var(--u))', 
              fontWeight: 600, 
              color: 'rgba(255,255,255,0.55)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'calc(6 * var(--u))',
              marginBottom: 'calc(6 * var(--u))',
              textTransform: 'uppercase',
              letterSpacing: 'calc(0.5 * var(--u))'
            }}>
              <Icon id="i-cal" width="13" height="13" style={{ color: '#f59e0b' }} />
              {t.selectors.growthStage}
            </label>
            <select 
              value={activeGrowthStage} 
              onChange={e => setActiveGrowthStage(e.target.value)}
              style={{
                width: '100%',
                padding: 'calc(8 * var(--u)) calc(12 * var(--u))',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 'calc(8 * var(--u))',
                color: '#fff',
                fontSize: 'calc(13 * var(--u))',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {availableStages.map(s => (
                <option key={s} value={s} style={{ color: '#000', background: '#fff' }}>
                  {getDisplayStageName(s)}
                </option>
              ))}
            </select>
          </div>

          {/* Live Weather Telemetry Pill */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 'calc(10 * var(--u))',
            padding: 'calc(8 * var(--u)) calc(14 * var(--u))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'calc(12 * var(--u))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
              <div style={{
                width: 'calc(32 * var(--u))',
                height: 'calc(32 * var(--u))',
                borderRadius: 'calc(8 * var(--u))',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}>
                <Icon id={weatherData.conditionId || 'i-cloud'} width="20" height="20" />
              </div>
              <div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
                  {weatherData.temp}°C
                </div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)' }}>
                  {weatherData.condition}
                </div>
              </div>
            </div>

            <div style={{ 
              borderLeft: '1px solid rgba(255,255,255,0.12)', 
              paddingLeft: 'calc(10 * var(--u))', 
              fontSize: 'calc(11.5 * var(--u))', 
              color: 'rgba(255,255,255,0.7)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(2 * var(--u))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(4 * var(--u))' }}>
                <Icon id="i-drop" width="12" height="12" style={{ color: '#38bdf8' }} />
                <span>{t.selectors.rain}: <strong style={{ color: '#fff' }}>{weatherData.rainfall}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(4 * var(--u))' }}>
                <Icon id="i-droplet" width="12" height="12" style={{ color: '#60a5fa' }} />
                <span>{t.selectors.rh}: <strong style={{ color: '#fff' }}>{weatherData.humidity}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: One-click Quick Switch Panchayat Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', flexWrap: 'wrap', paddingTop: 'calc(6 * var(--u))', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 'calc(0.6 * var(--u))', fontWeight: 600 }}>
            {t.selectors.quickSwitch} ({activeBlock}):
          </span>
          {panchayatsInBlock.map(p => {
            const isSelected = p.id === activePanchayat
            return (
              <button
                key={p.id}
                onClick={() => handlePanchayatChange(p.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'calc(6 * var(--u))',
                  padding: 'calc(4 * var(--u)) calc(12 * var(--u))',
                  borderRadius: 'calc(20 * var(--u))',
                  border: isSelected ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.12)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255,255,255,0.04)',
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)',
                  fontSize: 'calc(12 * var(--u))',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 calc(8 * var(--u)) rgba(56, 189, 248, 0.25)' : 'none'
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.color = '#fff'
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }
                }}
              >
                <Icon id="i-pin" width="11" height="11" style={{ color: isSelected ? '#38bdf8' : 'rgba(255,255,255,0.45)' }} />
                <span>{p.name}</span>
                <span style={{ fontSize: 'calc(10.5 * var(--u))', opacity: 0.75, fontWeight: 500 }}>
                  ({p.temp}°C)
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── GROWTH STAGE PHENOLOGY PROGRESS BAR ─── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))' }}>
          <div style={{
            width: 'calc(32 * var(--u))',
            height: 'calc(32 * var(--u))',
            borderRadius: 'calc(8 * var(--u))',
            background: 'rgba(74, 222, 128, 0.15)',
            color: '#4ade80',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon id="i-sprout" width="18" height="18" />
          </div>
          <div>
            <div style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 600, color: '#fff' }}>
              {selectedLanguage === 'bn' ? currentCropMeta.bnName || currentCropMeta.name : selectedLanguage === 'hi' ? currentCropMeta.hiName || currentCropMeta.name : currentCropMeta.name}
            </div>
            <div style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.5)' }}>
              {currentCropMeta.scientific} • {currentCropMeta.season} ({currentCropMeta.duration})
            </div>
          </div>
        </div>

        {/* Stage clickable chips / Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', flexWrap: 'wrap' }}>
          {availableStages.map((st, idx) => {
            const isSelected = st === activeGrowthStage
            return (
              <button
                key={st}
                onClick={() => setActiveGrowthStage(st)}
                style={{
                  padding: 'calc(5 * var(--u)) calc(12 * var(--u))',
                  borderRadius: 'calc(6 * var(--u))',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.09)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255,255,255,0.03)',
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)',
                  fontSize: 'calc(12 * var(--u))',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(6 * var(--u))',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ 
                  width: 'calc(16 * var(--u))', 
                  height: 'calc(16 * var(--u))', 
                  borderRadius: '50%', 
                  background: isSelected ? '#38bdf8' : 'rgba(255,255,255,0.1)', 
                  color: isSelected ? '#000' : 'rgba(255,255,255,0.6)',
                  fontSize: 'calc(10 * var(--u))',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {idx + 1}
                </span>
                <span>{getDisplayStageName(st)}</span>
              </button>
            )
          })}
        </div>

        <div style={{ 
          fontSize: 'calc(12 * var(--u))', 
          color: '#93c5fd', 
          background: 'rgba(59, 130, 246, 0.15)', 
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: 'calc(4 * var(--u)) calc(10 * var(--u))', 
          borderRadius: 'calc(6 * var(--u))',
          display: 'flex',
          alignItems: 'center',
          gap: 'calc(6 * var(--u))'
        }}>
          <Icon id="i-clock" width="13" height="13" />
          <span>{t.stageDuration}: <strong>{currentStageMeta.das}</strong></span>
        </div>
      </div>

      {/* ─── MAIN ADVISORY DISPLAY AREA ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(16 * var(--u))' }}>
        
        {/* ─── CRITICAL ALERTS & SUBMERGENCE HAZARDS (WHEN ELEVATED) ─── */}
        {(advisory.cropRisk.level === 'Critical' || advisory.cropRisk.level === 'High' || t.cropRisk.level === 'জরুরি' || t.cropRisk.level === 'উচ্চ' || t.cropRisk.level === 'गंभीर' || t.cropRisk.level === 'उच्च') && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.16) 0%, rgba(185, 28, 28, 0.06) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderLeft: 'calc(5 * var(--u)) solid #ef4444',
            borderRadius: 'calc(14 * var(--u))',
            padding: 'calc(14 * var(--u)) calc(18 * var(--u))',
            display: 'flex',
            gap: 'calc(14 * var(--u))',
            alignItems: 'flex-start',
            boxShadow: '0 calc(4 * var(--u)) calc(20 * var(--u)) rgba(239, 68, 68, 0.12)'
          }}>
            <div style={{
              width: 'calc(34 * var(--u))',
              height: 'calc(34 * var(--u))',
              borderRadius: 'calc(8 * var(--u))',
              background: 'rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fca5a5',
              flexShrink: 0
            }}>
              <Icon id="i-alert-triangle" width="18" height="18" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', flexWrap: 'wrap' }}>
                <span style={{ 
                  background: '#ef4444', 
                  color: '#fff', 
                  fontSize: 'calc(10.5 * var(--u))', 
                  fontWeight: 700, 
                  padding: 'calc(2 * var(--u)) calc(8 * var(--u))', 
                  borderRadius: 'calc(4 * var(--u))', 
                  textTransform: 'uppercase' 
                }}>
                  {t.cropRisk.level} {selectedLanguage === 'bn' ? 'সতর্কতা' : selectedLanguage === 'hi' ? 'चेतावनी' : 'ALERT'}
                </span>
                <h3 style={{ fontSize: 'calc(15.5 * var(--u))', fontWeight: 700, color: '#fca5a5', margin: 0 }}>
                  {t.cropRisk.title}
                </h3>
              </div>
              <p style={{ fontSize: 'calc(13.5 * var(--u))', color: 'rgba(255,255,255,0.95)', margin: 'calc(6 * var(--u)) 0 0 0', lineHeight: 1.5 }}>
                {t.cropRisk.details}
              </p>
            </div>
          </div>
        )}

        {/* TOP ROW: WEATHER IMPACT & CROP RISK SUMMARY CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'calc(16 * var(--u))' }}>
          
          {/* 1. WEATHER IMPACT CARD */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.25) 0%, rgba(15, 23, 42, 0.35) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.28)',
            borderRadius: 'calc(16 * var(--u))',
            padding: 'calc(18 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(12 * var(--u))',
            boxShadow: '0 calc(6 * var(--u)) calc(20 * var(--u)) rgba(0,0,0,0.18)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
                <div style={{
                  width: 'calc(32 * var(--u))',
                  height: 'calc(32 * var(--u))',
                  borderRadius: 'calc(8 * var(--u))',
                  background: 'rgba(59, 130, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa'
                }}>
                  <Icon id="i-cloud" width="18" height="18" />
                </div>
                <h3 style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: 'calc(0.6 * var(--u))', color: '#93c5fd' }}>
                  {t.impactLabel}
                </h3>
              </div>
              <span style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                {t.outlook48h}
              </span>
            </div>

            <p style={{ fontSize: 'calc(14.5 * var(--u))', fontWeight: 500, color: '#fff', lineHeight: 1.5, margin: 0 }}>
              {t.weatherImpactText}
            </p>

            <div style={{ marginTop: 'auto', display: 'flex', gap: 'calc(8 * var(--u))', flexWrap: 'wrap' }}>
              <span style={{ 
                fontSize: 'calc(12 * var(--u))', 
                background: 'rgba(255,255,255,0.06)', 
                border: '1px solid rgba(255,255,255,0.1)',
                padding: 'calc(4 * var(--u)) calc(10 * var(--u))', 
                borderRadius: 'calc(6 * var(--u))', 
                color: 'rgba(255,255,255,0.85)',
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(5 * var(--u))'
              }}>
                <Icon id="i-drop" width="13" height="13" style={{ color: '#38bdf8' }} />
                <span>{t.selectors.rain}: <strong style={{ color: '#fff' }}>{weatherData.rainfall}</strong></span>
              </span>
              <span style={{ 
                fontSize: 'calc(12 * var(--u))', 
                background: 'rgba(255,255,255,0.06)', 
                border: '1px solid rgba(255,255,255,0.1)',
                padding: 'calc(4 * var(--u)) calc(10 * var(--u))', 
                borderRadius: 'calc(6 * var(--u))', 
                color: 'rgba(255,255,255,0.85)',
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(5 * var(--u))'
              }}>
                <Icon id="i-wind" width="13" height="13" style={{ color: '#c084fc' }} />
                <span>{selectedLanguage === 'bn' ? 'বাতাস' : selectedLanguage === 'hi' ? 'हवा' : 'Wind Gusts'}: <strong style={{ color: '#fff' }}>{weatherData.gusts || weatherData.wind}</strong></span>
              </span>
            </div>
          </div>

          {/* 2. CROP RISK CARD */}
          <div style={{
            background: advisory.cropRisk.level === 'Critical' || advisory.cropRisk.level === 'High'
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(15, 23, 42, 0.35) 100%)'
              : 'linear-gradient(135deg, rgba(34, 197, 94, 0.14) 0%, rgba(15, 23, 42, 0.35) 100%)',
            border: `1px solid ${advisory.cropRisk.color}45`,
            borderRadius: 'calc(16 * var(--u))',
            padding: 'calc(18 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(12 * var(--u))',
            boxShadow: '0 calc(6 * var(--u)) calc(20 * var(--u)) rgba(0,0,0,0.18)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
                <div style={{
                  width: 'calc(32 * var(--u))',
                  height: 'calc(32 * var(--u))',
                  borderRadius: 'calc(8 * var(--u))',
                  background: `${advisory.cropRisk.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: advisory.cropRisk.color
                }}>
                  <Icon id="i-shield-alert" width="18" height="18" />
                </div>
                <h3 style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: 'calc(0.6 * var(--u))', color: advisory.cropRisk.color }}>
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
                {t.cropRisk.level} ({advisory.cropRisk.score}%)
              </span>
            </div>

            <div>
              <div style={{ fontSize: 'calc(14.5 * var(--u))', fontWeight: 600, color: '#fff', marginBottom: 'calc(4 * var(--u))' }}>
                {t.cropRisk.title}
              </div>
              <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,0.75)', lineHeight: 1.45, margin: 0 }}>
                {t.cropRisk.details}
              </p>
            </div>

            <div style={{ marginTop: 'auto', fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
              <Icon id="i-info" width="13" height="13" />
              <span>{t.stageSensitivityLabel}: <strong style={{ color: '#fff' }}>{currentStageMeta.sensitivity}</strong></span>
            </div>
          </div>
        </div>

        {/* ─── 4-CARD OPERATIONS SUITE (IRRIGATION, FERTILIZER, SPRAY, PEST SCOUTING) ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(calc(200 * var(--u)), 1fr))', gap: 'calc(14 * var(--u))' }}>
          
          {/* 1. Irrigation Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(30, 58, 138, 0.04) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: 'calc(14 * var(--u))',
            padding: 'calc(16 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(10 * var(--u))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
                <div style={{
                  width: 'calc(30 * var(--u))',
                  height: 'calc(30 * var(--u))',
                  borderRadius: 'calc(8 * var(--u))',
                  background: 'rgba(59, 130, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#93c5fd'
                }}>
                  <Icon id="i-drop" width="16" height="16" />
                </div>
                <h4 style={{ fontSize: 'calc(13.5 * var(--u))', fontWeight: 700, margin: 0, color: '#93c5fd' }}>
                  {t.operations.irrigationTitle}
                </h4>
              </div>
              <span style={{ fontSize: 'calc(10.5 * var(--u))', background: 'rgba(59, 130, 246, 0.2)', padding: 'calc(2 * var(--u)) calc(8 * var(--u))', borderRadius: 'calc(6 * var(--u))', fontWeight: 600, color: '#93c5fd' }}>
                {t.operations.irrigationTag}
              </span>
            </div>
            <p style={{ fontSize: 'calc(12.5 * var(--u))', color: 'rgba(255,255,255,0.85)', lineHeight: 1.45, margin: 0 }}>
              {t.operations.irrigationText}
            </p>
          </div>

          {/* 2. Fertilizer Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(20, 83, 45, 0.04) 100%)',
            border: '1px solid rgba(74, 222, 128, 0.25)',
            borderRadius: 'calc(14 * var(--u))',
            padding: 'calc(16 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(10 * var(--u))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
                <div style={{
                  width: 'calc(30 * var(--u))',
                  height: 'calc(30 * var(--u))',
                  borderRadius: 'calc(8 * var(--u))',
                  background: 'rgba(34, 197, 94, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#86efac'
                }}>
                  <Icon id="i-sprout" width="16" height="16" />
                </div>
                <h4 style={{ fontSize: 'calc(13.5 * var(--u))', fontWeight: 700, margin: 0, color: '#86efac' }}>
                  {t.operations.fertilizerTitle}
                </h4>
              </div>
              <span style={{ fontSize: 'calc(10.5 * var(--u))', background: 'rgba(34, 197, 94, 0.2)', padding: 'calc(2 * var(--u)) calc(8 * var(--u))', borderRadius: 'calc(6 * var(--u))', fontWeight: 600, color: '#86efac' }}>
                {t.operations.fertilizerTag}
              </span>
            </div>
            <p style={{ fontSize: 'calc(12.5 * var(--u))', color: 'rgba(255,255,255,0.85)', lineHeight: 1.45, margin: 0 }}>
              {t.operations.fertilizerText}
            </p>
          </div>

          {/* 3. Spray Window */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(88, 28, 135, 0.04) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: 'calc(14 * var(--u))',
            padding: 'calc(16 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(10 * var(--u))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
                <div style={{
                  width: 'calc(30 * var(--u))',
                  height: 'calc(30 * var(--u))',
                  borderRadius: 'calc(8 * var(--u))',
                  background: 'rgba(168, 85, 247, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc'
                }}>
                  <Icon id="i-wind" width="16" height="16" />
                </div>
                <h4 style={{ fontSize: 'calc(13.5 * var(--u))', fontWeight: 700, margin: 0, color: '#c084fc' }}>
                  {t.operations.sprayTitle}
                </h4>
              </div>
              <span style={{ 
                fontSize: 'calc(10.5 * var(--u))', 
                background: advisory.operations.sprayingSuitability > 60 ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                color: advisory.operations.sprayingSuitability > 60 ? '#86efac' : '#fca5a5', 
                padding: 'calc(2 * var(--u)) calc(8 * var(--u))', 
                borderRadius: 'calc(6 * var(--u))', 
                fontWeight: 600 
              }}>
                {t.operations.sprayTag}
              </span>
            </div>
            <p style={{ fontSize: 'calc(12.5 * var(--u))', color: 'rgba(255,255,255,0.85)', lineHeight: 1.45, margin: 0 }}>
              {t.operations.sprayText}
            </p>
          </div>

          {/* 4. Pest & Disease Surveillance */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(120, 53, 15, 0.04) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'calc(14 * var(--u))',
            padding: 'calc(16 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(10 * var(--u))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
                <div style={{
                  width: 'calc(30 * var(--u))',
                  height: 'calc(30 * var(--u))',
                  borderRadius: 'calc(8 * var(--u))',
                  background: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fde047'
                }}>
                  <Icon id="i-shield-alert" width="16" height="16" />
                </div>
                <h4 style={{ fontSize: 'calc(13.5 * var(--u))', fontWeight: 700, margin: 0, color: '#fde047' }}>
                  {t.operations.pestTitle}
                </h4>
              </div>
              <span style={{ fontSize: 'calc(10.5 * var(--u))', background: 'rgba(245, 158, 11, 0.2)', color: '#fde047', padding: 'calc(2 * var(--u)) calc(8 * var(--u))', borderRadius: 'calc(6 * var(--u))', fontWeight: 600 }}>
                {t.operations.pestTag}
              </span>
            </div>
            <p style={{ fontSize: 'calc(12.5 * var(--u))', color: 'rgba(255,255,255,0.85)', lineHeight: 1.45, margin: 0 }}>
              {t.operations.pestText}
            </p>
          </div>

        </div>

        {/* MIDDLE SECTION: RECOMMENDED ACTIONS vs ACTIONS TO AVOID (TWO-COLUMN DUAL CARD) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'calc(16 * var(--u))' }}>
          
          {/* RECOMMENDED ACTIONS */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.1) 0%, rgba(20, 83, 45, 0.04) 100%)',
            border: '1px solid rgba(74, 222, 128, 0.25)',
            borderRadius: 'calc(16 * var(--u))',
            padding: 'calc(20 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(14 * var(--u))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', color: '#4ade80' }}>
              <div style={{
                width: 'calc(28 * var(--u))',
                height: 'calc(28 * var(--u))',
                borderRadius: 'calc(7 * var(--u))',
                background: 'rgba(74, 222, 128, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4ade80'
              }}>
                <Icon id="i-check" width="16" height="16" />
              </div>
              <h3 style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, margin: 0, letterSpacing: 'calc(-0.2 * var(--u))' }}>
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
              {t.recommendedActions.map((action, idx) => (
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
            background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.1) 0%, rgba(127, 29, 29, 0.04) 100%)',
            border: '1px solid rgba(248, 113, 113, 0.25)',
            borderRadius: 'calc(16 * var(--u))',
            padding: 'calc(20 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(14 * var(--u))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', color: '#f87171' }}>
              <div style={{
                width: 'calc(28 * var(--u))',
                height: 'calc(28 * var(--u))',
                borderRadius: 'calc(7 * var(--u))',
                background: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f87171'
              }}>
                <Icon id="i-cross" width="14" height="14" />
              </div>
              <h3 style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, margin: 0, letterSpacing: 'calc(-0.2 * var(--u))' }}>
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
              {t.actionsToAvoid.map((avoidItem, idx) => (
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
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
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
            gap: 'calc(8 * var(--u))',
            flexWrap: 'wrap'
          }}>
            {[
              { id: 'fiveday', label: t.tabs?.fiveday || '5-Day Agromet Plan', icon: 'i-cal' },
              { id: 'operations', label: t.tabs?.operations || 'Field Operations Matrix', icon: 'i-wind' },
              { id: 'askai', label: t.tabs?.askai || 'Agromet AI Intelligence', icon: 'i-bot' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: 'calc(9 * var(--u)) calc(16 * var(--u))',
                  border: 'none',
                  background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  borderRadius: 'calc(8 * var(--u)) calc(8 * var(--u)) 0 0',
                  borderBottom: activeTab === tab.id ? '2.5px solid #38bdf8' : '2.5px solid transparent',
                  color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.6)',
                  fontSize: 'calc(13.5 * var(--u))',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(8 * var(--u))',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon id={tab.icon} width="15" height="15" style={{ color: activeTab === tab.id ? '#38bdf8' : 'rgba(255,255,255,0.5)' }} />
                <span>{typeof tab.label === 'string' ? tab.label.replace(/^[\p{Emoji}\s]+/u, '') : tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: 5-DAY AGROMET ACTION PLAN (DEFAULT SELECTED) */}
          {activeTab === 'fiveday' && (
            <div className="anim-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 'calc(10 * var(--u))', marginBottom: 'calc(16 * var(--u))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff', margin: 0 }}>
                  {t.tabs.fivedayTitle}
                </h4>
                <span style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.5)' }}>
                  {t.tabs.fivedaySubtitle}
                </span>
              </div>
              {t.fiveDayPlan.map((item, i) => (
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
                      width: 'calc(32 * var(--u))',
                      height: 'calc(32 * var(--u))',
                      borderRadius: 'calc(8 * var(--u))',
                      background: `${item.statusColor}20`,
                      color: item.statusColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon id={item.icon || 'i-cal'} width="16" height="16" />
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
            <div className="anim-fadeIn" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(calc(260 * var(--u)), 1fr))', gap: 'calc(14 * var(--u))' }}>
              
              {/* Spray Suitability */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 'calc(12 * var(--u))',
                padding: 'calc(16 * var(--u))',
                display: 'flex',
                flexDirection: 'column',
                gap: 'calc(8 * var(--u))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
                    <Icon id="i-wind" width="16" height="16" style={{ color: '#c084fc' }} />
                    <span style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                      {t.operations.sprayTitle}
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: 'calc(11 * var(--u))', 
                    fontWeight: 700, 
                    color: advisory.operations.sprayingSuitability > 60 ? '#4ade80' : '#f87171',
                    background: advisory.operations.sprayingSuitability > 60 ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                    padding: 'calc(2 * var(--u)) calc(8 * var(--u))',
                    borderRadius: 'calc(6 * var(--u))'
                  }}>
                    {advisory.operations.sprayingSuitability}% Score
                  </span>
                </div>
                <div style={{ fontSize: 'calc(18 * var(--u))', fontWeight: 700, color: advisory.operations.sprayingSuitability > 60 ? '#4ade80' : '#f87171' }}>
                  {t.operations.sprayTag}
                </div>
                <p style={{ fontSize: 'calc(12.5 * var(--u))', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.45 }}>
                  {t.operations.sprayText}
                </p>
              </div>

              {/* Fertilizer Suitability */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 'calc(12 * var(--u))',
                padding: 'calc(16 * var(--u))',
                display: 'flex',
                flexDirection: 'column',
                gap: 'calc(8 * var(--u))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
                    <Icon id="i-sprout" width="16" height="16" style={{ color: '#4ade80' }} />
                    <span style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                      {t.operations.fertilizerTitle}
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: 'calc(11 * var(--u))', 
                    fontWeight: 700, 
                    color: advisory.operations.topDressingSuitability > 60 ? '#4ade80' : '#f59e0b',
                    background: advisory.operations.topDressingSuitability > 60 ? 'rgba(74, 222, 128, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    padding: 'calc(2 * var(--u)) calc(8 * var(--u))',
                    borderRadius: 'calc(6 * var(--u))'
                  }}>
                    {advisory.operations.topDressingSuitability}% Score
                  </span>
                </div>
                <div style={{ fontSize: 'calc(18 * var(--u))', fontWeight: 700, color: advisory.operations.topDressingSuitability > 60 ? '#4ade80' : '#f59e0b' }}>
                  {t.operations.fertilizerTag}
                </div>
                <p style={{ fontSize: 'calc(12.5 * var(--u))', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.45 }}>
                  {t.operations.fertilizerText}
                </p>
              </div>

              {/* Drainage Priority */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 'calc(12 * var(--u))',
                padding: 'calc(16 * var(--u))',
                display: 'flex',
                flexDirection: 'column',
                gap: 'calc(8 * var(--u))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
                    <Icon id="i-drop" width="16" height="16" style={{ color: '#38bdf8' }} />
                    <span style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                      {t.operations.irrigationTitle}
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: 'calc(11 * var(--u))', 
                    fontWeight: 700, 
                    color: advisory.operations.drainagePriority === 'Critical' ? '#ef4444' : '#38bdf8',
                    background: advisory.operations.drainagePriority === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    padding: 'calc(2 * var(--u)) calc(8 * var(--u))',
                    borderRadius: 'calc(6 * var(--u))'
                  }}>
                    {advisory.operations.drainagePriority}
                  </span>
                </div>
                <div style={{ fontSize: 'calc(18 * var(--u))', fontWeight: 700, color: advisory.operations.drainagePriority === 'Critical' ? '#ef4444' : '#38bdf8' }}>
                  {advisory.operations.drainagePriority} {selectedLanguage === 'bn' ? 'অগ্রাধিকার' : selectedLanguage === 'hi' ? 'प्राथमिकता' : 'Priority'}
                </div>
                <p style={{ fontSize: 'calc(12.5 * var(--u))', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.45 }}>
                  {t.operations.irrigationText}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ASK AGROMET AI ASSISTANT */}
          {activeTab === 'askai' && (
            <div className="anim-fadeIn" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(14 * var(--u))',
              padding: 'calc(18 * var(--u))',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(14 * var(--u))'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 'calc(12 * var(--u))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))' }}>
                  <div style={{
                    width: 'calc(32 * var(--u))',
                    height: 'calc(32 * var(--u))',
                    borderRadius: 'calc(8 * var(--u))',
                    background: 'rgba(56, 189, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8'
                  }}>
                    <Icon id="i-bot" width="18" height="18" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 'calc(14.5 * var(--u))', fontWeight: 700, margin: 0, color: '#fff' }}>
                      {t.tabs.askaiTitle}
                    </h4>
                    <div style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.5)' }}>
                      Connected to Regional Agrometeorological Knowledge Base • AMFU Hooghly
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'calc(6 * var(--u))',
                  fontSize: 'calc(11 * var(--u))',
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.1)',
                  padding: 'calc(4 * var(--u)) calc(8 * var(--u))',
                  borderRadius: 'calc(6 * var(--u))',
                  fontWeight: 600
                }}>
                  <Icon id="i-cpu" width="12" height="12" />
                  <span>v2.4 Telemetry Model</span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div style={{ maxHeight: 'calc(180 * var(--u))', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'calc(10 * var(--u))' }}>
                {chatMessages.map((msg, i) => (
                  <div 
                    key={i}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'user' 
                        ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' 
                        : 'rgba(255,255,255,0.06)',
                      border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
                      borderRadius: msg.sender === 'user' ? 'calc(12 * var(--u)) calc(12 * var(--u)) 0 calc(12 * var(--u))' : 'calc(12 * var(--u)) calc(12 * var(--u)) calc(12 * var(--u)) 0',
                      maxWidth: '82%',
                      fontSize: 'calc(13 * var(--u))',
                      lineHeight: 1.5,
                      boxShadow: '0 calc(2 * var(--u)) calc(8 * var(--u)) rgba(0,0,0,0.15)'
                    }}
                  >
                    {msg.sender === 'ai' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', marginBottom: 'calc(4 * var(--u))', color: '#38bdf8', fontSize: 'calc(11 * var(--u))', fontWeight: 600 }}>
                        <Icon id="i-bot" width="13" height="13" />
                        <span>Agromet AI Advisor</span>
                      </div>
                    )}
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Smart Suggestion Chips */}
              <div style={{ display: 'flex', gap: 'calc(8 * var(--u))', flexWrap: 'wrap', paddingTop: 'calc(4 * var(--u))' }}>
                {smartPrompts.map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setChatInput(p.query)}
                    style={{
                      padding: 'calc(5 * var(--u)) calc(11 * var(--u))',
                      borderRadius: 'calc(14 * var(--u))',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: 'calc(11.5 * var(--u))',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'calc(6 * var(--u))',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)'
                      e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                    }}
                  >
                    <Icon id="i-zap" width="11" height="11" style={{ color: '#38bdf8' }} />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: 'calc(8 * var(--u))' }}>
                <input
                  type="text"
                  placeholder={t.tabs.askaiPlaceholder || "Ask Agromet AI about crops, fertilizers, pest control, or weather..."}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
                    background: 'rgba(0, 0, 0, 0.45)',
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
                    padding: 'calc(10 * var(--u)) calc(18 * var(--u))',
                    background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                    border: 'none',
                    borderRadius: 'calc(8 * var(--u))',
                    color: '#000',
                    fontWeight: 700,
                    fontSize: 'calc(13 * var(--u))',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'calc(6 * var(--u))',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <Icon id="i-send" width="14" height="14" />
                  <span>{t.tabs.askaiBtn}</span>
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
                  {selectedLanguage === 'bn' ? 'এআই ভয়েস কৃষি বুলেটিন' : selectedLanguage === 'hi' ? 'एआई ध्वनि कृषि बुलेटिन' : 'Agromet Voice Bulletin'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel()
                  }
                  setIsPlayingAudio(false)
                  setAudioModalOpen(false)
                }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 'calc(18 * var(--u))', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'calc(12 * var(--u))', padding: 'calc(16 * var(--u))' }}>
              <div style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.5)', marginBottom: 'calc(6 * var(--u))' }}>
                {selectedLanguage === 'bn' ? 'কথোপকথন স্ক্রিপ্ট (বাংলা):' : selectedLanguage === 'hi' ? 'ध्वनि आलेख (हिंदी):' : 'Spoken Audio Transcript:'}
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
                <span>
                  {isPlayingAudio 
                    ? (selectedLanguage === 'bn' ? "অডিও থামান" : selectedLanguage === 'hi' ? "ध्वनि रोकें" : "Pause Audio")
                    : (selectedLanguage === 'bn' ? "ভয়েস বার্তা শুনুন" : selectedLanguage === 'hi' ? "ध्वनि संदेश सुनें" : "Play Voice Readout")}
                </span>
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
                  {selectedLanguage === 'bn' ? 'কৃষকদের কৃষি পরামর্শ সম্প্রচার' : selectedLanguage === 'hi' ? 'किसानों को कृषि सलाह प्रसारण' : 'Broadcast Farmer Advisory'}
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
                {selectedLanguage === 'bn' ? 'সম্প্রচার মাধ্যম নির্বাচন করুন' : selectedLanguage === 'hi' ? 'प्रसारण माध्यम चुनें' : 'Dissemination Channel'}
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
                <span>{selectedLanguage === 'bn' ? 'বার্তা প্রিভিউ' : selectedLanguage === 'hi' ? 'संदेश पूर्वावलोकन' : 'Message Preview'}</span>
                <span>{selectedLanguage === 'bn' ? 'প্রাপক: ১,৪২০ জন নিবন্ধিত কৃষক' : selectedLanguage === 'hi' ? 'लक्षित: 1,420 पंजीकृत किसान' : 'Target: 1,420 registered farmers'}</span>
              </div>
              <textarea
                readOnly
                value={`[WB-AGROMET] ${t.bulletinTitle} (${activeCrop} - ${activeGrowthStage}): ${t.weatherImpactText} ${t.recommendedActions[0] || ""} ${t.actionsToAvoid[0] || ""}`}
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
              {isBroadcasting 
                ? (selectedLanguage === 'bn' ? "বার্তা পাঠানো হচ্ছে..." : selectedLanguage === 'hi' ? "प्रसारण भेजा जा रहा है..." : "Dispatching Broadcast...") 
                : (selectedLanguage === 'bn' ? `${broadcastChannel}-এর মাধ্যমে সম্প্রচার করুন` : selectedLanguage === 'hi' ? `${broadcastChannel} द्वारा प्रसारण भेजें` : `Send Broadcast via ${broadcastChannel}`)}
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
                  {selectedLanguage === 'bn' ? 'জেলা কৃষি-আবহাওয়া ইউনিট (DAMU) • হুগলি, পশ্চিমবঙ্গ' : selectedLanguage === 'hi' ? 'जिला कृषि मौसम इकाई (DAMU) • हुगली, पश्चिम बंगाल' : 'District Agromet Unit (DAMU) • Hooghly, West Bengal'}
                </div>
                <h2 style={{ fontSize: 'calc(20 * var(--u))', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  {t.bulletinTitle}
                </h2>
                <div style={{ fontSize: 'calc(12 * var(--u))', color: '#64748b', marginTop: 'calc(2 * var(--u))' }}>
                  {selectedLanguage === 'bn' ? 'গ্রাম পঞ্চায়েত' : selectedLanguage === 'hi' ? 'ग्राम पंचायत' : 'Panchayat'}: <strong>{currentPanchayat.name}</strong> | {selectedLanguage === 'bn' ? 'ব্লক' : selectedLanguage === 'hi' ? 'प्रखंड' : 'Block'}: <strong>{currentPanchayat.block}</strong>
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
                <span style={{ fontSize: 'calc(12 * var(--u))', color: '#64748b' }}>{t.selectors.crop}: </span>
                <strong style={{ fontSize: 'calc(14 * var(--u))', color: '#0f172a' }}>{activeCrop}</strong>
              </div>
              <div>
                <span style={{ fontSize: 'calc(12 * var(--u))', color: '#64748b' }}>{t.selectors.growthStage}: </span>
                <strong style={{ fontSize: 'calc(14 * var(--u))', color: '#0f172a' }}>{getDisplayStageName(activeGrowthStage)}</strong>
              </div>
              <div>
                <span style={{ fontSize: 'calc(12 * var(--u))', color: '#64748b' }}>{t.riskScoreLabel}: </span>
                <strong style={{ fontSize: 'calc(14 * var(--u))', color: advisory.cropRisk.color }}>{t.cropRisk.level}</strong>
              </div>
            </div>

            {/* Weather Impact */}
            <div>
              <h4 style={{ margin: 0, fontSize: 'calc(14 * var(--u))', fontWeight: 700, color: '#1e3a8a', marginBottom: 'calc(4 * var(--u))' }}>
                1. {t.impactLabel}
              </h4>
              <p style={{ fontSize: 'calc(13 * var(--u))', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                {t.weatherImpactText}
              </p>
            </div>

            {/* Recommended Actions */}
            <div>
              <h4 style={{ margin: 0, fontSize: 'calc(14 * var(--u))', fontWeight: 700, color: '#166534', marginBottom: 'calc(6 * var(--u))' }}>
                2. {t.recLabel}
              </h4>
              <ul style={{ margin: 0, paddingLeft: 'calc(18 * var(--u))', fontSize: 'calc(13 * var(--u))', color: '#334155', lineHeight: 1.5 }}>
                {t.recommendedActions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>

            {/* Actions to Avoid */}
            <div>
              <h4 style={{ margin: 0, fontSize: 'calc(14 * var(--u))', fontWeight: 700, color: '#991b1b', marginBottom: 'calc(6 * var(--u))' }}>
                3. {t.avoidLabel}
              </h4>
              <ul style={{ margin: 0, paddingLeft: 'calc(18 * var(--u))', fontSize: 'calc(13 * var(--u))', color: '#334155', lineHeight: 1.5 }}>
                {t.actionsToAvoid.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>

            {/* Scientific Rationale */}
            <div>
              <h4 style={{ margin: 0, fontSize: 'calc(14 * var(--u))', fontWeight: 700, color: '#854d0e', marginBottom: 'calc(4 * var(--u))' }}>
                4. {t.reasonLabel}
              </h4>
              <p style={{ fontSize: 'calc(12.5 * var(--u))', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                {t.reasonText}
              </p>
            </div>

            {/* Footer Seal & Print Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #cbd5e1', paddingTop: 'calc(12 * var(--u))', marginTop: 'calc(8 * var(--u))' }}>
              <div style={{ fontSize: 'calc(11 * var(--u))', color: '#64748b' }}>
                {selectedLanguage === 'bn' ? 'আঞ্চলিক কৃষি-আবহাওয়া ফিল্ড ইউনিট (AMFU) দ্বারা অনুমোদিত' : selectedLanguage === 'hi' ? 'क्षेत्रीय कृषि-मौसम विज्ञान फील्ड यूनिट (AMFU) द्वारा अधिकृत' : 'Authorized by Regional Agrometeorological Field Unit (AMFU)'}
              </div>
              <button
                onClick={() => {
                  window.print()
                  showToast(selectedLanguage === 'bn' ? "বুলেটিন প্রিন্টারে পাঠানো হচ্ছে..." : selectedLanguage === 'hi' ? "बुलेटिन प्रिंटर को भेजा जा रहा है..." : "Sending Agro-Advisory Bulletin to printer...")
                }}
                style={{
                  padding: 'calc(8 * var(--u)) calc(18 * var(--u))',
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'calc(6 * var(--u))',
                  fontSize: 'calc(13 * var(--u))',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(6 * var(--u))'
                }}
              >
                <Icon id="i-printer" width="14" height="14" />
                <span>{t.buttons.print}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
