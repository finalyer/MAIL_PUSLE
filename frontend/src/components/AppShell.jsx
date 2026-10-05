import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard, Inbox, Search, RefreshCw, LogOut, Settings, Mail
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { logout } from '../api'

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard', id: 'nav-dashboard' },
  { label: 'Inbox',     icon: Inbox,           to: '/inbox',    id: 'nav-inbox'     },
  { label: 'Search',    icon: Search,           to: '/search',   id: 'nav-search'    },
  { label: 'Sync',      icon: RefreshCw,        to: '/sync',     id: 'nav-sync'      },
]

export default function AppShell({ children }) {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = async () => {
    await logout().catch(() => {})
    setUser(null)
    navigate('/')
  }

  const initials = user?.name
    ? user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">⚡</div>
          <span className="logo-text">MailPulse</span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {NAV.map(item => {
            const active = pathname === item.to || pathname.startsWith(item.to + '/')
            return (
              <Link
                key={item.to}
                to={item.to}
                id={item.id}
                className={`nav-item ${active ? 'active' : ''}`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="avatar">
              {user?.picture
                ? <img src={user.picture} alt={user.name} />
                : initials
              }
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="truncate" style={{ fontSize: 12, fontWeight: 600 }}>
                {user?.name || 'User'}
              </div>
              <div className="truncate text-muted" style={{ fontSize: 11 }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button
            className="nav-item"
            id="logout-btn"
            onClick={handleLogout}
            style={{ marginTop: 4, color: 'var(--accent-red)' }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <Mail size={16} style={{ color: 'var(--accent-light)' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
            {NAV.find(n => pathname.startsWith(n.to))?.label || 'MailPulse'}
          </span>
        </header>

        {children}
      </div>
    </div>
  )
}
