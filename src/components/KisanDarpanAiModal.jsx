import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from './IconSprite'
import { useDashboard } from '../context/DashboardContext'
import { askCropAdvisoryAI } from '../lib/api'
import KisanDarpanLogo from './KisanDarpanLogo'

export default function KisanDarpanAiModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const {
    activeState,
    activeDistrict,
    activeBlock,
    activePanchayat,
    activeCrop,
    activeGrowthStage,
    weatherData
  } = useDashboard()

  const [language, setLanguage] = useState('en')
  const [messages, setMessages] = useState([])
  const [inputQuery, setInputQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  // Initialize or re-seed welcome message when modal opens or language changes
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const locationLabel = `${activePanchayat || 'Amnan'}, ${activeBlock || 'Polba-Dadpur'}`
      const welcomeText = language === 'bn'
        ? `নমস্কার! আমি কিষাণদর্পণ এআই ইন্টেলিজেন্স (Kisan Darpan AI Intelligence)। ${locationLabel}-এর ${activeCrop || 'ধান (খরিফ)'}-এর জন্য সার প্রয়োগ, স্প্রে, সেচ বা আবহাওয়া ঝুঁকি সংক্রান্ত যে কোনো প্রশ্ন জিজ্ঞাসা করুন।`
        : language === 'hi'
        ? `नमस्कार! मैं किसान दर्पण एआई इंटेलिजेंस (Kisan Darpan AI Intelligence) हूँ। ${locationLabel} में ${activeCrop || 'चावल (खरीफ)'} की फसल, खाद, कीटनाशक छिड़काव और मौसम संबंधित किसी भी सवाल के लिए पूछें।`
        : `Namaskar! I am Kisan Darpan AI Intelligence, your regional agromet and crop advisory specialist for ${locationLabel}. Ask me anything regarding ${activeCrop || 'Rice (Kharif)'}, fertilizer spray timing, drainage, pest control, or weather telemetry.`

      setMessages([
        {
          id: 'welcome-1',
          sender: 'ai',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: welcomeText
        }
      ])
    }
  }, [isOpen, language, activePanchayat, activeBlock, activeCrop])

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 150)
    }
  }, [isOpen])

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading, isOpen])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSend = async (queryText) => {
    const query = (queryText || inputQuery).trim()
    if (!query || isLoading) return

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    }

    setMessages(prev => [...prev, userMsg])
    setInputQuery('')
    setIsLoading(true)

    try {
      const aiReply = await askCropAdvisoryAI({
        question: query,
        crop: activeCrop || 'Rice (Kharif)',
        growthStage: activeGrowthStage || 'Tillering',
        location: {
          panchayat: activePanchayat || 'Amnan',
          block: activeBlock || 'Polba-Dadpur',
          district: activeDistrict || 'Hooghly',
          state: activeState || 'West Bengal'
        },
        weather: {
          temp: weatherData?.temp || 30,
          rainfall: weatherData?.rainfall || '34.5mm',
          humidity: weatherData?.humidity || '88%',
          wind: weatherData?.wind || '24 km/h',
          condition: weatherData?.condition || 'Rainy'
        },
        language: language
      })

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: aiReply
      }

      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      console.error('Kisan Darpan AI error:', err)
      const errorMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: language === 'bn'
          ? `⚠️ বর্তমান আবহাওয়া (${weatherData?.rainfall || 'বৃষ্টিপাত'}): জমিতে সার বা কীটনাশক স্প্রে করা স্থগিত রাখুন। আবহাওয়া পরিষ্কার হলে পুনরায় প্রয়োগ করুন।`
          : language === 'hi'
          ? `⚠️ वर्तमान मौसम (${weatherData?.rainfall || 'वर्षा'}): उर्वरक या कीटनाशक का छिड़काव रोकें। बारिश रुकने और मौसम साफ होने तक प्रतीक्षा करें।`
          : `⚠️ Current Weather Advisory (${weatherData?.rainfall || 'rain'}): Avoid spraying fertilizers or agro-chemicals during wet conditions to prevent wash-off and leaching.`
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions = language === 'bn'
    ? [
        'কখন জমিতে সার স্প্রে করব?',
        'বর্তমান বৃষ্টিতে সেচ ও নিকাশির কী ব্যবস্থা?',
        'টিলারিং পর্যায়ে ইউরিয়া কীভাবে দেব?'
      ]
    : language === 'hi'
    ? [
        'खेत में खाद का छिड़काव कब करें?',
        'वर्तमान बारिश में जल निकासी की क्या सलाह है?',
        'टिलरिंग अवस्था में यूरिया कैसे दें?'
      ]
    : [
        'When should I spray fertilizer in my field?',
        'Is rainfall high for chemical spray today?',
        'Nutrient & top-dressing advice for tillering'
      ]

  const handleOpenStudio = () => {
    onClose()
    navigate('/dashboard/cropadvisory?tab=askai')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kisan Darpan AI Intelligence Assistant"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(16 * var(--u))',
        background: 'rgba(4, 18, 27, 0.72)',
        backdropFilter: 'blur(calc(14 * var(--u)))',
        WebkitBackdropFilter: 'blur(calc(14 * var(--u)))'
      }}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        style={{
          width: '100%',
          maxWidth: 'calc(760 * var(--u))',
          height: 'min(86vh, calc(720 * var(--u)))',
          background: 'linear-gradient(145deg, rgba(16, 36, 48, 0.94) 0%, rgba(8, 22, 32, 0.96) 100%)',
          backdropFilter: 'blur(calc(30 * var(--u)))',
          WebkitBackdropFilter: 'blur(calc(30 * var(--u)))',
          border: '1px solid rgba(52, 211, 153, 0.35)',
          borderRadius: 'calc(24 * var(--u))',
          boxShadow: '0 calc(20 * var(--u)) calc(50 * var(--u)) rgba(0, 0, 0, 0.55), 0 0 calc(30 * var(--u)) rgba(16, 185, 129, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          animation: 'kdAiPop 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes kdAiPop {
            0% { transform: scale(0.92); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes aiShimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          .kd-ai-scroll::-webkit-scrollbar {
            width: 5px;
          }
          .kd-ai-scroll::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.03);
          }
          .kd-ai-scroll::-webkit-scrollbar-thumb {
            background: rgba(52, 211, 153, 0.3);
            border-radius: 4px;
          }
          .kd-ai-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(52, 211, 153, 0.6);
          }
        `}</style>

        {/* Top Glowing Shimmer Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 'calc(2.5 * var(--u))',
            background: 'linear-gradient(90deg, transparent, #34d399, #38bdf8, #34d399, transparent)',
            backgroundSize: '200% 100%',
            animation: 'aiShimmer 3s infinite linear'
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: 'calc(16 * var(--u)) calc(22 * var(--u))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'calc(12 * var(--u))',
            background: 'rgba(255, 255, 255, 0.03)'
          }}
        >
          {/* Title & Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))' }}>
            <KisanDarpanLogo size={38} animated={true} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 'calc(17 * var(--u))',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: 'calc(-0.2 * var(--u))'
                  }}
                >
                  Kisan Darpan AI Intelligence
                </h3>
                <span
                  style={{
                    fontSize: 'calc(9.5 * var(--u))',
                    padding: 'calc(2 * var(--u)) calc(7 * var(--u))',
                    borderRadius: 'calc(8 * var(--u))',
                    background: 'rgba(52, 211, 153, 0.16)',
                    border: '1px solid rgba(52, 211, 153, 0.4)',
                    color: '#34d399',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Global Assistant
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 'calc(11.5 * var(--u))',
                  color: 'rgba(255, 255, 255, 0.65)'
                }}
              >
                {activePanchayat || 'Amnan'} GP • {activeBlock || 'Polba-Dadpur'} • {activeCrop || 'Rice'} • 🌧️ {weatherData?.rainfall || '34.5mm'}
              </p>
            </div>
          </div>

          {/* Actions & Language */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
            {/* Language Selector */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 'calc(8 * var(--u))',
                padding: 'calc(2 * var(--u))',
                border: '1px solid rgba(255, 255, 255, 0.14)'
              }}
            >
              {[
                { code: 'en', label: 'EN' },
                { code: 'bn', label: 'বাংলা' },
                { code: 'hi', label: 'हिंदी' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  style={{
                    padding: 'calc(3 * var(--u)) calc(8 * var(--u))',
                    borderRadius: 'calc(6 * var(--u))',
                    fontSize: 'calc(11 * var(--u))',
                    fontWeight: language === lang.code ? 700 : 500,
                    background: language === lang.code ? '#10b981' : 'transparent',
                    color: language === lang.code ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.18s'
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Open Full Studio Button */}
            <button
              onClick={handleOpenStudio}
              title="Open full studio in Crop Advisory page"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(5 * var(--u))',
                padding: 'calc(5 * var(--u)) calc(11 * var(--u))',
                borderRadius: 'calc(8 * var(--u))',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#7dd3fc',
                fontSize: 'calc(11.5 * var(--u))',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <span>Full Studio</span>
              <span style={{ fontSize: 'calc(12 * var(--u))' }}>↗</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                width: 'calc(32 * var(--u))',
                height: 'calc(32 * var(--u))',
                borderRadius: 'calc(8 * var(--u))',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.18s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
            >
              <Icon id="i-cross" width="14" height="14" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div
          className="kd-ai-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'calc(18 * var(--u)) calc(22 * var(--u))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'calc(14 * var(--u))'
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: 'calc(12 * var(--u)) calc(16 * var(--u))',
                  borderRadius: msg.sender === 'user'
                    ? 'calc(18 * var(--u)) calc(18 * var(--u)) calc(4 * var(--u)) calc(18 * var(--u))'
                    : 'calc(18 * var(--u)) calc(18 * var(--u)) calc(18 * var(--u)) calc(4 * var(--u))',
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, #059669 0%, #0284c7 100%)'
                    : 'rgba(255, 255, 255, 0.07)',
                  border: msg.sender === 'user'
                    ? '1px solid rgba(52, 211, 153, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  fontSize: 'calc(13.5 * var(--u))',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  boxShadow: msg.sender === 'user'
                    ? '0 4px 14px rgba(5, 150, 105, 0.3)'
                    : '0 4px 14px rgba(0, 0, 0, 0.2)'
                }}
              >
                {msg.text}
              </div>
              <span
                style={{
                  fontSize: 'calc(10 * var(--u))',
                  color: 'rgba(255, 255, 255, 0.45)',
                  marginTop: 'calc(4 * var(--u))',
                  padding: '0 calc(6 * var(--u))'
                }}
              >
                {msg.sender === 'user' ? 'You' : 'Kisan Darpan AI'} • {msg.time}
              </span>
            </div>
          ))}

          {/* Loading bubble */}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', padding: 'calc(8 * var(--u)) 0' }}>
              <div
                style={{
                  padding: 'calc(10 * var(--u)) calc(16 * var(--u))',
                  borderRadius: 'calc(16 * var(--u))',
                  background: 'rgba(52, 211, 153, 0.12)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  color: '#34d399',
                  fontSize: 'calc(12.5 * var(--u))',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(8 * var(--u))'
                }}
              >
                <span style={{ display: 'inline-block', animation: 'spin 1s infinite linear' }}>⚙️</span>
                <span>{language === 'bn' ? 'কৃষি পরামর্শ বিশ্লেষণ করা হচ্ছে...' : language === 'hi' ? 'कृषि सलाह का विश्लेषण हो रहा है...' : 'Analyzing telemetry and agromet knowledge base...'}</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div
          style={{
            padding: 'calc(8 * var(--u)) calc(22 * var(--u))',
            display: 'flex',
            gap: 'calc(8 * var(--u))',
            overflowX: 'auto',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              style={{
                padding: 'calc(5 * var(--u)) calc(12 * var(--u))',
                borderRadius: 'calc(14 * var(--u))',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: 'calc(11.5 * var(--u))',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(52, 211, 153, 0.18)'
                e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.45)'
                e.currentTarget.style.color = '#34d399'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)'
              }}
            >
              💡 {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          style={{
            padding: 'calc(14 * var(--u)) calc(22 * var(--u))',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            gap: 'calc(10 * var(--u))',
            alignItems: 'center',
            background: 'rgba(10, 25, 36, 0.7)'
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            placeholder={
              language === 'bn'
                ? 'ফসল, সার, রোগবালাই বা আবহাওয়া সম্পর্কে কিষাণদর্পণ এআই-কে জিজ্ঞাসা করুন...'
                : language === 'hi'
                ? 'फसल, खाद, कीट नियंत्रण या मौसम के बारे में किसान दर्पण एआई से पूछें...'
                : 'Ask Kisan Darpan AI about crops, fertilizers, pest control, or weather...'
            }
            style={{
              flex: 1,
              padding: 'calc(11 * var(--u)) calc(16 * var(--u))',
              borderRadius: 'calc(14 * var(--u))',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#fff',
              fontSize: 'calc(13.5 * var(--u))',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#34d399'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'}
          />

          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            style={{
              padding: 'calc(11 * var(--u)) calc(18 * var(--u))',
              borderRadius: 'calc(14 * var(--u))',
              background: inputQuery.trim() && !isLoading
                ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: inputQuery.trim() && !isLoading ? '#fff' : 'rgba(255, 255, 255, 0.35)',
              fontWeight: 600,
              fontSize: 'calc(13 * var(--u))',
              cursor: inputQuery.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(6 * var(--u))',
              transition: 'all 0.2s',
              boxShadow: inputQuery.trim() && !isLoading ? '0 4px 12px rgba(16, 185, 129, 0.35)' : 'none'
            }}
          >
            <span>{language === 'bn' ? 'পাঠান' : language === 'hi' ? 'भेजें' : 'Send'}</span>
            <Icon id="i-send" width="14" height="14" />
          </button>
        </form>
      </div>
    </div>
  )
}
