import React from 'react'
import { BrandIcon, Icon, Verified, mediaSrc } from '../ui.jsx'
import { cn, compact } from '../../lib/util.js'

export const XTopBar = ({ title = '', back = false, right = null }) => (
  <div className="x-topbar">
    <span className="x-topbar-left">
      {back ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
      ) : (
        <BrandIcon name="x" size={22} color="currentColor" />
      )}
    </span>
    {title ? <span className="x-topbar-title">{title}</span> : <span />}
    <span className="x-topbar-right">
      {right === 'search' ? (
        <Icon.search size={22} />
      ) : right === 'more' ? (
        <Icon.more size={20} />
      ) : right === 'bell' ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-2 7-2 8h16c0-1-2-1-2-8Z" />
          <path d="M10 20a2.2 2.2 0 0 0 4 0" strokeLinecap="round" />
        </svg>
      ) : null}
    </span>
  </div>
)

export const XNav = () => (
  <div className="x-nav">
    <span className="x-nav-item active"><Icon.home size={24} filled /></span>
    <span className="x-nav-item"><Icon.search size={24} /></span>
    <span className="x-nav-item">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="m12 3 2.1 6.1L20 11l-5.9 1.9L12 19l-2.1-6.1L4 11l5.9-1.9L12 3Z" />
        <path d="m19 3 .8 2.2L22 6l-2.2.8L19 9l-.8-2.2L16 6l2.2-.8L19 3Z" fill="currentColor" stroke="none" />
      </svg>
    </span>
    <span className="x-nav-item badge">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M18 8a6 6 0 1 0-12 0c0 7-2 7-2 8h16c0-1-2-1-2-8Z" />
        <path d="M10 20a2.2 2.2 0 0 0 4 0" strokeLinecap="round" />
      </svg>
    </span>
    <span className="x-nav-item">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <rect x="2.5" y="5" width="19" height="14" rx="2.4" />
        <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
      </svg>
    </span>
  </div>
)

export const XName = ({ cast, fallback = 'User', light = false, small = false }) => (
  <span className={cn('x-name', light && 'light', small && 'small')}>
    <b>{cast?.name || fallback}</b>
    {cast?.verified ? <Verified variant="x" color={light ? '#1d9bf0' : '#1d9bf0'} size={small ? 15 : 17} /> : null}
  </span>
)

export const XHandle = ({ handle, time }) => (
  <span className="x-handle">
    @{handle || 'user'}
    {time ? <span className="x-dot">·</span> : null}
    {time ? <span className="x-time">{time}</span> : null}
  </span>
)

export const XActions = ({ data, compactMode = false }) => (
  <div className={cn('x-actions', compactMode && 'compact')}>
    <span className="x-action">
      <Icon.comment size={18} />
      <em>{data.replies ? compact(data.replies) : ''}</em>
    </span>
    <span className="x-action">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
        <path d="M17 2.5 21.5 7 17 11.5M21 7H8.5A5.5 5.5 0 0 0 3 12.5V13" />
        <path d="M7 21.5 2.5 17 7 12.5M3 17h12.5a5.5 5.5 0 0 0 5.5-5.5V11" />
      </svg>
      <em>{data.reposts ? compact(data.reposts) : ''}</em>
    </span>
    <span className={cn('x-action', data.liked && 'liked')}>
      <Icon.heart size={18} filled={!!data.liked} color={data.liked ? '#f91880' : 'currentColor'} />
      <em>{data.likes ? compact(data.likes) : ''}</em>
    </span>
    <span className={cn('x-action', data.bookmarked && 'bookmarked')}>
      <Icon.bookmark size={18} filled={!!data.bookmarked} color={data.bookmarked ? 'currentColor' : 'currentColor'} />
      <em>{data.bookmarks ? compact(data.bookmarks) : ''}</em>
    </span>
    <span className="x-action">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 16V3M8 7l4-4 4 4M4 14v5.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V14" />
      </svg>
    </span>
  </div>
)

export const XMedia = ({ images = [], onDark = true }) => {
  if (!images.length) return null
  const count = Math.min(images.length, 4)
  return (
    <div className={cn('x-media', `count-${count}`)}>
      {images.slice(0, 4).map((src, i) => (
        <div className="x-media-cell" key={i}>
          <img src={mediaSrc(src)} alt="" draggable={false} style={{ objectFit: 'cover' }} />
          {i === 3 && images.length > 4 ? <span className="x-media-more">+{images.length - 4}</span> : null}
        </div>
      ))}
    </div>
  )
}
