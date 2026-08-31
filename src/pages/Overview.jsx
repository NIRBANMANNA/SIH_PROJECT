import React from 'react'
import Hero from '../components/Hero'
import Forecast from '../components/Forecast'
import RightRail from '../components/RightRail'
import { useDashboard } from '../context/DashboardContext'
import { overviewLayoutStyle } from '../lib/styles'

export default function Overview() {
  const { weatherData, activePanchayat, setActivePanchayat } = useDashboard()

  return (
    <>
      <Hero
        cityData={weatherData}
        tempUnit="C"
      />
      <Forecast
        cityData={weatherData}
        tempUnit="C"
      />
      <RightRail 
        activeCity={activePanchayat} 
        setActiveCity={setActivePanchayat} 
        weatherData={{ [activePanchayat]: weatherData }} 
        tempUnit="C" 
      />
    </>
  )
}
