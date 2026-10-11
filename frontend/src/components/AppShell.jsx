import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Inbox, Send, Search, BarChart2, Users, Tag,
  RefreshCw, FileText, Lightbulb, Settings, Bell, Calendar,
  SlidersHorizontal, ArrowRight, LogOut, ChevronDown, Check
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import NotificationsDrawer from './NotificationsDrawer'

export default function AppShell({ children }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout, isDemoUser } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [dateRange, setDateRange] = useState('Oct 2026')

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Inbox', path: '/inbox', icon: Inbox, badge: '24' },
    { label: 'Sent Mails', path: '/sent', icon: Send },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
    { label: 'Contacts', path: '/contacts', icon: Users },
    { label: 'Smart Labels', path: '/inbox?filter=labels', icon: Tag },
    { isDivider: true },
    { label: 'Sync Status', path: '/sync', icon: RefreshCw, indicator: 'green' },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'AI Insights', path: '/analytics?view=insights', icon: Lightbulb },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      {/* ── Left Sidebar ─────────────────────────────────── */}
      <aside className="sidebar" id="app-sidebar">
        {/* Brand Header */}
        <div className="sidebar-header">
          <Link to="/dashboard" className="brand-link" id="brand-logo-link">
            {/* Waveform Pulse ECG Logo */}
            <svg
              className="brand-pulse-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="2 12 6 12 9 4 13 20 16 10 18 14 22 12" />
            </svg>
            <span className="brand-title">MailPulse</span>
          </Link>
          <button className="sidebar-toggle-btn" title="Toggle Sidebar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="sidebar-nav">
          {navItems.map((item, index) => {
            if (item.isDivider) {
              return <div key={`div-${index}`} className="nav-divider" />
            }

            const active = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
            const Icon = item.icon

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${active ? 'active' : ''}`}
                id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
                {item.indicator === 'green' && <span className="nav-indicator-dot" />}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer Cards */}
        <div className="sidebar-footer">
          {/* Pro Tier Upgrade Card */}
          <div className="sidebar-pro-card">
            <div className="pro-card-header">MailPulse Pro</div>
            <div className="pro-progress-bar">
              <div
                className="pro-progress-fill"
                style={{ width: `${(user?.quotaUsed / user?.quotaTotal) * 100 || 25}%` }}
              />
            </div>
            <div className="pro-card-sub">
              {(user?.quotaUsed || 12480).toLocaleString()} / {(user?.quotaTotal || 50000).toLocaleString()} emails
            </div>
            <button
              className="pro-upgrade-btn"
              onClick={() => alert('MailPulse Pro Plan is active for this workspace!')}
            >
              <span>Upgrade Plan</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Connected Gmail status indicator card */}
          <div className="sidebar-account-badge">
            <svg className="google-icon-mark" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <div className="account-badge-info">
              <div className="account-badge-title flex items-center gap-1">
                Gmail Connected
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-green)', display: 'inline-block' }} />
              </div>
              <div className="account-badge-status">Last synced {user?.lastSynced || '5 min ago'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Workspace ───────────────────────────────── */}
      <div className="workspace-wrapper">
        {/* Topbar */}
        <header className="topbar">
          {/* Global Search Bar */}
          <div className="topbar-search-wrap">
            <Search className="topbar-search-icon" size={15} />
            <input
              type="text"
              className="topbar-search-input"
              placeholder="Search emails, people or keywords..."
              onKeyDown={e => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`)
                }
              }}
            />
            <div className="topbar-kbd-shortcut">
              <span>Ctrl</span>
              <span>K</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="topbar-actions">
            {/* Filter / Sliders Icon Button */}
            <button className="topbar-icon-btn" title="Filter & View options">
              <SlidersHorizontal size={15} />
            </button>

            {/* Date range picker dropdown */}
            <div
              className="topbar-date-picker"
              onClick={() => setDateRange(dateRange === 'Oct 2026' ? 'Sep 2026' : 'Oct 2026')}
              title="Change date filter"
            >
              <Calendar size={14} color="var(--text-muted)" />
              <span>{dateRange}</span>
              <ChevronDown size={13} color="var(--text-muted)" />
            </div>

            {/* Notification Bell Button with Red Dot */}
            <button
              className="topbar-icon-btn"
              onClick={() => setNotifOpen(true)}
              id="topbar-notif-btn"
              title="Notifications"
            >
              <Bell size={16} />
              <div className="topbar-notif-dot" />
            </button>

            {/* User Profile */}
            <div style={{ position: 'relative' }}>
              <div
                className="topbar-user-profile"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                id="user-profile-menu-btn"
              >
                <div className="user-avatar-circle">
                  {user?.name?.[0] || 'N'}
                </div>
                <div className="topbar-user-meta">
                  <span className="topbar-user-name">{user?.name || 'Nikhil'}</span>
                  <span className="topbar-user-email">{user?.email || 'nikk24g@gmail.com'}</span>
                </div>
                <ChevronDown size={14} color="var(--text-muted)" />
              </div>

              {/* Profile Dropdown Menu */}
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    width: 220,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 0',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 50
                  }}
                >
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{user?.fullName || 'Alex Morgan'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.secondaryEmail || 'alex@example.com'}</div>
                  </div>
                  <Link
                    to="/settings"
                    className="nav-link"
                    style={{ padding: '8px 16px', borderRadius: 0 }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings size={14} />
                    Account Settings
                  </Link>
                  <Link
                    to="/sync"
                    className="nav-link"
                    style={{ padding: '8px 16px', borderRadius: 0 }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <RefreshCw size={14} />
                    Sync Status
                  </Link>
                  <button
                    className="nav-link"
                    style={{ width: '100%', textAlign: 'left', padding: '8px 16px', borderRadius: 0, color: 'var(--accent-red)' }}
                    onClick={handleLogout}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, minHeight: 'calc(100vh - 58px)' }}>
          {children}
        </main>
      </div>

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        onActionClick={(notif) => {
          setNotifOpen(false)
          if (notif.category === 'sync') navigate('/sync')
          else navigate('/inbox')
        }}
      />
    </div>
  )
}
