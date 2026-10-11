import { useState, useEffect, useCallback } from 'react'
import {
  Search, Star, Flag, Paperclip, Sparkles, Filter, MoreHorizontal,
  ChevronLeft, ChevronRight, CheckSquare, Square, RefreshCw, AlertTriangle,
  Mail, Inbox, Lock, Loader2
} from 'lucide-react'
import { mockEmails } from '../mockData'
import { getEmails, getEmail, getThread, triggerSync } from '../api'
import { formatEmailForUI } from '../utils/emailAdapter'
import { useAuth } from '../contexts/AuthContext'
import EmailDetailDrawer from '../components/EmailDetailDrawer'
import AIReviewDrawer from '../components/AIReviewDrawer'
import ThreadViewModal from '../components/ThreadViewModal'

export default function InboxPage() {
  const { user, isDemoUser } = useAuth()
  const [filterTab, setFilterTab] = useState('all') // 'all' | 'unread' | 'starred' | 'important'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmails, setSelectedEmails] = useState([])
  const [activeDetailEmail, setActiveDetailEmail] = useState(null)
  const [activeAiReviewEmail, setActiveAiReviewEmail] = useState(null)
  const [activeThreadEmail, setActiveThreadEmail] = useState(null)
  const [emails, setEmails] = useState([])
  const [totalEmailsCount, setTotalEmailsCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [viewState, setViewState] = useState('normal') // 'normal' | 'syncing' | 'error' | 'connect' | 'clear'
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch emails from API
  const loadEmails = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true)
    else setIsLoading(true)

    try {
      if (user && !isDemoUser) {
        const { data } = await getEmails({ page: currentPage, page_size: 50 })
        if (data && data.items && data.items.length > 0) {
          const formatted = data.items.map(item => formatEmailForUI(item, user?.email))
          setEmails(formatted)
          setTotalEmailsCount(data.total || formatted.length)
          setTotalPages(data.pages || Math.ceil((data.total || formatted.length) / 50) || 1)
        } else {
          // If no emails yet in DB
          if (data && data.total === 0) {
            setEmails([])
            setTotalEmailsCount(0)
            setViewState('clear')
          } else {
            setEmails(mockEmails)
            setTotalEmailsCount(mockEmails.length)
          }
        }
      } else {
        // Demo or guest mode
        setEmails(mockEmails)
        setTotalEmailsCount(mockEmails.length)
      }
    } catch (err) {
      console.warn('Failed to fetch real emails from API, falling back to mock:', err)
      setEmails(mockEmails)
      setTotalEmailsCount(mockEmails.length)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [user, isDemoUser, currentPage])

  useEffect(() => {
    loadEmails()
  }, [loadEmails])

  // Open full email detail with API lookup for body and attachments
  const handleOpenEmailDetail = async (email) => {
    setActiveDetailEmail(email)
    if (user && !isDemoUser && email.id && !email.id.startsWith('em-')) {
      try {
        const { data } = await getEmail(email.id)
        if (data) {
          setActiveDetailEmail(formatEmailForUI(data, user?.email))
        }
      } catch (err) {
        console.warn('Could not load detailed email from API:', err)
      }
    }
  }

  // Open full thread with API lookup
  const handleOpenThread = async (email) => {
    setActiveThreadEmail(email)
    if (user && !isDemoUser && email.threadId && !email.id.startsWith('em-')) {
      try {
        const { data } = await getThread(email.threadId)
        if (data && data.messages && data.messages.length > 0) {
          const threadMsgs = data.messages.map(m => {
            const formatted = formatEmailForUI(m, user?.email)
            return {
              id: formatted.id,
              sender: formatted.sender,
              email: formatted.senderEmail,
              avatar: formatted.avatar,
              date: formatted.fullDate,
              type: formatted.direction === 'sent' ? 'Sent' : 'Received',
              isUnread: !formatted.isRead,
              content: formatted.body || formatted.snippet,
              attachments: formatted.attachments || []
            }
          })
          setActiveThreadEmail({
            ...email,
            threadMessages: threadMsgs
          })
        }
      } catch (err) {
        console.warn('Could not load detailed thread from API:', err)
      }
    }
  }

  // Calculate live counts
  const unreadCount = emails.filter(e => !e.isRead).length
  const starredCount = emails.filter(e => e.isStarred).length
  const importantCount = emails.filter(e => e.isImportant).length

  // Filtering
  const filtered = emails.filter(em => {
    if (filterTab === 'unread' && em.isRead) return false
    if (filterTab === 'starred' && !em.isStarred) return false
    if (filterTab === 'important' && !em.isImportant) return false
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      const match =
        em.subject?.toLowerCase().includes(q) ||
        em.sender?.toLowerCase().includes(q) ||
        em.senderEmail?.toLowerCase().includes(q) ||
        em.snippet?.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  // Select all or toggle single
  const toggleSelectAll = () => {
    if (selectedEmails.length === filtered.length) {
      setSelectedEmails([])
    } else {
      setSelectedEmails(filtered.map(e => e.id))
    }
  }

  const toggleSelectOne = (id, e) => {
    e.stopPropagation()
    setSelectedEmails(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleStar = (id, e) => {
    e.stopPropagation()
    setEmails(prev => prev.map(em => em.id === id ? { ...em, isStarred: !em.isStarred } : em))
  }

  const toggleFlag = (id, e) => {
    e.stopPropagation()
    setEmails(prev => prev.map(em => em.id === id ? { ...em, isImportant: !em.isImportant } : em))
  }

  return (
    <div className="page-container fade-in">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Inbox</h1>
          <p className="page-subtitle">Browse, filter, and understand your received emails.</p>
        </div>

        {/* View State Switcher (for previewing Desktop - 4, 17, 18, 19 states) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Demo State:</span>
          <select
            value={viewState}
            onChange={e => setViewState(e.target.value)}
            className="form-select"
            style={{ padding: '4px 8px', fontSize: 11.5 }}
          >
            <option value="normal">Normal Inbox (UI - 1, 11)</option>
            <option value="syncing">Syncing State (UI - 17)</option>
            <option value="error">Sync Error (UI - 4)</option>
            <option value="connect">Connect Gmail (UI - 18)</option>
            <option value="clear">Inbox Clear (UI - 19)</option>
          </select>
        </div>
      </div>

      {/* ── Filter Tabs & Action Toolbar ─────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div className="filter-tabs-row" style={{ margin: 0 }}>
          <button
            className={`filter-tab-pill ${filterTab === 'all' ? 'active' : ''}`}
            onClick={() => setFilterTab('all')}
          >
            <Mail size={14} />
            <span>All Mail</span>
            <span className="pill-count">{totalEmailsCount || emails.length}</span>
          </button>

          <button
            className={`filter-tab-pill ${filterTab === 'unread' ? 'active' : ''}`}
            onClick={() => setFilterTab('unread')}
          >
            <span>Unread</span>
            <span className="pill-count">{unreadCount}</span>
          </button>

          <button
            className={`filter-tab-pill ${filterTab === 'starred' ? 'active' : ''}`}
            onClick={() => setFilterTab('starred')}
          >
            <Star size={13} />
            <span>Starred</span>
            <span className="pill-count">{starredCount}</span>
          </button>

          <button
            className={`filter-tab-pill ${filterTab === 'important' ? 'active' : ''}`}
            onClick={() => setFilterTab('important')}
          >
            <Flag size={13} />
            <span>Important</span>
            <span className="pill-count">{importantCount}</span>
          </button>

          <button
            className="filter-tab-pill"
            onClick={() => loadEmails(true)}
            title="Refresh emails from database"
            disabled={isRefreshing}
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin-slow' : ''} />
            <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Search input inside inbox */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: 30, fontSize: 12.5 }}
            placeholder="Search emails, senders, subjects..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ── View States Handling ─────────────────────────── */}

      {/* 1. Syncing State (Desktop - 17) */}
      {viewState === 'syncing' && (
        <div className="empty-state-card" style={{ padding: '80px 24px' }}>
          {/* Circular 64% Progress Ring */}
          <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 24px' }}>
            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="40" fill="none" stroke="var(--accent-red)" strokeWidth="8"
                strokeDasharray={`${(64 / 100) * 251.3} 251.3`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#ffffff' }}>
              64%
            </div>
          </div>

          <h2 className="empty-state-title" style={{ fontSize: 22 }}>Syncing your Gmail account...</h2>
          <p className="empty-state-desc">Fetching recent emails and updating your local database.</p>

          {/* 4 Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, width: '100%', maxWidth: 700, marginBottom: 28 }}>
            <div className="kpi-card" style={{ padding: '14px', alignItems: 'center', textAlign: 'center' }}>
              <Mail size={18} color="var(--accent-red)" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>1,248</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Emails processed</div>
            </div>

            <div className="kpi-card" style={{ padding: '14px', alignItems: 'center', textAlign: 'center' }}>
              <RefreshCw size={18} color="var(--accent-red)" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>64%</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sync progress</div>
            </div>

            <div className="kpi-card" style={{ padding: '14px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: 16, color: 'var(--accent-red)', marginBottom: 6 }}>⏱</span>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>~ 2 min</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Estimated time</div>
            </div>

            <div className="kpi-card" style={{ padding: '14px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: 16, color: 'var(--accent-red)', marginBottom: 6 }}>🗄</span>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Updating</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Local database</div>
            </div>
          </div>

          <button className="btn btn-outline-red" onClick={() => setViewState('normal')}>
            Cancel Sync
          </button>
        </div>
      )}

      {/* 2. Sync Error State (Desktop - 4) */}
      {viewState === 'error' && (
        <div className="empty-state-card" style={{ padding: '70px 24px' }}>
          <div className="empty-state-icon-box" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-red)' }}>
            <AlertTriangle size={36} />
          </div>
          <h2 className="empty-state-title">Sync could not be completed</h2>
          <p className="empty-state-desc">Please check your connection and try again.</p>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 22px',
              maxWidth: 480,
              width: '100%',
              marginBottom: 24,
              textAlign: 'left',
              display: 'flex',
              gap: 14
            }}
          >
            <div style={{ color: 'var(--accent-red)', marginTop: 2 }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#ffffff', fontSize: 13.5 }}>Connection error</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.5 }}>
                We couldn't connect to your Gmail account. This could be due to a network issue or expired permissions.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary-red" onClick={() => setViewState('normal')}>
              Try Again
            </button>
            <button className="btn btn-outline-red" onClick={() => alert('Diagnostic details: Token valid, network reachable.')}>
              View Details
            </button>
          </div>
        </div>
      )}

      {/* 3. Connect Gmail Onboarding State (Desktop - 18) */}
      {viewState === 'connect' && (
        <div className="empty-state-card" style={{ padding: '70px 24px' }}>
          <div style={{ position: 'relative', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ width: 80, height: 60, borderRadius: 10, border: '2px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={32} color="var(--text-muted)" />
            </div>
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-red)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
              +
            </div>
          </div>

          <h2 className="empty-state-title">Connect your Gmail account</h2>
          <p className="empty-state-desc">Connect Gmail to begin analyzing your email activity.</p>

          <a href="/api/auth/google" className="btn btn-primary-red btn-lg" style={{ marginBottom: 36 }}>
            <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#ffffff"/>
            </svg>
            Connect Gmail
          </a>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, maxWidth: 650, width: '100%', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: 24 }}>
            <div>
              <Lock size={18} color="var(--accent-red)" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#ffffff' }}>Secure connection</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>with Google</div>
            </div>
            <div>
              <span style={{ fontSize: 18, display: 'block', marginBottom: 6 }}>📊</span>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#ffffff' }}>Analyze your</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>email activity</div>
            </div>
            <div>
              <Sparkles size={18} color="var(--accent-red)" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#ffffff' }}>Get AI-powered</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>insights</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Inbox Clear Empty State (Desktop - 19) */}
      {viewState === 'clear' && (
        <div className="empty-state-card" style={{ padding: '80px 24px' }}>
          <div className="empty-state-icon-box">
            <Inbox size={36} />
          </div>
          <h2 className="empty-state-title">Your inbox is clear</h2>
          <p className="empty-state-desc">No messages match your current filters.</p>
          <button className="btn btn-outline-red" onClick={() => { setViewState('normal'); setFilterTab('all'); setSearchTerm(''); }}>
            Clear Filters
          </button>
        </div>
      )}

      {/* 5. Main Inbox Table (Desktop - 1 & 11) */}
      {viewState === 'normal' && (
        <>
          <div className="mail-table-container">
            {/* Table Header Row */}
            <div
              className="mail-table-header"
              style={{ gridTemplateColumns: '32px 28px 28px 28px 40px 180px 1fr 28px 100px 90px 100px' }}
            >
              <div onClick={toggleSelectAll} style={{ cursor: 'pointer' }}>
                {selectedEmails.length === filtered.length && filtered.length > 0 ? (
                  <CheckSquare size={15} color="var(--accent-red)" />
                ) : (
                  <Square size={15} />
                )}
              </div>
              <div /> {/* unread indicator col */}
              <div /> {/* star col */}
              <div /> {/* flag col */}
              <div /> {/* avatar col */}
              <div>Sender</div>
              <div>Subject & Preview</div>
              <div><Paperclip size={13} /></div>
              <div>Category</div>
              <div style={{ textAlign: 'right' }}>Date</div>
              <div style={{ textAlign: 'center' }}>Actions</div>
            </div>

            {/* Email Rows */}
            {filtered.map(email => {
              const isSelected = selectedEmails.includes(email.id)

              return (
                <div
                  key={email.id}
                  className={`mail-row ${!email.isRead ? 'unread' : ''} ${isSelected ? 'selected' : ''}`}
                  style={{ gridTemplateColumns: '32px 28px 28px 28px 40px 180px 1fr 28px 100px 90px 100px' }}
                  onClick={() => handleOpenEmailDetail(email)}
                  id={`email-row-${email.id}`}
                >
                  {/* Select Checkbox */}
                  <div onClick={e => toggleSelectOne(email.id, e)} className="row-check">
                    {isSelected ? (
                      <CheckSquare size={15} color="var(--accent-red)" />
                    ) : (
                      <Square size={15} />
                    )}
                  </div>

                  {/* Unread Red Dot */}
                  <div>
                    {!email.isRead && <div className="unread-dot-indicator" />}
                  </div>

                  {/* Star Toggle */}
                  <div>
                    <button
                      className={`icon-toggle ${email.isStarred ? 'starred' : ''}`}
                      onClick={e => toggleStar(email.id, e)}
                    >
                      <Star size={14} fill={email.isStarred ? '#fbbf24' : 'none'} color={email.isStarred ? '#fbbf24' : 'currentColor'} />
                    </button>
                  </div>

                  {/* Flag Toggle */}
                  <div>
                    <button
                      className={`icon-toggle ${email.isImportant ? 'flagged' : ''}`}
                      onClick={e => toggleFlag(email.id, e)}
                    >
                      <Flag size={14} fill={email.isImportant ? 'var(--accent-red)' : 'none'} color={email.isImportant ? 'var(--accent-red)' : 'currentColor'} />
                    </button>
                  </div>

                  {/* Contact Avatar Circle */}
                  <div className="contact-avatar">
                    {email.avatar || email.sender.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Sender Name & Email */}
                  <div style={{ minWidth: 0 }}>
                    <div className="truncate" style={{ fontWeight: !email.isRead ? 700 : 600, color: '#ffffff', fontSize: 13 }}>
                      {email.sender}
                    </div>
                    <div className="truncate" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {email.senderEmail}
                    </div>
                  </div>

                  {/* Subject & Preview Snippet */}
                  <div className="truncate" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span style={{ fontWeight: !email.isRead ? 700 : 600, color: '#ffffff' }}>
                      {email.subject}
                    </span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>
                      {email.snippet}
                    </span>
                  </div>

                  {/* Attachment Icon */}
                  <div>
                    {email.hasAttachment && <Paperclip size={14} color="var(--text-muted)" />}
                  </div>

                  {/* Category Badge Pill */}
                  <div>
                    <span className={`category-badge ${email.category?.toLowerCase() || 'project'}`}>
                      {email.category}
                    </span>
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', textAlign: 'right' }}>
                    {email.date}
                  </div>

                  {/* AI Review Action Button */}
                  <div style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-outline-red btn-sm"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                      onClick={e => {
                        e.stopPropagation()
                        setActiveAiReviewEmail(email)
                      }}
                      id={`ai-btn-${email.id}`}
                    >
                      <Sparkles size={11} />
                      AI Review
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Pagination ─────────────────────────────────── */}
          <div className="pagination-row">
            <div>
              {totalEmailsCount > 0 ? (
                <>
                  {(currentPage - 1) * 50 + 1} - {Math.min(currentPage * 50, totalEmailsCount)} of {totalEmailsCount} emails
                </>
              ) : (
                <>{filtered.length} emails</>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                {totalPages > 5 && (
                  <>
                    <span style={{ color: 'var(--text-muted)', padding: '0 4px' }}>...</span>
                    <button className="page-btn" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
                  </>
                )}
                <button
                  className="page-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Email Detail Slide-over Drawer (Desktop - 11) ─── */}
      <EmailDetailDrawer
        email={activeDetailEmail}
        isOpen={Boolean(activeDetailEmail)}
        onClose={() => setActiveDetailEmail(null)}
        onOpenAIReview={(email) => {
          setActiveDetailEmail(null)
          setActiveAiReviewEmail(email)
        }}
        onOpenThread={(email) => {
          setActiveDetailEmail(null)
          setActiveThreadEmail(email)
        }}
      />

      {/* ── AI Review Slide-over Drawer (Desktop - 14) ─────── */}
      <AIReviewDrawer
        email={activeAiReviewEmail}
        isOpen={Boolean(activeAiReviewEmail)}
        onClose={() => setActiveAiReviewEmail(null)}
      />

      {/* ── Thread Multi-Message View Modal (Desktop - 15) ── */}
      <ThreadViewModal
        email={activeThreadEmail}
        isOpen={Boolean(activeThreadEmail)}
        onClose={() => setActiveThreadEmail(null)}
        onOpenAIReview={(email) => {
          setActiveThreadEmail(null)
          setActiveAiReviewEmail(email)
        }}
      />
    </div>
  )
}
