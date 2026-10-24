import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, Layers, Plus, Settings as SettingsIcon } from 'lucide-react'
import { Brand } from './Brand.jsx'
import { useStudio } from '../lib/store.jsx'

export const SaveIndicator = ({ compact = false }) => {
  const { saveState, loaded } = useStudio()
  if (!loaded) return null
  const status = saveState.status
  const labels = {
    idle: 'Autosave on',
    saved: 'Saved',
    saving: 'Saving…',
    unsaved: 'Saving…',
    error: 'Save failed',
  }
  const label = labels[status] || 'Autosave on'
  const dotClass = status === 'error' ? 'error' : status === 'saved' ? 'saved' : status === 'saving' || status === 'unsaved' ? 'saving' : ''
  const time = saveState.at
    ? new Date(saveState.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : null
  return (
    <span
      className="save-pill"
      title={status === 'error' ? saveState.error : time ? `Last saved at ${time}` : 'Changes save automatically in this browser'}
    >
      <i className={`save-dot ${dotClass}`} />
      <span className="save-label">{label}</span>
      {!compact && time && status === 'saved' ? <span className="muted tiny hide-mobile">· {time}</span> : null}
    </span>
  )
}

export default function Shell({ children, footer = true, wide = false }) {
  const navigate = useNavigate()
  return (
    <div className="shell">
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" aria-label="Elsewhere home" className="brand">
            <Brand />
          </Link>
          <nav className="header-nav" aria-label="Main">
            <NavLink to="/" end className={({ isActive }) => `header-link ${isActive ? 'active' : ''}`}>
              <Layers size={16} />
              <span>Library</span>
            </NavLink>
            <NavLink to="/new" className={({ isActive }) => `header-link ${isActive ? 'active' : ''}`}>
              <Plus size={16} />
              <span>Templates</span>
            </NavLink>
            <NavLink to="/guide" className={({ isActive }) => `header-link ${isActive ? 'active' : ''}`}>
              <BookOpen size={16} />
              <span>Guide</span>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `header-link ${isActive ? 'active' : ''}`} aria-label="Settings">
              <SettingsIcon size={17} />
              <span className="hide-mobile">Settings</span>
            </NavLink>
          </nav>
          <div className="header-actions">
            <SaveIndicator />
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/new')}>
              <Plus size={15} />
              <span>New AU</span>
            </button>
          </div>
        </div>
      </header>
      <main className={wide ? '' : ''}>{children}</main>
      {footer ? (
        <footer className="site-footer">
          <div className="page spread" style={{ maxWidth: 'var(--max)', width: '100%', padding: 0 }}>
            <div className="stack" style={{ gap: 6 }}>
              <span className="brand-name serif">elsewhere</span>
              <span className="disclaimer">
                A private studio for fictional social media stories. Not affiliated with Instagram, X, TikTok, or any platform shown.
                All characters and posts are invented by you.
              </span>
            </div>
            <div className="footer-links">
              <Link to="/">Library</Link>
              <Link to="/new">Templates</Link>
              <Link to="/guide">Guide</Link>
              <Link to="/settings">Backups</Link>
            </div>
            <span className="tiny">Made for stories that live on your phone.</span>
          </div>
        </footer>
      ) : null}
    </div>
  )
}
