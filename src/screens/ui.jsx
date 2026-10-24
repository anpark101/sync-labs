import React, { useState } from 'react'
import {
  siDiscord,
  siImessage,
  siInstagram,
  siReddit,
  siSnapchat,
  siSpotify,
  siTiktok,
  siWhatsapp,
  siX,
  siYoutube,
} from 'simple-icons'
import { cn, gradientFor } from '../lib/util.js'

const BASE = import.meta.env.BASE_URL || '/'

export const BRAND = {
  instagram: siInstagram,
  x: siX,
  tiktok: siTiktok,
  whatsapp: siWhatsapp,
  discord: siDiscord,
  snapchat: siSnapchat,
  spotify: siSpotify,
  youtube: siYoutube,
  reddit: siReddit,
  imessage: siImessage,
}

export const BRAND_COLOR = {
  instagram: '#E1306C',
  x: '#ffffff',
  tiktok: '#ffffff',
  whatsapp: '#25D366',
  discord: '#5865F2',
  snapchat: '#FFFC00',
  spotify: '#1DB954',
  youtube: '#FF0033',
  reddit: '#FF4500',
  imessage: '#34C759',
}

/** Resolve a stored media path against the deployed base URL. */
export const mediaSrc = (src) => {
  if (!src) return ''
  if (/^(data:|blob:|https?:)/i.test(src)) return src
  if (src.startsWith('/')) return src
  return `${BASE}${src.replace(/^\.?\//, '')}`
}

export function BrandIcon({ name, size = 20, color = 'currentColor', className = '' }) {
  const icon = BRAND[name]
  if (!icon)
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" fill={color} />
      </svg>
    )
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d={icon.path} fill={color} />
    </svg>
  )
}

