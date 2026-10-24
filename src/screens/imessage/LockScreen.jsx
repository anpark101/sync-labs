import React from 'react'
import { Avatar, AppIcon, Img, mediaSrc } from '../ui.jsx'
import { resolveChrome } from '../Phone.jsx'
import { cn } from '../../lib/util.js'

const APP_LABEL = {
  imessage: 'Messages',
  instagram: 'Instagram',
  x: 'X',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp',
  discord: 'Discord',
  snapchat: 'Snapchat',
  spotify: 'Spotify',
  youtube: 'YouTube',
  reddit: 'Reddit',
  phone: 'Phone',
  music: 'Music',
}

const LockGlyph = () => (
  <svg width="17" height="21" viewBox="0 0 17 21" fill="none" aria-hidden="true">
    <rect x="1" y="8.6" width="15" height="11.4" rx="3.4" fill="currentColor" />
    <path d="M4.4 8V6.2a4.1 4.1 0 0 1 8.2 0V8" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
  </svg>
)

export default function LockScreen({ project, screen, data }) {
  const chrome = resolveChrome(project, screen)
  const castMap = Object.fromEntries(project.cast.map((c) => [c.id, c]))
  const notifs = data.notifications || []
  const wallpaper = data.wallpaper || ''
  const weather = data.weather ?? '18°  Cloudy'
  const event = data.event ?? 'Nothing scheduled'
  return (
    <div className="app lock-app bleed">
      {wallpaper ? (
        <img className="lock-wallpaper" src={mediaSrc(wallpaper)} alt="" draggable={false} />
      ) : (
        <div className="lock-wallpaper lock-wallpaper-default" />
      )}
      <div className="lock-scrim" />
      <div className="lock-content">
        <div className="lock-head">
          <LockGlyph />
        </div>
        <div className="lock-date">{data.date || 'Monday, October 12'}</div>
        <div className="lock-clock">{data.time || chrome.time}</div>
        <div className="lock-widgets">
          <span className="lock-widget">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="4.2" fill="currentColor" />
              <path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            {weather}
          </span>
          <span className="lock-widget">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="3.4" stroke="currentColor" strokeWidth="1.7" />
              <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            {event}
          </span>
        </div>

        <div className="lock-notifications">
          {notifs.slice(0, 4).map((n) => {
            const cast = castMap[n.castId]
            const showAvatar = cast && n.app === 'imessage'
            return (
              <div key={n.id} className={cn('lock-notif', showAvatar && 'with-avatar')}>
                <div className="lock-notif-icon">
                  {showAvatar ? (
                    <>
                      <Avatar src={cast.avatar} name={cast.name} size={38} />
                      <span className="lock-notif-badge"><AppIcon app="imessage" size={17} /></span>
                    </>
                  ) : (
                    <AppIcon app={n.app || 'imessage'} size={38} />
                  )}
                </div>
                <div className="lock-notif-main">
                  <div className="lock-notif-top">
                    <span className="lock-notif-app">{APP_LABEL[n.app] || 'Messages'}</span>
                    <span className="lock-notif-time">{n.time || 'now'}</span>
                  </div>
                  <div className="lock-notif-title">{n.title || cast?.name || 'Messages'}</div>
                  <div className="lock-notif-body">{n.body}</div>
                </div>
              </div>
            )
          })}
          {data.moreCount ? <div className="lock-more">{data.moreCount} more notifications</div> : null}
        </div>

        <div className="lock-actions">
          <span className="lock-action">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9 2h6v6h6v6h-6v8H9v-8H3V8h6V2Z" opacity="0" />
              <path d="M6.6 6.6 4.2 4.2a9.9 9.9 0 0 1 15.6 0l-2.4 2.4a6.6 6.6 0 0 0-10.8 0Z" />
              <rect x="9.4" y="10" width="5.2" height="9" rx="2.6" />
              <path d="M12 4.5v3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="lock-action">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4.5 8.5h3l1.6-2.4h5.8l1.6 2.4h3A1.5 1.5 0 0 1 21 10v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-8a1.5 1.5 0 0 1 1.5-1.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <circle cx="12" cy="14" r="3.2" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}
