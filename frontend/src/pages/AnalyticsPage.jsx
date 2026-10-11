import { useState, useEffect } from 'react'
import {
  Mail, Send, CornerUpLeft, Clock, Star, Zap, Download, ChevronDown,
  TrendingUp, Calendar, AlertCircle, Sparkles
} from 'lucide-react'
import { mockAnalyticsKPIs, mockActivity30Days } from '../mockData'
import { getAnalytics } from '../api'
import { useAuth } from '../contexts/AuthContext'

export default function AnalyticsPage() {
  const { user, isDemoUser } = useAuth()
  const [timeRange, setTimeRange] = useState('Last 30 days')
  const [realAnalytics, setRealAnalytics] = useState(null)

  useEffect(() => {
    if (user && !isDemoUser) {
      getAnalytics()
        .then(res => {
          if (res.data?.success) setRealAnalytics(res.data.data)
        })
        .catch(err => console.warn('Could not load analytics:', err))
    }
  }, [user, isDemoUser])

  const kpis = realAnalytics ? [
    { label: 'Total Received', value: (realAnalytics.received ?? (realAnalytics.total_emails - (realAnalytics.sent || 0))).toLocaleString(), change: 'Live', note: 'synced emails', icon: 'Mail', isUp: true },
    { label: 'Total Sent', value: (realAnalytics.sent ?? 0).toLocaleString(), change: 'Outbox', note: 'sent messages', icon: 'Send', isUp: true },
    { label: 'Unread Rate', value: `${Math.round(((realAnalytics.unread || 0) / (realAnalytics.total_emails || 1)) * 100)}%`, change: `${realAnalytics.unread} unread`, note: 'pending review', icon: 'Clock', isUp: false },
    { label: 'Starred & Key', value: (realAnalytics.starred ?? 0).toLocaleString(), change: 'Priority', note: 'flagged messages', icon: 'Star', isUp: true },
    { label: 'With Attachments', value: (realAnalytics.with_attachments ?? 0).toLocaleString(), change: 'Documents', note: 'contain files', icon: 'CornerUpLeft', isUp: true },
    { label: 'Total Processed', value: (realAnalytics.total_emails ?? 0).toLocaleString(), change: 'Indexed', note: 'in database', icon: 'Zap', isUp: true },
  ] : mockAnalyticsKPIs

  return (
    <div className="page-container fade-in">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Email Analytics</h1>
          <p className="page-subtitle">Discover patterns in your inbox and sent mail activity.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            className="topbar-date-picker"
            onClick={() => setTimeRange(timeRange === 'Last 30 days' ? 'Last 90 days' : 'Last 30 days')}
          >
            <Calendar size={14} color="var(--text-muted)" />
            <span>{timeRange}</span>
            <ChevronDown size={13} color="var(--text-muted)" />
          </div>

          <button className="btn btn-primary-red" onClick={() => alert('Exporting Analytics Overview...')}>
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* ── 6 KPI Cards ─────────────────────────────────── */}
      <div className="kpi-grid">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="kpi-card" id={`analytics-kpi-${idx}`}>
            <div className="kpi-icon-box">
              {kpi.icon === 'Mail' && <Mail size={16} />}
              {kpi.icon === 'Send' && <Send size={16} />}
              {kpi.icon === 'CornerUpLeft' && <CornerUpLeft size={16} />}
              {kpi.icon === 'Clock' && <Clock size={16} />}
              {kpi.icon === 'Star' && <Star size={16} />}
              {kpi.icon === 'Zap' && <Zap size={16} />}
            </div>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value-row">
              <span className="kpi-value">{kpi.value}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className={`kpi-change-tag ${kpi.isUp ? 'up' : 'down'}`}>
                {kpi.change}
              </span>
              <span className="kpi-subtext">{kpi.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle Row: Communication Volume & Sent Mail Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginBottom: 24 }}>
        {/* Communication Volume Grouped Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Communication Volume</h3>
              <p className="chart-sub">Daily email activity over the last 30 days.</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="legend-dot" style={{ background: 'var(--accent-red)' }} />
                <span>Received emails</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="legend-dot" style={{ background: '#d1d5db' }} />
                <span>Sent emails</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="legend-dot" style={{ background: '#6b7280' }} />
                <span>Replies received</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visual */}
          <div style={{ height: 210, display: 'flex', alignItems: 'flex-end', gap: 14, paddingTop: 20 }}>
            {mockActivity30Days.map((d, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  gap: 3,
                  height: '100%'
                }}
                title={`${d.date}: ${d.received} rec, ${d.sent} sent, ${d.replies} rep`}
              >
                <div style={{ width: '30%', height: `${(d.received / 150) * 100}%`, background: 'var(--accent-red)', borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '30%', height: `${(d.sent / 150) * 100}%`, background: '#d1d5db', borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '30%', height: `${(d.replies / 150) * 100}%`, background: '#6b7280', borderRadius: '2px 2px 0 0' }} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
            {mockActivity30Days.map((d, i) => (
              <span key={i}>{d.date}</span>
            ))}
          </div>
        </div>

        {/* Sent Mail Status Donut */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Sent Mail Status</h3>
              <p className="chart-sub">Read and response status for sent emails.</p>
            </div>
          </div>

          <div className="donut-wrap">
            <div className="donut-svg-box">
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="var(--accent-red)" strokeWidth="12"
                  strokeDasharray={`${(72.9 / 100) * 238.7} 238.7`}
                />
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="#6b7280" strokeWidth="12"
                  strokeDasharray={`${(18.2 / 100) * 238.7} 238.7`}
                  strokeDashoffset={`${-((72.9 / 100) * 238.7)}`}
                />
              </svg>
              <div className="donut-center-text">
                <span className="donut-center-val">428</span>
                <span className="donut-center-lbl">Sent Emails</span>
              </div>
            </div>

            <div className="donut-legend-list">
              <div className="donut-legend-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="legend-dot" style={{ background: 'var(--accent-red)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Read status known</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>312</span>
                  <span style={{ color: 'var(--text-muted)' }}>72.9%</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="legend-dot" style={{ background: '#6b7280' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Read status unknown</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>78</span>
                  <span style={{ color: 'var(--text-muted)' }}>18.2%</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="legend-dot" style={{ background: '#d1d5db' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Read receipts received</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>64</span>
                  <span style={{ color: 'var(--text-muted)' }}>15.0%</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="legend-dot" style={{ background: 'var(--accent-red)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Replies received</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>164</span>
                  <span style={{ color: 'var(--text-muted)' }}>38.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Recipient Role, Action Distribution & Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
        {/* Recipient Role Breakdown */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Recipient Role Breakdown</h3>
              <p className="chart-sub">Distribution of recipient types in your sent emails.</p>
            </div>
          </div>

          <div className="donut-wrap">
            <div className="donut-svg-box">
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="var(--accent-red)" strokeWidth="12" strokeDasharray={`${(65.2 / 100) * 238.7} 238.7`} />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#6b7280" strokeWidth="12" strokeDasharray={`${(32.3 / 100) * 238.7} 238.7`} strokeDashoffset={`${-((65.2 / 100) * 238.7)}`} />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeDasharray={`${(2.4 / 100) * 238.7} 238.7`} strokeDashoffset={`${-(((65.2 + 32.3) / 100) * 238.7)}`} />
              </svg>
              <div className="donut-center-text">
                <span className="donut-center-val">984</span>
                <span className="donut-center-lbl">Total Recipients</span>
              </div>
            </div>

            <div className="donut-legend-list">
              <div className="donut-legend-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="legend-dot" style={{ background: 'var(--accent-red)' }} />
                  <span>To</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>642</span>
                  <span style={{ color: 'var(--text-muted)' }}>65.2%</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="legend-dot" style={{ background: '#6b7280' }} />
                  <span>CC</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>318</span>
                  <span style={{ color: 'var(--text-muted)' }}>32.3%</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="legend-dot" style={{ background: '#e5e7eb' }} />
                  <span>BCC</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>24</span>
                  <span style={{ color: 'var(--text-muted)' }}>2.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Action Distribution</h3>
              <p className="chart-sub">How you interact with your emails.</p>
            </div>
          </div>

          <div className="donut-wrap">
            <div className="donut-svg-box">
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="var(--accent-red)" strokeWidth="12" strokeDasharray={`${(42.5 / 100) * 238.7} 238.7`} />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#d1d5db" strokeWidth="12" strokeDasharray={`${(19.7 / 100) * 238.7} 238.7`} strokeDashoffset={`${-((42.5 / 100) * 238.7)}`} />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#6b7280" strokeWidth="12" strokeDasharray={`${(16.1 / 100) * 238.7} 238.7`} strokeDashoffset={`${-(((42.5 + 19.7) / 100) * 238.7)}`} />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#374151" strokeWidth="12" strokeDasharray={`${(21.8 / 100) * 238.7} 238.7`} strokeDashoffset={`${-(((42.5 + 19.7 + 16.1) / 100) * 238.7)}`} />
              </svg>
              <div className="donut-center-text">
                <span className="donut-center-val">386</span>
                <span className="donut-center-lbl">Total Actions</span>
              </div>
            </div>

            <div className="donut-legend-list">
              <div className="donut-legend-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="legend-dot" style={{ background: 'var(--accent-red)' }} />
                  <span>Replied</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>164</span>
                  <span style={{ color: 'var(--text-muted)' }}>42.5%</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="legend-dot" style={{ background: '#d1d5db' }} />
                  <span>Starred</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>76</span>
                  <span style={{ color: 'var(--text-muted)' }}>19.7%</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="legend-dot" style={{ background: '#6b7280' }} />
                  <span>Marked Important</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>62</span>
                  <span style={{ color: 'var(--text-muted)' }}>16.1%</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="legend-dot" style={{ background: '#374151' }} />
                  <span>Archived</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>84</span>
                  <span style={{ color: 'var(--text-muted)' }}>21.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Insights Card */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Insights</h3>
              <p className="chart-sub">Smart analytical detections.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div className="kpi-icon-box" style={{ width: 32, height: 32, margin: 0 }}>
                <TrendingUp size={15} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#ffffff' }}>Your reply rate increased by 18%</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>You're responding to more emails this month.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div className="kpi-icon-box" style={{ width: 32, height: 32, margin: 0 }}>
                <Calendar size={15} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#ffffff' }}>Tuesday is your busiest day</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>You receive 28% more emails on Tuesdays.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div className="kpi-icon-box" style={{ width: 32, height: 32, margin: 0 }}>
                <Clock size={15} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#ffffff' }}>
                  Average response time: 4.2 hours <span className="text-green" style={{ fontSize: 11.5 }}>↓ 32%</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Faster than last month.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
