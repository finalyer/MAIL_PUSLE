import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, BarChart2, ArrowRight, Mail } from 'lucide-react'
import { mockTopCorrespondences } from '../mockData'

export default function ContactsPage() {
  const navigate = useNavigate()
  const [currentMonth, setCurrentMonth] = useState('September 2026')

  return (
    <div className="page-container fade-in">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Top 10 Correspondences</h1>
          <p className="page-subtitle">People and organizations with the highest email activity during this month.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Month Navigator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '4px 8px' }}>
            <button className="icon-toggle" onClick={() => setCurrentMonth(currentMonth === 'September 2026' ? 'August 2026' : 'September 2026')}>
              <ChevronLeft size={15} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', minWidth: 120, textAlign: 'center' }}>
              {currentMonth}
            </span>
            <button className="icon-toggle" onClick={() => setCurrentMonth(currentMonth === 'September 2026' ? 'October 2026' : 'September 2026')}>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* View Full Report Button */}
          <button className="btn btn-outline-red" onClick={() => navigate('/reports')}>
            <BarChart2 size={15} />
            <span>View full report</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Ranked Correspondences Table ────────────────── */}
      <div className="mail-table-container">
        <div
          className="mail-table-header"
          style={{ gridTemplateColumns: '44px 44px 1.5fr 1fr 1fr 1fr 1fr 1.2fr 1.5fr' }}
        >
          <div>#</div>
          <div />
          <div>Contact</div>
          <div>Total Emails ▾</div>
          <div>Received</div>
          <div>Sent</div>
          <div>Replies</div>
          <div>Last Activity</div>
          <div>Activity</div>
        </div>

        {mockTopCorrespondences.map(contact => {
          const isTopTier = contact.rank <= 3

          return (
            <div
              key={contact.rank}
              className={`leaderboard-row ${isTopTier ? 'top-tier' : ''}`}
              id={`contact-row-${contact.rank}`}
            >
              {/* Rank Badge with Glow for Top 3 */}
              <div>
                <span className={`rank-badge ${contact.rank <= 3 ? `top-${contact.rank}` : ''}`}>
                  {contact.rank}
                </span>
              </div>

              {/* Avatar Initial Circle */}
              <div>
                <div
                  className="contact-avatar"
                  style={{
                    background: isTopTier ? 'rgba(239, 68, 68, 0.2)' : '#27272a',
                    color: isTopTier ? 'var(--accent-red)' : '#ffffff'
                  }}
                >
                  {contact.avatar}
                </div>
              </div>

              {/* Contact Name & Email */}
              <div style={{ minWidth: 0 }}>
                <div className="truncate" style={{ fontWeight: 600, color: '#ffffff', fontSize: 13.5 }}>
                  {contact.name}
                </div>
                <div className="truncate" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {contact.email}
                </div>
              </div>

              {/* Total Emails */}
              <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                {contact.total}
              </div>

              {/* Received */}
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {contact.received}
              </div>

              {/* Sent */}
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {contact.sent}
              </div>

              {/* Replies */}
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {contact.replies}
              </div>

              {/* Last Activity Date */}
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {contact.lastActivity}
              </div>

              {/* Activity Progress Bar & Percentage */}
              <div className="activity-bar-wrap">
                <div className="activity-bar">
                  <div
                    className="activity-fill"
                    style={{ width: `${contact.activityPct}%` }}
                  />
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', minWidth: 32, textAlign: 'right' }}>
                  {contact.activityPct}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
