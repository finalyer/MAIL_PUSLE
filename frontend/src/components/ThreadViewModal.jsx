import { useState } from 'react'
import {
  X, Star, Bookmark, Sparkles, Archive, MoreHorizontal, Download, FileText,
  User, Calendar, Clock, ChevronDown, ChevronUp
} from 'lucide-react'

export default function ThreadViewModal({ email, isOpen, onClose, onOpenAIReview }) {
  const [isStarred, setIsStarred] = useState(email?.isStarred ?? false)
  const [isBookmarked, setIsBookmarked] = useState(email?.isImportant ?? false)
  const [showAIReview, setShowAIReview] = useState(true)

  if (!isOpen || !email) return null

  const messages = email.threadMessages || [
    {
      id: 'default-1',
      sender: email.sender,
      email: email.senderEmail,
      avatar: email.avatar,
      date: email.fullDate || email.date,
      type: 'Received',
      isUnread: !email.isRead,
      content: email.body || email.snippet,
      attachments: email.attachments || []
    }
  ]

  const meta = email.threadMeta || {
    participantsCount: 3,
    messagesCount: messages.length,
    attachmentsCount: email.attachments?.length || 2,
    toCount: 2,
    ccCount: 3,
    bccCount: 0,
    firstActivity: 'Sep 28, 2026',
    lastActivity: 'Oct 5, 2026',
    participants: [
      { name: email.sender, email: email.senderEmail, avatar: email.avatar, isUnread: true },
      { name: 'Priya Sharma', email: 'priya.sharma@company.com', avatar: 'P', isUnread: false },
      { name: 'Alex Carter', email: 'alex@example.com', avatar: 'A', isYou: true }
    ]
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '95vw',
          maxWidth: 1300,
          height: '90vh',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Left Column: Messages Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid var(--border)', minWidth: 0 }}>
          {/* Header */}
          <div
            style={{
              padding: '18px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-surface)'
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>{email.subject}</h2>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {meta.messagesCount} messages • {meta.participantsCount} participants • {meta.attachmentsCount} attachments
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                className={`icon-toggle ${isStarred ? 'starred' : ''}`}
                onClick={() => setIsStarred(!isStarred)}
                title="Star"
              >
                <Star size={16} fill={isStarred ? '#fbbf24' : 'none'} />
              </button>
              <button
                className={`icon-toggle ${isBookmarked ? 'flagged' : ''}`}
                onClick={() => setIsBookmarked(!isBookmarked)}
                title="Important"
              >
                <Bookmark size={16} fill={isBookmarked ? 'var(--accent-red)' : 'none'} />
              </button>
              <button
                className="btn btn-outline-red btn-sm"
                onClick={() => onOpenAIReview?.(email)}
              >
                <Sparkles size={13} />
                AI Review
              </button>
              <button className="icon-toggle" title="Archive">
                <Archive size={16} />
              </button>
              <button className="icon-toggle" title="More">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`thread-msg-bubble ${msg.type === 'Sent' ? 'sent' : ''}`}
                style={{
                  borderLeft: msg.isUnread ? '3px solid var(--accent-red)' : '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="contact-avatar" style={{ width: 34, height: 34, fontSize: 13 }}>
                      {msg.avatar || msg.sender?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: '#ffffff' }}>
                        {msg.sender}{' '}
                        <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--text-muted)' }}>
                          &lt;{msg.email}&gt;
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>to me, Priya Sharma ▾</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{msg.date}</span>
                    <span
                      className={`status-pill ${msg.type === 'Sent' ? 'neutral' : 'danger'}`}
                      style={{ fontSize: 10.5 }}
                    >
                      {msg.type}
                    </span>
                    {msg.isUnread && <div className="unread-dot-indicator" />}
                  </div>
                </div>

                <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
                  {msg.content}
                </div>

                {msg.attachments?.length > 0 && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                    {msg.attachments.map((att, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '6px 12px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 12,
                          color: '#ffffff'
                        }}
                      >
                        <FileText size={14} color="var(--accent-red)" />
                        <span>{att.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{att.size}</span>
                        <Download size={13} style={{ cursor: 'pointer', marginLeft: 4 }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Thread Information & Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '20px', gap: 18, background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>Thread Details</h3>
            <button className="drawer-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {/* Thread Info Card */}
          <div className="ai-section-box">
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginBottom: 12 }}>
              Thread Information
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
              <div style={{ color: 'var(--text-muted)' }}>Participants</div>
              <div style={{ textAlign: 'right', fontWeight: 600, color: '#ffffff' }}>{meta.participantsCount}</div>

              <div style={{ color: 'var(--text-muted)' }}>Messages</div>
              <div style={{ textAlign: 'right', fontWeight: 600, color: '#ffffff' }}>{meta.messagesCount}</div>

              <div style={{ color: 'var(--text-muted)' }}>Attachments</div>
              <div style={{ textAlign: 'right', fontWeight: 600, color: '#ffffff' }}>{meta.attachmentsCount}</div>

              <div style={{ color: 'var(--text-muted)' }}>To recipients</div>
              <div style={{ textAlign: 'right', fontWeight: 600, color: '#ffffff' }}>{meta.toCount}</div>

              <div style={{ color: 'var(--text-muted)' }}>CC recipients</div>
              <div style={{ textAlign: 'right', fontWeight: 600, color: '#ffffff' }}>{meta.ccCount}</div>

              <div style={{ color: 'var(--text-muted)' }}>BCC recipients</div>
              <div style={{ textAlign: 'right', fontWeight: 600, color: '#ffffff' }}>{meta.bccCount}</div>

              <div style={{ color: 'var(--text-muted)' }}>First activity</div>
              <div style={{ textAlign: 'right', fontWeight: 500, color: '#ffffff' }}>{meta.firstActivity}</div>

              <div style={{ color: 'var(--text-muted)' }}>Last activity</div>
              <div style={{ textAlign: 'right', fontWeight: 500, color: '#ffffff' }}>{meta.lastActivity}</div>
            </div>
          </div>

          {/* Participants Card */}
          <div className="ai-section-box">
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginBottom: 10 }}>
              Participants ({meta.participants.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {meta.participants.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="contact-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                      {p.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{p.name}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{p.email}</div>
                    </div>
                  </div>
                  {p.isYou ? (
                    <span className="status-pill success" style={{ fontSize: 10 }}>● You</span>
                  ) : p.isUnread ? (
                    <div className="unread-dot-indicator" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Collapsible AI Review Card */}
          <div className="ai-section-box">
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => setShowAIReview(!showAIReview)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--accent-red)' }}>
                <Sparkles size={14} />
                AI Review
              </div>
              {showAIReview ? <ChevronUp size={15} color="var(--text-muted)" /> : <ChevronDown size={15} color="var(--text-muted)" />}
            </div>

            {showAIReview && (
              <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>Summary</div>
                <p style={{ marginBottom: 10 }}>
                  This thread reviews the project presentation. Rohan and Priya reviewed the slides and suggested UI improvements.
                </p>
                <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>Key Points</div>
                <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <li>Positive feedback on overall direction</li>
                  <li>Suggestions on UI screens and naming</li>
                  <li>Revised presentation shared</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
