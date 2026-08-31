import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header  from '../components/Header'
import { DashboardProvider, useDashboard } from '../context/DashboardContext'

function DashboardLayout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', text: 'Severe flood warning active for Hooghly coastal areas.', time: '10m ago', unread: true },
    { id: 2, type: 'info', text: 'Rainstorm intensifies near Polba-Dadpur. Drive safely.', time: '45m ago', unread: true },
  ])

  const { activePanchayat, setActivePanchayat, weatherData } = useDashboard()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: '#020d14',
        backgroundImage: `url(${weatherData.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 25%',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 0.5s ease-in-out',
      }}
    >
      {/* Vignette overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: `
            linear-gradient(105deg, rgba(4,16,24,.34) 0%, rgba(4,16,24,.20) 40%, rgba(4,16,24,.06) 78%, transparent 100%),
            linear-gradient(180deg, rgba(4,16,24,.12) 0%, transparent 22%),
            linear-gradient(0deg, rgba(4,16,24,.07), rgba(4,16,24,.07))
          `,
        }}
      />

      <Sidebar />
      <Header
        activeCity={activePanchayat}
        setActiveCity={setActivePanchayat}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        notificationsOpen={notificationsOpen}
        setNotificationsOpen={setNotificationsOpen}
        notifications={notifications}
        setNotifications={setNotifications}
        weatherData={{ [activePanchayat]: weatherData }}
      />

      <Outlet />
    </div>
  )
}

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardLayout />
    </DashboardProvider>
  )
}
