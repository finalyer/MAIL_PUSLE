import { useState } from 'react'
import {
  X, Check, CornerUpLeft, Mail, RefreshCw, Flag, AlertTriangle, Inbox, CheckCircle2, MoreVertical
} from 'lucide-react'
import { mockNotifications } from '../mockData'

export default function NotificationsDrawer({ isOpen, onClose, onActionClick }) {
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState(mockNotifications)

  if (!isOpen) return null

  const filtered = notifications.filter(n => {
    if (activeTab === 'all') return true
    if (activeTab === 'email') return n.category === 'email'
    if (activeTab === 'sync') return n.category === 'sync'
    if (activeTab === 'system') return n.category === 'system'
    return true
  })

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const renderIcon = (type) => {
    switch (type) {
      case 'reply':
        return <div className="notif-icon-circle red"><CornerUpLeft size={16} /></div>
      case 'read':
        return <div className="notif-icon-circle red"><Mail size={16} /></div>
      case 'sync':
        return <div className="notif-icon-circle green"><RefreshCw size={16} /></div>
      case 'flag':
        return <div className="notif-icon-circle red"><Flag size={16} /></div>
      case 'error':
        return <div className="notif-icon-circle red"><AlertTriangle size={16} /></div>
      case 'inbox':
        return <div className="notif-icon-circle amber"><Inbox size={16} /></div>
      default:
        return <div className="notif-icon-circle red"><Mail size={16} /></div>
    }
  }

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel" id="notifications-drawer">
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Notifications</h2>
            <p className="drawer-subtitle">Stay updated with your email activity, sync status, and more.</p>
          </div>
          <button className="drawer-close-btn" onClick={onClose} id="close-notif-btn">
            <X size={18} />
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ padding: '14px 24px 6px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className={`filter-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All (6)
          </button>
          <button
            className={`filter-tab-pill ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            Email Activity (3)
          </button>
          <button
            className={`filter-tab-pill ${activeTab === 'sync' ? 'active' : ''}`}
            onClick={() => setActiveTab('sync')}
          >
            Sync (2)
          </button>
          <button
            className={`filter-tab-pill ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            System (1)
          </button>
        </div>

        <div style={{ padding: '4px 24px 10px' }}>
          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={markAllRead}
            id="mark-all-read-btn"
          >
            <Check size={14} />
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="drawer-body">
          {filtered.map(item => (
            <div key={item.id} className="notif-card" id={`notif-item-${item.id}`}>
              {/* Unread red dot */}
              {item.unread && (
                <div
                  style={{
                    position: 'absolute',
                    left: 6,
                    top: 14,
                    width: 6,
                    height: 6,
                    borderRadius: 99,
                    background: 'var(--accent-red)'
                  }}
                />
              )}

              {renderIcon(item.type)}

              <div className="notif-content">
                <div className="notif-top-row">
                  <span className="notif-title">{item.title}</span>
                  <span className="notif-time">{item.time}</span>
                </div>
                <p className="notif-desc">{item.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    className="btn btn-outline-red btn-sm"
                    onClick={() => {
                      if (onActionClick) onActionClick(item)
                    }}
                  >
                    {item.actionText}
                  </button>
                  <button className="icon-toggle" title="More">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* All Caught Up Footer Card */}
          <div
            style={{
              marginTop: 'auto',
              padding: '24px 16px',
              textAlign: 'center',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)'
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--accent-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}
            >
              <CheckCircle2 size={22} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#ffffff', marginBottom: 4 }}>
              You're all caught up.
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
              No new notifications at the moment.
            </div>
            <button className="btn btn-secondary btn-sm" onClick={markAllRead}>
              Mark all as read
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
