import { useState, useEffect, useCallback } from 'react'
import { Search, Star, Mail, RefreshCw } from 'lucide-react'
import { getThreads, getEmails, search } from '../api'
import { formatDistanceToNow, format } from 'date-fns'

function EmailAvatar({ name, email }) {
  const letter = (name || email || '?')[0].toUpperCase()
  const colors = ['#7c3aed','#06b6d4','#f59e0b','#10b981','#ef4444','#8b5cf6']
  const color = colors[(letter.charCodeAt(0)) % colors.length]
  return (
    <div className="avatar" style={{ background: color, width: 36, height: 36, fontSize: 14 }}>
      {letter}
    </div>
  )
}

function ThreadRow({ thread, selected, onClick }) {
  const isUnread = thread.messages?.some(m => !m.is_read) ?? false
  const sender = thread.messages?.[0]?.sender_name || thread.messages?.[0]?.sender_email || 'Unknown'
  const date = thread.last_message_at
    ? formatDistanceToNow(new Date(thread.last_message_at), { addSuffix: false })
    : ''

  return (
    <div
      className={`thread-item ${isUnread ? 'unread' : ''} ${selected ? 'selected' : ''}`}
      onClick={onClick}
      id={`thread-${thread.id}`}
    >
      <EmailAvatar name={sender} />
      <div style={{ minWidth: 0 }}>
        <div className="thread-sender truncate">{sender}</div>
        <div className="thread-subject truncate">{thread.subject}</div>
        <div className="thread-snippet truncate">{thread.snippet}</div>
      </div>
      <div className="thread-meta">
        <div className="thread-time">{date}</div>
        {isUnread && <div className="unread-dot" style={{ marginLeft: 'auto', marginTop: 6 }} />}
        {thread.message_count > 1 && (
          <div className="text-muted" style={{ fontSize: 10, marginTop: 4 }}>{thread.message_count}</div>
        )}
      </div>
    </div>
  )
}

function EmailDetail({ threadId }) {
  const [thread, setThread] = useState(null)
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!threadId) return
    setLoading(true)
    setSelectedMsg(null)
    // Fetch all messages in this thread via /emails?thread_id=
    getEmails({ thread_id: threadId, page: 1, page_size: 100 })
      .then(r => {
        const msgs = r.data?.items || []
        setThread(msgs)
        if (msgs.length) setSelectedMsg(msgs[msgs.length - 1])
      })
      .catch(() => setThread(null))
      .finally(() => setLoading(false))
  }, [threadId])

  if (!threadId) return (
    <div className="empty-state" style={{ height: '100%' }}>
      <div className="empty-icon"><Mail size={24} /></div>
      <div className="text-secondary">Select a thread to read</div>
    </div>
  )

  if (loading) return (
    <div className="email-detail">
      <div className="skeleton skel-title mb-4" />
      <div className="skeleton skel-text mb-2" />
      <div className="skeleton skel-text mb-2" />
      <div className="skeleton skel-text" style={{ width: '70%' }} />
    </div>
  )

  if (!thread?.length) return (
    <div className="empty-state"><div className="text-muted">No messages found</div></div>
  )

  const msg = selectedMsg || thread[thread.length - 1]

  return (
    <div className="email-detail">
      <div className="email-header">
        <div className="email-subject">{msg.subject}</div>
        <div className="email-from">
          <EmailAvatar name={msg.sender_name} email={msg.sender_email} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{msg.sender_name || msg.sender_email}</div>
            <div className="text-xs text-muted">{msg.sender_email}</div>
          </div>
          <div className="ml-auto text-xs text-muted">
            {msg.sent_at ? format(new Date(msg.sent_at), 'MMM d, yyyy · h:mm a') : ''}
          </div>
        </div>

        {/* Thread messages mini list */}
        {thread.length > 1 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {thread.map((m, i) => (
              <button
                key={m.id}
                className={`btn btn-sm ${selectedMsg?.id === m.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSelectedMsg(m)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="email-body">
        {msg.body_text || msg.body_html
          ? (msg.body_text || 'HTML content — preview not available')
          : <span className="text-muted">(No body)</span>
        }
      </div>
    </div>
  )
}

export default function InboxPage() {
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const limit = 40

  const fetch = useCallback(async (q, p) => {
    setLoading(true)
    try {
      const params = { page: p, page_size: limit }
      if (q) params.q = q
      const { data } = q
        ? await search(q, { page: p, page_size: limit })
        : await getThreads(params)
      const list = data.items || []
      setThreads(list)
      setHasMore(list.length === limit)
    } catch { setThreads([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch(query, page) }, [query, page])

  const handleSearch = (e) => {
    setQuery(e.target.value)
    setPage(1)
  }

  return (
    <div className="inbox-split" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Left: thread list */}
      <div className="inbox-left">
        {/* Search */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', position:'sticky', top:0, background:'var(--bg-surface)', zIndex:2 }}>
          <div className="search-wrapper" style={{ maxWidth: '100%' }}>
            <Search size={14} className="search-icon" />
            <input
              className="search-input"
              id="inbox-search"
              placeholder="Search threads…"
              value={query}
              onChange={handleSearch}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 16 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ display:'flex', gap:12, padding:'14px 0', borderBottom:'1px solid var(--border)' }}>
                <div className="skeleton" style={{ width:36,height:36,borderRadius:'50%',flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div className="skeleton skel-text" style={{ width:'50%', marginBottom:6 }} />
                  <div className="skeleton skel-text" style={{ width:'80%', marginBottom:6 }} />
                  <div className="skeleton skel-text" style={{ width:'65%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : threads.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Mail size={24} /></div>
            <div>No threads yet</div>
            <div className="text-xs text-muted">Connect your Gmail and trigger a sync</div>
          </div>
        ) : (
          <div className="thread-list">
            {threads.map(t => (
              <ThreadRow
                key={t.id}
                thread={t}
                selected={selected === t.id}
                onClick={() => setSelected(t.id)}
              />
            ))}
            {hasMore && (
              <div style={{ padding: 16, textAlign: 'center' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => p + 1)}>
                  Load more
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: email detail */}
      <div className="inbox-right">
        <EmailDetail threadId={selected} />
      </div>
    </div>
  )
}
