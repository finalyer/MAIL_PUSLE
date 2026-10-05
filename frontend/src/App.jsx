import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AppShell from './components/AppShell'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import InboxPage from './pages/InboxPage'
import SearchPage from './pages/SearchPage'
import SyncPage from './pages/SyncPage'

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', flexDirection: 'column', gap: 16
    }}>
      <div style={{
        width: 44, height: 44,
        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
        borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, boxShadow: '0 0 30px var(--accent-glow)'
      }}>⚡</div>
      <div className="spinner spinner-lg" />
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppShell><DashboardPage /></AppShell>
        </ProtectedRoute>
      } />

      <Route path="/inbox" element={
        <ProtectedRoute>
          <AppShell><InboxPage /></AppShell>
        </ProtectedRoute>
      } />

      <Route path="/search" element={
        <ProtectedRoute>
          <AppShell><SearchPage /></AppShell>
        </ProtectedRoute>
      } />

      <Route path="/sync" element={
        <ProtectedRoute>
          <AppShell><SyncPage /></AppShell>
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
