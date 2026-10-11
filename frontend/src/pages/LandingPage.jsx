import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Lock, EyeOff, BarChart2, ArrowRight,
  TrendingUp, RefreshCw, Shield
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LandingPage() {
  const navigate = useNavigate()
  const { loginDemo } = useAuth()
  const [activeVolumeTab, setActiveVolumeTab] = useState('both')

  const handleDemoAccess = () => {
    loginDemo()
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: '#ffffff' }}>
      {/* ── Navbar ────────────────────────────────────────── */}
      <nav className="landing-navbar">
        <Link to="/" className="brand-link">
          <svg className="brand-pulse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2 12 6 12 9 4 13 20 16 10 18 14 22 12" />
          </svg>
          <span className="brand-title">MailPulse</span>
        </Link>

        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#privacy" className="landing-nav-link">Privacy</a>
          <a href="#about" className="landing-nav-link">About</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleDemoAccess}
            title="Explore full interactive UI with demo workspace"
          >
            Launch Interactive Demo
          </button>
          <a
            href="/api/auth/google"
            className="btn btn-primary-red"
            style={{ borderRadius: 'var(--radius-lg)', padding: '9px 18px' }}
          >
            <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#ffffff"/>
            </svg>
            Continue with Google
          </a>
        </div>
      </nav>

      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="landing-hero-grid">
        {/* Left Column: Pitch */}
        <div>
          <div className="hero-subtitle-badge">
            EMAIL ANALYTICS FOR A CLEARER TOMORROW
          </div>

          <h1 className="hero-title">
            Turn your inbox<br />
            into <span>intelligence.</span>
          </h1>

          <p className="hero-desc">
            Analyze your inbox, sent mails, communication patterns, and monthly activity with actionable clarity and speed.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <a
              href="/api/auth/google"
              className="google-cta-btn"
              id="hero-continue-btn"
              style={{ textDecoration: 'none' }}
            >
              <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#ffffff"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#ffffff"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#dddddd"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#dddddd"/>
              </svg>
              <span>Connect with Google</span>
              <ArrowRight size={18} />
            </a>

            <button
              onClick={handleDemoAccess}
              className="hero-trust-note"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              id="hero-demo-btn"
            >
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Or try the interactive demo →</span>
            </button>

            <div className="hero-trust-note" style={{ marginTop: 2 }}>
              <Lock size={14} color="var(--accent-red)" />
              <span>Read-only Gmail access. Your data stays private.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Mockup Frame */}
        <div className="mockup-frame-card" onClick={handleDemoAccess} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>MailPulse Dashboard — Live Workspace</span>
            </div>
            <span className="status-pill success" style={{ fontSize: 10 }}>
              ● Synced 5 min ago
            </span>
          </div>

          {/* Inner Dashboard Mockup Screen */}
          <div style={{ padding: '16px 0 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Dashboard</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Your email activity at a glance.</div>
              </div>
              <div className="btn btn-outline-red btn-sm" style={{ padding: '3px 8px', fontSize: 11 }}>
                <RefreshCw size={11} /> Sync Now
              </div>
            </div>

            {/* 4 Mini KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              <div className="kpi-card" style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Emails</span>
                  <span className="text-green">↑ 12%</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginTop: 4 }}>2,847</div>
              </div>

              <div className="kpi-card" style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sent Mails</span>
                  <span className="text-green">↑ 8%</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginTop: 4 }}>1,126</div>
              </div>

              <div className="kpi-card" style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Unread Emails</span>
                  <span className="text-red">↑ 24%</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginTop: 4 }}>321</div>
              </div>

              <div className="kpi-card" style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Starred Emails</span>
                  <span className="text-green">↑ 6%</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginTop: 4 }}>48</div>
              </div>
            </div>

            {/* Middle Section: Volume Chart & Monthly Report */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
              {/* Volume chart */}
              <div className="chart-card" style={{ padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>Email Volume</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <span className={`status-pill ${activeVolumeTab === 'inbox' ? 'danger' : 'neutral'}`} style={{ fontSize: 10, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setActiveVolumeTab('inbox'); }}>Inbox</span>
                    <span className={`status-pill ${activeVolumeTab === 'sent' ? 'danger' : 'neutral'}`} style={{ fontSize: 10, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setActiveVolumeTab('sent'); }}>Sent</span>
                    <span className={`status-pill ${activeVolumeTab === 'both' ? 'danger' : 'neutral'}`} style={{ fontSize: 10, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setActiveVolumeTab('both'); }}>Both</span>
                  </div>
                </div>

                {/* Bars visual */}
                <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', gap: 6, paddingTop: 10 }}>
                  {[30, 65, 45, 90, 60, 110, 80, 130, 95, 120, 75, 105].map((h, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', gap: 2 }}>
                      <div style={{ height: `${h * 0.55}%`, background: 'var(--accent-red)', borderRadius: 2 }} />
                      <div style={{ height: `${h * 0.35}%`, background: '#374151', borderRadius: 2 }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly report card */}
              <div className="chart-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>Monthly Report</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Oct 2026</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5, margin: '8px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Emails</span>
                    <span style={{ fontWeight: 600 }}>2,847</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Sent Mails</span>
                    <span style={{ fontWeight: 600 }}>1,126</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Received Mails</span>
                    <span style={{ fontWeight: 600 }}>1,721</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Unread Emails</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent-red)' }}>321</span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Explore full report</span>
                  <ArrowRight size={11} />
                </div>
              </div>
            </div>

            {/* Bottom Row in Mockup: Top Contacts & Categories Donut */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div className="chart-card" style={{ padding: '12px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Top Contacts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>team@company.com</span>
                    <span style={{ fontWeight: 600 }}>142</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>client@design.co</span>
                    <span style={{ fontWeight: 600 }}>96</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>project@startup.io</span>
                    <span style={{ fontWeight: 600 }}>64</span>
                  </div>
                </div>
              </div>

              <div className="chart-card" style={{ padding: '12px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Email Categories</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', border: '5px solid var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                    42%
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                    <div>Work 42%</div>
                    <div>Personal 28%</div>
                  </div>
                </div>
              </div>

              <div className="chart-card" style={{ padding: '12px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Recent Insights</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Email volume increased by 24% this week.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Trio Grid ─────────────────────────────── */}
      <section className="features-trio-grid" id="features">
        <div className="feature-trio-card" onClick={() => navigate('/analytics')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="kpi-icon-box" style={{ margin: 0, width: 44, height: 44 }}>
              <BarChart2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                Inbox and Sent Mail Analytics
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 320 }}>
                Get clear insights into your inbox and sent mails. Track volume, patterns, top contacts, and important conversations.
              </p>
            </div>
          </div>
          <ArrowRight size={18} color="var(--text-muted)" />
        </div>

        <div className="feature-trio-card" onClick={() => navigate('/reports')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="kpi-icon-box" style={{ margin: 0, width: 44, height: 44 }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                Monthly Communication Reports
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 320 }}>
                Understand your communication habits with detailed monthly reports, key metrics and actionable insights.
              </p>
            </div>
          </div>
          <ArrowRight size={18} color="var(--text-muted)" />
        </div>

        <div className="feature-trio-card" onClick={() => navigate('/sync')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="kpi-icon-box" style={{ margin: 0, width: 44, height: 44 }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                Secure Gmail Synchronization
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 320 }}>
                OCR-free, read-only Gmail access with encrypted token storage. Your data stays private and secure.
              </p>
            </div>
          </div>
          <ArrowRight size={18} color="var(--text-muted)" />
        </div>
      </section>

      {/* ── Privacy & Trust Pillars ───────────────────────── */}
      <footer className="privacy-banner-footer" id="privacy">
        <div className="privacy-banner-title">YOUR PRIVACY COMES FIRST</div>
        <div className="privacy-pillars-row">
          <div className="privacy-pillar">
            <div className="kpi-icon-box" style={{ margin: 0, width: 36, height: 36 }}>
              <Lock size={16} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#ffffff' }}>Read-only Gmail access</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>We only read your emails. No changes, no deletions.</div>
            </div>
          </div>

          <div className="privacy-pillar">
            <div className="kpi-icon-box" style={{ margin: 0, width: 36, height: 36 }}>
              <Shield size={16} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#ffffff' }}>Encrypted token storage</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Your Gmail tokens are securely encrypted.</div>
            </div>
          </div>

          <div className="privacy-pillar">
            <div className="kpi-icon-box" style={{ margin: 0, width: 36, height: 36 }}>
              <EyeOff size={16} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#ffffff' }}>No emails sent on your behalf</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>We never send emails from your account.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
