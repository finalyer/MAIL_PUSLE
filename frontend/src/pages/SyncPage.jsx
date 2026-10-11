import { useState, useEffect } from 'react'
import {
  RefreshCw, Shield, Lock, Database, EyeOff, CheckCircle2,
  MoreVertical
} from 'lucide-react'
import { mockSyncHistory } from '../mockData'
import { getSyncStatus, triggerSync, getSyncJobs } from '../api'
import { useAuth } from '../contexts/AuthContext'

export default function SyncPage() {
  const { user, isDemoUser } = useAuth()
  const [syncHistory, setSyncHistory] = useState(mockSyncHistory)
  const [isSyncActive, setIsSyncActive] = useState(false)
  const [progress, setProgress] = useState(100)
  const [triggering, setTriggering] = useState(false)

  // Fetch real sync status and jobs
  useEffect(() => {
    if (user && !isDemoUser) {
      getSyncStatus()
        .then(res => {
          if (res.data) {
            setIsSyncActive(res.data.sync_status === 'SYNCING')
            setProgress(res.data.sync_status === 'SYNCING' ? 64 : 100)
          }
        })
        .catch(() => {})

      getSyncJobs()
        .then(res => {
          if (res.data && res.data.length > 0) {
            const formatted = res.data.map(job => ({
              id: job.id,
              type: job.job_type === 'INITIAL_SYNC' ? 'Initial sync' : 'Manual sync',
              subType: 'Gmail Inbox & Threads',
              status: job.status === 'COMPLETED' ? 'Completed' : job.status === 'RUNNING' ? 'In progress' : job.status,
              date: new Date(job.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
              records: job.status === 'COMPLETED' ? 'Synchronized' : (job.error_message || 'Pending'),
              duration: job.status === 'COMPLETED' ? 'Completed' : 'Running'
            }))
            setSyncHistory(formatted)
          }
        })
        .catch(() => {})
    }
  }, [user, isDemoUser])

  const handleTriggerSync = async () => {
    setTriggering(true)
    try {
      await triggerSync()
      setIsSyncActive(true)
      setProgress(25)
      setTimeout(() => setProgress(75), 1500)
    } catch {}
    setTriggering(false)
  }

  const handleCancelSync = () => {
    setIsSyncActive(false)
  }

  return (
    <div className="page-container fade-in">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Gmail Sync</h1>
          <p className="page-subtitle">Manage your Gmail connection and email data synchronization.</p>
        </div>

        <div>
          <button
            className="btn btn-primary-red"
            onClick={handleTriggerSync}
            disabled={triggering || isSyncActive}
          >
            <RefreshCw size={14} className={triggering ? 'animate-spin-slow' : ''} />
            <span>{isSyncActive ? 'Sync in progress' : 'Trigger New Sync'}</span>
          </button>
        </div>
      </div>

      {/* ── Top Row: Account Connection Card & Security Assurance Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginBottom: 24 }}>
        {/* Left Column: Connected Account & Active Sync */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Account Status Card */}
          <div className="chart-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Gmail Icon Box */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg style={{ width: 22, height: 22 }} viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>alex@example.com</span>
                    <span className="status-pill success">● Synced</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Connected via Gmail</div>
                </div>
              </div>

              <button className="icon-toggle" title="Options">
                <MoreVertical size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: 12, borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>1,248</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Emails stored</div>
              </div>

              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>312</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Threads stored</div>
              </div>

              <div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Last synced</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginTop: 2 }}>October 6, 2026 at 10:42 AM</div>
              </div>
            </div>
          </div>

          {/* Active Live Sync Progress Card */}
          {isSyncActive && (
            <div className="chart-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>Syncing your Gmail account...</h3>
                <button className="btn btn-outline-red btn-sm" onClick={handleCancelSync}>
                  Cancel Sync
                </button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                Please keep this window open while we sync your emails.
              </p>

              {/* Red glowing progress bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: 'var(--accent-red)',
                      boxShadow: '0 0 12px var(--accent-red-glow)',
                      borderRadius: 99,
                      transition: 'width 300ms ease'
                    }}
                  />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', minWidth: 40, textAlign: 'right' }}>
                  {progress}%
                </span>
              </div>

              {/* 4 Sub-stat Boxes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>84 / 150</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Threads processed</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>1,203</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Emails created</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>42</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Emails updated</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>~ 2 min</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Estimated time left</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Security Guarantees Card */}
        <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div className="kpi-icon-box" style={{ width: 34, height: 34, margin: 0 }}>
              <Shield size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: '#ffffff' }}>Your data is secure</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.5 }}>
                We take your privacy seriously. Your Gmail data is only used to provide analytics and insights.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div className="kpi-icon-box" style={{ width: 34, height: 34, margin: 0 }}>
              <Lock size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: '#ffffff' }}>Read-only Gmail access</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.5 }}>
                We only read your emails, never modify or delete.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div className="kpi-icon-box" style={{ width: 34, height: 34, margin: 0 }}>
              <Database size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: '#ffffff' }}>Encrypted token storage</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.5 }}>
                Your OAuth tokens are securely encrypted.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div className="kpi-icon-box" style={{ width: 34, height: 34, margin: 0 }}>
              <EyeOff size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: '#ffffff' }}>No email sending on your behalf</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.5 }}>
                We never send emails from your account.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div className="kpi-icon-box" style={{ width: 34, height: 34, margin: 0 }}>
              <CheckCircle2 size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: '#ffffff' }}>Disconnect anytime</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.5 }}>
                You can revoke access at any time from settings or your Google account.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Sync History Table ──────────── */}
      <div className="chart-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <h3 className="chart-title">Sync History</h3>
          <p className="chart-sub">View your recent synchronization activity.</p>
        </div>

        <div className="mail-table-header" style={{ gridTemplateColumns: '1.4fr 120px 1.2fr 130px 120px 40px', background: 'transparent' }}>
          <div>Sync type</div>
          <div>Status</div>
          <div>Started</div>
          <div>Emails processed</div>
          <div>Duration</div>
          <div>Actions</div>
        </div>

        {syncHistory.map(item => (
          <div
            key={item.id}
            className="mail-row"
            style={{ gridTemplateColumns: '1.4fr 120px 1.2fr 130px 120px 40px', padding: '14px 22px' }}
          >
            <div>
              <div style={{ fontWeight: 600, color: '#ffffff', fontSize: 13 }}>{item.type}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.subType}</div>
            </div>

            <div>
              <span
                className={`status-pill ${
                  item.status === 'Completed'
                    ? 'success'
                    : item.status === 'Partial'
                    ? 'warning'
                    : 'danger'
                }`}
              >
                ● {item.status}
              </span>
            </div>

            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
              {item.started}
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>
              {item.emailsProcessed}
            </div>

            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
              {item.duration}
            </div>

            <div>
              <button className="icon-toggle" title="More">
                <MoreVertical size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
