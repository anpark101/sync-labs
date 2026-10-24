import React from 'react'
import { useStudioTheme, castMapOf } from '../useTheme.js'
import { Img, mediaSrc } from '../ui.jsx'
import { cn, gradientFor, initials } from '../../lib/util.js'

const fmt = (s) => {
  const v = Math.max(0, Math.round(s || 0))
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`
}

export default function SpotifyNowPlaying({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const author = castMap[data.castId] || project.cast[0]
  const duration = Number(data.duration) || 214
  const progress = Math.min(100, Math.max(0, Number(data.progress) || 0))
  const elapsed = Math.round((duration * progress) / 100)
  const accent = data.accent || '#3f5147'
  return (
    <div className={cn('app sp-app', dark && 'is-dark')} style={{ '--sp-accent': accent }}>
      <div className="sp-bg" />
      <header className="sp-header">
        <span className="sp-chevron">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </span>
        <div className="sp-context">
          <span>PLAYING FROM PLAYLIST</span>
          <b>{data.playlist || 'this is what it feels like'}</b>
        </div>
        <span className="sp-more">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="19" cy="12" r="1.9" /></svg>
        </span>
      </header>

      <div className="sp-body">
        <div className="sp-art">
          {data.cover ? (
            <img src={mediaSrc(data.cover)} alt="" draggable={false} />
          ) : (
            <div className="sp-art-empty" style={{ background: 'linear-gradient(150deg, color-mix(in srgb, var(--sp-accent) 72%, #fff 8%), #141414)' }}>
              <span className="sp-art-rings" aria-hidden="true" />
              <span className="sp-art-mono serif">{initials(data.title || data.artist || 'now playing')}</span>
            </div>
          )}
          <div className="sp-art-shine" />
        </div>

        <div className="sp-track-row">
          <div className="sp-track-meta">
            <div className="sp-title">{data.title || 'Untitled song'}</div>
            <div className="sp-artist">
              {data.artist || author?.name || 'Unknown artist'}
              {data.album ? <span> · {data.album}</span> : null}
            </div>
          </div>
          <span className="sp-heart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={data.liked ? '#1ed760' : 'none'} stroke={data.liked ? '#1ed760' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>
          </span>
        </div>

        {data.note ? <div className="sp-note">“{data.note}”</div> : null}

        <div className="sp-progress">
          <div className="sp-bar"><i style={{ width: `${progress}%` }} /><b style={{ left: `${progress}%` }} /></div>
          <div className="sp-times">
            <span>{fmt(elapsed)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        <div className="sp-controls">
          <span className="sp-ctrl small">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 3.5 20 7l-3.5 3.5M3.5 7h4.2c2 0 3.4 1.1 4.7 3s3.1 4.6 5.3 4.6h2.3M16.5 11.2 20 14.7l-3.5 3.5M3.5 18.5h4.2c1.5 0 2.6-.4 3.6-1.3" /></svg>
          </span>
          <span className="sp-ctrl">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h2.3v16H6zM9.6 12 19 4.5v15L9.6 12Z" /></svg>
          </span>
          <span className="sp-play">
            <svg width="27" height="27" viewBox="0 0 24 24" fill="#000"><path d="M7.5 4.2a.9.9 0 0 1 1.4-.8l11 7.1a1.5 1.5 0 0 1 0 2.5l-11 7.1a.9.9 0 0 1-1.4-.7V4.2Z" /></svg>
          </span>
          <span className="sp-ctrl">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M15.7 4H18v16h-2.3zM5 4.5 14.4 12 5 19.5v-15Z" /></svg>
          </span>
          <span className="sp-ctrl small">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6.4 5.4h11.2a3 3 0 0 1 3 3v3.2M17.6 18.6H6.4a3 3 0 0 1-3-3v-3.2" /><path d="m8.2 2.6-2.8 2.8 2.8 2.8M15.8 21.4l2.8-2.8-2.8-2.8" /></svg>
          </span>
        </div>

        <div className="sp-bottom-icons">
          <span>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M9 8h6M9 12h6" strokeLinecap="round" /></svg>
          </span>
          <span>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V3M8 7l4-4 4 4M4 14v5.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V14" /></svg>
          </span>
          <span>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
          </span>
        </div>
      </div>

    </div>
  )
}
