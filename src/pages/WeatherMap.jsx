import React, { useState, useMemo, useEffect, useRef } from 'react'
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
  Activity,
  Sun,
  Moon,
  Globe,
  BarChart2
} from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Circle, Tooltip, GeoJSON, useMap, Polyline, Marker } from 'react-leaflet'
import { getPanchayatsForBlock, getPanchayatDetail, mockBlocks, getDistrictForBlock } from '../data/mockPanchayats'

// ─── Leaflet fix: default icon images (needed when bundled with Vite) ───────
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ─── West Bengal state boundary (simplified GeoJSON) ────────────────────────
// Source: public-domain Natural Earth / Survey of India simplified outline
const WB_BOUNDARY = {
  type: 'Feature',
  properties: { name: 'West Bengal' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [85.82, 27.10],[86.02, 26.98],[86.55, 26.87],[86.97, 26.52],[87.22, 26.41],
      [87.55, 26.38],[87.98, 26.18],[88.12, 25.97],[88.35, 25.61],[88.62, 25.47],
      [88.72, 25.18],[88.95, 25.06],[89.18, 25.11],[89.35, 25.30],[89.43, 25.68],
      [89.82, 25.88],[89.88, 26.18],[89.53, 26.55],[89.20, 26.72],[88.85, 26.62],
      [88.42, 26.72],[88.17, 26.98],[87.97, 27.02],[87.72, 26.90],[87.38, 27.10],
      [87.05, 27.25],[86.65, 27.22],[86.28, 27.15],[85.98, 27.18],[85.82, 27.10]
    ]]
  }
}

// ─── Hooghly district boundary (approximate) ────────────────────────────────
const HOOGHLY_BOUNDARY = {
  type: 'Feature',
  properties: { name: 'Hooghly District' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [88.00, 23.05],[88.16, 22.95],[88.32, 22.82],[88.50, 22.75],[88.60, 22.88],
      [88.62, 23.10],[88.52, 23.28],[88.38, 23.45],[88.20, 23.52],[88.05, 23.40],
      [87.95, 23.22],[87.98, 23.10],[88.00, 23.05]
    ]]
  }
}

// ─── Map theme controller to synchronously update Leaflet DOM container ─────
function MapThemeController({ mapTheme }) {
  const map = useMap()
  useEffect(() => {
    const container = map.getContainer()
    if (!container) return
    container.classList.remove('map-theme-dark', 'map-theme-light')
    container.classList.add(`map-theme-${mapTheme}`)
  }, [mapTheme, map])
  return null
}

// ─── Map auto-recentre & pinpoint controller ─────────────────────────────────
function MapController({ panchayats, selectedPanchayat, activeBlock }) {
  const map = useMap()
  const blockRef = useRef(activeBlock)
  const selectedPIdRef = useRef(selectedPanchayat?.id)

  // Invalidate map size on mount and container resizing so tiles render across 100% of canvas
  useEffect(() => {
    map.invalidateSize(true)
    const timers = [60, 200, 450, 800].map(d => setTimeout(() => map.invalidateSize(true), d))

    const container = map.getContainer()
    if (!container) return

    const ro = new ResizeObserver(() => {
      map.invalidateSize(true)
    })
    ro.observe(container)

    return () => {
      timers.forEach(clearTimeout)
      ro.disconnect()
    }
  }, [map])

  // Fit bounds to the selected block's panchayats whenever activeBlock changes or on mount
  useEffect(() => {
    if (!panchayats || panchayats.length === 0) return
    const bounds = L.latLngBounds(panchayats.map(p => [p.lat, p.lng]))
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
      setTimeout(() => map.invalidateSize(false), 250)
    }
    blockRef.current = activeBlock
  }, [activeBlock, panchayats, map])

  // Fly directly to selected panchayat when clicked or changed
  useEffect(() => {
    if (!selectedPanchayat) return
    if (selectedPIdRef.current !== selectedPanchayat.id) {
      selectedPIdRef.current = selectedPanchayat.id
      map.flyTo([selectedPanchayat.lat, selectedPanchayat.lng], 14, {
        duration: 0.85,
        easeLinearity: 0.25
      })
      setTimeout(() => map.invalidateSize(false), 300)
    }
  }, [selectedPanchayat, map])

  return null
}

// ─── Helper to calculate meteorological wind vector coordinates ─────────────
function computeWindFlowVector(p) {
  let deg = 215
  if (p.windDirection) {
    const match = p.windDirection.match(/(\d+)°/)
    if (match) deg = parseInt(match[1], 10)
  }
  // Wind direction is FROM angle -> flow is TO angle: (deg + 180) % 360
  const flowAngle = (deg + 180) % 360
  const flowRad = (90 - flowAngle) * (Math.PI / 180)
  const speed = p.windSpeed || 18
  const length = 0.012 + Math.min(speed, 40) * 0.0006

  const dLat = Math.sin(flowRad) * length
  const dLng = Math.cos(flowRad) * length * 1.12

  return {
    deg,
    flowAngle,
    speed,
    dLat,
    dLng,
    start: [p.lat - dLat * 0.4, p.lng - dLng * 0.4],
    end: [p.lat + dLat * 0.85, p.lng + dLng * 0.85],
    mid: [p.lat + dLat * 0.25, p.lng + dLng * 0.25]
  }
}

