import React from 'react'
import { useStudioTheme, castMapOf } from '../useTheme.js'
import { Avatar, Icon, Img, Verified } from '../ui.jsx'
import { cn, compact, formatCount } from '../../lib/util.js'

export default function TikTokProfile({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const author = castMap[data.castId] || project.cast[0]
  const videos = data.videos || []
  return (
    <div className={cn('app tt-profile-app', dark && 'is-dark')}>
      <div className="tt-profile-topbar">
        <span>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5 8 12l7 7" /></svg>
        </span>
        <span className="tt-profile-topname">@{author?.handle || 'username'}</span>
        <span className="tt-profile-top-icons">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3v13M12 3c1 3.2 2.8 4.8 6 5M4 13v6.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V13" /></svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </span>
      </div>

      <div className="tt-profile-scroll">
        <div className="tt-profile-avatar-wrap">
          <Avatar src={author?.avatar} name={author?.name} size={94} />
        </div>
        <div className="tt-profile-name">
          {author?.name || 'Character'}
          {author?.verified ? <Verified size={16} color="#20d5ec" /> : null}
        </div>
        <div className="tt-profile-stats">
          <span><b>{compact(data.following ?? author?.following ?? 0)}</b><em>Following</em></span>
          <span><b>{compact(data.followers ?? author?.followers ?? 0)}</b><em>Followers</em></span>
          <span><b>{compact(data.likes ?? 0)}</b><em>Likes</em></span>
        </div>
        <div className="tt-profile-buttons">
          <span className="tt-btn-follow">Follow</span>
          <span className="tt-btn-message">Message</span>
          <span className="tt-btn-more">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </div>
        {data.bio || author?.bio ? <div className="tt-profile-bio">{data.bio || author?.bio}</div> : null}
        {data.link ? <div className="tt-profile-link">↗ {data.link}</div> : null}

        <div className="tt-profile-tabs">
          <span className="active">Videos</span>
          <span>Reposts</span>
          <span>Favorites</span>
          <span>Liked</span>
        </div>

        <div className="tt-grid">
          {videos.length
            ? videos.map((v, i) => (
                <div className="tt-grid-cell" key={v.id || i}>
                  <Img src={v.image} className="tt-grid-img" seed={`tt-${i}`} alt="" />
                  <span className="tt-grid-views">
                    <Icon.play size={11} color="#fff" /> {v.views ? compact(v.views) : '0'}
                  </span>
                  {v.pinned ? <span className="tt-grid-pinned">Pinned</span> : null}
                </div>
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <div className="tt-grid-cell" key={i}>
                  <Img src="" className="tt-grid-img" seed={`tt-empty-${i}-${author?.name}`} alt="" />
                  <span className="tt-grid-views"><Icon.play size={11} color="#fff" /> 0</span>
                </div>
              ))}
        </div>
      </div>

      <div className="tt-profile-nav">
        <span className="active">
          <Icon.home size={22} filled />
          <em>Home</em>
        </span>
        <span>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="8" r="3.4" /><path d="M2.8 20c.5-3.6 3-5.7 6.2-5.7s5.7 2.1 6.2 5.7" /><path d="M16 5.2a3.4 3.4 0 0 1 0 5.6M18.5 14.6c1.6.8 2.5 2.6 2.8 5.4" /></svg>
          <em>Friends</em>
        </span>
        <span className="tt-profile-plus"><i /><i /><b /></span>
        <span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4 5h16v12H8l-4 4V5Z" /><path d="M8 9h8M8 13h5" strokeLinecap="round" /></svg>
          <em>Inbox</em>
        </span>
        <span className="active">
          <Avatar src={author?.avatar} name={author?.name} size={25} ring />
          <em>Profile</em>
        </span>
      </div>
    </div>
  )
}
