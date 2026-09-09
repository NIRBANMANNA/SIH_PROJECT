import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { getWeatherData, getBlockWeatherData, mockBlockWeather } from '../data/mockWeather'
import { getPanchayatsForBlock, mockPanchayatDetails, mockBlocks, getDistrictForBlock } from '../data/mockPanchayats'
import { mockGrowthStages } from '../data/mockAdvisory'
import { fetchDownscaledForecast } from '../lib/api'
import { geocodeBlock, fetchLiveWeatherForCoords, fetchPanchayatsForBlock } from '../lib/geoService'

const DashboardContext = createContext()

export function DashboardProvider({ children }) {
  // Global Filters
  const [activeState, setActiveState] = useState("West Bengal")
  const [activeDistrict, setActiveDistrict] = useState("Hooghly")
  const [activeBlock, setActiveBlock] = useState("Polba-Dadpur")
  const [activePanchayat, setActivePanchayat] = useState("p1") // Amnan

  const [activeCrop, setActiveCrop] = useState("Rice (Kharif)")
  const [activeGrowthStage, setActiveGrowthStage] = useState("Tillering")

  // App Settings & Measurement Units (persisted)
  const [tempUnit, setTempUnit] = useState(() => localStorage.getItem('kisandarpan_temp_unit') || 'C')
  const [windUnit, setWindUnit] = useState(() => localStorage.getItem('kisandarpan_wind_unit') || 'km/h')
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('kisandarpan_prefs')
      return saved ? JSON.parse(saved) : { severeAlerts: true, dailyForecast: true, agroEmail: true }
    } catch {
      return { severeAlerts: true, dailyForecast: true, agroEmail: true }
    }
  })

  const updateUnits = (newTemp, newWind) => {
    if (newTemp) {
      setTempUnit(newTemp)
      localStorage.setItem('kisandarpan_temp_unit', newTemp)
    }
    if (newWind) {
      setWindUnit(newWind)
      localStorage.setItem('kisandarpan_wind_unit', newWind)
    }
  }

  const updatePreferences = (newPrefs) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPrefs }
      localStorage.setItem('kisandarpan_prefs', JSON.stringify(updated))
      return updated
    })
  }

  // Live API state — shared across all pages
  const [liveApiResult, setLiveApiResult] = useState(null)
  const [liveApiLoading, setLiveApiLoading] = useState(false)
  const [liveApiError, setLiveApiError] = useState(null)

  // Live Geospatial & Open-Meteo Telemetry state
  const [liveGeoData, setLiveGeoData] = useState(null)
  const [liveTelemetry, setLiveTelemetry] = useState(null)
  const [livePanchayats, setLivePanchayats] = useState([])

  // Live Geocoding effect whenever activeBlock or activeDistrict changes
  useEffect(() => {
    let isMounted = true
    const cleanBlock = (activeBlock || "Polba-Dadpur").trim()
    const resolvedDist = getDistrictForBlock(cleanBlock)

    geocodeBlock(cleanBlock, resolvedDist, activeState).then(geo => {
      if (!isMounted || !geo) return
      setLiveGeoData(geo)

      if (geo.district && geo.district !== activeDistrict) {
        setActiveDistrict(geo.district)
      }

      // Fetch live high-resolution weather telemetry for the exact coordinates
      fetchLiveWeatherForCoords(geo.lat, geo.lng).then(weather => {
        if (isMounted && weather) {
          setLiveTelemetry(weather)
        }
      }).catch(() => {})

      // Fetch authentic Gram Panchayats around GPS coordinates
      fetchPanchayatsForBlock(cleanBlock, geo.district, geo.lat, geo.lng).then(gps => {
        if (isMounted && gps && gps.length > 0) {
          setLivePanchayats(gps)
        }
      }).catch(() => {})
    }).catch(() => {})

    return () => { isMounted = false }
  }, [activeBlock, activeState])

  const setCustomLocation = useCallback((newState, newDistrict, newBlock, newPanchayat) => {
    if (newState) setActiveState(newState)
    const resolvedDist = getDistrictForBlock(newBlock) || ((newDistrict && newDistrict !== "West Bengal") ? newDistrict : "Murshidabad")
    if (resolvedDist) setActiveDistrict(resolvedDist)
    if (newBlock) setActiveBlock(newBlock)
    if (newPanchayat) setActivePanchayat(newPanchayat)
  }, [])

  const runPrediction = useCallback(async (block, panchayat, date) => {
    setLiveApiLoading(true)
    setLiveApiError(null)
    const targetBlock = block || activeBlock
    const targetPanchayat = panchayat || activePanchayat
    const targetDate = date || new Date().toISOString().slice(0, 10)

    try {
      const data = await fetchDownscaledForecast(targetBlock, targetPanchayat, targetDate)
      setLiveApiResult(data)
      if (block && block !== activeBlock) {
        setActiveBlock(block)
        setActiveDistrict(getDistrictForBlock(block))
      }
      if (panchayat && panchayat !== activePanchayat) setActivePanchayat(panchayat)
      return data
    } catch (err) {
      setLiveApiError(err?.message || 'Prediction failed')
      throw err
    } finally {
      setLiveApiLoading(false)
    }
  }, [activeBlock, activePanchayat])

  const setLocationAndPredict = useCallback(async ({ state, district, block, panchayat, date }) => {
    if (state) setActiveState(state)

    let resolvedDistrict = getDistrictForBlock(block) || district
    if (resolvedDistrict && resolvedDistrict !== "West Bengal") {
      setActiveDistrict(resolvedDistrict)
    }

    if (block) {
      const cleanBlock = block.trim()
      setActiveBlock(cleanBlock)
      const list = getPanchayatsForBlock(cleanBlock)
      if (list && list.length > 0) {
        if (!panchayat || !list.some(p => p.id === panchayat)) {
          setActivePanchayat(list[0].id)
        } else {
          setActivePanchayat(panchayat)
        }
      }
    } else if (panchayat) {
      setActivePanchayat(panchayat)
    }

    const targetDate = date || new Date().toISOString().slice(0, 10)
    return await runPrediction(block || activeBlock, panchayat || activePanchayat, targetDate)
  }, [activeBlock, activePanchayat, runPrediction])

  // Resolve true district: prioritize block's real district over stale context state
  const effectiveDistrict = useMemo(() => {
    const trueBlockDist = getDistrictForBlock(activeBlock)
    if (trueBlockDist) return trueBlockDist
    if (activeDistrict && activeDistrict !== "West Bengal" && mockBlocks[activeDistrict]) {
      return activeDistrict
    }
    return "Murshidabad"
  }, [activeBlock, activeDistrict])

  // Panchayats in active block (live settlements or authentic registry)
  const panchayatsInBlock = useMemo(() => {
    if (livePanchayats && livePanchayats.length > 0) {
      const first = livePanchayats[0]
      if (first && first.block?.toLowerCase() === activeBlock.trim().toLowerCase()) {
        return livePanchayats
      }
    }
    return getPanchayatsForBlock(activeBlock)
  }, [livePanchayats, activeBlock])

  // Weather observations with live Open-Meteo telemetry overlay
  const baseWeatherData = getWeatherData(activePanchayat)
  const weatherData = useMemo(() => {
    if (!liveTelemetry) return baseWeatherData
    return {
      ...baseWeatherData,
      temp: liveTelemetry.temp,
      feelsLike: liveTelemetry.feelsLike,
      humidity: liveTelemetry.humidity,
      rainfall: liveTelemetry.rainfall,
      wind: liveTelemetry.wind,
      gusts: liveTelemetry.gusts,
      condition: liveTelemetry.condition,
      conditionId: liveTelemetry.conditionId,
      days: liveTelemetry.days || baseWeatherData.days,
      city: `${activeBlock} (${effectiveDistrict})`,
      region: `${effectiveDistrict}, West Bengal`
    }
  }, [baseWeatherData, liveTelemetry, activeBlock, effectiveDistrict])

  const baseBlockWeatherData = getBlockWeatherData(activeBlock, effectiveDistrict, liveApiResult)
  const blockWeatherData = useMemo(() => {
    if (!liveTelemetry) return baseBlockWeatherData
    return {
      ...baseBlockWeatherData,
      district: effectiveDistrict,
      temp: liveTelemetry.temp,
      humidity: liveTelemetry.humidity,
      rainfall: liveTelemetry.rainfall,
      wind: liveTelemetry.wind,
      gusts: liveTelemetry.gusts,
      condition: liveTelemetry.condition,
      conditionId: liveTelemetry.conditionId,
      days: liveTelemetry.days || baseBlockWeatherData.days,
      city: `${activeBlock} (Block)`,
      region: `${effectiveDistrict}, West Bengal`
    }
  }, [baseBlockWeatherData, liveTelemetry, activeBlock, effectiveDistrict])

  // Blocks list for effectiveDistrict
  const blocksInDistrict = useMemo(() => {
    if (mockBlocks && mockBlocks[effectiveDistrict]) {
      return mockBlocks[effectiveDistrict]
    }
    return ["Jalangi", "Domkal", "Raninagar-I", "Berhampore", "Hariharpara"]
  }, [effectiveDistrict])

  // Handlers to auto-update dependent fields
  const handlePanchayatChange = (pid) => {
    setActivePanchayat(pid)
    const detail = mockPanchayatDetails[pid]
    if (detail) {
      if (detail.block && detail.block !== activeBlock) {
        setActiveBlock(detail.block)
      }
      if (detail.district && detail.district !== activeDistrict) {
        setActiveDistrict(detail.district)
      }
      if (detail.state && detail.state !== activeState) {
        setActiveState(detail.state)
      }
    }
  }

  const handleBlockChange = (block) => {
    if (!block) return
    const cleanBlock = block.trim()
    setActiveBlock(cleanBlock)

    const foundDistrict = getDistrictForBlock(cleanBlock)
    if (foundDistrict) {
      setActiveDistrict(foundDistrict)
    }

    const list = getPanchayatsForBlock(cleanBlock)
    if (list && list.length > 0) {
      setActivePanchayat(list[0].id)
    }
  }

  const handleCropChange = (crop) => {
    setActiveCrop(crop)
    if (mockGrowthStages[crop] && mockGrowthStages[crop].length > 0) {
      setActiveGrowthStage(mockGrowthStages[crop][0])
    }
  }

  return (
    <DashboardContext.Provider
      value={{
        activeState, setActiveState,
        activeDistrict: effectiveDistrict, setActiveDistrict,
        activeBlock, setActiveBlock, handleBlockChange,
        activePanchayat, setActivePanchayat, handlePanchayatChange,
        setCustomLocation,
        setLocationAndPredict,
        activeCrop, handleCropChange,
        activeGrowthStage, setActiveGrowthStage,
        weatherData,
        blockWeatherData,
        panchayatsInBlock,
        blocksInDistrict,
        mockBlocks,
        mockBlockWeather,
        liveGeoData,
        liveTelemetry,
        // Settings & Units
        tempUnit, setTempUnit,
        windUnit, setWindUnit,
        updateUnits,
        preferences, updatePreferences,
        // Live Aurora ML API
        liveApiResult,
        liveApiLoading,
        liveApiError,
        runPrediction,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
