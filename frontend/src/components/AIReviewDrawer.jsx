import { useState } from 'react'
import {
  X, Sparkles, Folder, AlertCircle, Signal, Star, CornerUpLeft, Check
} from 'lucide-react'

export default function AIReviewDrawer({ email, isOpen, onClose }) {
  const [isMarkedImportant, setIsMarkedImportant] = useState(email?.isImportant ?? false)
  const [isStarred, setIsStarred] = useState(email?.isStarred ?? false)
  const [replied, setReplied] = useState(false)

  if (!isOpen || !email) return null

  const ai = email.aiReview || {
    subject: email.subject,
    summary: 'Email contains actionable updates regarding ongoing work and deliverables.',
    keyPoints: [
      'Review latest deliverables submitted by collaborator',
      'Address key feedback items before scheduled deadline',
      'Synchronize next steps with team lead'
    ],
    suggestedAction: 'Review email contents and respond with confirmation.',
    category: email.category || 'General',
    priority: 'Normal',
    confidence: 'High'
  }

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel" id="ai-review-drawer" style={{ width: 480 }}>
        {/* Header */}
        <div className="drawer-header" style={{ alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ color: 'var(--accent-red)', display: 'flex', alignItems: 'center' }}>
              <Sparkles size={20} />
            </div>
            <h2 className="drawer-title" style={{ fontSize: 17 }}>AI Review</h2>
            <span
              style={{
                fontSize: 10.5,
                background: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--accent-red)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              Preview is in preview
            </span>
          </div>
          <button className="drawer-close-btn" onClick={onClose} id="close-ai-drawer-btn">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body" style={{ gap: 16 }}>
          {/* Subject note */}
          <div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 2 }}>
              Email subject
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
              {ai.subject || email.subject}
            </div>
          </div>

          {/* Card 1: Summary */}
          <div className="ai-section-box">
            <div className="ai-section-title">
              <span style={{ color: 'var(--accent-red)' }}>▣</span>
              Summary
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {ai.summary}
            </p>
          </div>

          {/* Card 2: Key Points */}
          <div className="ai-section-box">
            <div className="ai-section-title">
              <span style={{ color: 'var(--accent-red)' }}>☰</span>
              Key Points
            </div>
            <ul className="ai-points-list">
              {ai.keyPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>

          {/* Card 3: Suggested Action */}
          <div className="ai-section-box">
            <div className="ai-section-title">
              <span style={{ color: 'var(--accent-red)' }}>🎯</span>
              Suggested Action
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {ai.suggestedAction}
            </p>
          </div>

          {/* Metadata Pills */}
          <div className="ai-tags-row">
            <div className="ai-tag-chip">
              <span style={{ color: 'var(--text-muted)' }}>Detected Category</span>
              <span style={{ color: '#ffffff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Folder size={12} />
                {ai.category}
              </span>
            </div>

            <div className="ai-tag-chip">
              <span style={{ color: 'var(--text-muted)' }}>Priority</span>
              <span style={{ color: 'var(--accent-red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertCircle size={12} />
                {ai.priority}
              </span>
            </div>

            <div className="ai-tag-chip">
              <span style={{ color: 'var(--text-muted)' }}>Confidence</span>
              <span style={{ color: 'var(--status-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Signal size={12} />
                {ai.confidence}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16 }}>
            <button
              className="btn btn-primary-red"
              style={{ width: '100%', padding: '12px' }}
              onClick={() => setIsMarkedImportant(!isMarkedImportant)}
            >
              <AlertCircle size={15} />
              {isMarkedImportant ? 'Marked Important ✓' : '! Mark Important'}
            </button>

            <button
              className="btn btn-secondary"
              style={{ width: '100%', padding: '10px' }}
              onClick={() => setIsStarred(!isStarred)}
            >
              <Star size={15} fill={isStarred ? '#fbbf24' : 'none'} color={isStarred ? '#fbbf24' : 'currentColor'} />
              {isStarred ? 'Email Starred ✓' : 'Star Email'}
            </button>

            <button
              className="btn btn-secondary"
              style={{ width: '100%', padding: '10px' }}
              onClick={() => {
                setReplied(true)
                setTimeout(() => setReplied(false), 2500)
              }}
            >
              <CornerUpLeft size={15} />
              {replied ? 'Reply drafted in composer!' : 'Reply'}
            </button>

            <button
              className="btn btn-ghost"
              style={{ width: '100%', padding: '10px' }}
              onClick={onClose}
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
