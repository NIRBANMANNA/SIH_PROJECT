import React from 'react'
import Hero from '../components/Hero'
import Forecast from '../components/Forecast'
import RightRail from '../components/RightRail'
import { useDashboard } from '../context/DashboardContext'

export default function Overview() {
  const { 
    blockWeatherData, 
    activeBlock, 
    handleBlockChange, 
    activeDistrict, 
    activeState 
  } = useDashboard()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 'calc(76 * var(--u)) calc(38 * var(--u)) calc(70 * var(--u)) calc(100 * var(--u))',
      height: '100%',
      boxSizing: 'border-box',
      gap: 'calc(24 * var(--u))'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: 'calc(30 * var(--u))',
        flex: 1,
        minWidth: 0,
      }}>
        <Hero
          cityData={blockWeatherData}
          chipText={`Block Weather • ${activeBlock} (${activeDistrict})`}
          tempUnit="C"
          style={{ position: 'relative', left: 'auto', top: 'auto', maxWidth: 'none', flexShrink: 0 }}
        />
        <Forecast
          cityData={blockWeatherData}
          tempUnit="C"
          style={{ position: 'relative', left: 'auto', right: 'auto', bottom: 'auto', flexShrink: 0 }}
        />
      </div>
      <RightRail 
        tempUnit="C" 
        style={{ position: 'relative', right: 'auto', top: 'auto', bottom: 'auto', width: 'calc(310 * var(--u))', height: '100%' }}
      />
    </div>
  )
}
