import React from 'react'
import { useStudioTheme, castMapOf } from '../useTheme.js'
import { Avatar, Icon, Img } from '../ui.jsx'
import { cn } from '../../lib/util.js'

export default function InstagramDM({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const other = castMap[data.castId] || project.cast[0]
  const me = project.cast.find((c) => c.id !== other?.id) || project.cast[0]
  const messages = data.messages || []

  return (
    <div className={cn('app ig-dm-app', dark && 'is-dark')}>
      <div className="ig-dm-header">
        <span className="ig-dm-back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5 8 12l7 7" />
          </svg>
        </span>
        <div className="ig-dm-header-user">
          <span className="ig-dm-avatar">
            <Avatar src={other?.avatar} name={other?.name} size={32} />
            {data.active !== false ? <i className="ig-dm-online" /> : null}
          </span>
          <span className="ig-dm-name">
            {other?.name || 'Character'}
            {other?.verified ? <span className="ig-verified">✓</span> : null}
            <em>{data.active !== false ? 'Active now' : 'Offline'}</em>
          </span>
        </div>
        <div className="ig-dm-header-icons">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
            <path d="M5.5 3.5 12 6l6.5-2.5v6L21 11v2l-2.5 1.5v6L12 18l-6.5 2.5v-6L3 13v-2l2.5-1.5v-6Z" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2.8" y="6" width="13" height="12" rx="3" />
            <path d="m16 10.8 4-2.3a.6.6 0 0 1 .9.5v6a.6.6 0 0 1-.9.5l-4-2.3" />
          </svg>
        </div>
      </div>

      <div className="ig-dm-thread">
        <div className="ig-dm-start">
          <Avatar src={other?.avatar} name={other?.name} size={64} />
          <span><b>{other?.handle || 'username'}</b> · Instagram</span>
          <em>You started this conversation</em>
        </div>

        {messages.map((m, i) => {
          const outgoing = m.from === 'me'
          const next = messages[i + 1]
          const lastInGroup = !next || next.from !== m.from
          const isPost = m.kind === 'post'
          const isImage = m.kind === 'image'
          const isAudio = m.kind === 'audio'
          if (m.kind === 'time') return <div key={m.id} className="ig-dm-time">{m.text}</div>
          return (
            <div key={m.id || i} className={cn('ig-dm-row', outgoing ? 'out' : 'in', lastInGroup && 'last')}>
              {!outgoing && lastInGroup ? <Avatar src={other?.avatar} name={other?.name} size={24} className="ig-dm-row-avatar" /> : null}
              <div className={cn('ig-dm-bubble', outgoing ? 'out' : 'in')} style={{ maxWidth: isPost || isImage ? 236 : 268 }}>
                {isPost ? (
                  <div className="ig-dm-shared">
                    <div className="ig-dm-shared-head">
                      <Avatar src={other?.avatar} name={other?.name} size={22} />
                      <b>{other?.handle}</b>
                      <span>· 1m</span>
                    </div>
                    <Img src={m.image} className="ig-dm-shared-img" seed={m.id} alt="" />
                    {m.text ? <div className="ig-dm-shared-caption">{m.text}</div> : null}
                  </div>
                ) : isImage ? (
                  <Img src={m.image} className="ig-dm-image" seed={m.id} alt="" />
                ) : isAudio ? (
                  <span className="ig-dm-audio">
                    <span className="ig-dm-audio-play"><Icon.play size={10} color="#fff" /></span>
                    <span className="ig-dm-wave">{Array.from({ length: 22 }).map((_, k) => <i key={k} style={{ height: 5 + ((k * 7) % 13) }} />)}</span>
                    <em>{m.duration || '0:14'}</em>
                  </span>
                ) : (
                  m.text
                )}
                {m.reaction ? <span className="ig-dm-reaction">{m.reaction}</span> : null}
              </div>
              {outgoing && lastInGroup && data.seen ? <span className="ig-dm-seen">Seen</span> : null}
            </div>
          )
        })}
      </div>

      {data.showReply !== false ? (
        <div className="ig-dm-inputbar">
          <span className="ig-dm-plus">
            <svg width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="14" fill="#3797f0" /><path d="M15 9v12M9 15h12" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
          </span>
          <div className="ig-dm-input">
            <span>Message…</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="ig-dm-input-icons">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="m4 17 5-5 4 4 3-2 4 4" strokeLinejoin="round" /></svg>
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 8h4l2-3h4l2 3h4v11H4z" strokeLinejoin="round" /><circle cx="12" cy="13" r="3" /></svg>
          </div>
        </div>
      ) : null}
    </div>
  )
}
