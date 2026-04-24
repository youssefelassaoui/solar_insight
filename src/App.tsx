import { useAuth } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import Topbar from './components/layout/Topbar'
import SolarMap from './components/map/SolarMap'
import SignInPage from './pages/SignInPage'

function Dashboard() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#0f1117' : '#f4f6fb',
      color:      isDark ? '#e2e8f0' : '#1a1f2e',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Topbar />
      <main style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column' }}>
        <SolarMap />
      </main>
    </div>
  )
}

/* Waits for Clerk to finish loading before deciding to redirect */
function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <img src="/bayan.svg" alt="Bayan" style={{ height: '48px', opacity: 0.7 }} />
          <div style={{
            width: '32px', height: '32px',
            border: '3px solid #e8733a',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  return <Dashboard />
}

function PublicRoute() {
  const { isLoaded, isSignedIn } = useAuth()
  // While loading — show nothing (avoids flash)
  if (!isLoaded) return null
  // Already authenticated — go to dashboard
  if (isSignedIn) {
    window.location.replace('/')
    return null
  }
  return <SignInPage />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in/*" element={<PublicRoute />} />
        <Route path="/*"         element={<ProtectedRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
