import { Routes, Route, Navigate } from 'react-router-dom'
import IconSprite from './components/IconSprite'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

// New Dashboard Pages
import Overview from './pages/Overview'
import WeatherMap from './pages/WeatherMap'
import ForecastDownscaled from './pages/ForecastDownscaled'
import RiskAlerts from './pages/RiskAlerts'
import CropAdvisory from './pages/CropAdvisory'
import HistoricalTrends from './pages/HistoricalTrends'
import Accuracy from './pages/Accuracy'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

export default function App() {
  return (
    <>
      <IconSprite />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="map" element={<WeatherMap />} />
          <Route path="forecast" element={<ForecastDownscaled />} />
          <Route path="alerts" element={<RiskAlerts />} />
          <Route path="advisory" element={<CropAdvisory />} />
          <Route path="historical" element={<HistoricalTrends />} />
          <Route path="accuracy" element={<Accuracy />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
