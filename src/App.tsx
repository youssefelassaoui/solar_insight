import { SignedIn, SignedOut } from '@clerk/clerk-react'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/sign-in/*"
          element={
            <SignedOut>
              <SignInPage />
            </SignedOut>
          }
        />
        <Route
          path="/*"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
