// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#041018',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 500,
        gap: '12px',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '3px solid rgba(255,255,255,0.2)',
          borderTopColor: '#22c55e',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        Authenticating KisanDarpan AI session…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
