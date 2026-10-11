import { useState } from 'react'
import {
  X, Trash2, Mail, MoreHorizontal, Star, Flag, Download, FileText, Sparkles
} from 'lucide-react'

export default function EmailDetailDrawer({ email, isOpen, onClose, onOpenAIReview, onOpenThread }) {
  const [isStarred, setIsStarred] = useState(email?.isStarred ?? false)
  const [isImportant, setIsImportant] = useState(email?.isImportant ?? false)

  if (!isOpen || !email) return null

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel" id="email-detail-drawer" style={{ width: 540 }}>
        {/* Header Actions */}
        <div className="drawer-header" style={{ padding: '16px 20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="icon-toggle" title="Delete" onClick={onClose}>
              <Trash2 size={16} />
            </button>
            <button className="icon-toggle" title="Mark Unread">
              <Mail size={16} />
            </button>
            <button className="icon-toggle" title="More Options">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <button className="drawer-close-btn" onClick={onClose} id="close-detail-btn">
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="drawer-body" style={{ padding: '24px 28px' }}>
          {/* Subject & Star */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
              {email.subject}
            </h2>
            <button
              className={`icon-toggle ${isStarred ? 'starred' : ''}`}
              onClick={() => setIsStarred(!isStarred)}
              title={isStarred ? 'Unstar' : 'Star'}
            >
              <Star size={18} fill={isStarred ? '#fbbf24' : 'none'} />
            </button>
          </div>

          {/* Sender Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <div className="contact-avatar" style={{ width: 40, height: 40, fontSize: 14 }}>
              {email.avatar || email.sender?.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#ffffff' }}>{email.sender}</span>
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{email.fullDate || email.date}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{email.senderEmail}</div>
            </div>
          </div>

          {/* To header & Labels */}
          <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <span>To: {email.to || 'nikk24g@gmail.com'}</span>
            {email.threadMessages && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 11.5, color: 'var(--accent-red)' }}
                onClick={() => onOpenThread?.(email)}
              >
                View Full Thread ({email.threadMessages.length}) →
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
            <span className={`category-badge ${email.category?.toLowerCase() || 'project'}`}>
              #{email.category || 'Project'}
            </span>
            {isImportant && (
              <span className="status-pill danger" style={{ padding: '2px 8px' }}>
                <Flag size={11} fill="currentColor" />
                Important
              </span>
            )}
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />

          {/* Body */}
          <div style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
            {email.body || email.snippet}
          </div>

          {/* Attachments Section */}
          {email.attachments?.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>
                  {email.attachments.length} attachments
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--accent-red)', padding: '2px 6px' }}
                  onClick={() => alert('Downloading all attachments...')}
                >
                  <Download size={13} />
                  Download all
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {email.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 'var(--radius-sm)',
                          background: att.type === 'PDF' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                          color: att.type === 'PDF' ? 'var(--accent-red)' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FileText size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#ffffff' }}>{att.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{att.size} • {att.type}</div>
                      </div>
                    </div>
                    <button className="icon-toggle" title="Download">
                      <Download size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Review Trigger Footer */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: 24,
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            <button
              className="btn btn-primary-red"
              style={{ width: '100%', padding: '12px', fontSize: 14 }}
              onClick={() => onOpenAIReview?.(email)}
              id="open-ai-review-btn"
            >
              <Sparkles size={16} />
              AI Review
            </button>
            <p style={{ fontSize: 11.5, color: 'var(--text-muted)', textAlign: 'center' }}>
              Get an AI summary, key points and suggested actions for this email.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
