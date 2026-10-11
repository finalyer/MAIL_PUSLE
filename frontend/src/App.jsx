import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AppShell from './components/AppShell'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import InboxPage from './pages/InboxPage'
import SentPage from './pages/SentPage'
import SearchPage from './pages/SearchPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ContactsPage from './pages/ContactsPage'
import ReportsPage from './pages/ReportsPage'
import SyncPage from './pages/SyncPage'
import SettingsPage from './pages/SettingsPage'

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', flexDirection: 'column', gap: 16
    }}>
      <div style={{
        width: 44, height: 44,
        background: 'var(--accent-red)',
        borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 30px var(--accent-red-glow)'
      }}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 22, height: 22 }}
        >
          <polyline points="2 12 6 12 9 4 13 20 16 10 18 14 22 12" />
        </svg>
      </div>
      <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  // If user is logged out, allow viewing landing or redirect
  if (!user) return <Navigate to="/" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  // When user clicks back to landing page, let them view landing page freely
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

      <Route path="/sent" element={
        <ProtectedRoute>
          <AppShell><SentPage /></AppShell>
        </ProtectedRoute>
      } />

      <Route path="/search" element={
        <ProtectedRoute>
          <AppShell><SearchPage /></AppShell>
        </ProtectedRoute>
      } />

      <Route path="/analytics" element={
        <ProtectedRoute>
          <AppShell><AnalyticsPage /></AppShell>
        </ProtectedRoute>
      } />

      <Route path="/contacts" element={
        <ProtectedRoute>
          <AppShell><ContactsPage /></AppShell>
        </ProtectedRoute>
      } />

      <Route path="/reports" element={
        <ProtectedRoute>
          <AppShell><ReportsPage /></AppShell>
        </ProtectedRoute>
      } />

      <Route path="/sync" element={
        <ProtectedRoute>
          <AppShell><SyncPage /></AppShell>
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <AppShell><SettingsPage /></AppShell>
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
