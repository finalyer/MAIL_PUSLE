import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail, Send, CornerUpLeft, Star, Eye, Download, ChevronLeft, ChevronRight,
  Info, ArrowRight, Bookmark, Archive, CheckCircle2
} from 'lucide-react'
import { mockMonthlyReportStats, mockTopCorrespondences } from '../mockData'

export default function ReportsPage() {
  const navigate = useNavigate()
  const [currentMonth, setCurrentMonth] = useState('September 2026')
  const [exporting, setExporting] = useState(false)

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => {
      setExporting(false)
      alert(`Report for ${currentMonth} exported as PDF.`)
    }, 1200)
  }

  // Daily bars for Sept (1-30)
  const days = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1
    const rec = Math.floor(Math.sin(day * 0.5) * 35 + 45) + (day % 7 === 0 ? 30 : 0)
    const sent = Math.floor(rec * 0.45)
    return { day, rec, sent }
  })

  return (
    <div className="page-container fade-in">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Monthly Report</h1>
          <p className="page-subtitle">Your communication activity for {currentMonth}.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Month Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '4px 8px' }}>
            <button
              className="icon-toggle"
              onClick={() => setCurrentMonth(currentMonth === 'September 2026' ? 'August 2026' : 'September 2026')}
            >
              <ChevronLeft size={15} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', minWidth: 120, textAlign: 'center' }}>
              {currentMonth}
            </span>
            <button
              className="icon-toggle"
              onClick={() => setCurrentMonth(currentMonth === 'September 2026' ? 'October 2026' : 'September 2026')}
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Export Report Button */}
          <button className="btn btn-primary-red" onClick={handleExport} disabled={exporting}>
            <Download size={15} />
            <span>{exporting ? 'Generating PDF...' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* ── 5 Stat Cards with Mini Sparklines ────────────── */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {mockMonthlyReportStats.map(stat => (
          <div key={stat.id} className="kpi-card" id={`rep-stat-${stat.id}`}>
            <div className="kpi-icon-box">
              {stat.icon === 'Mail' && <Mail size={16} />}
              {stat.icon === 'Send' && <Send size={16} />}
              {stat.icon === 'CornerUpLeft' && <CornerUpLeft size={16} />}
              {stat.icon === 'Star' && <Star size={16} />}
              {stat.icon === 'Eye' && <Eye size={16} />}
            </div>
            <div className="kpi-label">{stat.label}</div>
            <div className="kpi-value-row">
              <span className="kpi-value">{stat.value}</span>
              <span className="kpi-change-tag up">{stat.change}</span>
            </div>
            {stat.sub && <div className="kpi-subtext">{stat.sub}</div>}

            {/* Mini Sparkline Bars */}
            <div className="mini-sparkline">
              {stat.spark.map((h, idx) => (
                <div
                  key={idx}
                  className="spark-bar"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle Row: Monthly Activity Distribution & Action Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 18, marginBottom: 24 }}>
        {/* Monthly Activity Daily Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Monthly Activity</h3>
              <p className="chart-sub">Daily distribution of received and sent emails.</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="legend-dot" style={{ background: 'var(--accent-red)' }} />
                <span>Received (1,024)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="legend-dot" style={{ background: '#9ca3af' }} />
                <span>Sent (428)</span>
              </div>
            </div>
          </div>

          {/* Grouped Bar Chart Visual */}
          <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 4, paddingTop: 16 }}>
            {days.map(d => (
              <div
                key={d.day}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  gap: 2,
                  height: '100%'
                }}
                title={`Day ${d.day}: ${d.rec} received, ${d.sent} sent`}
              >
                {/* Received Bar */}
                <div
                  style={{
                    width: '45%',
                    height: `${(d.rec / 100) * 100}%`,
                    background: 'var(--accent-red)',
                    borderRadius: '2px 2px 0 0'
                  }}
                />
                {/* Sent Bar */}
                <div
                  style={{
                    width: '45%',
                    height: `${(d.sent / 100) * 100}%`,
                    background: '#6b7280',
                    borderRadius: '2px 2px 0 0'
                  }}
                />
              </div>
            ))}
          </div>

          {/* X Axis Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10.5, color: 'var(--text-muted)' }}>
            <span>Sep 1</span>
            <span>3</span>
            <span>5</span>
            <span>7</span>
            <span>9</span>
            <span>11</span>
            <span>13</span>
            <span>15</span>
            <span>17</span>
            <span>19</span>
            <span>21</span>
            <span>23</span>
            <span>25</span>
            <span>27</span>
            <span>29</span>
          </div>
        </div>

        {/* Action Summary Card */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Action Summary</h3>
              <p className="chart-sub">Key interactions performed this month.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CornerUpLeft size={16} color="var(--accent-red)" />
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Replies sent</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-red)' }}>164</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Star size={16} color="var(--accent-red)" />
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Emails starred</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-red)' }}>76</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Bookmark size={16} color="var(--accent-red)" />
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Emails marked important</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>52</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Archive size={16} color="var(--accent-red)" />
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Emails archived</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>48</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Eye size={16} color="var(--accent-red)" />
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Emails opened or reviewed</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>386</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Recipient Role Classification & Top 10 Correspondences Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: 18 }}>
        {/* Recipient Role Classification Donut */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Recipient Role Classification</h3>
              <p className="chart-sub">Distribution of email roles.</p>
            </div>
          </div>

          <div className="donut-wrap" style={{ marginBottom: 16 }}>
            <div className="donut-svg-box">
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="11" />
                {/* To: 65% in Red */}
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="var(--accent-red)" strokeWidth="11"
                  strokeDasharray={`${(65 / 100) * 238.7} 238.7`}
                />
                {/* CC: 32% in Gray */}
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="#6b7280" strokeWidth="11"
                  strokeDasharray={`${(32 / 100) * 238.7} 238.7`}
                  strokeDashoffset={`${-((65 / 100) * 238.7)}`}
                />
                {/* BCC: 3% in Light White */}
                <circle
                  cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="11"
                  strokeDasharray={`${(3 / 100) * 238.7} 238.7`}
                  strokeDashoffset={`${-(((65 + 32) / 100) * 238.7)}`}
                />
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
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontWeight: 600 }}>642</span>
                  <span style={{ color: 'var(--text-muted)' }}>65%</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="legend-dot" style={{ background: '#6b7280' }} />
                  <span>CC</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontWeight: 600 }}>318</span>
                  <span style={{ color: 'var(--text-muted)' }}>32%</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="legend-dot" style={{ background: '#e5e7eb' }} />
                  <span>BCC</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontWeight: 600 }}>24</span>
                  <span style={{ color: 'var(--text-muted)' }}>3%</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
            <Info size={13} />
            <span>An email may appear in more than one recipient category.</span>
          </div>
        </div>

        {/* Top 10 Correspondences Preview */}
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="chart-title">Top 10 Correspondences</h3>
            <Link
              to="/contacts"
              style={{ fontSize: 12.5, color: 'var(--accent-red)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              className="mail-table-header"
              style={{ gridTemplateColumns: '36px 1.4fr 100px 90px 80px 80px 100px', padding: '10px 18px', background: 'transparent' }}
            >
              <div>#</div>
              <div>Contact</div>
              <div>Total emails ▾</div>
              <div>Received</div>
              <div>Sent</div>
              <div>Replies</div>
              <div>Last activity</div>
            </div>

            {mockTopCorrespondences.slice(0, 6).map((c, idx) => (
              <div
                key={c.rank}
                className="mail-row"
                style={{
                  gridTemplateColumns: '36px 1.4fr 100px 90px 80px 80px 100px',
                  padding: '10px 18px',
                  background: idx === 0 ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                }}
                onClick={() => navigate('/contacts')}
              >
                <div>
                  <span
                    className={`rank-badge ${idx < 3 ? `top-${idx + 1}` : ''}`}
                    style={{ width: 22, height: 22, fontSize: 11 }}
                  >
                    {c.rank}
                  </span>
                </div>
                <div className="truncate" style={{ fontWeight: 600, color: idx === 0 ? 'var(--accent-red)' : '#ffffff', fontSize: 12.5 }}>
                  {c.name}
                </div>
                <div style={{ fontWeight: 600, color: idx === 0 ? 'var(--accent-red)' : '#ffffff', fontSize: 12.5 }}>
                  {c.total}
                </div>
                <div style={{ color: idx === 0 ? 'var(--accent-red)' : 'var(--text-secondary)', fontSize: 12 }}>
                  {c.received}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                  {c.sent}
                </div>
                <div style={{ color: idx === 0 ? 'var(--accent-red)' : 'var(--text-secondary)', fontSize: 12 }}>
                  {c.replies}
                </div>
                <div style={{ color: idx === 0 ? 'var(--accent-red)' : 'var(--text-muted)', fontSize: 11.5 }}>
                  {c.lastActivity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
