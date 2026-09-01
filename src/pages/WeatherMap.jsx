import React, { useState, useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { tabViewBaseStyle } from '../lib/styles'
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  Layers, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  X, 
  Compass, 
  Activity
} from 'lucide-react'
import { getPanchayatsForBlock, getPanchayatDetail, mockBlocks } from '../data/mockPanchayats'

// Layer Definitions with thematic color scales & legends (4 Weather Parameters)
const LAYERS = [
  {
    id: 'rainfall',
    label: 'Rainfall',
    unit: 'mm',
    icon: CloudRain,
    description: 'Precipitation accumulation & rain rate',
    getColor: (p) => {
      const v = p.rainfall
      if (v === 0) return 'rgba(56, 189, 248, 0.18)'
      if (v < 10) return 'rgba(56, 189, 248, 0.52)'
      if (v < 25) return 'rgba(59, 130, 246, 0.72)'
      if (v < 40) return 'rgba(99, 102, 241, 0.86)'
      return 'rgba(168, 85, 247, 0.94)'
    },
    getStroke: (p) => {
      const v = p.rainfall
      if (v === 0) return '#38bdf8'
      if (v < 10) return '#60a5fa'
      if (v < 25) return '#3b82f6'
      if (v < 40) return '#818cf8'
      return '#c084fc'
    },
    formatValue: (p) => `${p.rainfall} mm`,
    legend: {
      title: 'Rainfall Accumulation',
      unit: 'mm / 24h',
      gradient: 'linear-gradient(90deg, #38bdf8 0%, #3b82f6 35%, #6366f1 70%, #a855f7 100%)',
      steps: [
        { label: '0 mm', desc: 'Dry / Trace' },
        { label: '10 mm', desc: 'Light' },
        { label: '25 mm', desc: 'Moderate' },
        { label: '40 mm', desc: 'Heavy' },
        { label: '50+ mm', desc: 'Downpour' }
      ]
    }
  },
  {
    id: 'temp',
    label: 'Temperature',
    unit: '°C',
    icon: Thermometer,
    description: 'Ambient 2m surface temperature & heat index',
    getColor: (p) => {
      const v = p.temp
      if (v < 29) return 'rgba(16, 185, 129, 0.65)'
      if (v < 32) return 'rgba(234, 179, 8, 0.65)'
      if (v < 35) return 'rgba(249, 115, 22, 0.75)'
      return 'rgba(239, 68, 68, 0.88)'
    },
    getStroke: (p) => {
      const v = p.temp
      if (v < 29) return '#34d399'
      if (v < 32) return '#facc15'
      if (v < 35) return '#fb923c'
      return '#f87171'
    },
    formatValue: (p) => `${p.temp}°C`,
    legend: {
      title: 'Surface Temperature',
      unit: '°Celsius',
      gradient: 'linear-gradient(90deg, #10b981 0%, #eab308 35%, #f97316 70%, #ef4444 100%)',
      steps: [
        { label: '< 28°C', desc: 'Cool' },
        { label: '30°C', desc: 'Pleasant' },
        { label: '33°C', desc: 'Warm' },
        { label: '36°C+', desc: 'Heat Alert' }
      ]
    }
  },
  {
    id: 'humidity',
    label: 'Humidity',
    unit: '%',
    icon: Droplets,
    description: 'Atmospheric relative moisture saturation',
    getColor: (p) => {
      const v = p.humidity
      if (v < 60) return 'rgba(103, 232, 249, 0.35)'
      if (v < 75) return 'rgba(56, 189, 248, 0.60)'
      if (v < 85) return 'rgba(37, 99, 235, 0.75)'
      return 'rgba(30, 27, 75, 0.90)'
    },
    getStroke: (p) => {
      const v = p.humidity
      if (v < 60) return '#67e8f9'
      if (v < 75) return '#38bdf8'
      if (v < 85) return '#60a5fa'
      return '#818cf8'
    },
    formatValue: (p) => `${p.humidity}%`,
    legend: {
      title: 'Relative Humidity',
      unit: '% Moisture',
      gradient: 'linear-gradient(90deg, #67e8f9 0%, #38bdf8 35%, #2563eb 70%, #1e1b4b 100%)',
      steps: [
        { label: '50%', desc: 'Dry' },
        { label: '70%', desc: 'Optimal' },
        { label: '85%', desc: 'High Moisture' },
        { label: '95%+', desc: 'Saturated' }
      ]
    }
  },
  {
    id: 'wind',
    label: 'Wind Speed',
    unit: 'km/h',
    icon: Wind,
    description: 'Surface anemometer velocity & gust potential',
    getColor: (p) => {
      const v = p.windSpeed
      if (v < 12) return 'rgba(52, 211, 153, 0.40)'
      if (v < 20) return 'rgba(250, 204, 21, 0.60)'
      if (v < 30) return 'rgba(251, 146, 60, 0.75)'
      return 'rgba(217, 70, 239, 0.85)'
    },
    getStroke: (p) => {
      const v = p.windSpeed
      if (v < 12) return '#34d399'
      if (v < 20) return '#facc15'
      if (v < 30) return '#fb923c'
      return '#e879f9'
    },
    formatValue: (p) => `${p.windSpeed} km/h`,
    legend: {
      title: 'Sustained Wind Speed',
      unit: 'km/h',
      gradient: 'linear-gradient(90deg, #34d399 0%, #facc15 35%, #fb923c 70%, #d946ef 100%)',
      steps: [
        { label: '< 10 km/h', desc: 'Calm' },
        { label: '15 km/h', desc: 'Breeze' },
        { label: '25 km/h', desc: 'Moderate' },
        { label: '35+ km/h', desc: 'Strong Gale' }
      ]
    }
  }
]