export function Verified({ color = '#0095f6', size = 13, variant = 'circle' }) {
  if (variant === 'x') {
    return (
      <svg width={size} height={size} viewBox="0 0 22 22" aria-label="Verified" className="verified">
        <path
          fill={color}
          d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
        />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Verified" className="verified">
      <path fill={color} d="M12 1.5 15 3l3.4-.6 1.7 3L23 7.5l-1 3 1 3-2.9 2.1-1.7 3L15 18l-3 1.5L9 18l-3.4.6-1.7-3L1 13.5l1-3-1-3 2.9-2.1 1.7-3L9 3z" />
      <path fill="#fff" d="m7.7 12.2 2.7 2.7 5.9-6.2-1.4-1.3-4.6 4.8-1.3-1.3z" />
    </svg>
  )
}

export function Avatar({ src, name, size = 32, className = '', ring = false, style }) {
  const [broken, setBroken] = useState(false)
  const showImg = src && !broken
  return (
    <span
      className={cn('avatar', ring && 'avatar-ring', className)}
      style={{ width: size, height: size, fontSize: size * 0.36, ...style }}
    >
      {showImg ? (
        <img src={mediaSrc(src)} alt={name || ''} onError={() => setBroken(true)} />
      ) : (
        <span className="avatar-fallback" style={{ background: gradientFor(name || 'anon') }}>
          {(name || '?')
            .split(/\s+/)
            .slice(0, 2)
            .map((w) => w[0]?.toUpperCase())
            .join('')}
        </span>
      )}
    </span>
  )
}

export function Img({ src, alt = '', className = '', seed = 'scene', children, onClick }) {
  const [broken, setBroken] = useState(false)
  if (!src || broken)
    return (
      <div
        className={cn('img-empty', className)}
        style={{ background: gradientFor(seed) }}
        aria-label={alt}
        onClick={onClick}
      >
        {children}
      </div>
    )
  return (
    <div className={cn('img-wrap', className)} onClick={onClick}>
      <img src={mediaSrc(src)} alt={alt} onError={() => setBroken(true)} draggable={false} />
      {children}
    </div>
  )
}

const TOKEN_RE = /(https?:\/\/[^\s]+|#[\p{L}\p{N}_]+|@[A-Za-z0-9_.]+)/gu

/** Tweet/caption text with highlighted hashtags, mentions and links. */
export function RichText({ text = '', className = '', accent = '#1d9bf0', linkUnderline = false }) {
  if (!text) return null
  const parts = String(text).split(TOKEN_RE)
  return (
    <span className={cn('rich-text', className)}>
      {parts.map((part, i) => {
        if (/^#/.test(part) || /^@/.test(part) || /^https?:/.test(part)) {
          return (
            <span
              key={i}
              style={{ color: accent, textDecoration: linkUnderline ? 'underline' : 'none' }}
            >
              {part}
            </span>
          )
        }
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </span>
  )
}

const Signal = () => (
  <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
    <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" />
    <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" />
    <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
    <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
  </svg>
)
const Wifi = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
    <path d="M8 10.6 6.1 8.4a2.9 2.9 0 0 1 3.8 0L8 10.6Z" fill="currentColor" />
    <path d="M3.4 5.6a6.7 6.7 0 0 1 9.2 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M.9 2.6a10.5 10.5 0 0 1 14.2 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)
const Battery = ({ level = 78 }) => (
  <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden="true">
    <rect x="0.5" y="0.5" width="22" height="11" rx="3.2" stroke="currentColor" strokeOpacity="0.38" />
    <rect x="2.2" y="2.2" width={Math.max(2, (18.6 * Math.min(100, level)) / 100)} height="7.6" rx="1.8" fill="currentColor" />
    <path d="M24 4.2v3.6c1.1-.3 1.5-1 1.5-1.8s-.4-1.5-1.5-1.8Z" fill="currentColor" fillOpacity="0.4" />
  </svg>
)

/**
 * iOS status bar. `variant` controls icon colour.
 */
export function StatusBar({ time = '9:41', battery = 78, variant = 'dark', island = true, className = '' }) {
  return (
    <div className={cn('status-bar', `status-${variant}`, className)} aria-hidden="true">
      <span className="status-time">{time}</span>
      {island ? <span className="dynamic-island"><i /></span> : null}
      <span className="status-icons">
        <Signal />
        <Wifi />
        <Battery level={battery} />
      </span>
    </div>
  )
}

export function HomeIndicator({ variant = 'dark' }) {
  return <span className={cn('home-indicator', `home-${variant}`)} aria-hidden="true" />
}

export function AppIcon({ app = 'imessage', size = 38 }) {
  const map = {
    imessage: { bg: 'linear-gradient(180deg,#5BF675,#0BCA3E)', color: '#fff', name: 'imessage' },
    whatsapp: { bg: 'linear-gradient(180deg,#5BF675,#1FAF54)', color: '#fff', name: 'whatsapp' },
    instagram: { bg: 'linear-gradient(135deg,#f9ce34,#ee2a7b 52%,#6228d7)', color: '#fff', name: 'instagram' },
    x: { bg: '#000', color: '#fff', name: 'x' },
    tiktok: { bg: '#000', color: '#fff', name: 'tiktok' },
    discord: { bg: '#5865F2', color: '#fff', name: 'discord' },
    snapchat: { bg: '#FFFC00', color: '#000', name: 'snapchat' },
    spotify: { bg: '#1DB954', color: '#000', name: 'spotify' },
    youtube: { bg: '#fff', color: '#FF0033', name: 'youtube' },
    reddit: { bg: '#FF4500', color: '#fff', name: 'reddit' },
    phone: { bg: 'linear-gradient(180deg,#5BF675,#0BCA3E)', color: '#fff', name: 'phone' },
    music: { bg: 'linear-gradient(180deg,#FC5C7D,#6A82FB)', color: '#fff', name: 'music' },
  }
  const icon = map[app] || map.imessage
  return (
    <span className="app-icon" style={{ width: size, height: size, background: icon.bg, borderRadius: size * 0.24 }}>
      <BrandIcon name={icon.name === 'music' ? 'spotify' : icon.name} size={size * 0.6} color={icon.color} />
    </span>
  )
}

export function Chevron({ dir = 'left', size = 22, color = 'currentColor', stroke = 2.4 }) {
  const rotate = { left: 0, right: 180, up: 90, down: -90 }[dir]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      <path d="M15 5 8 12l7 7" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ScreenPlaceholder({ label }) {
  return (
    <div className="screen-placeholder">
      <span>{label}</span>
      <small>Open the editor to fill this screen in.</small>
    </div>
  )
}

export const Icon = {
  heart: ({ size = 24, color = 'currentColor', filled = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.7 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  ),
  comment: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.3 9.3 0 0 1-4-.9L3 21l1.9-4.4a8.4 8.4 0 1 1 16.1-5.1Z" />
    </svg>
  ),
  share: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
    </svg>
  ),
  bookmark: ({ size = 24, color = 'currentColor', filled = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
    </svg>
  ),
  more: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <circle cx="5" cy="12" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="19" cy="12" r="1.9" />
    </svg>
  ),
  home: ({ size = 24, color = 'currentColor', filled = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.2 12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.8Z" />
    </svg>
  ),
  search: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-4.2-4.2" />
    </svg>
  ),
  reels: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" /><path d="m3.5 8.5 17 0M8 3.2 11 8.5M14 3.2l3 5.3" /><path d="m11 12.4 4.2 2.5-4.2 2.5v-5Z" fill={color} stroke="none" />
    </svg>
  ),
  play: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true"><path d="M7 4.5v15l13-7.5-13-7.5Z" /></svg>
  ),
  music: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" />
    </svg>
  ),
  send: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
    </svg>
  ),
  back: ({ size = 24, color = 'currentColor' }) => <Chevron dir="left" size={size} color={color} />,
}

export const BottomNav = ({ tabs = [], active = 0, variant = 'light', avatar, extra }) => (
  <div className={cn('bottom-nav', `bn-${variant}`)}>
    {tabs.map((tab, i) => (
      <span key={tab.key || i} className={cn('bn-item', i === active && 'active')}>
        {tab.icon}
      </span>
    ))}
    {extra}
  </div>
)
