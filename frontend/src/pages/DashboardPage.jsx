import { useEffect, useState } from 'react'
import { Mail, Star, Inbox, Clock, Users, TrendingUp, Zap, RefreshCw, AlertCircle } from 'lucide-react'
import { getAnalytics, getSyncStatus, triggerSync } from '../api'
import { formatDistanceToNow } from 'date-fns'

function StatCard({ icon: Icon, iconClass, value, label, sub }) {
  return (
    <div className="stat-card fade-in">
      <div className={`stat-icon ${iconClass}`}>
        <Icon size={18} />
      </div>
      <div className="stat-value">{value ?? <span className="skeleton" style={{height:28,display:'block',width:80}}/>}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-change up">{sub}</div>}
    </div>
  )
}

function MiniBarChart({ data, color = '#7c3aed' }) {
  if (!data?.length) return null
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="chart-bar-wrap">
      {data.map((d, i) => (
        <div
          key={i}
          className="chart-bar"
          style={{ height: `${Math.max((d.count / max) * 100, 4)}%`, background: color }}
          title={`${d.label || d.date}: ${d.count}`}
        />
      ))}
    </div>
  )
}

function SyncStatusBanner({ status, lastSynced, onTrigger, triggering }) {
  const isPill = (s) => {
    if (!s) return 'idle'
    const sl = s.toLowerCase()
    if (sl === 'synced') return 'synced'
    if (sl === 'syncing') return 'syncing'
    if (sl === 'error') return 'error'
    return 'idle'
  }

  const statusLabel = {
    synced: '✓ Synced',
    syncing: 'Syncing…',
    error: 'Sync Error',
    idle: 'Not synced',
  }

  const pillClass = isPill(status)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <div className={`sync-pill ${pillClass}`}>
        {pillClass === 'syncing' && <span className="spinner" style={{width:10,height:10,borderWidth:1.5}} />}
        {statusLabel[pillClass]}
      </div>
      {lastSynced && (
        <span className="text-muted text-xs">
          Last synced {formatDistanceToNow(new Date(lastSynced), { addSuffix: true })}
        </span>
      )}
      <button
        className="btn btn-ghost btn-sm ml-auto"
        id="trigger-sync-btn"
        onClick={onTrigger}
        disabled={triggering || pillClass === 'syncing'}
      >
        <RefreshCw size={13} className={triggering ? 'pulse' : ''} />
        {triggering ? 'Starting…' : 'Sync Now'}
      </button>
    </div>
  )
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null)
  const [syncStatus, setSyncStatus] = useState(null)
  const [triggering, setTriggering] = useState(false)
  const [toast, setToast] = useState(null)

  const fetchAll = async () => {
    try {
      const [analyticsRes, syncRes] = await Promise.allSettled([
        getAnalytics(),
        getSyncStatus(),
      ])
      if (analyticsRes.status === 'fulfilled') {
        // analytics response: { success, data: {...}, account: {...} }
        const body = analyticsRes.value.data
        setAnalytics(body.data || body)
      }
      if (syncRes.status === 'fulfilled') setSyncStatus(syncRes.value.data)
    } catch {}
  }

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleSync = async () => {
    setTriggering(true)
    try {
      await triggerSync()
      setToast({ type: 'success', msg: 'Sync started! Your inbox is being updated.' })
      setTimeout(fetchAll, 2000)
    } catch (e) {
      const msg = e?.response?.data?.detail || 'Failed to start sync'
      setToast({ type: 'error', msg })
    } finally {
      setTriggering(false)
      setTimeout(() => setToast(null), 4000)
    }
  }

  const a = analytics

  return (
    <div className="page-content">
      <div className="mb-6">
        <h1 className="text-2xl" style={{ fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Dashboard
        </h1>
        <p className="text-secondary text-sm">Your Gmail intelligence overview</p>
      </div>

      <SyncStatusBanner
        status={syncStatus?.sync_status}
        lastSynced={syncStatus?.last_synced_at}
        onTrigger={handleSync}
        triggering={triggering}
      />

      {/* Stats grid */}
      <div className="grid-4 mb-6">
        <StatCard
          icon={Mail}
          iconClass="stat-icon-purple"
          value={a?.total_emails?.toLocaleString() ?? '—'}
          label="Total Emails"
        />
        <StatCard
          icon={Inbox}
          iconClass="stat-icon-cyan"
          value={a ? (a.sent + a.received).toLocaleString() : '—'}
          label="Received + Sent"
        />
        <StatCard
          icon={Star}
          iconClass="stat-icon-amber"
          value={a?.unread?.toLocaleString() ?? '—'}
          label="Unread"
        />
        <StatCard
          icon={Users}
          iconClass="stat-icon-green"
          value={a?.with_attachments?.toLocaleString() ?? '—'}
          label="With Attachments"
        />
      </div>

      {/* Second row */}
      <div className="grid-2 mb-6">
        {/* Email volume chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm" style={{ fontWeight: 600, marginBottom: 2 }}>Email Volume</div>
              <div className="text-xs text-muted">Last 30 days</div>
            </div>
            <TrendingUp size={16} className="text-accent" />
          </div>
          {a?.volume_by_day ? (
            <MiniBarChart data={a.volume_by_day} />
          ) : (
            <div className="skeleton" style={{ height: 64, borderRadius: 8 }} />
          )}
        </div>

        {/* Top senders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm" style={{ fontWeight: 600, marginBottom: 2 }}>Top Senders</div>
              <div className="text-xs text-muted">By message count</div>
            </div>
            <Users size={16} className="text-accent" />
          </div>
          {a?.top_senders ? (
            <div className="flex flex-col gap-2">
              {a.top_senders.slice(0, 5).map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="avatar" style={{ width: 24, height: 24, fontSize: 10 }}>
                    {s.sender_email?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-xs truncate flex-1" style={{ color: 'var(--text-secondary)' }}>
                    {s.sender_email}
                  </span>
                  <span className="badge badge-muted">{s.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {[80,60,45,30,20].map((w,i) => (
                <div key={i} className="skeleton skel-text" style={{ width: `${w}%` }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Labels breakdown */}
      {a?.label_breakdown && (
        <div className="card p-5">
          <div className="text-sm mb-4" style={{ fontWeight: 600 }}>Label Breakdown</div>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(a.label_breakdown).map(([label, count]) => (
              <div key={label} className="badge badge-muted" style={{ fontSize: 12, padding: '4px 10px' }}>
                {label} · <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sync job info */}
      {syncStatus?.latest_job && (
        <div className="card p-4 mt-4 flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
          <Zap size={14} style={{ color: 'var(--accent-light)', flexShrink: 0 }} />
          <div className="text-xs text-secondary flex-1">
            Last sync job: <strong>{syncStatus.latest_job.job_type}</strong> ·{' '}
            {syncStatus.latest_job.emails_fetched} fetched ·{' '}
            {syncStatus.latest_job.emails_created} created
          </div>
          <span className={`badge ${syncStatus.latest_job.status === 'COMPLETED' ? 'badge-green' : syncStatus.latest_job.status === 'FAILED' ? 'badge-red' : 'badge-amber'}`}>
            {syncStatus.latest_job.status}
          </span>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'error' ? <AlertCircle size={16} style={{color:'var(--accent-red)'}} /> : <Zap size={16} style={{color:'var(--accent-green)'}} />}
          <span className="text-sm">{toast.msg}</span>
        </div>
      )}
    </div>
  )
}
