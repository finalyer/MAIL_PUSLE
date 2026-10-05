import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, X, Mail, Loader2 } from 'lucide-react'
import { search } from '../api'
import { formatDistanceToNow } from 'date-fns'

function ResultRow({ item }) {
  const date = item.sent_at
    ? formatDistanceToNow(new Date(item.sent_at), { addSuffix: true })
    : ''
  return (
    <div className="thread-item" id={`search-result-${item.id}`}>
      <div className="avatar" style={{
        width: 36, height: 36, fontSize: 14,
        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))'
      }}>
        {(item.sender_name || item.sender_email || '?')[0].toUpperCase()}
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="thread-sender truncate">{item.sender_name || item.sender_email}</div>
        <div className="thread-subject truncate">{item.subject}</div>
        <div className="thread-snippet truncate text-xs text-muted">{item.snippet}</div>
      </div>
      <div className="thread-meta">
        <div className="thread-time">{date}</div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const doSearch = useCallback(async (query) => {
    if (!query.trim()) { setResults([]); setSearched(false); return }
    setLoading(true)
    setSearched(true)
    try {
      const { data } = await search(query)
      setResults(Array.isArray(data) ? data : data.results || [])
    } catch { setResults([]) }
    finally { setLoading(false) }
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQ(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(val), 350)
  }

  const clear = () => { setQ(''); setResults([]); setSearched(false); inputRef.current?.focus() }

  return (
    <div className="page-content" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="mb-6">
        <h1 className="text-2xl" style={{ fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Search
        </h1>
        <p className="text-secondary text-sm">Full-text search across your inbox</p>
      </div>

      {/* Search input */}
      <div className="search-wrapper mb-6" style={{ maxWidth: '100%', position: 'relative' }}>
        <Search size={16} className="search-icon" />
        <input
          ref={inputRef}
          id="search-input"
          className="search-input"
          style={{ fontSize: 15, padding: '12px 44px 12px 44px', borderRadius: 'var(--radius-lg)' }}
          placeholder="Search subjects, senders, body…"
          value={q}
          onChange={handleChange}
        />
        {q && (
          <button
            onClick={clear}
            style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center" style={{ padding: 40 }}>
          <div className="spinner spinner-lg" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><Mail size={24} /></div>
          <div>No results for "<strong>{q}</strong>"</div>
          <div className="text-xs text-muted">Try different keywords</div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div className="text-xs text-muted mb-3">
            {results.length} result{results.length !== 1 ? 's' : ''} for "<strong style={{color:'var(--text-secondary)'}}>{q}</strong>"
          </div>
          <div className="card">
            <div className="thread-list">
              {results.map(r => <ResultRow key={r.id} item={r} />)}
            </div>
          </div>
        </>
      )}

      {!searched && !loading && (
        <div className="empty-state">
          <div className="empty-icon" style={{ width: 64, height: 64 }}><Search size={28} /></div>
          <div className="text-lg" style={{ fontWeight: 600 }}>Search your inbox</div>
          <div className="text-sm text-muted">Type to search across subjects, senders, and body text</div>
        </div>
      )}
    </div>
  )
}
