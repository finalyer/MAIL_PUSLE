import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Mail, RefreshCw, Bell, Moon, Sun, Monitor, Shield,
  Lock, Edit3, Trash2, LogOut, Sliders
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // Setting States
  const [activeTab, setActiveTab] = useState('account')
  const [autoSync, setAutoSync] = useState(true)
  const [includeAttachments, setIncludeAttachments] = useState(true)
  const [maxHistory, setMaxHistory] = useState('12 months')
  const [syncFreq, setSyncFreq] = useState('Every 30 minutes')

  // Notification Toggles
  const [notifReply, setNotifReply] = useState(true)
  const [notifReceipt, setNotifReceipt] = useState(true)
  const [notifSyncComp, setNotifSyncComp] = useState(true)
  const [notifSyncFail, setNotifSyncFail] = useState(true)
  const [notifImportant, setNotifImportant] = useState(true)

  // Appearance
  const [theme, setTheme] = useState('dark') // 'dark' | 'light' | 'system'
  const [density, setDensity] = useState('comfortable') // 'comfortable' | 'compact'

  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="page-container fade-in">
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'var(--bg-card)',
            border: '1px solid var(--accent-red)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            color: '#ffffff',
            zIndex: 100
          }}
        >
          {toast}
        </div>
      )}

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your MailPulse account, Gmail connection, and preferences.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Left Subnav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button
            className={`nav-link ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <User size={16} />
            <span>Account</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'connection' ? 'active' : ''}`}
            onClick={() => setActiveTab('connection')}
          >
            <Mail size={16} />
            <span>Gmail Connection</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'sync' ? 'active' : ''}`}
            onClick={() => setActiveTab('sync')}
          >
            <RefreshCw size={16} />
            <span>Sync Preferences</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} />
            <span>Notifications</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Moon size={16} />
            <span>Appearance</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={16} />
            <span>Security</span>
          </button>
        </div>

        {/* Right Settings Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {/* 1. Account Information */}
          <div className="chart-card">
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>Account Information</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Your profile and account details.</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div className="contact-avatar" style={{ width: 50, height: 50, fontSize: 18, background: '#374151' }}>
                AM
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>Alex Morgan</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>alex@example.com</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Gmail Connected</span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-green)' }} />
                </div>
              </div>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={() => showToast('Profile editor opened')}>
              <Edit3 size={13} />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* 2. Gmail Connection */}
          <div className="chart-card">
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>Gmail Connection</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Manage your Gmail account connection.</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#ffffff' }}>alex@example.com</div>
              </div>
              <span className="status-pill success">● Connected</span>
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={13} color="var(--text-muted)" />
                <span>Read-only access: We only read your emails. No changes, no deletions.</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 11.5 }}>
                Last sync: Oct 11, 2026 at 2:24 PM
              </div>
            </div>

            <button
              className="btn btn-outline-red"
              style={{ width: '100%' }}
              onClick={() => showToast('Disconnect flow initiated')}
            >
              Disconnect Gmail
            </button>
          </div>

          {/* 3. Sync Preferences */}
          <div className="chart-card">
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>Sync Preferences</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Configure how MailPulse syncs and processes your emails.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Toggle 1 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>Automatic sync</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Automatically sync emails in the background.</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={e => setAutoSync(e.target.checked)}
                  style={{ accentColor: 'var(--accent-red)', width: 18, height: 18, cursor: 'pointer' }}
                />
              </div>

              {/* Toggle 2 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>Include attachments</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Download and analyze email attachments.</div>
                </div>
                <input
                  type="checkbox"
                  checked={includeAttachments}
                  onChange={e => setIncludeAttachments(e.target.checked)}
                  style={{ accentColor: 'var(--accent-red)', width: 18, height: 18, cursor: 'pointer' }}
                />
              </div>

              {/* Select 1 */}
              <div className="form-group">
                <label className="form-label">Maximum email history</label>
                <select
                  value={maxHistory}
                  onChange={e => setMaxHistory(e.target.value)}
                  className="form-select"
                >
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                  <option value="All time">All time</option>
                </select>
              </div>

              {/* Select 2 */}
              <div className="form-group">
                <label className="form-label">Default sync frequency</label>
                <select
                  value={syncFreq}
                  onChange={e => setSyncFreq(e.target.value)}
                  className="form-select"
                >
                  <option value="Every 15 minutes">Every 15 minutes</option>
                  <option value="Every 30 minutes">Every 30 minutes</option>
                  <option value="Every hour">Every hour</option>
                  <option value="Manual only">Manual only</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Notification Preferences */}
          <div className="chart-card">
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>Notification Preferences</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Choose which email activities you want to be notified about.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>Reply received</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Get notified when someone replies to your email.</div>
                </div>
                <input type="checkbox" checked={notifReply} onChange={e => setNotifReply(e.target.checked)} style={{ accentColor: 'var(--accent-red)', width: 18, height: 18, cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>Read receipt received</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Get notified when a read receipt is received.</div>
                </div>
                <input type="checkbox" checked={notifReceipt} onChange={e => setNotifReceipt(e.target.checked)} style={{ accentColor: 'var(--accent-red)', width: 18, height: 18, cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>Sync completed</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Get notified when email sync is completed.</div>
                </div>
                <input type="checkbox" checked={notifSyncComp} onChange={e => setNotifSyncComp(e.target.checked)} style={{ accentColor: 'var(--accent-red)', width: 18, height: 18, cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>Sync failed</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Get notified if there is an issue with email sync.</div>
                </div>
                <input type="checkbox" checked={notifSyncFail} onChange={e => setNotifSyncFail(e.target.checked)} style={{ accentColor: 'var(--accent-red)', width: 18, height: 18, cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>Important email detected</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Get notified when important emails are identified.</div>
                </div>
                <input type="checkbox" checked={notifImportant} onChange={e => setNotifImportant(e.target.checked)} style={{ accentColor: 'var(--accent-red)', width: 18, height: 18, cursor: 'pointer' }} />
              </div>
            </div>
          </div>

          {/* 5. Appearance */}
          <div className="chart-card">
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>Appearance</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Customize the look and feel of MailPulse.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
              <button
                className="btn btn-secondary"
                style={{
                  flexDirection: 'column',
                  padding: '12px 8px',
                  borderColor: theme === 'dark' ? 'var(--accent-red)' : 'var(--border)',
                  background: theme === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface)'
                }}
                onClick={() => setTheme('dark')}
              >
                <Moon size={18} color={theme === 'dark' ? 'var(--accent-red)' : 'var(--text-muted)'} />
                <span style={{ fontSize: 12, marginTop: 4 }}>Dark</span>
                <span style={{ fontSize: 10, color: theme === 'dark' ? 'var(--accent-red)' : 'var(--text-muted)' }}>Selected</span>
              </button>

              <button
                className="btn btn-secondary"
                style={{
                  flexDirection: 'column',
                  padding: '12px 8px',
                  borderColor: theme === 'light' ? 'var(--accent-red)' : 'var(--border)',
                  background: theme === 'light' ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface)'
                }}
                onClick={() => setTheme('light')}
              >
                <Sun size={18} color={theme === 'light' ? 'var(--accent-red)' : 'var(--text-muted)'} />
                <span style={{ fontSize: 12, marginTop: 4 }}>Light</span>
              </button>

              <button
                className="btn btn-secondary"
                style={{
                  flexDirection: 'column',
                  padding: '12px 8px',
                  borderColor: theme === 'system' ? 'var(--accent-red)' : 'var(--border)',
                  background: theme === 'system' ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface)'
                }}
                onClick={() => setTheme('system')}
              >
                <Monitor size={18} color={theme === 'system' ? 'var(--accent-red)' : 'var(--text-muted)'} />
                <span style={{ fontSize: 12, marginTop: 4 }}>System</span>
              </button>
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Interface density</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  className="btn btn-secondary"
                  style={{
                    borderColor: density === 'comfortable' ? 'var(--accent-red)' : 'var(--border)',
                    background: density === 'comfortable' ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface)'
                  }}
                  onClick={() => setDensity('comfortable')}
                >
                  <Sliders size={14} color={density === 'comfortable' ? 'var(--accent-red)' : 'var(--text-muted)'} />
                  <span>Comfortable</span>
                </button>
                <button
                  className="btn btn-secondary"
                  style={{
                    borderColor: density === 'compact' ? 'var(--accent-red)' : 'var(--border)',
                    background: density === 'compact' ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface)'
                  }}
                  onClick={() => setDensity('compact')}
                >
                  <span>Compact</span>
                </button>
              </div>
            </div>
          </div>

          {/* 6. Security */}
          <div className="chart-card">
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>Security</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Manage your security settings and data.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Lock size={16} color="var(--accent-red)" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
                    Encrypted token storage
                    <span className="status-pill success" style={{ fontSize: 10 }}>● Active</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                    Your Gmail access tokens are securely encrypted.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Monitor size={16} color="var(--text-muted)" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>Active session</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                    macOS • Chrome — Last active: Oct 11, 2026 at 2:24 PM
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                <LogOut size={13} />
                <span>Logout</span>
              </button>

              <button
                className="btn btn-outline-red btn-sm"
                onClick={() => {
                  if (confirm('Clear local cache and database?')) {
                    showToast('Local MailPulse cache cleared.')
                  }
                }}
              >
                <Trash2 size={13} />
                <span>Delete local MailPulse data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
