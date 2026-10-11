import { useState } from 'react'
import {
  Send, CornerUpLeft, Star, Bookmark, Eye, Info, Search, Filter,
  Paperclip, MoreVertical, ChevronLeft, ChevronRight, CheckSquare, Square
} from 'lucide-react'
import { mockSentStats, mockSentEmails, mockEmails } from '../mockData'
import ThreadViewModal from '../components/ThreadViewModal'
import EmailDetailDrawer from '../components/EmailDetailDrawer'

export default function SentPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSent, setSelectedSent] = useState([])
  const [sentList, setSentList] = useState(mockSentEmails)
  const [activeThread, setActiveThread] = useState(null)
  const [activeDetail, setActiveDetail] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = sentList.filter(item => {
    if (activeFilter === 'replied' && item.replyStatus !== 'Reply received') return false
    if (activeFilter === 'starred' && !item.isStarred) return false
    if (activeFilter === 'important' && !item.isImportant) return false
    if (activeFilter === 'receipt-received' && item.readReceiptStatus !== 'Read receipt received') return false
    if (activeFilter === 'no-receipt' && item.readReceiptStatus !== 'No read receipt') return false
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      const match =
        item.recipient.toLowerCase().includes(q) ||
        item.recipientEmail.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.preview.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  const toggleSelectAll = () => {
    if (selectedSent.length === filtered.length) setSelectedSent([])
    else setSelectedSent(filtered.map(s => s.id))
  }

  const toggleSelectOne = (id, e) => {
    e.stopPropagation()
    setSelectedSent(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleOpenAction = (sentItem, actionType) => {
    if (actionType === 'thread') {
      const baseEmail = mockEmails[0]
      setActiveThread({
        ...baseEmail,
        subject: sentItem.subject,
        sender: sentItem.recipient,
        senderEmail: sentItem.recipientEmail
      })
    } else {
      setActiveDetail({
        id: sentItem.id,
        subject: sentItem.subject,
        sender: sentItem.recipient,
        senderEmail: sentItem.recipientEmail,
        snippet: sentItem.preview,
        body: sentItem.preview + "\n\nLet me know if you have questions.",
        fullDate: sentItem.sentDate,
        isRead: true,
        isStarred: sentItem.isStarred,
        isImportant: sentItem.isImportant,
        attachments: sentItem.attachmentsCount > 0 ? [{ name: 'attachment_doc.pdf', size: '1.4 MB', type: 'PDF' }] : []
      })
    }
  }

  return (
    <div className="page-container fade-in">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Sent Mails</h1>
          <p className="page-subtitle">Track your outgoing communication and follow-up activity.</p>
        </div>
      </div>

      {/* ── 5 Stat Cards Grid ───────────────────────────── */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {mockSentStats.map(stat => (
          <div key={stat.id} className="kpi-card" id={`sent-stat-${stat.id}`}>
            <div className="kpi-icon-box">
              {stat.icon === 'Send' && <Send size={16} />}
              {stat.icon === 'CornerUpLeft' && <CornerUpLeft size={16} />}
              {stat.icon === 'Star' && <Star size={16} />}
              {stat.icon === 'Bookmark' && <Bookmark size={16} />}
              {stat.icon === 'Eye' && <Eye size={16} />}
            </div>
            <div className="kpi-label">{stat.label}</div>
            <div className="kpi-value-row">
              <span className="kpi-value">{stat.value}</span>
              <span className="kpi-change-tag up">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Info Banner Callout ─────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 16px',
          fontSize: 12.5,
          color: 'var(--text-secondary)',
          marginBottom: 20
        }}
      >
        <Info size={15} color="var(--text-muted)" />
        <span>Recipient read status is available only when a read receipt is received.</span>
      </div>

      {/* ── Filter Pills & Search ───────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div className="filter-tabs-row" style={{ margin: 0 }}>
          <button
            className={`filter-tab-pill ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Sent
          </button>
          <button
            className={`filter-tab-pill ${activeFilter === 'replied' ? 'active' : ''}`}
            onClick={() => setActiveFilter('replied')}
          >
            Replied
          </button>
          <button
            className={`filter-tab-pill ${activeFilter === 'starred' ? 'active' : ''}`}
            onClick={() => setActiveFilter('starred')}
          >
            Starred
          </button>
          <button
            className={`filter-tab-pill ${activeFilter === 'important' ? 'active' : ''}`}
            onClick={() => setActiveFilter('important')}
          >
            Important
          </button>
          <button
            className={`filter-tab-pill ${activeFilter === 'receipt-received' ? 'active' : ''}`}
            onClick={() => setActiveFilter('receipt-received')}
          >
            Read Receipt Received
          </button>
          <button
            className={`filter-tab-pill ${activeFilter === 'no-receipt' ? 'active' : ''}`}
            onClick={() => setActiveFilter('no-receipt')}
          >
            No Receipt
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative', width: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: 30, fontSize: 12 }}
              placeholder="Search sent mails..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="topbar-icon-btn" title="Filter">
            <Filter size={14} />
          </button>
        </div>
      </div>

      {/* ── Sent Mails Table ────────────────────────────── */}
      <div className="mail-table-container">
        <div
          className="mail-table-header"
          style={{ gridTemplateColumns: '32px 180px 180px 1.2fr 130px 130px 150px 30px 30px 40px 120px 30px' }}
        >
          <div onClick={toggleSelectAll} style={{ cursor: 'pointer' }}>
            {selectedSent.length === filtered.length && filtered.length > 0 ? (
              <CheckSquare size={15} color="var(--accent-red)" />
            ) : (
              <Square size={15} />
            )}
          </div>
          <div>Recipient</div>
          <div>Subject</div>
          <div>Preview</div>
          <div>Sent date ▾</div>
          <div>Reply status</div>
          <div>Read receipt status</div>
          <div />
          <div />
          <div />
          <div>Actions</div>
          <div />
        </div>

        {filtered.map(item => {
          const isSelected = selectedSent.includes(item.id)

          return (
            <div
              key={item.id}
              className={`mail-row ${isSelected ? 'selected' : ''}`}
              style={{ gridTemplateColumns: '32px 180px 180px 1.2fr 130px 130px 150px 30px 30px 40px 120px 30px' }}
              onClick={() => handleOpenAction(item, 'view')}
              id={`sent-row-${item.id}`}
            >
              {/* Checkbox */}
              <div onClick={e => toggleSelectOne(item.id, e)} className="row-check">
                {isSelected ? <CheckSquare size={15} color="var(--accent-red)" /> : <Square size={15} />}
              </div>

              {/* Recipient */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div className="contact-avatar">{item.avatar}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="truncate" style={{ fontWeight: 600, color: '#ffffff', fontSize: 13 }}>
                    {item.recipient}
                  </div>
                  <div className="truncate" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {item.recipientEmail}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="truncate" style={{ fontWeight: 600, color: '#ffffff', fontSize: 13 }}>
                {item.subject}
              </div>

              {/* Preview */}
              <div className="truncate" style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>
                {item.preview}
              </div>

              {/* Sent date */}
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                {item.sentDate}
              </div>

              {/* Reply status */}
              <div>
                <span className={`status-pill ${item.replyStatus === 'Reply received' ? 'success' : 'neutral'}`}>
                  ● {item.replyStatus}
                </span>
              </div>

              {/* Read receipt status */}
              <div>
                <span
                  className={`status-pill ${
                    item.readReceiptStatus === 'Read receipt received'
                      ? 'success'
                      : item.readReceiptStatus === 'No read receipt'
                      ? 'danger'
                      : 'neutral'
                  }`}
                >
                  ● {item.readReceiptStatus}
                </span>
              </div>

              {/* Star */}
              <div>
                {item.isStarred && <Star size={14} fill="#fbbf24" color="#fbbf24" />}
              </div>

              {/* Important */}
              <div>
                {item.isImportant && <Bookmark size={14} fill="var(--accent-red)" color="var(--accent-red)" />}
              </div>

              {/* Attachments */}
              <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                {item.attachmentsCount > 0 && (
                  <>
                    <Paperclip size={13} />
                    <span>{item.attachmentsCount}</span>
                  </>
                )}
              </div>

              {/* Action Button */}
              <div>
                {item.replyStatus === 'Reply received' ? (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: 11 }}
                    onClick={e => {
                      e.stopPropagation()
                      handleOpenAction(item, 'thread')
                    }}
                  >
                    Open Thread
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: 11 }}
                    onClick={e => {
                      e.stopPropagation()
                      handleOpenAction(item, 'view')
                    }}
                  >
                    View Email
                  </button>
                )}
              </div>

              {/* More */}
              <div>
                <button className="icon-toggle" title="More">
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Pagination ─────────────────────────────────── */}
      <div className="pagination-row">
        <div>Showing 1-{filtered.length} of 428 sent mails</div>
        <div className="pagination-controls">
          <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
            <ChevronLeft size={14} />
          </button>
          <button className={`page-btn ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
          <button className={`page-btn ${currentPage === 2 ? 'active' : ''}`} onClick={() => setCurrentPage(2)}>2</button>
          <button className={`page-btn ${currentPage === 3 ? 'active' : ''}`} onClick={() => setCurrentPage(3)}>3</button>
          <button className="page-btn" onClick={() => setCurrentPage(4)}>4</button>
          <button className="page-btn" onClick={() => setCurrentPage(5)}>5</button>
          <span style={{ color: 'var(--text-muted)' }}>...</span>
          <button className="page-btn" onClick={() => setCurrentPage(54)}>54</button>
          <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, 54))}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Modals & Drawers */}
      <ThreadViewModal
        email={activeThread}
        isOpen={Boolean(activeThread)}
        onClose={() => setActiveThread(null)}
      />

      <EmailDetailDrawer
        email={activeDetail}
        isOpen={Boolean(activeDetail)}
        onClose={() => setActiveDetail(null)}
      />
    </div>
  )
}
