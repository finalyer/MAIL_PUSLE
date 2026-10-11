import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail, Inbox, Send, Bookmark, Star, Zap, RefreshCw, Eye, HelpCircle,
  CornerUpLeft, CheckCircle2, ChevronRight, AlertCircle
} from 'lucide-react'
import { mockDashboardStats, mockActivity7Days, mockActivity30Days, mockEmails, mockNotifications } from '../mockData'
import { triggerSync } from '../api'
import EmailDetailDrawer from '../components/EmailDetailDrawer'
import AIReviewDrawer from '../components/AIReviewDrawer'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [activityRange, setActivityRange] = useState('7d')
  const [hoveredPoint, setHoveredPoint] = useState(mockActivity7Days[4])
  const [syncing, setSyncing] = useState(false)
  const [syncToast, setSyncToast] = useState(null)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [aiReviewEmail, setAiReviewEmail] = useState(null)

  const handleSyncNow = async () => {
    setSyncing(true)
    try {
      await triggerSync()
      setSyncToast('Mailbox sync initialized in background.')
    } catch {
      setSyncToast('Simulated mailbox sync completed.')
    } finally {
      setTimeout(() => setSyncing(false), 2000)
      setTimeout(() => setSyncToast(null), 4500)
    }
  }

  const chartData = activityRange === '7d' ? mockActivity7Days : mockActivity30Days

  // Render SVG Smooth Curved Line Chart
  const renderSmoothChart = () => {
    const width = 640
    const height = 180
    const padding = 30
    const points = chartData.length

    const getX = (i) => padding + (i / (points - 1)) * (width - 2 * padding)
    const maxY = 160
    const getY = (val) => height - padding - (val / maxY) * (height - 2 * padding)

    // Build curved path
    const buildPath = (key) => {
      return chartData.reduce((acc, d, i, arr) => {
        const x = getX(i)
        const y = getY(d[key])
        if (i === 0) return `M ${x} ${y}`
        const prevX = getX(i - 1)
        const prevY = getY(arr[i - 1][key])
        const cpX1 = prevX + (x - prevX) / 2
        const cpY1 = prevY
        const cpX2 = prevX + (x - prevX) / 2
        const cpY2 = y
        return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`
      }, '')
    }

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 50, 100, 150].map((level, i) => (
          <line
            key={i}
            x1={padding}
            y1={getY(level)}
            x2={width - padding}
            y2={getY(level)}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="3 3"
          />
        ))}

        {/* Lines */}
        <path
          d={buildPath('received')}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
        />
        <path
          d={buildPath('sent')}
          fill="none"
          stroke="var(--accent-red)"
          strokeWidth="2.5"
        />

        {/* Hover Points */}
        {chartData.map((d, i) => {
          const x = getX(i)
          const yRec = getY(d.received)
          const ySent = getY(d.sent)
          const isHovered = hoveredPoint?.date === d.date

          return (
            <g key={i} onMouseEnter={() => setHoveredPoint(d)} style={{ cursor: 'pointer' }}>
              <circle
                cx={x}
                cy={yRec}
                r={isHovered ? 5 : 3.5}
                fill="#ffffff"
                stroke="var(--bg-card)"
                strokeWidth="2"
              />
              <circle
                cx={x}
                cy={ySent}
                r={isHovered ? 5 : 3.5}
                fill="var(--accent-red)"
                stroke="var(--bg-card)"
                strokeWidth="2"
              />
              {/* X Axis Label */}
              <text
                x={x}
                y={height - 6}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="10.5"
                fontFamily="Inter"
              >
                {d.date}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  return (
    <div className="page-container fade-in">
      {/* Toast Notification */}
      {syncToast && (
        <div
          style={{
            position: 'fixed',
            top: 70,
            right: 28,
            zIndex: 90,
            background: 'var(--bg-card)',
            border: '1px solid var(--accent-red)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <CheckCircle2 size={16} color="var(--accent-red)" />
          <span style={{ fontSize: 13, color: '#ffffff' }}>{syncToast}</span>
        </div>
      )}

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Good morning, Alex</h1>
          <p className="page-subtitle">Here is your email activity overview.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="status-pill success" style={{ padding: '6px 12px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-green)', display: 'inline-block' }} />
            <span>Synced</span>
            <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>Last synced 5 minutes ago</span>
          </div>

          <button
            className="btn btn-outline-red btn-sm"
            onClick={handleSyncNow}
            disabled={syncing}
            id="dashboard-sync-btn"
          >
            <RefreshCw size={13} className={syncing ? 'animate-spin-slow' : ''} />
            <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* ── 6 KPI Cards Grid ────────────────────────────── */}
      <div className="kpi-grid">
        {mockDashboardStats.map(stat => (
          <div key={stat.id} className="kpi-card" id={`kpi-${stat.id}`}>
            <div className="kpi-icon-box">
              {stat.icon === 'Mail' && <Mail size={17} />}
              {stat.icon === 'Inbox' && <Inbox size={17} />}
              {stat.icon === 'Send' && <Send size={17} />}
              {stat.icon === 'Bookmark' && <Bookmark size={17} />}
              {stat.icon === 'Star' && <Star size={17} />}
              {stat.icon === 'Zap' && <Zap size={17} />}
            </div>
            <div className="kpi-label">{stat.label}</div>
            <div className="kpi-value-row">
              <span className="kpi-value">{stat.value}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className={`kpi-change-tag ${stat.alert ? 'down' : 'up'}`}>
                {stat.change}
              </span>
              <span className="kpi-subtext">{stat.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle Row: Email Activity Chart & Donut Visuals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginBottom: 24 }}>
        {/* Email Activity Card */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Email Activity</h3>
              <p className="chart-sub">Incoming and outgoing emails over time.</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                className={`filter-tab-pill ${activityRange === '7d' ? 'active' : ''}`}
                style={{ padding: '4px 10px', fontSize: 11.5 }}
                onClick={() => setActivityRange('7d')}
              >
                7 days
              </button>
              <button
                className={`filter-tab-pill ${activityRange === '30d' ? 'active' : ''}`}
                style={{ padding: '4px 10px', fontSize: 11.5 }}
                onClick={() => setActivityRange('30d')}
              >
                30 days
              </button>
              <button
                className={`filter-tab-pill ${activityRange === '3m' ? 'active' : ''}`}
                style={{ padding: '4px 10px', fontSize: 11.5 }}
                onClick={() => setActivityRange('30d')}
              >
                3 months
              </button>
            </div>
          </div>

          {/* Interactive Tooltip Card */}
          {hoveredPoint && (
            <div
              style={{
                position: 'absolute',
                top: 75,
                right: 32,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: 11.5,
                boxShadow: 'var(--shadow-md)',
                zIndex: 10
              }}
            >
              <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>{hoveredPoint.date}, 2026</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ color: '#ffffff' }}>● Received: {hoveredPoint.received}</span>
                <span style={{ color: 'var(--accent-red)' }}>● Sent: {hoveredPoint.sent}</span>
              </div>
            </div>
          )}

          {/* SVG Chart */}
          <div className="svg-chart-container">
            {renderSmoothChart()}
          </div>

          {/* Chart Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12, fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: '#ffffff' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Received (640)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="legend-dot" style={{ background: 'var(--accent-red)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Sent (428)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Read vs Unread & Sent Mail Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Read vs Unread Donut */}
          <div className="chart-card">
            <div className="chart-header" style={{ marginBottom: 12 }}>
              <div>
                <h3 className="chart-title">Read vs Unread</h3>
                <p className="chart-sub">Distribution of your emails.</p>
              </div>
            </div>

            <div className="donut-wrap">
              <div className="donut-svg-box">
                <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                  {/* Background Track */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                  {/* Read Segment (93.1%) */}
                  <circle
                    cx="50" cy="50" r="38" fill="none" stroke="#ffffff" strokeWidth="12"
                    strokeDasharray={`${(93.1 / 100) * 238.7} 238.7`}
                    strokeDashoffset="0"
                  />
                  {/* Unread Segment (6.9%) */}
                  <circle
                    cx="50" cy="50" r="38" fill="none" stroke="var(--accent-red)" strokeWidth="12"
                    strokeDasharray={`${(6.9 / 100) * 238.7} 238.7`}
                    strokeDashoffset={`${-((93.1 / 100) * 238.7)}`}
                  />
                </svg>
                <div className="donut-center-text">
                  <span className="donut-center-val">1,248</span>
                  <span className="donut-center-lbl">Total</span>
                </div>
              </div>

              <div className="donut-legend-list">
                <div className="donut-legend-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="legend-dot" style={{ background: 'var(--accent-red)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>Unread</span>
                  </div>
                  <span style={{ fontWeight: 600, color: '#ffffff' }}>86 (6.9%)</span>
                </div>
                <div className="donut-legend-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="legend-dot" style={{ background: '#ffffff' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>Read</span>
                  </div>
                  <span style={{ fontWeight: 600, color: '#ffffff' }}>1,162 (93.1%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sent Mail Status Progress bars */}
          <div className="chart-card">
            <div className="chart-header" style={{ marginBottom: 12 }}>
              <div>
                <h3 className="chart-title">Sent Mail Status</h3>
                <p className="chart-sub">Based on available read receipts and replies.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                    <Eye size={13} color="var(--accent-red)" /> Read status known
                  </span>
                  <span style={{ fontWeight: 600 }}>312 <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>73%</span></span>
                </div>
                <div className="activity-bar">
                  <div className="activity-fill" style={{ width: '73%' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                    <HelpCircle size={13} color="var(--text-muted)" /> Read status unknown
                  </span>
                  <span style={{ fontWeight: 600 }}>86 <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>20%</span></span>
                </div>
                <div className="activity-bar">
                  <div className="activity-fill" style={{ width: '20%', background: '#6b7280' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                    <CornerUpLeft size={13} color="var(--accent-red)" /> Replies received
                  </span>
                  <span style={{ fontWeight: 600 }}>30 <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>7%</span></span>
                </div>
                <div className="activity-bar">
                  <div className="activity-fill" style={{ width: '7%', background: 'var(--accent-red)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Recent Conversations & Notifications Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 18 }}>
        {/* Recent Conversations */}
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="chart-title">Recent Conversations</h3>
            <Link to="/inbox" style={{ fontSize: 12.5, color: 'var(--accent-red)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>View all</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {mockEmails.slice(0, 5).map(email => (
              <div
                key={email.id}
                className="mail-row"
                style={{ gridTemplateColumns: '36px 140px 1.5fr 100px 30px 30px 80px', padding: '12px 20px' }}
                onClick={() => setSelectedEmail(email)}
              >
                <div className="contact-avatar">{email.avatar}</div>
                <div className="truncate" style={{ fontWeight: 600, fontSize: 13, color: '#ffffff' }}>
                  {email.sender}
                </div>
                <div className="truncate" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: '#ffffff' }}>{email.subject}</span>{' — '}
                  <span style={{ color: 'var(--text-muted)' }}>{email.snippet}</span>
                </div>
                <div>
                  <span className={`category-badge ${email.category?.toLowerCase() || 'project'}`}>
                    {email.category}
                  </span>
                </div>
                <div>
                  {!email.isRead && <div className="unread-dot-indicator" />}
                </div>
                <div>
                  {email.isStarred && <Star size={14} fill="#fbbf24" color="#fbbf24" />}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', textAlign: 'right' }}>
                  {email.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Feed Widget */}
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="chart-title">Notifications</h3>
            <span style={{ fontSize: 12.5, color: 'var(--accent-red)', cursor: 'pointer' }} onClick={() => navigate('/inbox')}>
              View all
            </span>
          </div>

          <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mockNotifications.slice(0, 5).map(notif => (
              <div key={notif.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: notif.type === 'sync' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: notif.type === 'sync' ? 'var(--status-green)' : 'var(--accent-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {notif.type === 'reply' && <CornerUpLeft size={14} />}
                  {notif.type === 'read' && <Eye size={14} />}
                  {notif.type === 'sync' && <CheckCircle2 size={14} />}
                  {notif.type === 'flag' && <Bookmark size={14} />}
                  {notif.type === 'error' && <AlertCircle size={14} />}
                  {notif.type === 'inbox' && <Mail size={14} />}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#ffffff' }}>{notif.title}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{notif.time}</span>
                  </div>
                  <p className="truncate" style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {notif.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email Detail Drawer */}
      <EmailDetailDrawer
        email={selectedEmail}
        isOpen={Boolean(selectedEmail)}
        onClose={() => setSelectedEmail(null)}
        onOpenAIReview={(email) => {
          setSelectedEmail(null)
          setAiReviewEmail(email)
        }}
      />

      {/* AI Review Drawer */}
      <AIReviewDrawer
        email={aiReviewEmail}
        isOpen={Boolean(aiReviewEmail)}
        onClose={() => setAiReviewEmail(null)}
      />
    </div>
  )
}
