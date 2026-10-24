import React from 'react'
import { useStudioTheme, castMapOf } from '../useTheme.js'
import { Avatar, Img, mediaSrc } from '../ui.jsx'
import { cn } from '../../lib/util.js'

const WAVE = [6, 12, 9, 17, 22, 14, 10, 19, 25, 16, 8, 13, 21, 26, 12, 7, 15, 22, 18, 10, 24, 28, 15, 8]

const Ticks = ({ read }) => (
  <svg width="16" height="11" viewBox="0 0 20 11" fill="none" stroke={read ? '#53bdeb' : '#667781'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m1.5 6 3.2 3.2L12 1.8" />
    <path d="m8 6 3.2 3.2L18.5 1.8" />
  </svg>
)

export default function WhatsAppChat({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const participants = (data.participants || []).map((id) => castMap[id]).filter(Boolean)
  const contact = castMap[data.contactId] || participants[0] || project.cast[0]
  const isGroup = participants.length > 0
  const people = isGroup ? participants : contact ? [contact] : []
  const title = data.title || (isGroup ? people.map((p) => p.name.split(' ')[0]).join(', ') : contact?.name) || 'Chat'
  const messages = data.messages || []

  return (
    <div className={cn('app wa-app', dark && 'is-dark')}>
      <header className="wa-header">
        <span className="wa-back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5 8 12l7 7" /></svg>
        </span>
        <span className="wa-head-avatar">
          {isGroup ? (
            <span className="wa-group-avatar">
              {people.slice(0, 2).map((p, i) => <Avatar key={p.id} src={p.avatar} name={p.name} size={22} className={i ? 'second' : ''} />)}
            </span>
          ) : (
            <Avatar src={contact?.avatar} name={contact?.name} size={38} />
          )}
        </span>
        <div className="wa-head-meta">
          <span className="wa-head-name">{title}</span>
          <span className="wa-head-sub">{data.online !== false ? 'online' : 'last seen recently'}</span>
        </div>
        <div className="wa-head-icons">
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="6" width="13" height="12" rx="3" /><path d="m16 10.5 4.2-2.4a.6.6 0 0 1 .8.5v6.8a.6.6 0 0 1-.8.5L16 13.5" /></svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A18.3 18.3 0 0 1 3 3.7c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.2 1.1l-2.2 2.2Z" /></svg>
          <span className="wa-dots">⋮</span>
        </div>
      </header>

      <div className="wa-wallpaper" style={data.wallpaper ? { backgroundImage: `url(${mediaSrc(data.wallpaper)})` } : undefined}>
        <div className="wa-thread">
          {data.showEncryption !== false ? (
            <div className="wa-encrypt">
              <span>🔒</span> Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them.
            </div>
          ) : null}
          <div className="wa-day"><span>{data.dayLabel || 'TODAY'}</span></div>
          {messages.map((m, i) => {
            const outgoing = m.from === 'me'
            const sender = !outgoing && isGroup ? castMap[m.castId] || contact : null
            const isImage = m.kind === 'image'
            const isAudio = m.kind === 'audio'
            const time = m.time || '21:34'
            return (
              <div key={m.id || i} className={cn('wa-row', outgoing ? 'out' : 'in')}>
                {sender ? <div className="wa-sender" style={{ color: sender.color }}>{sender.name.split(' ')[0]}</div> : null}
                <div className={cn('wa-bubble', outgoing ? 'out' : 'in', isImage && 'pad0')}>
                  {isImage ? (
                    <div className="wa-image">
                      <Img src={m.image} className="wa-img" seed={m.id} alt="" />
                      <span className="wa-image-meta">{time} {outgoing ? <Ticks read={m.read !== false} /> : null}</span>
                    </div>
                  ) : isAudio ? (
                    <div className="wa-audio">
                      <span className="wa-audio-play">
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor"><path d="M1 1.3v11.4a.8.8 0 0 0 1.2.7l9-5.7a.8.8 0 0 0 0-1.4l-9-5.7A.8.8 0 0 0 1 1.3Z" /></svg>
                      </span>
                      <span className="wa-wave">{WAVE.map((h, k) => <i key={k} style={{ height: h }} />)}</span>
                      <em>{m.duration || '0:12'}</em>
                    </div>
                  ) : (
                    <span className="wa-text">{m.text}</span>
                  )}
                  {!isImage ? (
                    <span className="wa-meta">
                      {time}
                      {outgoing ? <Ticks read={m.read !== false} /> : null}
                    </span>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="wa-inputbar">
        <span className="wa-emoji">
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5a4.2 4.2 0 0 0 7 0" strokeLinecap="round" /><circle cx="9" cy="9.5" r=".9" fill="currentColor" /><circle cx="15" cy="9.5" r=".9" fill="currentColor" /></svg>
        </span>
        <div className="wa-input">
          <span>Message</span>
          <span className="wa-input-icons">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m21 11.5-8.6 8.6a5.3 5.3 0 0 1-7.5-7.5l9.2-9.2a3.5 3.5 0 0 1 5 5l-9.2 9.2a1.8 1.8 0 0 1-2.5-2.5l8.1-8.1" /></svg>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4.5 8.5h3l1.6-2.4h5.8l1.6 2.4h3A1.5 1.5 0 0 1 21 10v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-8a1.5 1.5 0 0 1 1.5-1.5Z" /><circle cx="12" cy="14" r="3.2" /></svg>
          </span>
        </div>
        <span className="wa-mic">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4" strokeLinecap="round" /></svg>
        </span>
      </div>
    </div>
  )
}
