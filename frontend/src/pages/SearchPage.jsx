import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search as SearchIcon, Filter, X, ChevronDown, Paperclip, Star, Flag,
  Sparkles, CornerUpLeft, MoreVertical, LayoutList, LayoutGrid, CheckSquare, Square
} from 'lucide-react'
import { mockEmails } from '../mockData'
import EmailDetailDrawer from '../components/EmailDetailDrawer'
import AIReviewDrawer from '../components/AIReviewDrawer'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || 'project presentation'

  const [query, setQuery] = useState(initialQuery)
  const [showAdvanced, setShowAdvanced] = useState(true)

  // Filters
  const [folder, setFolder] = useState('Sent')
  const [sender, setSender] = useState('')
  const [recipient, setRecipient] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [hasAttachment, setHasAttachment] = useState(true)
  const [isUnread, setIsUnread] = useState(false)
  const [isStarred, setIsStarred] = useState(true)
  const [isImportant, setIsImportant] = useState(true)
  const [isReplied, setIsReplied] = useState(false)
  const [isReadReceipt, setIsReadReceipt] = useState(false)

  // Active filter tags
  const [activeTags, setActiveTags] = useState([
    'folder:sent',
    'has:attachment',
    'after:2026-09-01',
    'important:true'
  ])

  const [sortBy, setSortBy] = useState('Most relevant')
  const [viewMode, setViewMode] = useState('list')
  const [selectedIds, setSelectedIds] = useState([])
  const [activeDetail, setActiveDetail] = useState(null)
  const [activeAiReview, setActiveAiReview] = useState(null)

  const removeTag = (tag) => {
    setActiveTags(prev => prev.filter(t => t !== tag))
  }

  const clearAllFilters = () => {
    setActiveTags([])
    setHasAttachment(false)
    setIsStarred(false)
    setIsImportant(false)
    setFolder('All')
    setSender('')
    setRecipient('')
    setSubjectFilter('')
  }

  // Enhanced search results
  const searchResults = [
    {
      id: 'sr-1',
      sender: 'Aarav Sharma',
      email: 'aarav@techcorp.in',
      avatar: 'AS',
      subject: 'Project presentation feedback',
      snippet: 'Thanks for sharing the project presentation. The changes look comprehensive...',
      folder: 'Sent',
      labels: 'Important',
      date: 'Oct 10, 2026 10:42 AM',
      replyStatus: 'Replied',
      hasAttachment: true,
      isStarred: true,
      isImportant: true,
      isRead: true
    },
    {
      id: 'sr-2',
      sender: 'Prof. C. Sharma',
      email: 'csharma@akgec.ac.in',
      avatar: 'PC',
      subject: 'Final project presentation schedule',
      snippet: 'Please find the updated presentation schedule for the upcoming department review...',
      folder: 'Inbox',
      labels: 'Academic',
      date: 'Oct 9, 2026 4:20 PM',
      replyStatus: 'Not replied',
      hasAttachment: false,
      isStarred: false,
      isImportant: true,
      isRead: false
    },
    {
      id: 'sr-3',
      sender: 'Team at Notion',
      email: 'team@notion.so',
      avatar: 'TA',
      subject: 'Your project presentation is ready',
      snippet: "Here's your exported presentation file with analytics integrations enabled...",
      folder: 'Sent',
      labels: 'Update',
      date: 'Oct 9, 2026 11:15 AM',
      replyStatus: 'Replied',
      hasAttachment: true,
      isStarred: false,
      isImportant: false,
      isRead: true
    },
    {
      id: 'sr-4',
      sender: 'Rohan Singh',
      email: 'rohan.s@designhub.co',
      avatar: 'RS',
      subject: 'Re: Project presentation assets',
      snippet: 'Attaching the latest presentation assets and vector illustrations for slide 4...',
      folder: 'Inbox',
      labels: 'Design',
      date: 'Oct 8, 2026 6:32 PM',
      replyStatus: 'Replied',
      hasAttachment: true,
      isStarred: true,
      isImportant: true,
      isRead: false
    },
    {
      id: 'sr-5',
      sender: 'Meera Kapoor',
      email: 'meera@motionlab.in',
      avatar: 'MK',
      subject: 'Project presentation - Review notes',
      snippet: 'Here are some notes for the project presentation deck before tomorrow...',
      folder: 'Sent',
      labels: 'Feedback',
      date: 'Oct 8, 2026 2:14 PM',
      replyStatus: 'Not replied',
      hasAttachment: false,
      isStarred: false,
      isImportant: false,
      isRead: true
    },
    {
      id: 'sr-6',
      sender: 'Google Drive',
      email: 'drive-noreply@google.com',
      avatar: 'GD',
      subject: 'Project Presentation_v2.pdf',
      snippet: 'You shared a file: Project Presentation_v2.pdf with engineering leads...',
      folder: 'Sent',
      labels: 'File Share',
      date: 'Oct 7, 2026 9:01 PM',
      replyStatus: 'Replied',
      hasAttachment: true,
      isStarred: false,
      isImportant: false,
      isRead: true
    },
    {
      id: 'sr-7',
      sender: 'Shreya Verma',
      email: 'shreya@startupx.in',
      avatar: 'SV',
      subject: 'Project presentation discussion',
      snippet: "Let's discuss the presentation in tomorrow's standup meeting...",
      folder: 'Inbox',
      labels: 'Meeting',
      date: 'Oct 7, 2026 11:48 AM',
      replyStatus: 'Not replied',
      hasAttachment: false,
      isStarred: false,
      isImportant: false,
      isRead: true
    },
    {
      id: 'sr-8',
      sender: 'Devansh Luthra',
      email: 'dev@luthraauto.com',
      avatar: 'DL',
      subject: 'Re: Project presentation for client',
      snippet: 'Looks good! A few minor changes in slide 4 regarding cost estimation...',
      folder: 'Sent',
      labels: 'Client',
      date: 'Oct 6, 2026 5:37 PM',
      replyStatus: 'Replied',
      hasAttachment: true,
      isStarred: false,
      isImportant: false,
      isRead: true
    }
  ]

  // Highlight matches
  const renderHighlighted = (text, highlight) => {
    if (!highlight.trim()) return text
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="search-highlight">{part}</span>
      ) : (
        part
      )
    )
  }

  return (
    <div className="page-container fade-in">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Search your emails</h1>
          <p className="page-subtitle">Find messages, conversations, attachments, and communication patterns.</p>
        </div>
      </div>

      {/* ── Main Big Search Box ──────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <SearchIcon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: 42, paddingRight: 40, height: 44, fontSize: 14 }}
            placeholder="Search emails, senders, subjects..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button className="btn btn-primary-red" style={{ height: 44, padding: '0 24px', fontSize: 14 }}>
          <SearchIcon size={15} />
          <span>Search</span>
        </button>
      </div>

      {/* ── Collapsible Advanced Filters ─────────────────── */}
      <div className="advanced-filter-box">
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 14 }}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#ffffff' }}>
            <Filter size={15} color="var(--accent-red)" />
            <span>Advanced Filters</span>
          </div>
          <ChevronDown size={15} color="var(--text-muted)" style={{ transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'var(--transition)' }} />
        </div>

        {showAdvanced && (
          <div>
            <div className="filter-grid-form">
              <div className="form-group">
                <label className="form-label">Folder</label>
                <select className="form-select" value={folder} onChange={e => setFolder(e.target.value)}>
                  <option value="Sent">Sent</option>
                  <option value="Inbox">Inbox</option>
                  <option value="All">All Folders</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sender</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. nikhil@gmail.com"
                  value={sender}
                  onChange={e => setSender(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Recipient</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. team@company.com"
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. project presentation"
                  value={subjectFilter}
                  onChange={e => setSubjectFilter(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date range</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '7px 12px', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                  <span>Sep 1, 2026 — Oct 31, 2026</span>
                </div>
              </div>
            </div>

            {/* Checkbox Options */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}>
                <input type="checkbox" checked={hasAttachment} onChange={e => setHasAttachment(e.target.checked)} style={{ accentColor: 'var(--accent-red)' }} />
                <span>Has attachment</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}>
                <input type="checkbox" checked={isUnread} onChange={e => setIsUnread(e.target.checked)} style={{ accentColor: 'var(--accent-red)' }} />
                <span>Unread</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}>
                <input type="checkbox" checked={isStarred} onChange={e => setIsStarred(e.target.checked)} style={{ accentColor: 'var(--accent-red)' }} />
                <span>Starred</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}>
                <input type="checkbox" checked={isImportant} onChange={e => setIsImportant(e.target.checked)} style={{ accentColor: 'var(--accent-red)' }} />
                <span>Important</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}>
                <input type="checkbox" checked={isReplied} onChange={e => setIsReplied(e.target.checked)} style={{ accentColor: 'var(--accent-red)' }} />
                <span>Replied</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, cursor: 'pointer' }}>
                <input type="checkbox" checked={isReadReceipt} onChange={e => setIsReadReceipt(e.target.checked)} style={{ accentColor: 'var(--accent-red)' }} />
                <span>Read receipt received</span>
              </label>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-secondary btn-sm" onClick={clearAllFilters}>
                Clear all
              </button>
              <button className="btn btn-primary-red btn-sm">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Active Filter Tags ───────────────────────────── */}
      {activeTags.length > 0 && (
        <div className="filter-tags-row">
          {activeTags.map(tag => (
            <span key={tag} className="filter-tag-chip">
              <span>{tag}</span>
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)} />
            </span>
          ))}
        </div>
      )}

      {/* ── Results Bar & View Toggle ────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>
          24 results found
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-secondary)' }}>
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="form-select"
              style={{ padding: '3px 8px', fontSize: 12 }}
            >
              <option value="Most relevant">Most relevant</option>
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 2 }}>
            <button
              className="icon-toggle"
              style={{ color: viewMode === 'list' ? 'var(--accent-red)' : 'var(--text-muted)' }}
              onClick={() => setViewMode('list')}
            >
              <LayoutList size={15} />
            </button>
            <button
              className="icon-toggle"
              style={{ color: viewMode === 'grid' ? 'var(--accent-red)' : 'var(--text-muted)' }}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Results Table ────────────────────────────────── */}
      <div className="mail-table-container">
        <div
          className="mail-table-header"
          style={{ gridTemplateColumns: '32px 28px 28px 40px 180px 1.4fr 80px 100px 28px 120px 100px 90px 30px' }}
        >
          <div />
          <div />
          <div />
          <div />
          <div>Sender / Recipient</div>
          <div>Subject & Preview</div>
          <div>Folder</div>
          <div>Labels</div>
          <div><Paperclip size={13} /></div>
          <div>Date ▾</div>
          <div>Reply</div>
          <div>AI</div>
          <div />
        </div>

        {searchResults.map(item => (
          <div
            key={item.id}
            className="mail-row"
            style={{ gridTemplateColumns: '32px 28px 28px 40px 180px 1.4fr 80px 100px 28px 120px 100px 90px 30px' }}
            onClick={() => setActiveDetail({
              ...mockEmails[0],
              subject: item.subject,
              sender: item.sender,
              senderEmail: item.email
            })}
          >
            <div><Square size={14} className="row-check" /></div>
            <div>{!item.isRead && <div className="unread-dot-indicator" />}</div>
            <div>
              {item.isStarred && <Star size={13} fill="#fbbf24" color="#fbbf24" />}
            </div>
            <div>
              <div className="contact-avatar">{item.avatar}</div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="truncate" style={{ fontWeight: 600, color: '#ffffff', fontSize: 13 }}>{item.sender}</div>
              <div className="truncate" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.email}</div>
            </div>

            {/* Subject with highlighted match keyword */}
            <div className="truncate" style={{ fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: '#ffffff' }}>
                {renderHighlighted(item.subject, 'project presentation')}
              </span>
              <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>
                {renderHighlighted(item.snippet, 'project presentation')}
              </span>
            </div>

            <div>
              <span className="status-pill neutral" style={{ fontSize: 11 }}>{item.folder}</span>
            </div>

            <div>
              <span className={`category-badge ${item.labels.toLowerCase()}`}>{item.labels}</span>
            </div>

            <div>
              {item.hasAttachment && <Paperclip size={13} color="var(--text-muted)" />}
            </div>

            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
              {item.date}
            </div>

            <div>
              <span style={{ fontSize: 11.5, color: item.replyStatus === 'Replied' ? 'var(--status-green)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CornerUpLeft size={11} /> {item.replyStatus}
              </span>
            </div>

            <div>
              <button
                className="btn btn-outline-red btn-sm"
                style={{ padding: '2px 8px', fontSize: 10.5 }}
                onClick={e => {
                  e.stopPropagation()
                  setActiveAiReview({
                    ...mockEmails[0],
                    subject: item.subject,
                    sender: item.sender,
                    senderEmail: item.email
                  })
                }}
              >
                AI Review
              </button>
            </div>

            <div>
              <MoreVertical size={14} color="var(--text-muted)" />
            </div>
          </div>
        ))}
      </div>

      {/* Drawers */}
      <EmailDetailDrawer
        email={activeDetail}
        isOpen={Boolean(activeDetail)}
        onClose={() => setActiveDetail(null)}
        onOpenAIReview={(email) => {
          setActiveDetail(null)
          setActiveAiReview(email)
        }}
      />

      <AIReviewDrawer
        email={activeAiReview}
        isOpen={Boolean(activeAiReview)}
        onClose={() => setActiveAiReview(null)}
      />
    </div>
  )
}
