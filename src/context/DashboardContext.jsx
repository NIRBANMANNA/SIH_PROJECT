import React, { createContext, useContext, useState, useCallback } from 'react'
import { getWeatherData, getBlockWeatherData, mockBlockWeather } from '../data/mockWeather'
import { getPanchayatsForBlock, mockPanchayatDetails, mockBlocks, getDistrictForBlock } from '../data/mockPanchayats'
import { mockGrowthStages } from '../data/mockAdvisory'
import { fetchDownscaledForecast } from '../lib/api'

const DashboardContext = createContext()

export function DashboardProvider({ children }) {
  // Global Filters
  const [activeState, setActiveState] = useState("West Bengal")
  const [activeDistrict, setActiveDistrict] = useState("Hooghly")
  const [activeBlock, setActiveBlock] = useState("Polba-Dadpur")
  const [activePanchayat, setActivePanchayat] = useState("p1") // Amnan

  const [activeCrop, setActiveCrop] = useState("Rice (Kharif)")
  const [activeGrowthStage, setActiveGrowthStage] = useState("Tillering")

  // Live API state — shared across all pages
  const [liveApiResult, setLiveApiResult] = useState(null)
  const [liveApiLoading, setLiveApiLoading] = useState(false)
  const [liveApiError, setLiveApiError] = useState(null)

  const setCustomLocation = useCallback((newState, newDistrict, newBlock, newPanchayat) => {
    if (newState) setActiveState(newState)
    const resolvedDist = (newDistrict && newDistrict !== "West Bengal") ? newDistrict : getDistrictForBlock(newBlock)
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

    let resolvedDistrict = district
    if (!resolvedDistrict || resolvedDistrict === "West Bengal") {
      resolvedDistrict = getDistrictForBlock(block)
    }
    if (resolvedDistrict) setActiveDistrict(resolvedDistrict)

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

  const effectiveDistrict = (activeDistrict && activeDistrict !== "West Bengal" && mockBlocks[activeDistrict])
    ? activeDistrict
    : getDistrictForBlock(activeBlock)

  const weatherData = getWeatherData(activePanchayat)
  const blockWeatherData = getBlockWeatherData(activeBlock, effectiveDistrict, liveApiResult)
  const panchayatsInBlock = getPanchayatsForBlock(activeBlock)

  // Find blocks for activeDistrict
  const blocksInDistrict = mockBlocks[effectiveDistrict] || 
    (activeBlock && (activeBlock.toLowerCase().includes("tamluk") || activeBlock.toLowerCase().includes("haldia") || activeBlock.toLowerCase().includes("mahishadal") || activeBlock.toLowerCase().includes("contai") || activeBlock.toLowerCase().includes("nandigram"))
      ? ["Mahishadal", "Tamluk", "Haldia", "Nandigram-I", "Contai-I"]
      : ["Polba-Dadpur", "Chinsurah-Mogra", "Singur", "Haripal"])

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
