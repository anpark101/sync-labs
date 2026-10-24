import React from 'react'
import { useStudioTheme, castMapOf } from '../useTheme.js'
import { Avatar, Icon, mediaSrc } from '../ui.jsx'
import { cn } from '../../lib/util.js'

export default function DiscordChat({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const messages = data.messages || []
  return (
    <div className={cn('app dc-app', dark && 'is-dark')}>
      <header className="dc-header">
        <span className="dc-hash">#</span>
        <div className="dc-head-meta">
          <span className="dc-head-name">{data.channelName || 'general'}</span>
          <span className="dc-head-topic">{data.topic || 'no thoughts head empty'}</span>
        </div>
        <div className="dc-head-icons">
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="9" cy="8" r="3.2" /><path d="M3 19.5c.5-3.3 2.8-5.2 6-5.2s5.5 1.9 6 5.2" />
            <path d="M16 5.4a3.2 3.2 0 0 1 0 5.2M18.5 14.6c1.5.8 2.4 2.4 2.7 4.9" />
          </svg>
          <Icon.search size={22} />
        </div>
      </header>

      <div className="dc-thread">
        <div className="dc-channel-start">
          <span className="dc-channel-icon">#</span>
          <h4>Welcome to #{data.channelName || 'general'}!</h4>
          <p>This is the start of the #{data.channelName || 'general'} channel.</p>
        </div>
        <div className="dc-date"><span>{data.dateLabel || 'Today'}</span></div>
        {messages.map((m, i) => {
          const author = castMap[m.castId] || project.cast[0]
          const prev = messages[i - 1]
          const grouped = prev && prev.castId === m.castId && !m.replyTo
          return (
            <div className={cn('dc-message', grouped && 'grouped')} key={m.id || i}>
              {!grouped ? (
                <Avatar src={author?.avatar} name={author?.name} size={40} className="dc-avatar" />
              ) : (
                <span className="dc-avatar-spacer" />
              )}
              <div className="dc-msg-main">
                {m.replyTo ? (
                  <div className="dc-reply-preview">
                    <span className="dc-reply-line" />
                    <Avatar src={m.replyTo.avatar} name={m.replyTo.author} size={16} />
                    <b>{m.replyTo.author || 'someone'}</b>
                    <span>{m.replyTo.text}</span>
                  </div>
                ) : null}
                {!grouped ? (
                  <div className="dc-msg-head">
                    <span className="dc-author" style={{ color: author?.color || '#f2f3f5' }}>{author?.name || 'user'}</span>
                    {m.bot ? <span className="dc-bot">APP</span> : null}
                    <span className="dc-time">{m.time || 'Today at 00:02'}</span>
                  </div>
                ) : null}
                <p className="dc-text" style={{ paddingLeft: 0 }}>{m.text}</p>
                {m.image ? <img className="dc-attachment" src={mediaSrc(m.image)} alt="" /> : null}
                {m.reactions?.length ? (
                  <div className="dc-reactions">
                    {m.reactions.map((r, k) => (
                      <span key={k} className={cn('dc-reaction', r.me && 'me')}>
                        {r.emoji} <b>{r.count}</b>
                      </span>
                    ))}
                    <span className="dc-reaction add">+</span>
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      <div className="dc-inputbar">
        <span className="dc-input-plus">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v4h4v2h-4v4h-2v-4H7v-2h4V7h2Z" /></svg>
        </span>
        <div className="dc-input">
          <span>Message #{data.channelName || 'general'}</span>
          <span className="dc-input-icons">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.4" /><circle cx="8.5" cy="10" r="1.6" /><path d="m3.5 17 5-4.2 4 3.2 3-2 5 4" /></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M3 8h18v9H8l-5 3V8Z" /><path d="M8 11h8M8 14h5" strokeLinecap="round" /></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5a4.2 4.2 0 0 0 7 0" strokeLinecap="round" /><circle cx="9" cy="9.5" r=".9" fill="currentColor" /><circle cx="15" cy="9.5" r=".9" fill="currentColor" /></svg>
          </span>
        </div>
      </div>
    </div>
  )
}
