import React from 'react'
import { useStudioTheme } from '../useTheme.js'
import { Avatar, Chevron, Icon, Img } from '../ui.jsx'
import { cn } from '../../lib/util.js'

const WAVE = [6, 12, 8, 18, 24, 15, 10, 20, 26, 17, 9, 14, 22, 28, 13, 7, 16, 23, 19, 11, 25, 30, 16, 9, 14, 20, 12, 7, 17, 22]

const AudioBubble = ({ duration = '0:14', outgoing }) => (
  <span className={cn('im-audio', outgoing ? 'out' : 'in')}>
    <span className="im-audio-play"><Icon.play size={12} color={outgoing ? '#fff' : 'currentColor'} /></span>
    <span className="im-wave" aria-hidden="true">
      {WAVE.map((h, i) => (
        <i key={i} style={{ height: h }} />
      ))}
    </span>
    <span className="im-audio-dur">{duration}</span>
  </span>
)

export default function IMessageChat({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const castMap = Object.fromEntries(project.cast.map((c) => [c.id, c]))
  const participants = (data.participants || []).map((id) => castMap[id]).filter(Boolean)
  const contact = castMap[data.contactId] || participants[0]
  const isGroup = participants.length > 0
  const people = isGroup ? participants : contact ? [contact] : []
  const title =
    data.title ||
    (isGroup
      ? people.length > 2
        ? `${people.slice(0, 2).map((p) => p.name.split(' ')[0]).join(', ')} & ${people.length - 2} more`
        : people.map((p) => p.name.split(' ')[0]).join(' & ')
      : contact?.name) ||
    'New Message'
  const messages = data.messages || []

  return (
    <div className={cn('app im-app', theme === 'dark' && 'is-dark')}>
      <header className="im-header">
        <span className="im-header-back">
          <Chevron dir="left" size={26} color="var(--im-accent)" stroke={2.6} />
          <span className="im-back-count">3</span>
        </span>
        <div className="im-header-center">
          <div className={cn('im-header-avatars', people.length > 1 && 'multi')}>
            {people.slice(0, 2).map((p, i) => (
              <Avatar key={p.id} src={p.avatar} name={p.name} size={people.length > 1 ? 25 : 27} className={i ? 'second' : ''} />
            ))}
            {!people.length ? <span className="im-unknown-avatar">?</span> : null}
          </div>
          <span className="im-header-name">{title}</span>
          <Chevron dir="right" size={11} color="var(--im-muted)" stroke={2.6} />
        </div>
        <span className="im-header-facetime">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="6" width="13.5" height="12" rx="3.2" stroke="var(--im-accent)" strokeWidth="1.8" />
            <path d="m17 10.8 4.2-2.5a.7.7 0 0 1 1 .6v6.2a.7.7 0 0 1-1 .6L17 13.2" stroke="var(--im-accent)" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </span>
      </header>

      <div className="im-thread">
        {messages[0]?.kind === 'time' ? null : (
          <div className="im-day">{data.day || 'Today'} <span>{data.time || '9:41 AM'}</span></div>
        )}
        {messages.map((m, idx) => {
          if (m.kind === 'time') {
            if (idx > 0 && messages[idx - 1]?.kind === 'time') return null
            return (
              <div key={m.id || idx} className="im-time-sep">
                {m.text || 'Today 9:41 AM'}
              </div>
            )
          }
          const outgoing = m.from === 'me'
          if (m.kind === 'call') {
            return (
              <div key={m.id || idx} className="im-call">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A18.3 18.3 0 0 1 3 3.7c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.2 1.1l-2.2 2.2Z" />
                </svg>
                <span>{m.text || 'FaceTime Audio'}</span>
                {m.duration ? <span className="im-call-dur">{m.duration}</span> : null}
              </div>
            )
          }
          const prev = messages[idx - 1]
          const next = messages[idx + 1]
          const sameAsPrev = prev && prev.from === m.from && prev.kind !== 'time' && prev.kind !== 'call'
          const nextSame = next && next.from === m.from && next.kind !== 'time' && next.kind !== 'call'
          const isEmoji = m.kind === 'emoji'
          const sender = !outgoing && isGroup ? castMap[m.castId] || contact : null
          const isImage = m.kind === 'image'
          const isAudio = m.kind === 'audio'
          return (
            <div key={m.id || idx} className="im-row-wrap">
              {sender && !sameAsPrev ? <div className="im-sender">{sender.name.split(' ')[0]}</div> : null}
              <div className={cn('im-row', outgoing ? 'out' : 'in', !sameAsPrev && 'first', !nextSame && 'last', isEmoji && 'emoji-row')}>
                {isEmoji ? (
                  <span className="im-emoji">{m.text || '🫶'}</span>
                ) : (
                  <div
                    className={cn(
                      'im-bubble',
                      outgoing ? 'out' : 'in',
                      isImage && 'media',
                      isAudio && 'audio',
                      !nextSame && 'tail'
                    )}
                  >
                    {isImage ? (
                      <Img src={m.image} className="im-attach" seed={m.id} alt="" />
                    ) : isAudio ? (
                      <AudioBubble outgoing={outgoing} duration={m.duration || '0:14'} />
                    ) : (
                      <span className="im-text">{m.text}</span>
                    )}
                    {m.reaction ? <span className={cn('im-reaction', outgoing ? 'left' : 'right')}>{m.reaction}</span> : null}
                  </div>
                )}
                {isGroup && outgoing && !nextSame && m.senderName ? <span className="im-meta">{m.senderName}</span> : null}
              </div>
            </div>
          )
        })}
        {data.typing ? (
          <div className="im-row in last">
            <div className="im-bubble in tail im-typing">
              <i /><i /><i />
            </div>
          </div>
        ) : null}
        {data.receipt && data.receipt !== 'None' ? (
          <div className="im-receipt">{data.receipt === 'Read' ? 'Read' : 'Delivered'}</div>
        ) : null}
      </div>

      <div className="im-inputbar">
        <span className="im-plus">
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
            <circle cx="15" cy="15" r="14" fill="var(--im-plus-bg)" />
            <path d="M15 9v12M9 15h12" stroke="var(--im-plus-fg)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <div className="im-input">
          <span className="im-placeholder">{data.placeholder || 'iMessage'}</span>
          <svg className="im-mic" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.7" />
            <path d="M6 11a6 6 0 0 0 12 0M12 17v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
