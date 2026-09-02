import React, { createContext, useContext, useState } from 'react'
import { getWeatherData, getBlockWeatherData, mockBlockWeather } from '../data/mockWeather'
import { getPanchayatsForBlock, mockPanchayatDetails, mockBlocks } from '../data/mockPanchayats'
import { mockGrowthStages } from '../data/mockAdvisory'

const DashboardContext = createContext()

export function DashboardProvider({ children }) {
  // Global Filters
  const [activeState, setActiveState] = useState("West Bengal")
  const [activeDistrict, setActiveDistrict] = useState("Hooghly")
  const [activeBlock, setActiveBlock] = useState("Polba-Dadpur")
  const [activePanchayat, setActivePanchayat] = useState("p1") // Amnan
  
  const [activeCrop, setActiveCrop] = useState("Rice (Kharif)")
  const [activeGrowthStage, setActiveGrowthStage] = useState("Tillering")

  // Derived Data
  const weatherData = getWeatherData(activePanchayat)
  const blockWeatherData = getBlockWeatherData(activeBlock)
  const panchayatsInBlock = getPanchayatsForBlock(activeBlock)
  const blocksInDistrict = (mockBlocks && mockBlocks[activeDistrict]) || ["Polba-Dadpur", "Chinsurah-Mogra", "Singur", "Haripal"]

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
    setActiveBlock(block)
    const list = getPanchayatsForBlock(block)
    if (list && list.length > 0) {
      const exists = list.some(p => p.id === activePanchayat)
      if (!exists) {
        setActivePanchayat(list[0].id)
      }
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
        activeDistrict, setActiveDistrict,
        activeBlock, setActiveBlock, handleBlockChange,
        activePanchayat, setActivePanchayat, handlePanchayatChange,
        activeCrop, handleCropChange,
        activeGrowthStage, setActiveGrowthStage,
        weatherData,
        blockWeatherData,
        panchayatsInBlock,
        blocksInDistrict,
        mockBlocks,
        mockBlockWeather
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
