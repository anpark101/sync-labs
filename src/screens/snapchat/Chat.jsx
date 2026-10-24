import React from 'react'
import { useStudioTheme, castMapOf } from '../useTheme.js'
import { Avatar } from '../ui.jsx'
import { cn } from '../../lib/util.js'

export default function SnapchatChat({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const contact = castMap[data.contactId] || project.cast[0]
  const messages = data.messages || []
  return (
    <div className={cn('app sc-app', dark && 'is-dark')}>
      <header className="sc-header">
        <span className="sc-back">
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5 8 12l7 7" /></svg>
        </span>
        <div className="sc-head-user">
          <span className="sc-avatar-wrap">
            <Avatar src={contact?.avatar} name={contact?.name} size={38} />
            {data.streak ? <span className="sc-streak">🔥{data.streak}</span> : null}
          </span>
          <div className="sc-head-meta">
            <span className="sc-name">{contact?.name || 'Character'}</span>
            <span className="sc-sub">{data.presence || 'Active now'}</span>
          </div>
        </div>
        <div className="sc-head-icons">
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A18.3 18.3 0 0 1 3 3.7c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.2 1.1l-2.2 2.2Z" /></svg>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="2.5" y="6" width="13" height="12" rx="3" /><path d="m16 10.5 4.2-2.4a.6.6 0 0 1 .8.5v6.8a.6.6 0 0 1-.8.5L16 13.5" /></svg>
        </div>
      </header>

      <div className="sc-thread">
        <div className="sc-snap-hero">
          <span className="sc-hero-avatar"><Avatar src={contact?.avatar} name={contact?.name} size={74} /></span>
          <div className="sc-hero-name">{contact?.name || 'Character'}</div>
          <div className="sc-hero-sub">{data.heroSub || 'You’re friends on Snapchat'}</div>
          <div className="sc-hero-badge">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#FFFC00"><path d="M12 2 14.6 6l4.8.4-3.5 3.4.9 4.7L12 12.3 7.2 14.5l.9-4.7L4.6 6.4 9.4 6 12 2Z" /></svg>
            {data.streak || 0} day streak
          </div>
        </div>

        <div className="sc-day">{data.dayLabel || 'TODAY'}</div>
        {messages.map((m, i) => {
          const outgoing = m.from === 'me'
          if (m.kind === 'snap') {
            return (
              <div key={m.id || i} className={cn('sc-row', outgoing ? 'out' : 'in')}>
                <div className={cn('sc-snapcard', outgoing ? 'out' : 'in')}>
                  <span className="sc-snapcard-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="14" rx="3" /><path d="M7 15h10M8 9h.01M16 9h.01" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div className="sc-snapcard-meta">
                    <b>{m.text || (outgoing ? 'Sent a Snap' : 'Received a Snap')}</b>
                    <span>{m.sub || 'Opened · 2m'} {m.time ? `· ${m.time}` : ''}</span>
                  </div>
                  <span className="sc-snapcard-chevron">›</span>
                </div>
              </div>
            )
          }
          if (m.kind === 'image') {
            return (
              <div key={m.id || i} className={cn('sc-row', outgoing ? 'out' : 'in')}>
                <div className="sc-photo"><img src={m.image} alt="" /></div>
              </div>
            )
          }
          return (
            <div key={m.id || i} className={cn('sc-row', outgoing ? 'out' : 'in')}>
              <div className={cn('sc-bubble', outgoing ? 'out' : 'in')}>
                {m.text}
                <span className="sc-msg-time">{m.time || '2m'}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="sc-inputbar">
        <span className="sc-cam-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4.5 8.5h3l1.6-2.4h5.8l1.6 2.4h3A1.5 1.5 0 0 1 21 10v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-8a1.5 1.5 0 0 1 1.5-1.5Z" /><circle cx="12" cy="14" r="3.2" /></svg>
        </span>
        <div className="sc-input">
          <span>Chat</span>
          <span className="sc-input-icons">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" shapeRendering="crispEdges"><path d="M4 8h4l2-3h4l2 3h4v11H4z" strokeLinejoin="round" /><circle cx="12" cy="13" r="3" /></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5a4.2 4.2 0 0 0 7 0" strokeLinecap="round" /><circle cx="9" cy="9.5" r=".9" fill="currentColor" /><circle cx="15" cy="9.5" r=".9" fill="currentColor" /></svg>
            <IconMic />
          </span>
        </div>
        <span className="sc-send">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="m21 4-7 16.5-3-7.5-7.5-3L21 4Z" /></svg>
        </span>
      </div>
    </div>
  )
}

const IconMic = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4" strokeLinecap="round" />
  </svg>
)
