import { Zap, BarChart2, Mail, Search, Shield, Clock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-bg" />
      <div className="landing-grid" />

      <div className="landing-content fade-in">
        {/* Badge */}
        <div className="landing-badge">
          <Zap size={12} />
          AI-Powered Gmail Intelligence · Phase 1
        </div>

        {/* Headline */}
        <h1 className="landing-title">
          Understand your<br />inbox like never<br />before.
        </h1>

        <p className="landing-sub">
          MailPulse analyzes your Gmail to surface patterns, trends, and
          insights you never knew existed — in real time.
        </p>

        {/* Google Login */}
        <a href="/api/auth/google" className="google-btn" id="google-login-btn">
          <svg className="google-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </a>

        {/* Feature chips */}
        <div className="features-row">
          <div className="feature-chip"><BarChart2 size={13} /> Analytics Dashboard</div>
          <div className="feature-chip"><Mail size={13} /> Smart Inbox</div>
          <div className="feature-chip"><Search size={13} /> Full-text Search</div>
          <div className="feature-chip"><Shield size={13} /> Encrypted Tokens</div>
          <div className="feature-chip"><Clock size={13} /> Auto Sync</div>
        </div>
      </div>
    </div>
  )
}
