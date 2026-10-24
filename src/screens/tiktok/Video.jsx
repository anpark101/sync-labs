import React from 'react'
import { useStudioTheme, castMapOf } from '../useTheme.js'
import { Avatar, Icon, Img, RichText, Verified, mediaSrc } from '../ui.jsx'
import { cn, compact } from '../../lib/util.js'

const TikTokNav = ({ avatar, name }) => (
  <div className="tt-nav">
    <span className="tt-nav-item active">
      <Icon.home size={22} filled />
      <em>Home</em>
    </span>
    <span className="tt-nav-item">
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="9" cy="8" r="3.4" /><path d="M2.8 20c.5-3.6 3-5.7 6.2-5.7s5.7 2.1 6.2 5.7" />
        <path d="M16 5.2a3.4 3.4 0 0 1 0 5.6M18.5 14.6c1.6.8 2.5 2.6 2.8 5.4" />
      </svg>
      <em>Friends</em>
    </span>
    <span className="tt-nav-create">
      <i /><i />
      <span />
    </span>
    <span className="tt-nav-item">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M4 5h16v12H8l-4 4V5Z" />
        <path d="M8 9h8M8 13h5" strokeLinecap="round" />
      </svg>
      <em>Inbox</em>
    </span>
    <span className="tt-nav-item">
      <span className="tt-nav-avatar"><Avatar src={avatar} name={name} size={25} /></span>
      <em>Profile</em>
    </span>
  </div>
)

export default function TikTokVideo({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const author = castMap[data.castId] || project.cast[0]
  return (
    <div className={cn('app tt-app bleed', dark && 'is-dark')}>
      {data.cover ? (
        <img className="tt-cover" src={mediaSrc(data.cover)} alt="" draggable={false} />
      ) : (
        <Img src="" className="tt-cover tt-cover-empty" seed={author?.name || 'tiktok'} alt="" />
      )}
      <div className="tt-shade top" />
      <div className="tt-shade bottom" />

      <div className="tt-top">
        <div className="tt-top-tabs">
          <span>Following</span>
          <span className="active">For You</span>
        </div>
        <span className="tt-top-search">
          <Icon.search size={23} color="#fff" />
        </span>
      </div>

      <div className="tt-rail">
        <div className="tt-rail-avatar">
          <Avatar src={author?.avatar} name={author?.name} size={45} ring />
          <span className="tt-follow-badge">+</span>
        </div>
        <div className="tt-rail-item">
          <Icon.heart size={33} color="#fff" filled={!!data.liked} />
          <em>{compact(data.likes)}</em>
        </div>
        <div className="tt-rail-item">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <path d="M21 11.3a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-3.7-.8L3 20.5l1.7-4.7A8.3 8.3 0 0 1 3.6 11a8.4 8.4 0 0 1 8.6-8.2A8.4 8.4 0 0 1 21 11.3Z" />
            <circle cx="8.5" cy="11.5" r="1.2" fill="#000" opacity=".65" />
            <circle cx="12" cy="11.5" r="1.2" fill="#000" opacity=".65" />
            <circle cx="15.5" cy="11.5" r="1.2" fill="#000" opacity=".65" />
          </svg>
          <em>{compact(data.comments)}</em>
        </div>
        <div className="tt-rail-item">
          <Icon.bookmark size={30} color="#fff" filled={!!data.saved} />
          <em>{compact(data.saves)}</em>
        </div>
        <div className="tt-rail-item">
          <Icon.share size={29} color="#fff" />
          <em>{compact(data.shares)}</em>
        </div>
        <div className="tt-disc">
          <span className="tt-disc-cover">
            <Avatar src={author?.avatar} name={author?.name} size={32} />
          </span>
          <span className="tt-disc-notes"><Icon.music size={12} color="#fff" /></span>
        </div>
      </div>

      <div className="tt-bottom">
        <div className="tt-author">
          @{author?.handle || 'username'}
          {author?.verified ? <Verified size={14} color="#20d5ec" variant="circle" /> : null}
        </div>
        <p className="tt-caption">
          <RichText text={data.caption} accent="#fff" />
        </p>
        <div className="tt-music">
          <Icon.music size={15} color="#fff" />
          <div className="tt-music-track">
            <span>{data.music || 'original sound'}{data.musicArtist ? ` - ${data.musicArtist}` : ''}</span>
          </div>
        </div>
      </div>

      {data.showNav !== false ? <TikTokNav avatar={author?.avatar} name={author?.name} /> : null}
    </div>
  )
}
