import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import Topbar       from './components/layout/Topbar'
import Sidebar       from './components/layout/Sidebar'
import SignInPage    from './pages/SignInPage'
import PortfolioPage from './pages/PortfolioPage'
import ProjectSetupPage from './pages/ProjectSetupPage'
import AnalyticsPage from './pages/AnalyticsPage'
import MapViewerPage from './pages/MapViewerPage'
import HitlPage      from './pages/HitlPage'
import MaintenancePage from './pages/MaintenancePage'
import ReportingPage from './pages/ReportingPage'

function AppLayout() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#0f1117' : '#f4f6fb',
      color: isDark ? '#e2e8f0' : '#1a1f2e',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Topbar />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Routes>
            <Route path="/"            element={<Navigate to="/portfolio" replace />} />
            <Route path="/portfolio"   element={<PortfolioPage />} />
            <Route path="/setup"       element={<ProjectSetupPage />} />
            <Route path="/analytics"   element={<AnalyticsPage />} />
            <Route path="/map"         element={<MapViewerPage />} />
            <Route path="/analysis"    element={<HitlPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/reporting"   element={<ReportingPage />} />
            <Route path="*"            element={<Navigate to="/portfolio" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <img src="/bayanplat.svg" alt="Bayan" style={{ height: '48px', opacity: 0.7 }} />
          <div style={{ width: '32px', height: '32px', border: '3px solid #e8733a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  return <AppLayout />
}

function PublicRoute() {
  const { isLoaded, isSignedIn } = useAuth()
  if (!isLoaded) return null
  if (isSignedIn) { window.location.replace('/portfolio'); return null }
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