// ─── LeafletMap sub-component ────────────────────────────────────────────────
function LeafletMap({
  panchayats, activeLayer, selectedPanchayatId,
  showPopupModal, onSelect, activeBlock,
  showNodePins, showFlowStreamlines, activeLayerId,
  mapTheme, tileType
}) {
  const selectedPanchayat = useMemo(() => {
    return panchayats.find(p => p.id === selectedPanchayatId) || panchayats[0]
  }, [panchayats, selectedPanchayatId])

  // Compute block centroid from panchayat coords
  const center = useMemo(() => {
    if (selectedPanchayat) return [selectedPanchayat.lat, selectedPanchayat.lng]
    if (!panchayats.length) return [22.18, 87.98]
    const avgLat = panchayats.reduce((s, p) => s + p.lat, 0) / panchayats.length
    const avgLng = panchayats.reduce((s, p) => s + p.lng, 0) / panchayats.length
    return [avgLat, avgLng]
  }, [activeBlock, selectedPanchayat])

  // Dynamic Tile configuration (100% Free, NO API Key required, NO Watermarks)
  const tileConfig = useMemo(() => {
    if (tileType === 'satellite') {
      return {
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        attribution: '&copy; Google Maps Satellite',
        maxZoom: 20
      }
    }
    if (tileType === 'esri') {
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri &copy; OpenStreetMap',
        maxZoom: 16
      }
    }
    // Google Maps Roadmap (Crisp standard in light mode, sleek inverted dark in dark mode)
    return {
      url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      attribution: '&copy; Google Maps Roadmap',
      maxZoom: 20
    }
  }, [tileType])

  // Bulletproof animation driver: directly shifts SVG stroke-dashoffset at 40 FPS on the DOM
  useEffect(() => {
    if (!showFlowStreamlines) return

    let offset = 0
    let frameId
    let lastTime = performance.now()

    const animate = (now) => {
      if (now - lastTime >= 24) {
        lastTime = now
        offset -= 1.2
        if (offset <= -360) offset = 0

        const paths = document.querySelectorAll('.dynamic-flow-line')
        for (let i = 0; i < paths.length; i++) {
          paths[i].style.setProperty('stroke-dashoffset', `${offset.toFixed(1)}px`, 'important')
        }
      }
      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [showFlowStreamlines, panchayats])

  return (
    <MapContainer
      center={center}
      zoom={13}
      className={`map-theme-${mapTheme}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: 'transparent'
      }}
      zoomControl={true}
      attributionControl={true}
    >
      <MapThemeController mapTheme={mapTheme} />
      <MapController
        panchayats={panchayats}
        selectedPanchayat={selectedPanchayat}
        activeBlock={activeBlock}
      />

      {/* Dynamic tile layer without blocking flags to guarantee complete 100% canvas tile fill */}
      <TileLayer
        key={`${mapTheme}-${tileType}-${tileConfig.url}`}
        url={tileConfig.url}
        attribution={tileConfig.attribution}
        maxZoom={tileConfig.maxZoom}
      />

      {/* West Bengal state boundary */}
      <GeoJSON
        key="wb-boundary"
        data={WB_BOUNDARY}
        style={{ color: '#38bdf8', weight: 1.5, fill: false, dashArray: '6 4', opacity: 0.5 }}
      />

      {/* Hooghly district boundary */}
      <GeoJSON
        key="hooghly-boundary"
        data={HOOGHLY_BOUNDARY}
        style={{ color: '#818cf8', weight: 1.5, fill: false, dashArray: '3 3', opacity: 0.7 }}
      />

      {/* Dynamic Atmospheric Vectors & Animated Flow Streamlines */}
      {showFlowStreamlines && panchayats.map(p => {
        const vec = computeWindFlowVector(p)
        const perpLat = -vec.dLng * 0.45
        const perpLng = vec.dLat * 0.45

        return (
          <React.Fragment key={`dynamic-flow-${p.id}`}>
            {/* Center animated streamline */}
            <Polyline
              positions={[vec.start, vec.end]}
              pathOptions={{
                className: 'dynamic-flow-line',
                dashArray: '8, 10',
                color: '#c084fc',
                weight: 2.5,
                opacity: 0.9
              }}
            />

            {/* Parallel flanking streamlines */}
            <Polyline
              positions={[
                [vec.start[0] + perpLat, vec.start[1] + perpLng],
                [vec.end[0] * 0.9 + vec.start[0] * 0.1 + perpLat, vec.end[1] * 0.9 + vec.start[1] * 0.1 + perpLng]
              ]}
              pathOptions={{
                className: 'dynamic-flow-line',
                dashArray: '6, 8',
                color: '#e879f9',
                weight: 1.5,
                opacity: 0.65
              }}
            />
            <Polyline
              positions={[
                [vec.start[0] - perpLat, vec.start[1] - perpLng],
                [vec.end[0] * 0.85 + vec.start[0] * 0.15 - perpLat, vec.end[1] * 0.85 + vec.start[1] * 0.15 - perpLng]
              ]}
              pathOptions={{
                className: 'dynamic-flow-line',
                dashArray: '6, 8',
                color: '#e879f9',
                weight: 1.5,
                opacity: 0.65
              }}
            />

            {/* Directional arrowhead at lead vector tip */}
            <Marker
              position={vec.end}
              interactive={false}
              icon={L.divIcon({
                className: 'dynamic-vector-arrow',
                html: `
                  <div style="
                    transform: rotate(${vec.flowAngle}deg);
                    transform-origin: center center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    filter: drop-shadow(0 0 5px rgba(192, 132, 252, 0.9));
                  ">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#e879f9" stroke="#ffffff" stroke-width="1.8">
                      <polygon points="12,2 22,22 12,17 2,22" />
                    </svg>
                  </div>
                `,
                iconSize: [18, 18],
                iconAnchor: [9, 9]
              })}
            />

            {/* Mid-vector velocity badge */}
            <Marker
              position={vec.mid}
              interactive={false}
              icon={L.divIcon({
                className: 'vec-speed-pill',
                html: `
                  <div style="
                    background: rgba(168, 85, 247, 0.92);
                    color: #ffffff;
                    font-size: 9.5px;
                    font-weight: 700;
                    padding: 1px 6px;
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.4);
                    white-space: nowrap;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.35);
                    font-family: system-ui, sans-serif;
                  ">
                    ${vec.speed} km/h
                  </div>
                `,
                iconSize: [52, 16],
                iconAnchor: [26, 8]
              })}
            />
          </React.Fragment>
        )
      })}

      {/* Heatmap & Weather Intensity Dispersion Halos (Always move with the map tiles) */}
      {panchayats.map(p => {
        const fillColor = activeLayer.getColor(p)
        const isSelected = p.id === selectedPanchayatId
        return (
          <React.Fragment key={`halo-${p.id}`}>
            {/* Broad regional weather dispersion aura */}
            <Circle
              center={[p.lat, p.lng]}
              radius={isSelected ? 4200 : 3400}
              pathOptions={{
                color: 'transparent',
                fillColor,
                fillOpacity: isSelected ? 0.32 : 0.22,
                weight: 0
              }}
            />
            {/* Focused microclimate core halo */}
            <Circle
              center={[p.lat, p.lng]}
              radius={isSelected ? 2000 : 1600}
              pathOptions={{
                color: activeLayer.getStroke(p),
                fillColor,
                fillOpacity: isSelected ? 0.45 : 0.35,
                weight: 1,
                dashArray: '3 6',
                opacity: 0.5
              }}
            />
          </React.Fragment>
        )
      })}

      {/* Base Microclimate Location Dots */}
      {panchayats.map(p => {
        const isSelected = p.id === selectedPanchayatId
        const fillColor = activeLayer.getColor(p)
        const strokeColor = activeLayer.getStroke(p)
        const radius = isSelected ? 16 : 10

        return (
          <CircleMarker
            key={`base-dot-${p.id}`}
            center={[p.lat, p.lng]}
            radius={radius}
            pathOptions={{
              color: isSelected ? '#ffffff' : strokeColor,
              weight: isSelected ? 2.5 : 1.5,
              fillColor,
              fillOpacity: isSelected ? 0.95 : 0.75,
              opacity: 1
            }}
            eventHandlers={{
              click: () => onSelect(p.id)
            }}
          />
        )
      })}

      {/* AWS Station Sensor Pin Markers (Interactive & Toggled by 'AWS Sensor Pins' button) */}
      {showNodePins && panchayats.map(p => {
        const isSelected = p.id === selectedPanchayatId
        const fillColor = activeLayer.getColor(p)
        const strokeColor = activeLayer.getStroke(p)

        return (
          <Marker
            key={`aws-pin-${p.id}-${isSelected}-${mapTheme}`}
            position={[p.lat, p.lng]}
            eventHandlers={{
              click: () => onSelect(p.id)
            }}
            icon={L.divIcon({
              className: 'aws-pin-icon-wrapper',
              html: `
                <div style="
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  cursor: pointer;
                  transform: translate(-50%, -100%);
                  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.45));
                ">
                  <!-- Live AWS Sensor Telemetry Callout Pill -->
                  <div style="
                    background: ${isSelected ? 'linear-gradient(135deg, #0284c7, #2563eb)' : (mapTheme === 'light' ? 'rgba(255,255,255,0.98)' : 'rgba(15,23,42,0.95)')};
                    color: ${isSelected ? '#ffffff' : (mapTheme === 'light' ? '#0f172a' : '#ffffff')};
                    border: 1.5px solid ${isSelected ? '#ffffff' : strokeColor};
                    border-radius: 12px;
                    padding: 3px 8px;
                    font-family: system-ui, -apple-system, sans-serif;
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 11px;
                    font-weight: 700;
                  ">
                    <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 6px #22c55e;"></span>
                    <span>${p.name}</span>
                    <span style="
                      background: ${isSelected ? 'rgba(255,255,255,0.25)' : (mapTheme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.12)')};
                      color: ${isSelected ? '#ffffff' : (mapTheme === 'light' ? '#0284c7' : '#38bdf8')};
                      padding: 1px 5px;
                      border-radius: 6px;
                      font-size: 10px;
                      font-weight: 700;
                    ">${activeLayer.formatValue(p)}</span>
                  </div>
                  <!-- Pin Needle Stem -->
                  <div style="
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 7px solid ${isSelected ? '#2563eb' : strokeColor};
                  "></div>
                  <!-- Ground Sensor Node Anchor -->
                  <div style="
                    width: 9px;
                    height: 9px;
                    background: ${fillColor};
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    box-shadow: 0 0 8px ${strokeColor};
                    margin-top: -1px;
                  "></div>
                </div>
              `,
              iconSize: [140, 48],
              iconAnchor: [70, 48]
            })}
          />
        )
      })}

      {/* Selected Panchayat Exact Pinpoint Highlight */}
      {selectedPanchayat && (
        <React.Fragment key={`selected-pin-${selectedPanchayat.id}`}>
          {/* Outer radar pulse boundary */}
          <Circle
            center={[selectedPanchayat.lat, selectedPanchayat.lng]}
            radius={2200}
            pathOptions={{
              color: '#38bdf8',
              fillColor: '#38bdf8',
              fillOpacity: 0.14,
              weight: 1.5,
              dashArray: '4 4'
            }}
          />
          {/* Inner distinct target ring */}
          <CircleMarker
            center={[selectedPanchayat.lat, selectedPanchayat.lng]}
            radius={30}
            pathOptions={{
              color: '#ffffff',
              weight: 3.5,
              fillColor: '#0284c7',
              fillOpacity: 0.35
            }}
          />
        </React.Fragment>
      )}
    </MapContainer>
  )
}



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
    handleBlockChange, 
    activeDistrict, 
    activeState, 
    activePanchayat, 
    handlePanchayatChange,
    blocksInDistrict
  } = useDashboard()

  const effectiveDistrict = useMemo(() => {
    if (activeDistrict && activeDistrict !== "West Bengal" && mockBlocks[activeDistrict]) {
      return activeDistrict
    }
    return getDistrictForBlock(activeBlock)
  }, [activeDistrict, activeBlock])

  const districtBlocks = useMemo(() => {
    if (blocksInDistrict && blocksInDistrict.length > 0) return blocksInDistrict
    return mockBlocks[effectiveDistrict] || ["Mahishadal", "Tamluk", "Haldia", "Nandigram-I", "Contai-I"]
  }, [blocksInDistrict, effectiveDistrict])

  const [activeLayerId, setActiveLayerId] = useState('rainfall')
  const [hoveredPanchayatId, setHoveredPanchayatId] = useState(null)
  const [selectedPanchayatId, setSelectedPanchayatId] = useState(activePanchayat || 'p1')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showNodePins, setShowNodePins] = useState(true)
  const [showFlowStreamlines, setShowFlowStreamlines] = useState(true)
  const [showPopupModal, setShowPopupModal] = useState(true)
  const [mapTheme, setMapTheme] = useState('dark')
  const [tileType, setTileType] = useState('default')
  const [rightPanelTab, setRightPanelTab] = useState('bars')
  const [showBottomBarDrawer, setShowBottomBarDrawer] = useState(false)

  const activeLayer = useMemo(() => {
    return LAYERS.find(l => l.id === activeLayerId) || LAYERS[0]
  }, [activeLayerId])

  const panchayats = useMemo(() => {
    return getPanchayatsForBlock(activeBlock)
  }, [activeBlock])

  // Automatically update selectedPanchayatId whenever activeBlock or panchayats change
  useEffect(() => {
    if (panchayats && panchayats.length > 0) {
      const exists = panchayats.some(p => p.id === selectedPanchayatId)
      if (!exists) {
        setSelectedPanchayatId(panchayats[0].id)
        handlePanchayatChange(panchayats[0].id)
      }
    }
  }, [activeBlock, panchayats, selectedPanchayatId])

  // Get active selected panchayat details strictly from the active block
  const selectedPanchayat = useMemo(() => {
    if (!panchayats || panchayats.length === 0) return null
    return panchayats.find(p => p.id === selectedPanchayatId) || panchayats[0]
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
      padding: 'calc(20 * var(--u))',
      overflow: 'hidden'
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
              {activeState} • {effectiveDistrict} • <b>{activeBlock} Block</b>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', flexWrap: 'wrap' }}>
          {/* 1. Quick Buttons for Blocks in Current District */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'calc(18 * var(--u))',
            padding: 'calc(3 * var(--u))',
            gap: 'calc(2 * var(--u))'
          }}>
            {districtBlocks.map(blk => (
              <button
                key={blk}
                onClick={() => handleBlockChange(blk)}
                style={{
                  background: activeBlock === blk ? 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)' : 'transparent',
                  color: activeBlock === blk ? '#fff' : 'rgba(255,255,255,0.7)',
                  border: 'none',
                  padding: 'calc(5 * var(--u)) calc(12 * var(--u))',
                  borderRadius: 'calc(14 * var(--u))',
                  fontSize: 'calc(11.5 * var(--u))',
                  fontWeight: activeBlock === blk ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: activeBlock === blk ? '0 calc(2 * var(--u)) calc(8 * var(--u)) rgba(56, 189, 248, 0.35)' : 'none'
                }}
              >
                {blk}
              </button>
            ))}
          </div>

          {/* 2. Interactive Block Input with Datalist & Live Auto-Update */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              type="text"
              list="wb-all-blocks-list"
              placeholder="Search / Give Block..."
              value={activeBlock}
              onChange={(e) => handleBlockChange(e.target.value)}
              style={{
                background: 'rgba(15,23,42,0.85)',
                border: '1px solid rgba(56,189,248,0.4)',
                borderRadius: 'calc(14 * var(--u))',
                color: '#ffffff',
                padding: 'calc(5 * var(--u)) calc(12 * var(--u))',
                fontSize: 'calc(11.5 * var(--u))',
                fontWeight: 600,
                width: 'calc(165 * var(--u))',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.35)'
              }}
            />
            <datalist id="wb-all-blocks-list">
              <option value="Mahishadal" />
              <option value="Polba-Dadpur" />
              <option value="Chinsurah-Mogra" />
              <option value="Singur" />
              <option value="Haripal" />
              <option value="Tamluk" />
              <option value="Haldia" />
              <option value="Nandigram-I" />
              <option value="Krishnanagar-I" />
              <option value="Burdwan-I" />
              <option value="Uluberia-I" />
              <option value="Barasat-I" />
              <option value="Baruipur" />
            </datalist>
          </div>

          {/* 3. Live Auto-Updating Panchayat Count Badge */}
          <div style={{
            background: 'rgba(34,197,94,0.14)',
            border: '1px solid rgba(34,197,94,0.38)',
            borderRadius: 'calc(18 * var(--u))',
            padding: 'calc(6 * var(--u)) calc(12 * var(--u))',
            fontSize: 'calc(11.5 * var(--u))',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(6 * var(--u))',
            color: '#4ade80',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            <span style={{ width: 'calc(7 * var(--u))', height: 'calc(7 * var(--u))', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
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
            title={showNodePins ? "Hide AWS Sensor Station Pin Markers" : "Show AWS Sensor Station Pin Markers"}
            style={{
              background: showNodePins ? 'rgba(56, 189, 248, 0.22)' : 'rgba(255,255,255,0.06)',
              color: showNodePins ? '#38bdf8' : 'rgba(255,255,255,0.6)',
              border: showNodePins ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.12)',
              padding: 'calc(5 * var(--u)) calc(10 * var(--u))',
              borderRadius: 'calc(8 * var(--u))',
              fontSize: 'calc(11 * var(--u))',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(5 * var(--u))',
              boxShadow: showNodePins ? '0 0 10px rgba(56, 189, 248, 0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <MapPin size={12} color={showNodePins ? '#38bdf8' : 'currentColor'} />
            AWS Sensor Pins {showNodePins ? '✓' : ''}
          </button>

          <button
            onClick={() => setShowFlowStreamlines(prev => !prev)}
            title={showFlowStreamlines ? "Hide Atmospheric Flow Vectors" : "Show Atmospheric Flow Vectors"}
            style={{
              background: showFlowStreamlines ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255,255,255,0.06)',
              color: showFlowStreamlines ? '#c084fc' : 'rgba(255,255,255,0.6)',
              border: showFlowStreamlines ? '1.5px solid #c084fc' : '1px solid rgba(255,255,255,0.12)',
              padding: 'calc(5 * var(--u)) calc(10 * var(--u))',
              borderRadius: 'calc(8 * var(--u))',
              fontSize: 'calc(11 * var(--u))',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(5 * var(--u))',
              boxShadow: showFlowStreamlines ? '0 0 10px rgba(168, 85, 247, 0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Compass size={12} color={showFlowStreamlines ? '#c084fc' : 'currentColor'} />
            Dynamic Vectors {showFlowStreamlines ? '✓' : ''}
          </button>

          {/* Map View Color Dark / Light Mode Toggle */}
          <button
            onClick={() => {
              if (mapTheme === 'dark') {
                setMapTheme('light')
                setTileType('google')
              } else {
                setMapTheme('dark')
                setTileType('dark')
              }
            }}
            title={`Switch to ${mapTheme === 'dark' ? 'Light (Google Maps)' : 'Dark Map'}`}
            style={{
              background: mapTheme === 'light' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.08)',
              color: mapTheme === 'light' ? '#fcd34d' : 'rgba(255,255,255,0.85)',
              border: mapTheme === 'light' ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(255,255,255,0.15)',
              padding: 'calc(5 * var(--u)) calc(10 * var(--u))',
              borderRadius: 'calc(8 * var(--u))',
              fontSize: 'calc(11 * var(--u))',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'calc(5 * var(--u))',
              transition: 'all 0.2s ease'
            }}
          >
            {mapTheme === 'dark' ? <Sun size={12} color="#fbbf24" /> : <Moon size={12} color="#93c5fd" />}
            <span>{mapTheme === 'dark' ? 'Google Light' : 'Dark Map'}</span>
          </button>
        </div>
      </div>

      {/* 3. Main Geospatial Area: 2-Column Split Layout */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        gap: 'calc(16 * var(--u))',
        overflow: 'hidden'
      }}>
        {/* LEFT COLUMN: Geospatial Map Canvas (Clean, Dedicated, Unobstructed) */}
        <div style={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          position: 'relative',
          borderRadius: 'calc(18 * var(--u))',
          border: '1px solid rgba(255,255,255,0.12)',
          overflow: 'hidden',
          boxShadow: '0 calc(8 * var(--u)) calc(24 * var(--u)) rgba(0,0,0,0.4)',
          background: mapTheme === 'dark' ? '#0b132b' : '#f8fafc'
        }}>
          {/* Leaflet map fills 100% of left column - absolute inset 0 prevents partial canvas collapse */}
          <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <LeafletMap
              panchayats={panchayats}
              activeLayer={activeLayer}
              selectedPanchayatId={selectedPanchayatId}
              showPopupModal={showPopupModal}
              onSelect={handleSelectPanchayat}
              activeBlock={activeBlock}
              showNodePins={showNodePins}
              showFlowStreamlines={showFlowStreamlines}
              activeLayerId={activeLayerId}
              mapTheme={mapTheme}
              tileType={tileType}
            />
          </div>

          {/* Location Badge (Top-Left) */}
          <div style={{
            position: 'absolute',
            top: 'calc(14 * var(--u))',
            left: 'calc(14 * var(--u))',
            zIndex: 20,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(6 * var(--u))',
            background: mapTheme === 'light' ? 'rgba(255,255,255,0.92)' : 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(12px)',
            border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.14)',
            borderRadius: 'calc(10 * var(--u))',
            padding: 'calc(5 * var(--u)) calc(12 * var(--u))',
            fontSize: 'calc(11.5 * var(--u))',
            color: mapTheme === 'light' ? '#0f172a' : 'rgba(255,255,255,0.9)',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <MapPin size={13} style={{ color: '#0284c7' }} />
            West Bengal · {effectiveDistrict} · {activeBlock} Block
          </div>

          {/* Map View Switcher: Google Map / Satellite / Dark Mode (Top-Right) */}
          <div style={{
            position: 'absolute',
            top: 'calc(14 * var(--u))',
            right: 'calc(14 * var(--u))',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            background: mapTheme === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(14px)',
            border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.18)',
            borderRadius: 'calc(10 * var(--u))',
            padding: 'calc(3 * var(--u))',
            gap: 'calc(3 * var(--u))',
            boxShadow: '0 4px 14px rgba(0,0,0,0.35)'
          }}>
            <button
              onClick={() => { setTileType('google'); setMapTheme('light'); }}
              title="Google Maps Roadmap (Real Google Maps with roads & towns)"
              style={{
                background: (mapTheme === 'light' && tileType !== 'satellite') ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
                color: (mapTheme === 'light' && tileType !== 'satellite') ? '#fff' : (mapTheme === 'light' ? '#475569' : 'rgba(255,255,255,0.7)'),
                border: 'none',
                padding: 'calc(4 * var(--u)) calc(8 * var(--u))',
                borderRadius: 'calc(7 * var(--u))',
                fontSize: 'calc(10.5 * var(--u))',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(4 * var(--u))',
                transition: 'all 0.18s ease'
              }}
            >
              <Sun size={11} /> Google Map
            </button>
            <button
              onClick={() => { setTileType('satellite'); setMapTheme('dark'); }}
              title="Google Satellite Hybrid Imagery"
              style={{
                background: tileType === 'satellite' ? 'linear-gradient(135deg, #059669, #10b981)' : 'transparent',
                color: tileType === 'satellite' ? '#fff' : (mapTheme === 'light' ? '#475569' : 'rgba(255,255,255,0.7)'),
                border: 'none',
                padding: 'calc(4 * var(--u)) calc(8 * var(--u))',
                borderRadius: 'calc(7 * var(--u))',
                fontSize: 'calc(10.5 * var(--u))',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(4 * var(--u))',
                transition: 'all 0.18s ease'
              }}
            >
              <Globe size={11} /> Satellite
            </button>
            <button
              onClick={() => { setTileType('dark'); setMapTheme('dark'); }}
              title="Dark Matter Map Mode"
              style={{
                background: (mapTheme === 'dark' && tileType !== 'satellite') ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: (mapTheme === 'dark' && tileType !== 'satellite') ? '#fff' : (mapTheme === 'light' ? '#475569' : 'rgba(255,255,255,0.7)'),
                border: 'none',
                padding: 'calc(4 * var(--u)) calc(8 * var(--u))',
                borderRadius: 'calc(7 * var(--u))',
                fontSize: 'calc(10.5 * var(--u))',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(4 * var(--u))',
                transition: 'all 0.18s ease'
              }}
            >
              <Moon size={11} /> Dark
            </button>
          </div>

          {/* In-Map Bottom Analytics Bar Chart Drawer */}
          {showBottomBarDrawer && (
            <div style={{
              position: 'absolute',
              bottom: 'calc(80 * var(--u))',
              left: 'calc(14 * var(--u))',
              right: 'calc(14 * var(--u))',
              zIndex: 25,
              background: mapTheme === 'light' ? 'rgba(255, 255, 255, 0.96)' : 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(20px)',
              border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'calc(14 * var(--u))',
              padding: 'calc(12 * var(--u)) calc(16 * var(--u))',
              boxShadow: '0 calc(8 * var(--u)) calc(28 * var(--u)) rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'calc(8 * var(--u))',
              animation: 'fadeInSlide 0.25s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'calc(12 * var(--u))', fontWeight: 700, color: mapTheme === 'light' ? '#0f172a' : '#fff', display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
                  <BarChart2 size={14} color="#0284c7" />
                  Live Panchayat {activeLayer.label} Comparison Across {activeBlock}
                </span>
                <button
                  onClick={() => setShowBottomBarDrawer(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    fontSize: 'calc(11 * var(--u))',
                    fontWeight: 600
                  }}
                >
                  ✕ Close
                </button>
              </div>

              {/* Horizontal Comparison Bars */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(calc(120 * var(--u)), 1fr))', gap: 'calc(8 * var(--u))' }}>
                {panchayats.map(p => {
                  const isSelected = p.id === selectedPanchayatId
                  const val = activeLayerId === 'rainfall' ? p.rainfall 
                    : activeLayerId === 'temp' ? p.temp 
                    : activeLayerId === 'humidity' ? p.humidity 
                    : p.windSpeed

                  const maxVal = Math.max(...panchayats.map(x => (
                    activeLayerId === 'rainfall' ? x.rainfall 
                    : activeLayerId === 'temp' ? x.temp 
                    : activeLayerId === 'humidity' ? x.humidity 
                    : x.windSpeed
                  ))) || 1

                  const pct = Math.min(100, Math.max(14, Math.round((val / maxVal) * 100)))

                  return (
                    <div
                      key={`inmap-bar-${p.id}`}
                      onClick={() => handleSelectPanchayat(p.id)}
                      title={`Click to pinpoint ${p.name}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'calc(4 * var(--u))',
                        cursor: 'pointer',
                        padding: 'calc(6 * var(--u)) calc(8 * var(--u))',
                        borderRadius: 'calc(8 * var(--u))',
                        background: isSelected ? 'rgba(56, 189, 248, 0.16)' : (mapTheme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)'),
                        border: isSelected ? '1.5px solid #0284c7' : '1px solid transparent',
                        transition: 'all 0.18s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'calc(11 * var(--u))' }}>
                        <span style={{ fontWeight: isSelected ? 700 : 600, color: mapTheme === 'light' ? '#0f172a' : '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.name}
                        </span>
                        <span style={{ fontWeight: 700, color: '#0284c7', fontSize: 'calc(10.5 * var(--u))' }}>
                          {activeLayer.formatValue(p)}
                        </span>
                      </div>
                      <div style={{ height: 'calc(6 * var(--u))', borderRadius: 'calc(3 * var(--u))', background: 'rgba(150,150,150,0.2)', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: activeLayer.getStroke(p), borderRadius: 'calc(3 * var(--u))', transition: 'width 0.35s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Dynamic Map Legend & In-Map Bar Chart Toggle (Bottom-Left) */}
          <div style={{
            position: 'absolute',
            bottom: 'calc(14 * var(--u))',
            left: 'calc(14 * var(--u))',
            zIndex: 20,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 'calc(8 * var(--u))'
          }}>
            {/* Color Legend Card */}
            <div style={{
              background: mapTheme === 'light' ? 'rgba(255, 255, 255, 0.94)' : 'rgba(15, 23, 42, 0.90)',
              backdropFilter: 'blur(16px)',
              border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.14)',
              borderRadius: 'calc(12 * var(--u))',
              padding: 'calc(8 * var(--u)) calc(12 * var(--u))',
              width: 'calc(250 * var(--u))',
              boxShadow: '0 calc(6 * var(--u)) calc(20 * var(--u)) rgba(0,0,0,0.4)',
              color: mapTheme === 'light' ? '#0f172a' : '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(4 * var(--u))' }}>
                <div style={{ fontSize: 'calc(11.5 * var(--u))', fontWeight: 700, color: mapTheme === 'light' ? '#0f172a' : '#fff', display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
                  <activeLayer.icon size={13} color="#0284c7" />
                  {activeLayer.legend.title}
                </div>
                <span style={{ fontSize: 'calc(10 * var(--u))', color: mapTheme === 'light' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                  {activeLayer.legend.unit}
                </span>
              </div>

              {/* Color Gradient Scale */}
              <div style={{
                height: 'calc(6 * var(--u))',
                borderRadius: 'calc(3 * var(--u))',
                background: activeLayer.legend.gradient,
                marginBottom: 'calc(4 * var(--u))',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
              }} />

              {/* Interval Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                {activeLayer.legend.steps.map((step, idx) => (
                  <div key={idx} style={{ textAlign: idx === 0 ? 'left' : idx === activeLayer.legend.steps.length - 1 ? 'right' : 'center' }}>
                    <div>{step.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Map Bar Chart Toggle Button */}
            <button
              onClick={() => setShowBottomBarDrawer(d => !d)}
              style={{
                background: showBottomBarDrawer ? 'linear-gradient(135deg, #0284c7, #2563eb)' : (mapTheme === 'light' ? 'rgba(255,255,255,0.92)' : 'rgba(15,23,42,0.90)'),
                color: showBottomBarDrawer ? '#fff' : (mapTheme === 'light' ? '#0f172a' : '#fff'),
                border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.14)',
                borderRadius: 'calc(12 * var(--u))',
                padding: 'calc(8 * var(--u)) calc(12 * var(--u))',
                fontSize: 'calc(11 * var(--u))',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'calc(6 * var(--u))',
                boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <BarChart2 size={13} />
              {showBottomBarDrawer ? 'Hide Map Bars' : '📊 Compare Bars'}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Dedicated Intelligence & Analytical Features Sidebar */}
        <div style={{
          width: 'calc(380 * var(--u))',
          minWidth: 'calc(320 * var(--u))',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'calc(12 * var(--u))',
          overflowY: 'auto',
          paddingRight: 'calc(4 * var(--u))',
          flexShrink: 0
        }}>
          {/* Top Tab Bar: Bars vs Details vs Summary */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(4 * var(--u))',
            background: mapTheme === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.12)',
            borderRadius: 'calc(12 * var(--u))',
            padding: 'calc(4 * var(--u))',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <button
              onClick={() => setRightPanelTab('bars')}
              style={{
                flex: 1,
                padding: 'calc(7 * var(--u)) calc(6 * var(--u))',
                borderRadius: 'calc(8 * var(--u))',
                border: 'none',
                background: rightPanelTab === 'bars' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
                color: rightPanelTab === 'bars' ? '#ffffff' : (mapTheme === 'light' ? '#334155' : 'rgba(255,255,255,0.7)'),
                fontSize: 'calc(11 * var(--u))',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'calc(5 * var(--u))',
                boxShadow: rightPanelTab === 'bars' ? '0 2px 8px rgba(2,132,199,0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <BarChart2 size={13} />
              Bar Chart
            </button>
            <button
              onClick={() => setRightPanelTab('details')}
              style={{
                flex: 1,
                padding: 'calc(7 * var(--u)) calc(6 * var(--u))',
                borderRadius: 'calc(8 * var(--u))',
                border: 'none',
                background: rightPanelTab === 'details' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
                color: rightPanelTab === 'details' ? '#ffffff' : (mapTheme === 'light' ? '#334155' : 'rgba(255,255,255,0.7)'),
                fontSize: 'calc(11 * var(--u))',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'calc(5 * var(--u))',
                boxShadow: rightPanelTab === 'details' ? '0 2px 8px rgba(2,132,199,0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <MapPin size={13} />
              Node Details
            </button>
            <button
              onClick={() => setRightPanelTab('summary')}
              style={{
                flex: 1,
                padding: 'calc(7 * var(--u)) calc(6 * var(--u))',
                borderRadius: 'calc(8 * var(--u))',
                border: 'none',
                background: rightPanelTab === 'summary' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
                color: rightPanelTab === 'summary' ? '#ffffff' : (mapTheme === 'light' ? '#334155' : 'rgba(255,255,255,0.7)'),
                fontSize: 'calc(11 * var(--u))',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'calc(5 * var(--u))',
                boxShadow: rightPanelTab === 'summary' ? '0 2px 8px rgba(2,132,199,0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Activity size={13} />
              Block Overview
            </button>
          </div>

          {/* TAB 1: Panchayat Comparison Bar Chart (Default Active View) */}
          {rightPanelTab === 'bars' && (
            <>
              <div style={{
                background: mapTheme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.90)',
                backdropFilter: 'blur(16px)',
                border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'calc(14 * var(--u))',
                padding: 'calc(12 * var(--u)) calc(14 * var(--u))',
                display: 'flex',
                flexDirection: 'column',
                gap: 'calc(8 * var(--u))',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'calc(12 * var(--u))', fontWeight: 700, color: mapTheme === 'light' ? '#0f172a' : '#fff', display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
                    <BarChart2 size={15} color="#0284c7" />
                    Panchayat {activeLayer.label} Comparison
                  </span>
                  <span style={{ fontSize: 'calc(10 * var(--u))', color: mapTheme === 'light' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                    {activeBlock} Block
                  </span>
                </div>

                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', marginBottom: 'calc(2 * var(--u))' }}>
                  Showing comparative telemetry across all {panchayats.length} panchayats. Click any bar to pinpoint on map.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(6 * var(--u))' }}>
                  {panchayats.map(p => {
                    const isSelected = p.id === selectedPanchayatId
                    const val = activeLayerId === 'rainfall' ? p.rainfall 
                      : activeLayerId === 'temp' ? p.temp 
                      : activeLayerId === 'humidity' ? p.humidity 
                      : p.windSpeed

                    const maxVal = Math.max(...panchayats.map(x => (
                      activeLayerId === 'rainfall' ? x.rainfall 
                      : activeLayerId === 'temp' ? x.temp 
                      : activeLayerId === 'humidity' ? x.humidity 
                      : x.windSpeed
                    ))) || 1

                    const pct = Math.min(100, Math.max(12, Math.round((val / maxVal) * 100)))

                    return (
                      <div
                        key={`barchart-${p.id}`}
                        onClick={() => handleSelectPanchayat(p.id)}
                        title={`Click to pinpoint ${p.name} on map`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'calc(8 * var(--u))',
                          cursor: 'pointer',
                          padding: 'calc(6 * var(--u)) calc(8 * var(--u))',
                          borderRadius: 'calc(8 * var(--u))',
                          background: isSelected 
                            ? (mapTheme === 'light' ? 'rgba(2, 132, 199, 0.12)' : 'rgba(56, 189, 248, 0.14)')
                            : (mapTheme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'),
                          border: isSelected 
                            ? (mapTheme === 'light' ? '1.5px solid #0284c7' : '1px solid rgba(56, 189, 248, 0.4)')
                            : '1px solid transparent',
                          transition: 'all 0.18s ease'
                        }}
                      >
                        <span style={{
                          width: 'calc(85 * var(--u))',
                          fontSize: 'calc(11 * var(--u))',
                          color: isSelected 
                            ? (mapTheme === 'light' ? '#0284c7' : '#ffffff')
                            : (mapTheme === 'light' ? '#1e293b' : 'rgba(255,255,255,0.8)'),
                          fontWeight: isSelected ? 700 : 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {p.name}
                        </span>

                        {/* Progress Bar Container */}
                        <div style={{
                          flex: 1,
                          height: 'calc(8 * var(--u))',
                          borderRadius: 'calc(4 * var(--u))',
                          background: mapTheme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          <div style={{
                            width: `${pct}%`,
                            height: '100%',
                            borderRadius: 'calc(4 * var(--u))',
                            background: isSelected ? 'linear-gradient(90deg, #38bdf8, #2563eb)' : activeLayer.getStroke(p),
                            boxShadow: isSelected ? '0 0 8px rgba(56, 189, 248, 0.5)' : 'none',
                            transition: 'width 0.4s ease'
                          }} />
                        </div>

                        <span style={{
                          width: 'calc(56 * var(--u))',
                          textAlign: 'right',
                          fontSize: 'calc(11 * var(--u))',
                          fontWeight: 700,
                          color: isSelected 
                            ? '#0284c7'
                            : (mapTheme === 'light' ? '#334155' : 'rgba(255,255,255,0.9)')
                        }}>
                          {activeLayer.formatValue(p)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Compact Selected Node Strip */}
              {selectedPanchayat && (
                <div style={{
                  background: mapTheme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.85)',
                  border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 'calc(14 * var(--u))',
                  padding: 'calc(12 * var(--u))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'calc(8 * var(--u))'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Active Node Telemetry
                      </div>
                      <div style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 700, color: mapTheme === 'light' ? '#0f172a' : '#fff' }}>
                        {selectedPanchayat.name} ({selectedPanchayat.block})
                      </div>
                    </div>
                    <span style={{
                      fontSize: 'calc(9.5 * var(--u))',
                      padding: 'calc(2 * var(--u)) calc(6 * var(--u))',
                      borderRadius: 'calc(6 * var(--u))',
                      background: selectedPanchayat.riskLevel === 'Low' ? 'rgba(34,197,94,0.15)' : selectedPanchayat.riskLevel === 'Moderate' ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)',
                      color: selectedPanchayat.riskLevel === 'Low' ? '#16a34a' : selectedPanchayat.riskLevel === 'Moderate' ? '#ca8a04' : '#dc2626',
                      fontWeight: 700
                    }}>
                      {selectedPanchayat.riskLevel} Risk
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'calc(6 * var(--u))' }}>
                    <div style={{ background: mapTheme === 'light' ? 'rgba(2,132,199,0.06)' : 'rgba(255,255,255,0.04)', borderRadius: 'calc(8 * var(--u))', padding: 'calc(6 * var(--u))', textAlign: 'center' }}>
                      <div style={{ fontSize: 'calc(9 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)' }}>Rain</div>
                      <div style={{ fontSize: 'calc(11.5 * var(--u))', fontWeight: 700, color: '#0284c7' }}>{selectedPanchayat.rainfall}mm</div>
                    </div>
                    <div style={{ background: mapTheme === 'light' ? 'rgba(249,115,22,0.06)' : 'rgba(255,255,255,0.04)', borderRadius: 'calc(8 * var(--u))', padding: 'calc(6 * var(--u))', textAlign: 'center' }}>
                      <div style={{ fontSize: 'calc(9 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)' }}>Temp</div>
                      <div style={{ fontSize: 'calc(11.5 * var(--u))', fontWeight: 700, color: '#ea580c' }}>{selectedPanchayat.temp}°C</div>
                    </div>
                    <div style={{ background: mapTheme === 'light' ? 'rgba(37,99,235,0.06)' : 'rgba(255,255,255,0.04)', borderRadius: 'calc(8 * var(--u))', padding: 'calc(6 * var(--u))', textAlign: 'center' }}>
                      <div style={{ fontSize: 'calc(9 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)' }}>Humid</div>
                      <div style={{ fontSize: 'calc(11.5 * var(--u))', fontWeight: 700, color: '#2563eb' }}>{selectedPanchayat.humidity}%</div>
                    </div>
                    <div style={{ background: mapTheme === 'light' ? 'rgba(202,138,4,0.06)' : 'rgba(255,255,255,0.04)', borderRadius: 'calc(8 * var(--u))', padding: 'calc(6 * var(--u))', textAlign: 'center' }}>
                      <div style={{ fontSize: 'calc(9 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)' }}>Wind</div>
                      <div style={{ fontSize: 'calc(11.5 * var(--u))', fontWeight: 700, color: '#ca8a04' }}>{selectedPanchayat.windSpeed}k</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setRightPanelTab('details')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: 'calc(11 * var(--u))',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center',
                      padding: 'calc(4 * var(--u)) 0',
                      textDecoration: 'underline'
                    }}
                  >
                    View Full Advisory & Node Telemetry →
                  </button>
                </div>
              )}
            </>
          )}

          {/* TAB 2: Selected Panchayat Detailed Intelligence Card */}
          {rightPanelTab === 'details' && (
            <>
              {/* Quick Selector Pills */}
              <div style={{
                background: mapTheme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.78)',
                backdropFilter: 'blur(16px)',
                border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'calc(14 * var(--u))',
                padding: 'calc(10 * var(--u)) calc(12 * var(--u))',
                display: 'flex',
                flexDirection: 'column',
                gap: 'calc(6 * var(--u))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'calc(10.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Select Panchayat ({panchayats.length})
                  </span>
                  <span style={{ fontSize: 'calc(10.5 * var(--u))', color: '#0284c7', fontWeight: 600 }}>
                    Active: {selectedPanchayat?.name}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'calc(6 * var(--u))' }}>
                  {panchayats.map(p => {
                    const isSelected = p.id === selectedPanchayatId
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPanchayat(p.id)}
                        style={{
                          background: isSelected ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : (mapTheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)'),
                          color: isSelected ? '#ffffff' : (mapTheme === 'light' ? '#1e293b' : 'rgba(255,255,255,0.8)'),
                          border: isSelected ? '1px solid #0284c7' : (mapTheme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)'),
                          borderRadius: 'calc(10 * var(--u))',
                          padding: 'calc(5 * var(--u)) calc(10 * var(--u))',
                          fontSize: 'calc(11 * var(--u))',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'calc(5 * var(--u))',
                          transition: 'all 0.18s ease'
                        }}
                      >
                        <span style={{
                          width: 'calc(6 * var(--u))',
                          height: 'calc(6 * var(--u))',
                          borderRadius: '50%',
                          background: activeLayer.getStroke(p)
                        }} />
                        {p.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedPanchayat && (
                <div style={{
                  background: mapTheme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'linear-gradient(180deg, rgba(15, 23, 42, 0.94) 0%, rgba(2, 6, 23, 0.98) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.14)',
                  borderRadius: 'calc(16 * var(--u))',
                  padding: 'calc(16 * var(--u))',
                  boxShadow: '0 calc(8 * var(--u)) calc(24 * var(--u)) rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'calc(10 * var(--u))'
                }}>
                  {/* Card Header */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(4 * var(--u))' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
                        <span style={{
                          background: 'rgba(56, 189, 248, 0.2)',
                          color: '#0284c7',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          padding: 'calc(2 * var(--u)) calc(6 * var(--u))',
                          borderRadius: 'calc(6 * var(--u))',
                          fontSize: 'calc(9.5 * var(--u))',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          Panchayat Node
                        </span>
                        <span style={{ fontSize: 'calc(11 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)' }}>
                          {selectedPanchayat.block}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 'calc(10 * var(--u))',
                        padding: 'calc(2 * var(--u)) calc(8 * var(--u))',
                        borderRadius: 'calc(10 * var(--u))',
                        background: selectedPanchayat.riskLevel === 'Low' ? 'rgba(34,197,94,0.2)' : selectedPanchayat.riskLevel === 'Moderate' ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)',
                        color: selectedPanchayat.riskLevel === 'Low' ? '#16a34a' : selectedPanchayat.riskLevel === 'Moderate' ? '#ca8a04' : '#dc2626',
                        border: `1px solid ${selectedPanchayat.riskLevel === 'Low' ? 'rgba(34,197,94,0.4)' : selectedPanchayat.riskLevel === 'Moderate' ? 'rgba(234,179,8,0.4)' : 'rgba(239,68,68,0.4)'}`,
                        fontWeight: 700
                      }}>
                        {selectedPanchayat.riskLevel} Risk
                      </span>
                    </div>
                    <h2 style={{ fontSize: 'calc(20 * var(--u))', fontWeight: 700, margin: 0, color: mapTheme === 'light' ? '#0f172a' : '#ffffff' }}>
                      {selectedPanchayat.name}
                    </h2>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.6)', marginTop: 'calc(2 * var(--u))' }}>
                      Lat: {selectedPanchayat.lat.toFixed(3)}°N • Lng: {selectedPanchayat.lng.toFixed(3)}°E
                    </div>
                  </div>

                  {/* Active Layer Hero Banner */}
                  {activeLayerId === 'rainfall' && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: 'calc(14 * var(--u))',
                      padding: 'calc(12 * var(--u))'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(4 * var(--u))' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', fontSize: 'calc(11.5 * var(--u))', color: '#0284c7', fontWeight: 600 }}>
                          <CloudRain size={15} /> 24h Precipitation
                        </div>
                        <span style={{
                          background: 'rgba(56, 189, 248, 0.25)',
                          color: '#0284c7',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          padding: 'calc(2 * var(--u)) calc(6 * var(--u))',
                          borderRadius: 'calc(6 * var(--u))',
                          fontSize: 'calc(9.5 * var(--u))',
                          fontWeight: 700
                        }}>
                          {selectedPanchayat.rainProb}% Prob
                        </span>
                      </div>
                      <div style={{ fontSize: 'calc(26 * var(--u))', fontWeight: 800, color: mapTheme === 'light' ? '#0f172a' : '#ffffff', letterSpacing: '-0.5px' }}>
                        {selectedPanchayat.rainfall} <span style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 500, color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.7)' }}>mm</span>
                      </div>
                      <div style={{ fontSize: 'calc(11 * var(--u))', color: mapTheme === 'light' ? '#334155' : 'rgba(255,255,255,0.8)', marginTop: 'calc(3 * var(--u))' }}>
                        Status: <b style={{ color: '#0284c7' }}>{selectedPanchayat.rainfallStatus}</b>
                      </div>
                    </div>
                  )}

                  {activeLayerId === 'temp' && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                      borderRadius: 'calc(14 * var(--u))',
                      padding: 'calc(12 * var(--u))'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(4 * var(--u))' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', fontSize: 'calc(11.5 * var(--u))', color: '#ea580c', fontWeight: 600 }}>
                          <Thermometer size={15} /> Surface Temperature
                        </div>
                        <span style={{
                          background: 'rgba(249, 115, 22, 0.25)',
                          color: '#ea580c',
                          border: '1px solid rgba(249, 115, 22, 0.4)',
                          padding: 'calc(2 * var(--u)) calc(6 * var(--u))',
                          borderRadius: 'calc(6 * var(--u))',
                          fontSize: 'calc(9.5 * var(--u))',
                          fontWeight: 700
                        }}>
                          Feels: {selectedPanchayat.feelsLike}°C
                        </span>
                      </div>
                      <div style={{ fontSize: 'calc(26 * var(--u))', fontWeight: 800, color: mapTheme === 'light' ? '#0f172a' : '#ffffff', letterSpacing: '-0.5px' }}>
                        {selectedPanchayat.temp} <span style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 500, color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.7)' }}>°C</span>
                      </div>
                      <div style={{ fontSize: 'calc(11 * var(--u))', color: mapTheme === 'light' ? '#334155' : 'rgba(255,255,255,0.8)', marginTop: 'calc(3 * var(--u))' }}>
                        Heat Index: <b style={{ color: '#ea580c' }}>{selectedPanchayat.temp >= 33 ? 'Elevated Heat Stress' : 'Comfortable Range'}</b>
                      </div>
                    </div>
                  )}

                  {activeLayerId === 'humidity' && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: 'calc(14 * var(--u))',
                      padding: 'calc(12 * var(--u))'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(4 * var(--u))' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', fontSize: 'calc(11.5 * var(--u))', color: '#2563eb', fontWeight: 600 }}>
                          <Droplets size={15} /> Relative Humidity
                        </div>
                        <span style={{
                          background: 'rgba(59, 130, 246, 0.25)',
                          color: '#2563eb',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          padding: 'calc(2 * var(--u)) calc(6 * var(--u))',
                          borderRadius: 'calc(6 * var(--u))',
                          fontSize: 'calc(9.5 * var(--u))',
                          fontWeight: 700
                        }}>
                          Dew Pt: {selectedPanchayat.dewPoint}°C
                        </span>
                      </div>
                      <div style={{ fontSize: 'calc(26 * var(--u))', fontWeight: 800, color: mapTheme === 'light' ? '#0f172a' : '#ffffff', letterSpacing: '-0.5px' }}>
                        {selectedPanchayat.humidity} <span style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 500, color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.7)' }}>%</span>
                      </div>
                      <div style={{ fontSize: 'calc(11 * var(--u))', color: mapTheme === 'light' ? '#334155' : 'rgba(255,255,255,0.8)', marginTop: 'calc(3 * var(--u))' }}>
                        Moisture: <b style={{ color: '#2563eb' }}>{selectedPanchayat.humidity >= 85 ? 'High Vapor Saturation' : 'Moderate Moisture'}</b>
                      </div>
                    </div>
                  )}

                  {activeLayerId === 'wind' && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(202, 138, 4, 0.08) 100%)',
                      border: '1px solid rgba(234, 179, 8, 0.3)',
                      borderRadius: 'calc(14 * var(--u))',
                      padding: 'calc(12 * var(--u))'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(4 * var(--u))' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', fontSize: 'calc(11.5 * var(--u))', color: '#ca8a04', fontWeight: 600 }}>
                          <Wind size={15} /> Sustained Wind Speed
                        </div>
                        <span style={{
                          background: 'rgba(234, 179, 8, 0.25)',
                          color: '#ca8a04',
                          border: '1px solid rgba(234, 179, 8, 0.4)',
                          padding: 'calc(2 * var(--u)) calc(6 * var(--u))',
                          borderRadius: 'calc(6 * var(--u))',
                          fontSize: 'calc(9.5 * var(--u))',
                          fontWeight: 700
                        }}>
                          Gusts: {selectedPanchayat.windGust} km/h
                        </span>
                      </div>
                      <div style={{ fontSize: 'calc(26 * var(--u))', fontWeight: 800, color: mapTheme === 'light' ? '#0f172a' : '#ffffff', letterSpacing: '-0.5px' }}>
                        {selectedPanchayat.windSpeed} <span style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 500, color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.7)' }}>km/h</span>
                      </div>
                      <div style={{ fontSize: 'calc(11 * var(--u))', color: mapTheme === 'light' ? '#334155' : 'rgba(255,255,255,0.8)', marginTop: 'calc(3 * var(--u))' }}>
                        Direction: <b style={{ color: '#ca8a04' }}>{selectedPanchayat.windDirection} ({selectedPanchayat.windDegree}°)</b>
                      </div>
                    </div>
                  )}

                  {/* 4-Parameter Telemetry Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 'calc(8 * var(--u))'
                  }}>
                    <div style={{ background: mapTheme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)', border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                      <div style={{ fontSize: 'calc(10 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Rainfall 24h</div>
                      <div style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 700, color: '#0284c7', marginTop: 'calc(2 * var(--u))' }}>{selectedPanchayat.rainfall} mm</div>
                      <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#94a3b8' : 'rgba(255,255,255,0.45)' }}>{selectedPanchayat.soilMoisture}</div>
                    </div>
                    <div style={{ background: mapTheme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)', border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                      <div style={{ fontSize: 'calc(10 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Temperature</div>
                      <div style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 700, color: '#ea580c', marginTop: 'calc(2 * var(--u))' }}>{selectedPanchayat.temp}°C</div>
                      <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#94a3b8' : 'rgba(255,255,255,0.45)' }}>Feels {selectedPanchayat.feelsLike}°C</div>
                    </div>
                    <div style={{ background: mapTheme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)', border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                      <div style={{ fontSize: 'calc(10 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Humidity</div>
                      <div style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 700, color: '#2563eb', marginTop: 'calc(2 * var(--u))' }}>{selectedPanchayat.humidity}%</div>
                      <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#94a3b8' : 'rgba(255,255,255,0.45)' }}>Dew Pt {selectedPanchayat.dewPoint}°C</div>
                    </div>
                    <div style={{ background: mapTheme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)', border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                      <div style={{ fontSize: 'calc(10 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Surface Wind</div>
                      <div style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 700, color: '#ca8a04', marginTop: 'calc(2 * var(--u))' }}>{selectedPanchayat.windSpeed} km/h</div>
                      <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#94a3b8' : 'rgba(255,255,255,0.45)' }}>Gust {selectedPanchayat.windGust} km/h</div>
                    </div>
                  </div>

                  {/* Advisory Box */}
                  <div style={{
                    background: mapTheme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
                    border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'calc(10 * var(--u))',
                    padding: 'calc(10 * var(--u)) calc(12 * var(--u))',
                    fontSize: 'calc(11 * var(--u))',
                    color: mapTheme === 'light' ? '#334155' : 'rgba(255,255,255,0.8)',
                    lineHeight: 1.45
                  }}>
                    <div style={{ fontWeight: 700, color: '#0284c7', marginBottom: 'calc(3 * var(--u))' }}>
                      Operational Advisory
                    </div>
                    {activeLayerId === 'rainfall' && (
                      selectedPanchayat.rainfall >= 30 
                        ? `Heavy precipitation recorded at ${selectedPanchayat.name}. Soil moisture is ${selectedPanchayat.soilMoisture.toLowerCase()} with waterlogging risk in low-lying crop patches.`
                        : selectedPanchayat.rainfall >= 10
                        ? `Moderate rain active across ${selectedPanchayat.name}. Favorable moisture retention for paddy fields.`
                        : `Dry to light conditions at ${selectedPanchayat.name}. Irrigation schedule remains on standard cycle.`
                    )}
                    {activeLayerId === 'temp' && (
                      selectedPanchayat.temp >= 33
                        ? `Heat stress advisory in effect for ${selectedPanchayat.name}. Peak afternoon temperatures near ${selectedPanchayat.temp}°C.`
                        : `Thermal conditions within safe range across ${selectedPanchayat.name}. Normal field operations suitable.`
                    )}
                    {activeLayerId === 'humidity' && (
                      selectedPanchayat.humidity >= 85
                        ? `Saturated air boundary over ${selectedPanchayat.name}. Elevated fungal spore germination risk.`
                        : `Optimal ambient moisture across ${selectedPanchayat.name} without fog condensation risk.`
                    )}
                    {activeLayerId === 'wind' && (
                      selectedPanchayat.windSpeed >= 25
                        ? `Strong sustained breeze at ${selectedPanchayat.name} with gusts reaching ${selectedPanchayat.windGust} km/h.`
                        : `Moderate to gentle breeze blowing from ${selectedPanchayat.windDirection} across ${selectedPanchayat.name}.`
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 3: Block Aggregated Telemetry Summary */}
          {rightPanelTab === 'summary' && (
            <>
              {/* Quick Selector Pills */}
              <div style={{
                background: mapTheme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.78)',
                backdropFilter: 'blur(16px)',
                border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'calc(14 * var(--u))',
                padding: 'calc(10 * var(--u)) calc(12 * var(--u))',
                display: 'flex',
                flexDirection: 'column',
                gap: 'calc(6 * var(--u))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'calc(10.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Panchayat Nodes ({panchayats.length})
                  </span>
                  <span style={{ fontSize: 'calc(10.5 * var(--u))', color: '#0284c7', fontWeight: 600 }}>
                    {activeBlock} Block
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'calc(6 * var(--u))' }}>
                  {panchayats.map(p => {
                    const isSelected = p.id === selectedPanchayatId
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPanchayat(p.id)}
                        style={{
                          background: isSelected ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : (mapTheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)'),
                          color: isSelected ? '#ffffff' : (mapTheme === 'light' ? '#1e293b' : 'rgba(255,255,255,0.8)'),
                          border: isSelected ? '1px solid #0284c7' : (mapTheme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)'),
                          borderRadius: 'calc(10 * var(--u))',
                          padding: 'calc(5 * var(--u)) calc(10 * var(--u))',
                          fontSize: 'calc(11 * var(--u))',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'calc(5 * var(--u))',
                          transition: 'all 0.18s ease'
                        }}
                      >
                        <span style={{
                          width: 'calc(6 * var(--u))',
                          height: 'calc(6 * var(--u))',
                          borderRadius: '50%',
                          background: activeLayer.getStroke(p)
                        }} />
                        {p.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{
                background: mapTheme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.78)',
                backdropFilter: 'blur(16px)',
                border: mapTheme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'calc(14 * var(--u))',
                padding: 'calc(14 * var(--u))',
                display: 'flex',
                flexDirection: 'column',
                gap: 'calc(10 * var(--u))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'calc(11.5 * var(--u))', fontWeight: 700, color: mapTheme === 'light' ? '#0f172a' : '#fff', display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
                    <Activity size={14} color="#0284c7" />
                    {activeBlock} Block Summary
                  </span>
                  <span style={{ fontSize: 'calc(10 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                    {activeLayer.label} Layer
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'calc(8 * var(--u))' }}>
                  {activeLayerId === 'rainfall' && (
                    <>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(2,132,199,0.06)' : 'rgba(56,189,248,0.08)', border: '1px solid rgba(2,132,199,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Avg Rain</div>
                        <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#0284c7', marginTop: 'calc(2 * var(--u))' }}>{blockStats.avgRain} mm</div>
                      </div>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(37,99,235,0.06)' : 'rgba(96,165,250,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Max Station</div>
                        <div style={{ fontSize: 'calc(12.5 * var(--u))', fontWeight: 700, color: '#2563eb', marginTop: 'calc(2 * var(--u))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {blockStats.maxRainPanchayat ? `${blockStats.maxRainPanchayat.rainfall} mm` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(59,130,246,0.06)' : 'rgba(147,197,253,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Min Station</div>
                        <div style={{ fontSize: 'calc(12.5 * var(--u))', fontWeight: 700, color: '#3b82f6', marginTop: 'calc(2 * var(--u))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {blockStats.minRainPanchayat ? `${blockStats.minRainPanchayat.rainfall} mm` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(2,132,199,0.06)' : 'rgba(56,189,248,0.08)', border: '1px solid rgba(2,132,199,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Wet ≥10mm</div>
                        <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#0284c7', marginTop: 'calc(2 * var(--u))' }}>{blockStats.wetPanchayats} / {panchayats.length}</div>
                      </div>
                    </>
                  )}

                  {activeLayerId === 'temp' && (
                    <>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(234,88,12,0.06)' : 'rgba(249,115,22,0.08)', border: '1px solid rgba(234,88,12,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Avg Temp</div>
                        <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#ea580c', marginTop: 'calc(2 * var(--u))' }}>{blockStats.avgTemp}°C</div>
                      </div>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(249,115,22,0.06)' : 'rgba(251,146,60,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Warmest Node</div>
                        <div style={{ fontSize: 'calc(12.5 * var(--u))', fontWeight: 700, color: '#f97316', marginTop: 'calc(2 * var(--u))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {blockStats.maxTempPanchayat ? `${blockStats.maxTempPanchayat.temp}°C` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(251,146,60,0.06)' : 'rgba(253,186,116,0.08)', border: '1px solid rgba(251,146,60,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Coolest Node</div>
                        <div style={{ fontSize: 'calc(12.5 * var(--u))', fontWeight: 700, color: '#ea580c', marginTop: 'calc(2 * var(--u))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {blockStats.minTempPanchayat ? `${blockStats.minTempPanchayat.temp}°C` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(234,88,12,0.06)' : 'rgba(249,115,22,0.08)', border: '1px solid rgba(234,88,12,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Heat ≥33°C</div>
                        <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#ea580c', marginTop: 'calc(2 * var(--u))' }}>{blockStats.hotPanchayats} / {panchayats.length}</div>
                      </div>
                    </>
                  )}

                  {activeLayerId === 'humidity' && (
                    <>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(37,99,235,0.06)' : 'rgba(59,130,246,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Avg Humidity</div>
                        <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#2563eb', marginTop: 'calc(2 * var(--u))' }}>{blockStats.avgHum}%</div>
                      </div>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(59,130,246,0.06)' : 'rgba(147,197,253,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Peak Moisture</div>
                        <div style={{ fontSize: 'calc(12.5 * var(--u))', fontWeight: 700, color: '#1d4ed8', marginTop: 'calc(2 * var(--u))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {blockStats.maxHumPanchayat ? `${blockStats.maxHumPanchayat.humidity}%` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(96,165,250,0.06)' : 'rgba(191,219,254,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Lowest Hum</div>
                        <div style={{ fontSize: 'calc(12.5 * var(--u))', fontWeight: 700, color: '#2563eb', marginTop: 'calc(2 * var(--u))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {blockStats.minHumPanchayat ? `${blockStats.minHumPanchayat.humidity}%` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(37,99,235,0.06)' : 'rgba(59,130,246,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Saturated ≥85%</div>
                        <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#2563eb', marginTop: 'calc(2 * var(--u))' }}>{blockStats.saturatedPanchayats} / {panchayats.length}</div>
                      </div>
                    </>
                  )}

                  {activeLayerId === 'wind' && (
                    <>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(202,138,4,0.06)' : 'rgba(234,179,8,0.08)', border: '1px solid rgba(202,138,4,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Avg Wind</div>
                        <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#ca8a04', marginTop: 'calc(2 * var(--u))' }}>{blockStats.avgWind} km/h</div>
                      </div>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(234,179,8,0.06)' : 'rgba(253,224,71,0.08)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Max Gust</div>
                        <div style={{ fontSize: 'calc(12.5 * var(--u))', fontWeight: 700, color: '#ca8a04', marginTop: 'calc(2 * var(--u))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {blockStats.maxGustPanchayat ? `${blockStats.maxGustPanchayat.windGust} km/h` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(250,204,21,0.06)' : 'rgba(254,240,138,0.08)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Calmest Node</div>
                        <div style={{ fontSize: 'calc(12.5 * var(--u))', fontWeight: 700, color: '#ca8a04', marginTop: 'calc(2 * var(--u))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {blockStats.minWindPanchayat ? `${blockStats.minWindPanchayat.windSpeed} km/h` : 'N/A'}
                        </div>
                      </div>
                      <div style={{ background: mapTheme === 'light' ? 'rgba(202,138,4,0.06)' : 'rgba(234,179,8,0.08)', border: '1px solid rgba(202,138,4,0.2)', borderRadius: 'calc(10 * var(--u))', padding: 'calc(8 * var(--u)) calc(10 * var(--u))' }}>
                        <div style={{ fontSize: 'calc(9.5 * var(--u))', color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Gust ≥30km/h</div>
                        <div style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 700, color: '#ca8a04', marginTop: 'calc(2 * var(--u))' }}>{blockStats.gustAlertPanchayats} / {panchayats.length}</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Prediction engine sync badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(6 * var(--u))',
                  fontSize: 'calc(10 * var(--u))',
                  color: mapTheme === 'light' ? '#64748b' : 'rgba(255,255,255,0.45)',
                  marginTop: 'calc(2 * var(--u))'
                }}>
                  <span style={{ width: 'calc(6 * var(--u))', height: 'calc(6 * var(--u))', borderRadius: '50%', background: '#0284c7' }} />
                  Active: WRF NetCDF 4km Analog & ONNX ML Engine
                </div>
              </div>
            </>
          )}
        </div>
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
