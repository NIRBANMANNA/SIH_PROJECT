import React, { createContext, useContext, useState, useEffect } from 'react'
import { getWeatherData } from '../data/mockWeather'
import { getPanchayatsForBlock } from '../data/mockPanchayats'
import { mockCrops, mockGrowthStages } from '../data/mockAdvisory'

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
  const panchayatsInBlock = getPanchayatsForBlock(activeBlock)

  // Handlers to auto-update dependent fields
  const handlePanchayatChange = (pid) => {
    setActivePanchayat(pid)
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
        activeBlock, setActiveBlock,
        activePanchayat, setActivePanchayat, handlePanchayatChange,
        activeCrop, handleCropChange,
        activeGrowthStage, setActiveGrowthStage,
        weatherData,
        panchayatsInBlock
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
