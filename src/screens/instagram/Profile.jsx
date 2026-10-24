import React from 'react'
import { useStudioTheme } from '../useTheme.js'
import { Avatar, Icon, Img, Chevron } from '../ui.jsx'
import { IgBottomNav } from './Bits.jsx'
import { castMapOf } from '../useTheme.js'
import { compact, formatCount, cn } from '../../lib/util.js'

const Tabs = () => (
  <div className="ig-profile-tabs">
    <span className="ig-profile-tab active">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    </span>
    <span className="ig-profile-tab">
      <Icon.reels size={24} />
    </span>
    <span className="ig-profile-tab">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M3 7.5h18v12H3zM7 7.5 8.5 4h7L17 7.5" />
        <circle cx="12" cy="13.5" r="3.4" />
      </svg>
    </span>
  </div>
)

export default function InstagramProfile({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const author = castMap[data.castId] || project.cast[0]
  const grid = data.grid || []
  const highlights = data.highlights || []
  const followers = data.followers ?? author?.followers ?? 0
  const following = data.following ?? author?.following ?? 0
  const posts = data.posts ?? grid.length

  return (
    <div className={cn('app ig-app ig-profile-app', dark && 'is-dark')}>
      <div className="ig-profile-topbar">
        <span className="ig-profile-back"><Chevron size={24} /></span>
        <span className="ig-profile-title">
          {author?.handle || 'profile'}
          <Chevron dir="down" size={12} stroke={2.4} />
        </span>
        <span className="ig-profile-top-icons">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </span>
      </div>

      <div className="ig-profile-scroll">
        <div className="ig-profile-header">
          <span className="ig-profile-avatar-ring">
            <Avatar src={author?.avatar} name={author?.name} size={84} />
          </span>
          <div className="ig-profile-stats">
            <span><b>{formatCount(posts)}</b><em>posts</em></span>
            <span><b>{compact(followers)}</b><em>followers</em></span>
            <span><b>{compact(following)}</b><em>following</em></span>
          </div>
        </div>

        <div className="ig-profile-name">
          {author?.name || 'Character name'}
          {author?.verified ? <span className="ig-verified">✓</span> : null}
        </div>
        <div className="ig-profile-cat">{data.category || 'digital creator'}</div>
        {data.bio || author?.bio ? <div className="ig-profile-bio">{data.bio || author?.bio}</div> : null}
        {data.link || author?.link ? (
          <div className="ig-profile-link">{data.link || author?.link}</div>
        ) : null}

        <div className="ig-profile-buttons">
          <span className="ig-profile-btn primary">{data.showFollowing === false ? 'Follow' : 'Following'}</span>
          <span className="ig-profile-btn">Message</span>
          <span className="ig-profile-btn icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
              <circle cx="10" cy="8" r="3.6" />
              <path d="M3.5 20c.6-3.6 3.2-5.6 6.5-5.6s5.9 2 6.5 5.6M18 7v6M15 10h6" />
            </svg>
          </span>
        </div>

        {highlights.length ? (
          <div className="ig-highlights">
            {highlights.map((h) => (
              <div className="ig-highlight" key={h.id}>
                <span className="ig-highlight-ring">
                  <Avatar src={h.image} name={h.name} size={55} />
                </span>
                <span className="ig-highlight-name">{h.name}</span>
              </div>
            ))}
          </div>
        ) : null}

        <Tabs />

        <div className="ig-grid">
          {grid.length
            ? grid.map((g, i) => (
                <div className="ig-grid-cell" key={g.id || i}>
                  <Img src={g.image} className="ig-grid-img" seed={`${author?.name}-${i}`} alt="" />
                  {g.pinned ? (
                    <span className="ig-grid-badge pin">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 3 21 9.5l-2.3 2.3-1.6-.6-3.2 3.2.3 3.4-1.6 1.6-3.1-3.1L5 21l-1.4-1.4 4.7-4.7-3.1-3.1 1.6-1.6 3.4.3 3.2-3.2-.6-1.6L14.5 3Z" /></svg>
                    </span>
                  ) : null}
                  {g.type === 'reels' ? (
                    <span className="ig-grid-badge left"><Icon.play size={10} /></span>
                  ) : null}
                  {g.type === 'carousel' ? (
                    <span className="ig-grid-badge right">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="6" y="6" width="14" height="14" rx="2" /><path d="M4 16V5a1 1 0 0 1 1-1h11" /></svg>
                    </span>
                  ) : null}
                </div>
              ))
            : Array.from({ length: 9 }).map((_, i) => (
                <div className="ig-grid-cell" key={i}>
                  <Img src="" className="ig-grid-img" seed={`grid-${i}-${author?.name}`} alt="" />
                </div>
              ))}
        </div>
      </div>

      {data.showNav !== false ? <IgBottomNav active={4} dark={dark} profileAvatar={author?.avatar} /> : null}
    </div>
  )
}
