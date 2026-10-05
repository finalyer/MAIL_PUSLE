import { useState, useEffect } from 'react'
import { getSyncJobs, getSyncStatus, triggerSync } from '../api'
import { RefreshCw, CheckCircle, XCircle, Clock, Zap, AlertCircle } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

const STATUS_CONFIG = {
  COMPLETED: { cls: 'badge-green',  icon: CheckCircle, color: 'var(--accent-green)' },
  FAILED:    { cls: 'badge-red',    icon: XCircle,     color: 'var(--accent-red)'   },
  RUNNING:   { cls: 'badge-amber',  icon: RefreshCw,   color: 'var(--accent-3)'     },
  PENDING:   { cls: 'badge-muted',  icon: Clock,       color: 'var(--text-muted)'   },
}

function JobRow({ job }) {
  const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.PENDING
  const Icon = cfg.icon
  const duration = job.started_at && job.completed_at
    ? ((new Date(job.completed_at) - new Date(job.started_at)) / 1000).toFixed(1) + 's'
    : null
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:16, alignItems:'center', padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Icon size={13} style={{ color: cfg.color, flexShrink: 0 }} />
          <span style={{ fontSize:13, fontWeight:600 }}>{job.job_type.replace('_', ' ')}</span>
          <span className={`badge ${cfg.cls}`}>{job.status}</span>
        </div>
        <div className="text-xs text-muted">
          {format(new Date(job.created_at), 'MMM d, yyyy · h:mm:ss a')}
          {duration && ` · ${duration}`}
        </div>
        {job.error_message && (
          <div className="text-xs" style={{ color:'var(--accent-red)', marginTop:4 }}>
            {job.error_message}
          </div>
        )}
      </div>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:20, fontWeight:800 }}>{job.emails_fetched}</div>
        <div className="text-xs text-muted">fetched</div>
      </div>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:20, fontWeight:800, color:'var(--accent-green)' }}>{job.emails_created}</div>
        <div className="text-xs text-muted">new</div>
      </div>
    </div>
  )
}

export default function SyncPage() {
  const [jobs, setJobs] = useState([])
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [triggering, setTriggering] = useState(false)
  const [toast, setToast] = useState(null)

  const fetchAll = async () => {
    try {
      const [jobsRes, statusRes] = await Promise.allSettled([getSyncJobs(), getSyncStatus()])
      if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value.data || [])
      if (statusRes.status === 'fulfilled') setStatus(statusRes.value.data)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    fetchAll()
    const iv = setInterval(fetchAll, 10000)
    return () => clearInterval(iv)
  }, [])

  const handleTrigger = async () => {
    setTriggering(true)
    try {
      await triggerSync()
      setToast({ type: 'success', msg: 'Sync started!' })
      setTimeout(fetchAll, 1500)
    } catch (e) {
      setToast({ type: 'error', msg: e?.response?.data?.detail || 'Sync failed to start' })
    } finally {
      setTriggering(false)
      setTimeout(() => setToast(null), 4000)
    }
  }

  const isSyncing = status?.sync_status === 'SYNCING' || jobs[0]?.status === 'RUNNING'

  return (
    <div className="page-content">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl" style={{ fontWeight:800, letterSpacing:'-0.02em', marginBottom:4 }}>
            Sync Center
          </h1>
          <p className="text-secondary text-sm">Manage and monitor your Gmail sync jobs</p>
        </div>
        <button
          className="btn btn-primary"
          id="sync-trigger-btn"
          onClick={handleTrigger}
          disabled={triggering || isSyncing}
        >
          <RefreshCw size={14} className={isSyncing ? 'pulse' : ''} />
          {isSyncing ? 'Syncing…' : 'Trigger Sync'}
        </button>
      </div>

      {/* Status card */}
      {status && (
        <div className="card p-5 mb-6">
          <div className="grid-3" style={{ gap:24 }}>
            <div>
              <div className="text-xs text-muted mb-1">Current Status</div>
              <div className={`sync-pill ${
                status.sync_status === 'SYNCED' ? 'synced' :
                status.sync_status === 'SYNCING' ? 'syncing' :
                status.sync_status === 'ERROR' ? 'error' : 'idle'
              }`} style={{ display:'inline-flex' }}>
                {isSyncing && <span className="spinner" style={{width:10,height:10,borderWidth:1.5}} />}
                {status.sync_status || 'Unknown'}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Gmail Account</div>
              <div style={{ fontSize:13, fontWeight:600 }}>{status.gmail_email || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Last Synced</div>
              <div style={{ fontSize:13, fontWeight:600 }}>
                {status.last_synced_at
                  ? formatDistanceToNow(new Date(status.last_synced_at), { addSuffix: true })
                  : 'Never'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jobs list */}
      <div className="card">
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <Zap size={14} style={{ color:'var(--accent-light)' }} />
            <span style={{ fontWeight:600, fontSize:14 }}>Sync History</span>
            <span className="badge badge-muted ml-auto">{jobs.length} jobs</span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding:20 }}>
            {[...Array(4)].map((_,i) => (
              <div key={i} className="skeleton" style={{ height:70, marginBottom:8, borderRadius:8 }} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Clock size={24} /></div>
            <div>No sync jobs yet</div>
            <div className="text-xs text-muted">Trigger your first sync to get started</div>
          </div>
        ) : (
          jobs.map(j => <JobRow key={j.id} job={j} />)
        )}
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'error' ? <AlertCircle size={16} style={{color:'var(--accent-red)'}} /> : <CheckCircle size={16} style={{color:'var(--accent-green)'}} />}
          <span className="text-sm">{toast.msg}</span>
        </div>
      )}
    </div>
  )
}