export default function WeatherMap() {
  const { 
    activeBlock, 
    setActiveBlock, 
    activeDistrict, 
    activeState, 
    activePanchayat, 
    handlePanchayatChange 
  } = useDashboard()

  const [activeLayerId, setActiveLayerId] = useState('rainfall')
  const [hoveredPanchayatId, setHoveredPanchayatId] = useState(null)
  const [selectedPanchayatId, setSelectedPanchayatId] = useState(activePanchayat || 'p1')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showNodePins, setShowNodePins] = useState(true)
  const [showFlowStreamlines, setShowFlowStreamlines] = useState(true)
  const [showPopupModal, setShowPopupModal] = useState(true)

  const activeLayer = useMemo(() => {
    return LAYERS.find(l => l.id === activeLayerId) || LAYERS[0]
  }, [activeLayerId])

  const panchayats = useMemo(() => {
    return getPanchayatsForBlock(activeBlock)
  }, [activeBlock])

  // Get active selected panchayat details
  const selectedPanchayat = useMemo(() => {
    return getPanchayatDetail(selectedPanchayatId) || panchayats[0] || getPanchayatDetail('p1')
  }, [selectedPanchayatId, panchayats])

  // Block Aggregated Telemetry (Dynamic for all 4 weather parameters)
  const blockStats = useMemo(() => {
    if (!panchayats.length) {
      return {
        avgRain: 0,
        maxRainPanchayat: null,
        minRainPanchayat: null,
        wetPanchayats: 0,
        avgTemp: 0,
        maxTempPanchayat: null,
        minTempPanchayat: null,
        hotPanchayats: 0,
        avgHum: 0,
        maxHumPanchayat: null,
        minHumPanchayat: null,
        saturatedPanchayats: 0,
        avgWind: 0,
        maxWindPanchayat: null,
        minWindPanchayat: null,
        maxGustPanchayat: null,
        gustAlertPanchayats: 0
      }
    }

    // Rainfall calculations
    const totalRain = panchayats.reduce((acc, p) => acc + p.rainfall, 0)
    const avgRain = (totalRain / panchayats.length).toFixed(1)
    const maxRainPanchayat = [...panchayats].sort((a, b) => b.rainfall - a.rainfall)[0]
    const minRainPanchayat = [...panchayats].sort((a, b) => a.rainfall - b.rainfall)[0]
    const wetPanchayats = panchayats.filter(p => p.rainfall >= 10).length

    // Temperature calculations
    const totalTemp = panchayats.reduce((acc, p) => acc + p.temp, 0)
    const avgTemp = (totalTemp / panchayats.length).toFixed(1)
    const maxTempPanchayat = [...panchayats].sort((a, b) => b.temp - a.temp)[0]
    const minTempPanchayat = [...panchayats].sort((a, b) => a.temp - b.temp)[0]
    const hotPanchayats = panchayats.filter(p => p.temp >= 33).length

    // Humidity calculations
    const totalHum = panchayats.reduce((acc, p) => acc + p.humidity, 0)
    const avgHum = Math.round(totalHum / panchayats.length)
    const maxHumPanchayat = [...panchayats].sort((a, b) => b.humidity - a.humidity)[0]
    const minHumPanchayat = [...panchayats].sort((a, b) => a.humidity - b.humidity)[0]
    const saturatedPanchayats = panchayats.filter(p => p.humidity >= 85).length

    // Wind calculations
    const totalWind = panchayats.reduce((acc, p) => acc + p.windSpeed, 0)
    const avgWind = (totalWind / panchayats.length).toFixed(1)
    const maxWindPanchayat = [...panchayats].sort((a, b) => b.windSpeed - a.windSpeed)[0]
    const minWindPanchayat = [...panchayats].sort((a, b) => a.windSpeed - b.windSpeed)[0]
    const maxGustPanchayat = [...panchayats].sort((a, b) => b.windGust - a.windGust)[0]
    const gustAlertPanchayats = panchayats.filter(p => p.windGust >= 30).length

    return {
      avgRain,
      maxRainPanchayat,
      minRainPanchayat,
      wetPanchayats,
      avgTemp,
      maxTempPanchayat,
      minTempPanchayat,
      hotPanchayats,
      avgHum,
      maxHumPanchayat,
      minHumPanchayat,
      saturatedPanchayats,
      avgWind,
      maxWindPanchayat,
      minWindPanchayat,
      maxGustPanchayat,
      gustAlertPanchayats
    }
  }, [panchayats])

  const handleSelectPanchayat = (pId) => {
    setSelectedPanchayatId(pId)
    handlePanchayatChange(pId)
    setShowPopupModal(true)
  }

  return (
    <div style={{
      ...tabViewBaseStyle,
      display: 'flex',
      flexDirection: 'column',
      gap: 'calc(14 * var(--u))',
      padding: 'calc(20 * var(--u))'
    }}>
      {/* 1. Header Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'calc(12 * var(--u))',
        flexShrink: 0
      }}>
        {/* Title & Hierarchy Breadcrumbs */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', marginBottom: 'calc(2 * var(--u))' }}>
            <span style={{ 
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2))',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: 'calc(2 * var(--u)) calc(8 * var(--u))',
              borderRadius: 'calc(10 * var(--u))',
              fontSize: 'calc(10.5 * var(--u))',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(4 * var(--u))'
            }}>
              <Activity size={12} /> Live Geospatial Telemetry
            </span>
            <span style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,0.6)' }}>
              {activeState} • {activeDistrict} • <b>{activeBlock} Block</b>
            </span>
          </div>
          <h1 style={{ 
            fontSize: 'calc(24 * var(--u))', 
            fontWeight: 700, 
            letterSpacing: 'calc(-0.4 * var(--u))', 
            margin: 0,
            color: '#ffffff'
          }}>
            Interactive Panchayat Weather & Risk Map
          </h1>
        </div>

        {/* Block Switcher & Node Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'calc(18 * var(--u))',
            padding: 'calc(3 * var(--u))'
          }}>
            {(mockBlocks[activeDistrict] || ["Polba-Dadpur", "Chinsurah-Mogra"]).map(blk => (
              <button
                key={blk}
                onClick={() => setActiveBlock(blk)}
                style={{
                  background: activeBlock === blk ? 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)' : 'transparent',
                  color: activeBlock === blk ? '#fff' : 'rgba(255,255,255,0.7)',
                  border: 'none',
                  padding: 'calc(5 * var(--u)) calc(12 * var(--u))',
                  borderRadius: 'calc(14 * var(--u))',
                  fontSize: 'calc(11.5 * var(--u))',
                  fontWeight: activeBlock === blk ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: activeBlock === blk ? '0 calc(2 * var(--u)) calc(8 * var(--u)) rgba(56, 189, 248, 0.35)' : 'none'
                }}
              >
                {blk}
              </button>
            ))}
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'calc(18 * var(--u))',
            padding: 'calc(6 * var(--u)) calc(12 * var(--u))',
            fontSize: 'calc(11.5 * var(--u))',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(6 * var(--u))'
          }}>
            <span style={{ width: 'calc(7 * var(--u))', height: 'calc(7 * var(--u))', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
            {panchayats.length} Panchayats
          </div>
        </div>
      </div>

      {/* 2. Layer Selection Switcher Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'calc(8 * var(--u))',
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 'calc(14 * var(--u))',
        padding: 'calc(6 * var(--u)) calc(10 * var(--u))',
        flexShrink: 0
      }}>
        {/* Layer Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', flexWrap: 'wrap' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'calc(5 * var(--u))', 
            fontSize: 'calc(11.5 * var(--u))', 
            fontWeight: 600, 
            color: 'rgba(255,255,255,0.5)',
            marginRight: 'calc(4 * var(--u))',
            paddingLeft: 'calc(4 * var(--u))'
          }}>
            <Layers size={14} /> LAYERS:
          </div>

          {LAYERS.map(layer => {
            const IconComp = layer.icon
            const isActive = activeLayerId === layer.id

            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayerId(layer.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(6 * var(--u))',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)' 
                    : 'rgba(255,255,255,0.04)',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  border: isActive ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.05)',
                  padding: 'calc(6 * var(--u)) calc(12 * var(--u))',
                  borderRadius: 'calc(10 * var(--u))',
                  fontSize: 'calc(12 * var(--u))',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 calc(2 * var(--u)) calc(8 * var(--u)) rgba(0,0,0,0.3)' : 'none'
                }}
              >
                <IconComp size={15} color={isActive ? '#38bdf8' : 'currentColor'} />
                <span>{layer.label}</span>
                <span style={{
                  fontSize: 'calc(9.5 * var(--u))',
                  padding: 'calc(1 * var(--u)) calc(5 * var(--u))',
                  borderRadius: 'calc(4 * var(--u))',
                  background: isActive ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255,255,255,0.08)',
                  color: isActive ? '#38bdf8' : 'rgba(255,255,255,0.5)'
                }}>
                  {layer.unit}
                </span>
              </button>
            )
          })}
        </div>

        {/* Layer display toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
          <button
            onClick={() => setShowNodePins(prev => !prev)}
            style={{
              background: showNodePins ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.05)',
              color: showNodePins ? '#38bdf8' : 'rgba(255,255,255,0.6)',
              border: showNodePins ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255,255,255,0.08)',
              padding: 'calc(5 * var(--u)) calc(8 * var(--u))',
              borderRadius: 'calc(8 * var(--u))',
              fontSize: 'calc(11 * var(--u))',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(4 * var(--u))'
            }}
          >
            <MapPin size={12} /> AWS Sensor Pins
          </button>

          <button
            onClick={() => setShowFlowStreamlines(prev => !prev)}
            style={{
              background: showFlowStreamlines ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.05)',
              color: showFlowStreamlines ? '#c084fc' : 'rgba(255,255,255,0.6)',
              border: showFlowStreamlines ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(255,255,255,0.08)',
              padding: 'calc(5 * var(--u)) calc(8 * var(--u))',
              borderRadius: 'calc(8 * var(--u))',
              fontSize: 'calc(11 * var(--u))',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(4 * var(--u))'
            }}
          >
            <Compass size={12} /> Dynamic Vectors
          </button>
        </div>
      </div>

      {/* 3. Main Geospatial Map Canvas Container */}
      <div style={{
        flex: 1,
        minHeight: 'calc(460 * var(--u))',
        position: 'relative',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%)',
        borderRadius: 'calc(18 * var(--u))',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        display: 'flex',
        boxShadow: 'inset 0 0 calc(50 * var(--u)) rgba(0,0,0,0.8)'
      }}>
        {/* Tactical HUD Coordinate Grid Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: 'calc(40 * var(--u)) calc(40 * var(--u))',
          pointerEvents: 'none'
        }} />

        {/* Radial Radar Rings */}
        <div style={{
          position: 'absolute',
          left: '42%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(520 * var(--u))',
          height: 'calc(520 * var(--u))',
          border: '1px dashed rgba(255,255,255,0.06)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          left: '42%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(320 * var(--u))',
          height: 'calc(320 * var(--u))',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        {/* Zoom & Map Control Float Widget */}
        <div style={{
          position: 'absolute',
          top: 'calc(14 * var(--u))',
          left: showPopupModal ? 'calc(14 * var(--u))' : 'calc(14 * var(--u))',
          zIndex: 20,
          display: 'flex',
          gap: 'calc(4 * var(--u))',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'calc(10 * var(--u))',
          padding: 'calc(3 * var(--u))'
        }}>
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
            title="Zoom In"
            style={{
              background: 'transparent',
              color: '#fff',
              border: 'none',
              width: 'calc(28 * var(--u))',
              height: 'calc(28 * var(--u))',
              borderRadius: 'calc(6 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.75))}
            title="Zoom Out"
            style={{
              background: 'transparent',
              color: '#fff',
              border: 'none',
              width: 'calc(28 * var(--u))',
              height: 'calc(28 * var(--u))',
              borderRadius: 'calc(6 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ZoomOut size={15} />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            title="Reset Map View"
            style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)',
              border: 'none',
              width: 'calc(28 * var(--u))',
              height: 'calc(28 * var(--u))',
              borderRadius: 'calc(6 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Interactive SVG Choropleth Vector Engine */}
        <div style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${zoomLevel})`,
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
          paddingRight: showPopupModal ? 'calc(350 * var(--u))' : 0
        }}>
          <svg
            viewBox="0 0 840 620"
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '100%',
              overflow: 'visible'
            }}
          >
            <defs>
              <filter id="glow-selected" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-hover" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <pattern id="rain-pattern" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
              </pattern>
            </defs>

            {/* 1. Panchayat Region Polygons (Choropleth Layer) */}
            <g id="panchayat-polygons">
              {panchayats.map(p => {
                const isSelected = p.id === selectedPanchayatId
                const isHovered = p.id === hoveredPanchayatId
                const fillColor = activeLayer.getColor(p)
                const strokeColor = isSelected ? '#ffffff' : isHovered ? '#38bdf8' : activeLayer.getStroke(p)
                const strokeWidth = isSelected ? 3.5 : isHovered ? 2.5 : 1.5

                return (
                  <g key={p.id}>
                    <path
                      d={p.path}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      filter={isSelected ? 'url(#glow-selected)' : isHovered ? 'url(#glow-hover)' : 'none'}
                      style={{
                        cursor: 'pointer',
                        transition: 'fill 0.4s ease, stroke 0.3s ease, stroke-width 0.2s ease',
                        opacity: isSelected ? 1 : isHovered ? 0.95 : 0.82
                      }}
                      onMouseEnter={() => setHoveredPanchayatId(p.id)}
                      onMouseLeave={() => setHoveredPanchayatId(null)}
                      onClick={() => handleSelectPanchayat(p.id)}
                    />

                    {/* Rain overlay pattern if high rainfall */}
                    {activeLayerId === 'rainfall' && p.rainfall > 20 && (
                      <path
                        d={p.path}
                        fill="url(#rain-pattern)"
                        pointerEvents="none"
                        style={{ opacity: 0.35 }}
                      />
                    )}
                  </g>
                )
              })}
            </g>

            {/* 2. Dynamic Wind Streamlines */}
            {showFlowStreamlines && activeLayerId === 'wind' && (
              <g id="wind-vectors" pointerEvents="none">
                {panchayats.map(p => {
                  const [cx, cy] = p.center
                  return (
                    <g key={`wind-${p.id}`} transform={`translate(${cx}, ${cy}) rotate(210)`}>
                      <line x1="-28" y1="0" x2="28" y2="0" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeDasharray="6,4" />
                      <polygon points="28,-4 36,0 28,4" fill="rgba(255,255,255,0.9)" />
                    </g>
                  )
                })}
              </g>
            )}

            {/* 3. Panchayat Station Nodes, Radar Pins, & Direct Labels */}
            {panchayats.map(p => {
              const [cx, cy] = p.center
              const isSelected = p.id === selectedPanchayatId
              const isHovered = p.id === hoveredPanchayatId
              const metricValue = activeLayer.formatValue(p)

              return (
                <g 
                  key={`node-${p.id}`} 
                  transform={`translate(${cx}, ${cy})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSelectPanchayat(p.id)}
                  onMouseEnter={() => setHoveredPanchayatId(p.id)}
                  onMouseLeave={() => setHoveredPanchayatId(null)}
                >
                  {/* Station Marker Dot */}
                  {showNodePins && (
                    <>
                      <circle
                        r={isSelected ? 9 : 6.5}
                        fill={isSelected ? '#38bdf8' : '#ffffff'}
                        stroke="rgba(0,0,0,0.6)"
                        strokeWidth="2"
                        style={{
                          transition: 'all 0.3s ease',
                          filter: isSelected ? 'drop-shadow(0 0 10px #38bdf8)' : 'none'
                        }}
                      />
                      {isSelected && (
                        <circle r="3.5" fill="#ffffff" />
                      )}
                    </>
                  )}

                  {/* Interactive Label Pill */}
                  <g transform={`translate(0, ${showNodePins ? 22 : 0})`}>
                    <rect
                      x="-60"
                      y="-13"
                      width="120"
                      height="26"
                      rx="13"
                      fill={isSelected ? 'rgba(255,255,255,0.95)' : 'rgba(15, 23, 42, 0.88)'}
                      stroke={isSelected ? '#38bdf8' : isHovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}
                      strokeWidth={isSelected ? 2 : 1}
                      style={{
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        transition: 'all 0.2s ease'
                      }}
                    />
                    <text
                      textAnchor="middle"
                      y="-1"
                      fill={isSelected ? '#0f172a' : '#ffffff'}
                      fontSize="10.5"
                      fontWeight="700"
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      {p.name}
                    </text>
                    <text
                      textAnchor="middle"
                      y="9.5"
                      fill={isSelected ? '#0284c7' : '#94a3b8'}
                      fontSize="9"
                      fontWeight="600"
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      {metricValue}
                    </text>
                  </g>
                </g>
              )
            })}
          </svg>
        </div>

        {/* 4. Dynamic Map Legend (Floating in Canvas Bottom-Left) */}
        <div style={{
          position: 'absolute',
          bottom: 'calc(14 * var(--u))',
          left: 'calc(14 * var(--u))',
          zIndex: 20,
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'calc(14 * var(--u))',
          padding: 'calc(12 * var(--u)) calc(16 * var(--u))',
          width: 'calc(260 * var(--u))',
          boxShadow: '0 calc(6 * var(--u)) calc(20 * var(--u)) rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(4 * var(--u))' }}>
            <div style={{ fontSize: 'calc(12 * var(--u))', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
              <activeLayer.icon size={14} color="#38bdf8" />
              {activeLayer.legend.title}
            </div>
            <span style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
              {activeLayer.legend.unit}
            </span>
          </div>

          {/* Color Gradient Scale */}
          <div style={{
            height: 'calc(8 * var(--u))',
            borderRadius: 'calc(4 * var(--u))',
            background: activeLayer.legend.gradient,
            marginBottom: 'calc(6 * var(--u))',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)'
          }} />

          {/* Interval Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'calc(10 * var(--u))', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
            {activeLayer.legend.steps.map((step, idx) => (
              <div key={idx} style={{ textAlign: idx === 0 ? 'left' : idx === activeLayer.legend.steps.length - 1 ? 'right' : 'center' }}>
                <div>{step.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Selected Panchayat Detail Intelligence Card / Popup (Anchored Right) */}
        {showPopupModal && selectedPanchayat && (
          <div style={{
            position: 'absolute',
            top: 'calc(12 * var(--u))',
            right: 'calc(12 * var(--u))',
            bottom: 'calc(12 * var(--u))',
            width: 'calc(340 * var(--u))',
            zIndex: 25,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(2, 6, 23, 0.98) 100%)',
            backdropFilter: 'blur(24 * var(--u))',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 'calc(16 * var(--u))',
            padding: 'calc(16 * var(--u))',
            boxShadow: '0 calc(12 * var(--u)) calc(36 * var(--u)) rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            animation: 'fadeInSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Header / Dismiss */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'calc(10 * var(--u))' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', marginBottom: 'calc(2 * var(--u))' }}>
                  <span style={{
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    padding: 'calc(2 * var(--u)) calc(6 * var(--u))',
                    borderRadius: 'calc(5 * var(--u))',
                    fontSize: 'calc(9.5 * var(--u))',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    Panchayat Node
                  </span>
                  <span style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.5)' }}>
                    {selectedPanchayat.block}
                  </span>
                </div>
                <h2 style={{ fontSize: 'calc(20 * var(--u))', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  {selectedPanchayat.name}
                </h2>
                <div style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.6)', marginTop: 'calc(2 * var(--u))' }}>
                  Lat: {selectedPanchayat.lat}°N • Lng: {selectedPanchayat.lng}°E
                </div>
              </div>

              <button
                onClick={() => setShowPopupModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  width: 'calc(26 * var(--u))',
                  height: 'calc(26 * var(--u))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={13} />
              </button>
            </div>

            {/* Dynamic Metric Details Based ONLY on the Active Layer */}
            {activeLayerId === 'rainfall' && (
              <>
                {/* 1. Rainfall Hero Telemetry */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: 'calc(14 * var(--u))',
                  padding: 'calc(14 * var(--u))',
                  marginBottom: 'calc(12 * var(--u))'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(6 * var(--u))' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', fontSize: 'calc(12 * var(--u))', color: '#38bdf8', fontWeight: 600 }}>
                      <CloudRain size={16} /> 24h Precipitation Accumulation
                    </div>
                    <span style={{
                      background: 'rgba(56, 189, 248, 0.25)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      padding: 'calc(2 * var(--u)) calc(7 * var(--u))',
                      borderRadius: 'calc(6 * var(--u))',
                      fontSize: 'calc(10 * var(--u))',
                      fontWeight: 700
                    }}>
                      {selectedPanchayat.rainProb}% Probability
                    </span>
                  </div>
                  <div style={{ fontSize: 'calc(28 * var(--u))', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
                    {selectedPanchayat.rainfall} <span style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>mm</span>
                  </div>
                  <div style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.8)', marginTop: 'calc(4 * var(--u))' }}>
                    Status: <b style={{ color: '#38bdf8' }}>{selectedPanchayat.rainfallStatus}</b>
                  </div>
                </div>

                {/* 2. Rainfall Key Telemetry Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'calc(8 * var(--u))',
                  marginBottom: 'calc(12 * var(--u))'
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Rain Probability</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: '#fff', marginTop: 'calc(2 * var(--u))' }}>
                      {selectedPanchayat.rainProb}%
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>Forecast Confidence</div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Soil Saturation</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: '#fff', marginTop: 'calc(2 * var(--u))' }}>
                      {selectedPanchayat.soilMoisture}
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>Root Depth Zone</div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Rainfall Rate</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: '#fff', marginTop: 'calc(2 * var(--u))' }}>
                      {selectedPanchayat.rainfall > 35 ? 'Torrential' : selectedPanchayat.rainfall > 15 ? 'Moderate' : selectedPanchayat.rainfall > 0 ? 'Light' : 'None'}
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>Hourly Intensity</div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Block Delta</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: selectedPanchayat.rainfall >= Number(blockStats.avgRain) ? '#38bdf8' : '#94a3b8', marginTop: 'calc(2 * var(--u))' }}>
                      {(selectedPanchayat.rainfall - Number(blockStats.avgRain)) >= 0 ? '+' : ''}{(selectedPanchayat.rainfall - Number(blockStats.avgRain)).toFixed(1)} mm
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>vs {activeBlock} Avg</div>
                  </div>
                </div>

                {/* 3. Rainfall Telemetry Observation */}
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'calc(12 * var(--u))',
                  padding: 'calc(12 * var(--u))'
                }}>
                  <div style={{ fontSize: 'calc(11.5 * var(--u))', fontWeight: 700, color: '#38bdf8', marginBottom: 'calc(4 * var(--u))' }}>
                    Hydro-Meteorological Status
                  </div>
                  <div style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                    {selectedPanchayat.rainfall >= 30 
                      ? `Heavy precipitation detected across ${selectedPanchayat.name}. Surface accumulation is elevated with high runoff in low-lying parcels.`
                      : selectedPanchayat.rainfall >= 10
                      ? `Steady showers recorded across ${selectedPanchayat.name}. Regular infiltration maintaining soil moisture equilibrium.`
                      : `Trace or dry conditions recorded at ${selectedPanchayat.name} station. No immediate heavy precipitation observed.`
                    }
                  </div>
                </div>
              </>
            )}

            {activeLayerId === 'temp' && (
              <>
                {/* 1. Temperature Hero Telemetry */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  borderRadius: 'calc(14 * var(--u))',
                  padding: 'calc(14 * var(--u))',
                  marginBottom: 'calc(12 * var(--u))'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(6 * var(--u))' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', fontSize: 'calc(12 * var(--u))', color: '#fb923c', fontWeight: 600 }}>
                      <Thermometer size={16} /> Ambient Surface Temperature
                    </div>
                    <span style={{
                      background: 'rgba(249, 115, 22, 0.25)',
                      color: '#fb923c',
                      border: '1px solid rgba(249, 115, 22, 0.4)',
                      padding: 'calc(2 * var(--u)) calc(7 * var(--u))',
                      borderRadius: 'calc(6 * var(--u))',
                      fontSize: 'calc(10 * var(--u))',
                      fontWeight: 700
                    }}>
                      Feels like {selectedPanchayat.feelsLike}°C
                    </span>
                  </div>
                  <div style={{ fontSize: 'calc(28 * var(--u))', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
                    {selectedPanchayat.temp} <span style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>°C</span>
                  </div>
                  <div style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.8)', marginTop: 'calc(4 * var(--u))' }}>
                    Hourly Rate: <b style={{ color: '#fb923c' }}>{selectedPanchayat.tempTrend}</b>
                  </div>
                </div>

                {/* 2. Temperature Key Telemetry Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'calc(8 * var(--u))',
                  marginBottom: 'calc(12 * var(--u))'
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Apparent Index</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: '#fff', marginTop: 'calc(2 * var(--u))' }}>
                      {selectedPanchayat.feelsLike}°C
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>Heat Index Rating</div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Hourly Trend</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: '#fff', marginTop: 'calc(2 * var(--u))' }}>
                      {selectedPanchayat.tempTrend}
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>Diurnal Rate</div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Dew Point</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: '#fff', marginTop: 'calc(2 * var(--u))' }}>
                      {selectedPanchayat.dewPoint}°C
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>Saturation Temp</div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Block Variance</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: selectedPanchayat.temp >= Number(blockStats.avgTemp) ? '#fb923c' : '#34d399', marginTop: 'calc(2 * var(--u))' }}>
                      {(selectedPanchayat.temp - Number(blockStats.avgTemp)) >= 0 ? '+' : ''}{(selectedPanchayat.temp - Number(blockStats.avgTemp)).toFixed(1)}°C
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>vs {activeBlock} Avg</div>
                  </div>
                </div>

                {/* 3. Temperature Telemetry Observation */}
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'calc(12 * var(--u))',
                  padding: 'calc(12 * var(--u))'
                }}>
                  <div style={{ fontSize: 'calc(11.5 * var(--u))', fontWeight: 700, color: '#fb923c', marginBottom: 'calc(4 * var(--u))' }}>
                    Thermal Microclimate Assessment
                  </div>
                  <div style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                    {selectedPanchayat.temp >= 35 
                      ? `Elevated surface temperature observed in ${selectedPanchayat.name}. High evapotranspiration rate with apparent heat index reaching ${selectedPanchayat.feelsLike}°C.`
                      : selectedPanchayat.temp >= 30
                      ? `Moderate warm surface profile in ${selectedPanchayat.name}. Normal diurnal heating without severe thermal distress.`
                      : `Cooler microclimate recorded at ${selectedPanchayat.name}, aided by cloud cover and local precipitation.`
                    }
                  </div>
                </div>
              </>
            )}

            {activeLayerId === 'humidity' && (
              <>
                {/* 1. Humidity Hero Telemetry */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(30, 27, 75, 0.15) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 'calc(14 * var(--u))',
                  padding: 'calc(14 * var(--u))',
                  marginBottom: 'calc(12 * var(--u))'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(6 * var(--u))' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', fontSize: 'calc(12 * var(--u))', color: '#60a5fa', fontWeight: 600 }}>
                      <Droplets size={16} /> Relative Atmospheric Humidity
                    </div>
                    <span style={{
                      background: 'rgba(59, 130, 246, 0.25)',
                      color: '#60a5fa',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      padding: 'calc(2 * var(--u)) calc(7 * var(--u))',
                      borderRadius: 'calc(6 * var(--u))',
                      fontSize: 'calc(10 * var(--u))',
                      fontWeight: 700
                    }}>
                      Dew Pt: {selectedPanchayat.dewPoint}°C
                    </span>
                  </div>
                  <div style={{ fontSize: 'calc(28 * var(--u))', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
                    {selectedPanchayat.humidity} <span style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>%</span>
                  </div>
                  <div style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.8)', marginTop: 'calc(4 * var(--u))' }}>
                    Moisture Profile: <b style={{ color: '#60a5fa' }}>{selectedPanchayat.humidity >= 85 ? 'Saturated Vapor' : selectedPanchayat.humidity >= 70 ? 'Optimal Moisture' : 'Dry Atmosphere'}</b>
                  </div>
                </div>

                {/* 2. Humidity Key Telemetry Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'calc(8 * var(--u))',
                  marginBottom: 'calc(12 * var(--u))'
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Dew Point</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: '#fff', marginTop: 'calc(2 * var(--u))' }}>
                      {selectedPanchayat.dewPoint}°C
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>Condensation Index</div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Soil Moisture</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: '#fff', marginTop: 'calc(2 * var(--u))' }}>
                      {selectedPanchayat.soilMoisture}
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>Ground Equilibrium</div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Saturation Level</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: '#fff', marginTop: 'calc(2 * var(--u))' }}>
                      {selectedPanchayat.humidity >= 85 ? 'Heavy' : selectedPanchayat.humidity >= 70 ? 'Moderate' : 'Low'}
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>Air Moisture Rank</div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Block Delta</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: selectedPanchayat.humidity >= Number(blockStats.avgHum) ? '#60a5fa' : '#94a3b8', marginTop: 'calc(2 * var(--u))' }}>
                      {(selectedPanchayat.humidity - Number(blockStats.avgHum)) >= 0 ? '+' : ''}{selectedPanchayat.humidity - Number(blockStats.avgHum)}%
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>vs {activeBlock} Avg</div>
                  </div>
                </div>

                {/* 3. Humidity Telemetry Observation */}
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'calc(12 * var(--u))',
                  padding: 'calc(12 * var(--u))'
                }}>
                  <div style={{ fontSize: 'calc(11.5 * var(--u))', fontWeight: 700, color: '#60a5fa', marginBottom: 'calc(4 * var(--u))' }}>
                    Atmospheric Moisture Analysis
                  </div>
                  <div style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                    {selectedPanchayat.humidity >= 85 
                      ? `Dense moisture saturation in ${selectedPanchayat.name}. Dew point is near ambient temperature, causing extended surface wetness duration.`
                      : selectedPanchayat.humidity >= 70
                      ? `Stable moisture levels in ${selectedPanchayat.name} providing balanced ambient relative humidity.`
                      : `Dry air mass dominant over ${selectedPanchayat.name} with low moisture retention.`
                    }
                  </div>
                </div>
              </>
            )}

            {activeLayerId === 'wind' && (
              <>
                {/* 1. Wind Hero Telemetry */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(217, 70, 239, 0.08) 100%)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  borderRadius: 'calc(14 * var(--u))',
                  padding: 'calc(14 * var(--u))',
                  marginBottom: 'calc(12 * var(--u))'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(6 * var(--u))' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', fontSize: 'calc(12 * var(--u))', color: '#facc15', fontWeight: 600 }}>
                      <Wind size={16} /> Sustained Anemometer Wind
                    </div>
                    <span style={{
                      background: 'rgba(234, 179, 8, 0.25)',
                      color: '#facc15',
                      border: '1px solid rgba(234, 179, 8, 0.4)',
                      padding: 'calc(2 * var(--u)) calc(7 * var(--u))',
                      borderRadius: 'calc(6 * var(--u))',
                      fontSize: 'calc(10 * var(--u))',
                      fontWeight: 700
                    }}>
                      Gusts: {selectedPanchayat.windGust} km/h
                    </span>
                  </div>
                  <div style={{ fontSize: 'calc(28 * var(--u))', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
                    {selectedPanchayat.windSpeed} <span style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>km/h</span>
                  </div>
                  <div style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,0.8)', marginTop: 'calc(4 * var(--u))' }}>
                    Direction: <b style={{ color: '#facc15' }}>{selectedPanchayat.windDirection}</b>
                  </div>
                </div>

                {/* 2. Wind Key Telemetry Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'calc(8 * var(--u))',
                  marginBottom: 'calc(12 * var(--u))'
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Compass Bearing</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: '#fff', marginTop: 'calc(2 * var(--u))' }}>
                      {selectedPanchayat.windDirection}
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>Surface Direction</div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Peak Gust Speed</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: '#fff', marginTop: 'calc(2 * var(--u))' }}>
                      {selectedPanchayat.windGust} km/h
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>Instantaneous Peak</div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Beaufort Scale</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: '#fff', marginTop: 'calc(2 * var(--u))' }}>
                      {selectedPanchayat.windSpeed >= 28 ? 'Force 5-6' : selectedPanchayat.windSpeed >= 15 ? 'Force 3-4' : 'Force 1-2'}
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>Velocity Class</div>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(12 * var(--u))',
                    padding: 'calc(10 * var(--u))'
                  }}>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Block Delta</div>
                    <div style={{ fontSize: 'calc(16 * var(--u))', fontWeight: 700, color: selectedPanchayat.windSpeed >= Number(blockStats.avgWind) ? '#facc15' : '#94a3b8', marginTop: 'calc(2 * var(--u))' }}>
                      {(selectedPanchayat.windSpeed - Number(blockStats.avgWind)) >= 0 ? '+' : ''}{(selectedPanchayat.windSpeed - Number(blockStats.avgWind)).toFixed(1)} km/h
                    </div>
                    <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(2 * var(--u))' }}>vs {activeBlock} Avg</div>
                  </div>
                </div>

                {/* 3. Wind Telemetry Observation */}
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'calc(12 * var(--u))',
                  padding: 'calc(12 * var(--u))'
                }}>
                  <div style={{ fontSize: 'calc(11.5 * var(--u))', fontWeight: 700, color: '#facc15', marginBottom: 'calc(4 * var(--u))' }}>
                    Surface Wind Assessment
                  </div>
                  <div style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                    {selectedPanchayat.windSpeed >= 25 
                      ? `Strong sustained breeze at ${selectedPanchayat.name} with gusts up to ${selectedPanchayat.windGust} km/h.`
                      : selectedPanchayat.windSpeed >= 12
                      ? `Moderate surface wind blowing from ${selectedPanchayat.windDirection} across ${selectedPanchayat.name}.`
                      : `Calm to light wind conditions recorded across ${selectedPanchayat.name}.`
                    }
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 4. Bottom Block Summary Statistics Strip (Context-Aware for Selected Layer) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'calc(10 * var(--u))',
        flexShrink: 0
      }}>
        {activeLayerId === 'rainfall' && (
          <>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <CloudRain size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Block Avg Rainfall</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff' }}>{blockStats.avgRain} mm</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <CloudRain size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Max Rainfall Station</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff' }}>
                  {blockStats.maxRainPanchayat ? `${blockStats.maxRainPanchayat.name} (${blockStats.maxRainPanchayat.rainfall} mm)` : 'N/A'}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <CloudRain size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Min Rainfall Station</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff' }}>
                  {blockStats.minRainPanchayat ? `${blockStats.minRainPanchayat.name} (${blockStats.minRainPanchayat.rainfall} mm)` : 'N/A'}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <CloudRain size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Wet Stations (≥10mm)</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#38bdf8' }}>
                  {blockStats.wetPanchayats} / {panchayats.length}
                </div>
              </div>
            </div>
          </>
        )}

        {activeLayerId === 'temp' && (
          <>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                <Thermometer size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Block Avg Temp</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff' }}>{blockStats.avgTemp}°C</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                <Thermometer size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Warmest Station</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff' }}>
                  {blockStats.maxTempPanchayat ? `${blockStats.maxTempPanchayat.name} (${blockStats.maxTempPanchayat.temp}°C)` : 'N/A'}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                <Thermometer size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Coolest Station</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff' }}>
                  {blockStats.minTempPanchayat ? `${blockStats.minTempPanchayat.name} (${blockStats.minTempPanchayat.temp}°C)` : 'N/A'}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                <Thermometer size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>High Heat Zones (≥33°C)</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#f97316' }}>
                  {blockStats.hotPanchayats} / {panchayats.length}
                </div>
              </div>
            </div>
          </>
        )}

        {activeLayerId === 'humidity' && (
          <>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                <Droplets size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Block Avg Humidity</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff' }}>{blockStats.avgHum}%</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                <Droplets size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Peak Moisture Station</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff' }}>
                  {blockStats.maxHumPanchayat ? `${blockStats.maxHumPanchayat.name} (${blockStats.maxHumPanchayat.humidity}%)` : 'N/A'}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                <Droplets size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Lowest Humidity Station</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff' }}>
                  {blockStats.minHumPanchayat ? `${blockStats.minHumPanchayat.name} (${blockStats.minHumPanchayat.humidity}%)` : 'N/A'}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                <Droplets size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Saturated Zones (≥85%)</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#60a5fa' }}>
                  {blockStats.saturatedPanchayats} / {panchayats.length}
                </div>
              </div>
            </div>
          </>
        )}

        {activeLayerId === 'wind' && (
          <>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15' }}>
                <Wind size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Block Avg Wind</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff' }}>{blockStats.avgWind} km/h</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15' }}>
                <Wind size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Max Gust Station</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff' }}>
                  {blockStats.maxGustPanchayat ? `${blockStats.maxGustPanchayat.name} (${blockStats.maxGustPanchayat.windGust} km/h)` : 'N/A'}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15' }}>
                <Wind size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Calmest Station</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#fff' }}>
                  {blockStats.minWindPanchayat ? `${blockStats.minWindPanchayat.name} (${blockStats.minWindPanchayat.windSpeed} km/h)` : 'N/A'}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(10 * var(--u))'
            }}>
              <div style={{ width: 'calc(34 * var(--u))', height: 'calc(34 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15' }}>
                <Wind size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Gust Alert Stations (≥30km/h)</div>
                <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#facc15' }}>
                  {blockStats.gustAlertPanchayats} / {panchayats.length}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Global Embedded Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}} />
    </div>
  )
}
