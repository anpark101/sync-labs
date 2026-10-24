import React from 'react'

/**
 * Platform glyphs.
 *
 * These are drawn to the proportions of the real apps rather than to a generic
 * icon set: Instagram's chunky heart and paper plane, X's speech bubble and
 * repost arrows, TikTok's curved share arrow, WhatsApp's ticks, and so on.
 * Everything is 24 × 24 and inherits `currentColor` unless a colour is passed.
 */

const Svg = ({ size = 24, color = 'currentColor', fill = 'none', stroke, strokeWidth, children, className = '', style, viewBox = '0 0 24 24' }) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill={fill}
    stroke={stroke || 'none'}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {children}
  </svg>
)

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

export const Heart = ({ size = 24, color = 'currentColor', filled = false }) => (
  <Svg size={size} color={color} fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth={filled ? 0 : 1.7}>
    <path d="M12 20.7c-.3 0-.6-.1-.8-.3l-7.4-7.2a5.1 5.1 0 0 1 0-7.2 5 5 0 0 1 7.1 0l1.1 1.1 1.1-1.1a5 5 0 0 1 7.1 0 5.1 5.1 0 0 1 0 7.2l-7.4 7.2c-.2.2-.5.3-.8.3Z" />
  </Svg>
)

export const Bookmark = ({ size = 24, color = 'currentColor', filled = false }) => (
  <Svg size={size} color={color} fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth={1.7}>
    <path d="M6.2 3.5h11.6a1 1 0 0 1 1 1v16.2L12 16.4l-6.8 4.3V4.5a1 1 0 0 1 1-1Z" />
  </Svg>
)

export const More = ({ size = 24, color = 'currentColor', horizontal = true }) => (
  <Svg size={size} color={color} fill={color}>
    {horizontal ? (
      <>
        <circle cx="5" cy="12" r="1.6" />
        <circle cx="12" cy="12" r="1.6" />
        <circle cx="19" cy="12" r="1.6" />
      </>
    ) : (
      <>
        <circle cx="12" cy="5" r="1.6" />
        <circle cx="12" cy="12" r="1.6" />
        <circle cx="12" cy="19" r="1.6" />
      </>
    )}
  </Svg>
)

export const ArrowUpRight = ({ size = 24, color = 'currentColor', strokeWidth = 1.9 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M7 17 17 7M8.5 7H17v8.5" />
  </Svg>
)

export const Chevron = ({ size = 24, color = 'currentColor', dir = 'left', strokeWidth = 2.4 }) => {
  const rotate = { left: 0, right: 180, up: 90, down: -90 }[dir]
  return (
    <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth} style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M15 4.5 7.5 12l7.5 7.5" />
    </Svg>
  )
}

/* ------------------------------------------------------------------ */
/* Instagram                                                           */
/* ------------------------------------------------------------------ */

export const IgHeart = Heart

export const IgComment = ({ size = 24, color = 'currentColor', strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M12 2.6c-5.3 0-9.4 4.1-9.4 9.3 0 2.1.7 4 1.9 5.6L3.4 21.4l4.2-1.1a9.5 9.5 0 0 0 4.4 1.1c5.3 0 9.4-4.2 9.4-9.4S17.3 2.6 12 2.6Z" />
  </Svg>
)

export const IgShare = ({ size = 24, color = 'currentColor', strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M21.6 2.4 2.9 9.6l6.9 2.7 2.7 6.9 9.1-16.8Z" />
    <path d="m9.8 12.3 4.6-4.6" />
  </Svg>
)

export const IgHome = ({ size = 24, color = 'currentColor', filled = false }) => (
  <Svg size={size} color={color} fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth={filled ? 0 : 1.8}>
    <path d="M12 2.2 1.9 10.6a1 1 0 0 0 1.3 1.5l1.3-1V21a1 1 0 0 0 1 1h5.1v-6.4h2.8V22h5.1a1 1 0 0 0 1-1v-9.9l1.3 1a1 1 0 0 0 1.3-1.5L12 2.2Z" />
  </Svg>
)

export const IgSearch = ({ size = 24, color = 'currentColor', strokeWidth = 1.9 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <circle cx="10.6" cy="10.6" r="7.6" />
    <path d="m16.3 16.3 4.6 4.6" />
  </Svg>
)

export const IgReels = ({ size = 24, color = 'currentColor', strokeWidth = 1.8 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.4" />
    <path d="M2.9 7.9h18.2M7.5 2.9l2.6 5M13.4 2.9l2.6 5" />
    <path d="m10.3 10.4 5 2.9-5 2.9v-5.8Z" fill={color} stroke="none" />
  </Svg>
)

export const IgShop = ({ size = 24, color = 'currentColor', strokeWidth = 1.8 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M3.6 8h16.8l1 12.2a1.6 1.6 0 0 1-1.6 1.8H4.2a1.6 1.6 0 0 1-1.6-1.8L3.6 8Z" />
    <path d="M8.2 8V6.2a3.8 3.8 0 0 1 7.6 0V8" />
  </Svg>
)

/* ------------------------------------------------------------------ */
/* X                                                                   */
/* ------------------------------------------------------------------ */

export const XReply = ({ size = 20, color = 'currentColor', strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M2 5.2A2.8 2.8 0 0 1 4.8 2.4h14.4A2.8 2.8 0 0 1 22 5.2v10.4a2.8 2.8 0 0 1-2.8 2.8H7.9L2 22.6V5.2Z" />
  </Svg>
)

export const XRepost = ({ size = 20, color = 'currentColor', strokeWidth = 1.8 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M4.2 9.2V7.4a3 3 0 0 1 3-3h10.2M14.6 1.5l3.3 2.9-3.3 2.9" />
    <path d="M19.8 14.8v1.8a3 3 0 0 1-3 3H6.6M9.4 22.5 6.1 19.6l3.3-2.9" />
  </Svg>
)

export const XViews = ({ size = 20, color = 'currentColor' }) => (
  <Svg size={size} color={color} fill={color}>
    <rect x="2.4" y="13.4" width="4.4" height="8.2" rx="1" />
    <rect x="9.8" y="8.6" width="4.4" height="13" rx="1" />
    <rect x="17.2" y="2.4" width="4.4" height="19.2" rx="1" />
  </Svg>
)

export const XShare = ({ size = 20, color = 'currentColor', strokeWidth = 1.8 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M12 15.2V3.4M7.6 7.8 12 3.4l4.4 4.4" />
    <path d="M4.5 13.6v5.2a1.8 1.8 0 0 0 1.8 1.8h11.4a1.8 1.8 0 0 0 1.8-1.8v-5.2" />
  </Svg>
)

export const XHome = ({ size = 24, color = 'currentColor', filled = false }) => (
  <Svg size={size} color={color} fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth={filled ? 0 : 1.9}>
    <path d="M12 1.9 1.9 9.6l1.6 2.5L5 10.9V21a1 1 0 0 0 1 1h11.9a1 1 0 0 0 1-1v-9.9l1.6 1.2 1.6-2.5L12 1.9Z" />
  </Svg>
)

export const XSearch = IgSearch

export const XGrok = ({ size = 22, color = 'currentColor', strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="m3 3 18 18M21 3 3 21" />
  </Svg>
)

export const XBell = ({ size = 24, color = 'currentColor', filled = false, strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth={strokeWidth}>
    <path d="M12 3.2a6.2 6.2 0 0 0-6.2 6.2v3.9L4.2 17h15.6l-1.6-3.7V9.4A6.2 6.2 0 0 0 12 3.2Z" />
    <path d="M9.7 17a2.3 2.3 0 0 0 4.6 0" fill="none" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
)

export const XMail = ({ size = 24, color = 'currentColor', strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <rect x="2.2" y="4.6" width="19.6" height="14.8" rx="2.6" />
    <path d="m3 6.2 9 6.7 9-6.7" />
  </Svg>
)

/* ------------------------------------------------------------------ */
/* TikTok                                                              */
/* ------------------------------------------------------------------ */

export const TtHeart = Heart

export const TtComment = ({ size = 26, color = 'currentColor', strokeWidth = 1.8 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M12 2.4c-5.6 0-10 3.9-10 8.8 0 1.5.4 2.9 1.2 4.1l-1.6 5 5.1-1.5c1.6.9 3.4 1.4 5.3 1.4 5.6 0 10-3.9 10-8.8S17.6 2.4 12 2.4Z" />
    <circle cx="7.8" cy="11.2" r=".95" fill={color} />
    <circle cx="12" cy="11.2" r=".95" fill={color} />
    <circle cx="16.2" cy="11.2" r=".95" fill={color} />
  </Svg>
)

export const TtShare = ({ size = 26, color = 'currentColor', strokeWidth = 1.9 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M13.2 2.6v5.1C6.9 8.2 3.1 12 1.9 19.6c2.7-4.4 6.3-6.2 11.3-6.2v5.1L21.9 9.6 13.2 2.6Z" />
  </Svg>
)

export const TtMusic = ({ size = 18, color = 'currentColor' }) => (
  <Svg size={size} color={color} fill={color}>
    <path d="M9 3.2v10.6a3.4 3.4 0 1 0 2.4 3.3V7.4l7.2-1.6v5.3a3.4 3.4 0 1 0 2.4 3.3V1.6L9 3.2Z" />
  </Svg>
)

export const TtHome = ({ size = 24, color = 'currentColor', filled = false }) => (
  <Svg size={size} color={color} fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth={filled ? 0 : 1.9}>
    <path d="M12 2 1.8 10.6h3.1V22h5.4v-6.6h3.4V22h5.4V10.6h3.1L12 2Z" />
  </Svg>
)

export const TtFriends = ({ size = 24, color = 'currentColor', strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <circle cx="9" cy="7.6" r="3.6" />
    <path d="M2.4 20.4c.6-3.4 3.3-5.4 6.6-5.4s6 2 6.6 5.4M16.2 4.5a3.6 3.6 0 0 1 0 6.9M17.5 15.3c2.2.5 3.7 2.2 4.1 4.6" />
  </Svg>
)

export const TtInbox = ({ size = 24, color = 'currentColor', strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M3.4 3.4h17.2v17.2H3.4z" />
    <path d="M3.4 15.4h4.2l1.5 2.4h5.8l1.5-2.4h4.2" />
  </Svg>
)

export const TtPlus = ({ size = 22, color = 'currentColor', strokeWidth = 2.2 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M12 4.8v14.4M4.8 12h14.4" />
  </Svg>
)

/* ------------------------------------------------------------------ */
/* WhatsApp                                                            */
/* ------------------------------------------------------------------ */

export const WaVideo = ({ size = 24, color = 'currentColor' }) => (
  <Svg size={size} color={color} fill={color}>
    <path d="M3.3 6.4h9.9a2 2 0 0 1 2 2v7.2a2 2 0 0 1-2 2H3.3a2 2 0 0 1-2-2V8.4a2 2 0 0 1 2-2Zm13.2 4.2 6-3.4v9.6l-6-3.4v-1.5Z" />
  </Svg>
)

export const WaPhone = ({ size = 24, color = 'currentColor' }) => (
  <Svg size={size} color={color} fill={color}>
    <path d="M6.9 2.6c.6 0 1.1.3 1.4.8l1.6 2.8c.3.6.2 1.3-.3 1.8l-1.1 1.1a14 14 0 0 0 6.4 6.4l1.1-1.1c.5-.5 1.2-.6 1.8-.3l2.8 1.6c.5.3.8.8.8 1.4v2.4c0 1.1-.9 2-2 2A17.9 17.9 0 0 1 2.5 4.6c0-1.1.9-2 2-2h2.4Z" />
  </Svg>
)

export const WaLock = ({ size = 14, color = 'currentColor' }) => (
  <Svg size={size} color={color} fill={color}>
    <path d="M12 2.2a4.4 4.4 0 0 0-4.4 4.4v2H7a1.8 1.8 0 0 0-1.8 1.8v8a1.8 1.8 0 0 0 1.8 1.8h10a1.8 1.8 0 0 0 1.8-1.8v-8A1.8 1.8 0 0 0 17 8.6h-.6v-2A4.4 4.4 0 0 0 12 2.2Zm0 2a2.4 2.4 0 0 1 2.4 2.4v2H9.6v-2A2.4 2.4 0 0 1 12 4.2Z" />
  </Svg>
)

export const WaCheck = ({ size = 17, color = 'currentColor', double = false }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={2} viewBox={double ? '0 0 24 16' : '0 0 16 16'} style={{ width: double ? size * 1.5 : size }}>
    {double ? (
      <path d="m1.4 8.6 3.9 4.2L14.4 3M9.4 12.8l1.2 1.3L22.6 3" />
    ) : (
      <path d="m2.4 8.6 3.9 4.2L14.6 3" />
    )}
  </Svg>
)

export const WaSend = ({ size = 22, color = 'currentColor', filled = true }) => (
  <Svg size={size} color={color} fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth={1.8}>
    <path d="M2.2 21 22.6 12 2.2 3l2.4 7.2 9.6 1.8-9.6 1.8L2.2 21Z" />
  </Svg>
)

export const WaEmoji = ({ size = 23, color = 'currentColor', strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <circle cx="12" cy="12" r="9.4" />
    <circle cx="8.8" cy="9.8" r=".9" fill={color} />
    <circle cx="15.2" cy="9.8" r=".9" fill={color} />
    <path d="M7.9 14.2a5 5 0 0 0 8.2 0" />
  </Svg>
)

export const WaClip = ({ size = 22, color = 'currentColor', strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M19.9 11.3 11.5 19.7a5 5 0 0 1-7.1-7.1l9-9a3.4 3.4 0 0 1 4.8 4.8l-8.9 8.9a1.8 1.8 0 0 1-2.5-2.5l8.1-8.1" />
  </Svg>
)

export const WaCamera = ({ size = 23, color = 'currentColor', strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M8.4 5.2 9.8 3h4.4l1.4 2.2H20a1.9 1.9 0 0 1 1.9 1.9v11a1.9 1.9 0 0 1-1.9 1.9H4A1.9 1.9 0 0 1 2.1 18V7.1A1.9 1.9 0 0 1 4 5.2h4.4Z" />
    <circle cx="12" cy="12.6" r="3.7" />
  </Svg>
)

export const WaMic = ({ size = 23, color = 'currentColor' }) => (
  <Svg size={size} color={color} fill={color}>
    <path d="M12 2.4a3.6 3.6 0 0 0-3.6 3.6v6.2a3.6 3.6 0 0 0 7.2 0V6a3.6 3.6 0 0 0-3.6-3.6Zm-7 8.6a1.2 1.2 0 0 1 2.4 0 4.6 4.6 0 0 0 9.2 0 1.2 1.2 0 0 1 2.4 0 7 7 0 0 1-5.8 6.9v2.5h2.6a1.2 1.2 0 0 1 0 2.4H8.2a1.2 1.2 0 0 1 0-2.4h2.6v-2.5A7 7 0 0 1 5 11Z" />
  </Svg>
)

/* ------------------------------------------------------------------ */
/* Discord / Snapchat                                                  */
/* ------------------------------------------------------------------ */

export const DcHash = ({ size = 22, color = 'currentColor', strokeWidth = 1.9 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M9.6 3 7.4 21M16.6 3l-2.2 18M3.6 8.6h17M2.8 15.4h17" />
  </Svg>
)

export const DcGift = ({ size = 22, color = 'currentColor', strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M2.6 8.2h18.8V12H2.6zM4.2 12h15.6v9.2H4.2zM12 8.2V21" />
    <path d="M12 8.2C10.6 5 9.2 3.6 7.4 3.6a2.3 2.3 0 0 0 0 4.6H12Zm0 0c1.4-3.2 2.8-4.6 4.6-4.6a2.3 2.3 0 0 1 0 4.6H12Z" />
  </Svg>
)

export const DcPlus = ({ size = 22, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 7.4v9.2M7.4 12h9.2" />
  </Svg>
)

export const ScCamera = ({ size = 30, color = 'currentColor', strokeWidth = 2 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M7.8 5.6 9.4 3h5.2l1.6 2.6H20a2 2 0 0 1 2 2v10.8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7.6a2 2 0 0 1 2-2h3.8Z" />
    <circle cx="12" cy="13" r="4" />
  </Svg>
)

export const ScChat = ({ size = 24, color = 'currentColor', strokeWidth = 1.8 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M4 4.2h16a1.8 1.8 0 0 1 1.8 1.8v9.4a1.8 1.8 0 0 1-1.8 1.8H9.4L4 21.4V6a1.8 1.8 0 0 1 1.8-1.8Z" />
  </Svg>
)

/* ------------------------------------------------------------------ */
/* Spotify                                                             */
/* ------------------------------------------------------------------ */

export const SpShuffle = ({ size = 22, color = 'currentColor', strokeWidth = 1.9 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M16.8 3.8 20.6 7l-3.8 3.2M3.4 7h3.4c2 0 3.2 1 4.5 3s3 4.8 5.1 4.8h4.2M16.8 11.6l3.8 3.2-3.8 3.2M3.4 17.8h3.4c1.4 0 2.4-.5 3.4-1.5" />
  </Svg>
)

export const SpPrev = ({ size = 24, color = 'currentColor' }) => (
  <Svg size={size} color={color} fill={color}>
    <path d="M5.4 4.5h2.2v15H5.4zM20.4 4.3v15.4L8.2 12 20.4 4.3Z" />
  </Svg>
)

export const SpNext = ({ size = 24, color = 'currentColor' }) => (
  <Svg size={size} color={color} fill={color}>
    <path d="M16.4 4.5h2.2v15h-2.2zM3.6 4.3v15.4L15.8 12 3.6 4.3Z" />
  </Svg>
)

export const SpPlay = ({ size = 26, color = 'currentColor' }) => (
  <Svg size={size} color={color} fill={color}>
    <path d="M6.6 3.6v16.8L20.4 12 6.6 3.6Z" />
  </Svg>
)

export const SpPause = ({ size = 26, color = 'currentColor' }) => (
  <Svg size={size} color={color} fill={color}>
    <rect x="6.4" y="4" width="4.2" height="16" rx="1" />
    <rect x="13.4" y="4" width="4.2" height="16" rx="1" />
  </Svg>
)

export const SpRepeat = ({ size = 22, color = 'currentColor', strokeWidth = 1.9, one = false }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M6.4 5.4h11.2a3 3 0 0 1 3 3v3.2M17.6 18.6H6.4a3 3 0 0 1-3-3v-3.2" />
    <path d="m8.2 2.6-2.8 2.8 2.8 2.8M15.8 21.4l2.8-2.8-2.8-2.8" />
    {one ? <path d="M11.2 10.2 12.6 9v6" strokeWidth="1.7" /> : null}
  </Svg>
)

export const SpDevice = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <rect x="5" y="2.4" width="14" height="19.2" rx="2.2" />
    <path d="M9.4 5.6h5.2M9.4 18.4h5.2" />
  </Svg>
)

export const SpQueue = ({ size = 22, color = 'currentColor', strokeWidth = 1.9 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M3.2 6.6h13M3.2 12h13M3.2 17.4h13M20.4 6.6h.1M20.4 12h.1M20.4 17.4h.1" />
  </Svg>
)

export const SpShare = XShare

/* ------------------------------------------------------------------ */
/* YouTube                                                             */
/* ------------------------------------------------------------------ */

export const YtThumbUp = ({ size = 24, color = 'currentColor', filled = false, strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth={strokeWidth}>
    <path d="M7.5 21V9.6l5-7c.3-.5.9-.8 1.5-.8 1.4 0 2.5 1.1 2.5 2.5v5.2h4.1c1.3 0 2.3 1.2 2 2.5l-1.4 6.9A3 3 0 0 1 18.3 21H7.5Z" />
    <path d="M3.4 9.6h4.1V21H3.4z" />
  </Svg>
)

export const YtThumbDown = ({ size = 24, color = 'currentColor', strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} fill="none" stroke={color} strokeWidth={strokeWidth} style={{ transform: 'rotate(180deg)' }}>
    <path d="M7.5 21V9.6l5-7c.3-.5.9-.8 1.5-.8 1.4 0 2.5 1.1 2.5 2.5v5.2h4.1c1.3 0 2.3 1.2 2 2.5l-1.4 6.9A3 3 0 0 1 18.3 21H7.5Z" />
    <path d="M3.4 9.6h4.1V21H3.4z" />
  </Svg>
)

export const YtShare = XShare

export const YtDownload = ({ size = 22, color = 'currentColor', strokeWidth = 1.8 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M12 2.8v12.4M7.4 10.6 12 15.2l4.6-4.6" />
    <path d="M4 18.2v1.6a1.4 1.4 0 0 0 1.4 1.4h13.2a1.4 1.4 0 0 0 1.4-1.4v-1.6" />
  </Svg>
)

export const YtComment = IgComment

export const YtShorts = ({ size = 24, color = 'currentColor' }) => (
  <Svg size={size} color={color} fill="none" stroke={color} strokeWidth={1.7}>
    <path d="M14.6 2.9a3.4 3.4 0 0 0-3.1 2.9L9.4 15a2.2 2.2 0 0 1-2 1.8 3.4 3.4 0 0 0 3.1 4.3 3.4 3.4 0 0 0 3.1-2.9l2.1-9.2a2.2 2.2 0 0 1 2-1.8 3.4 3.4 0 0 0-3.1-4.3Z" />
    <path d="m10.4 9.2 4.4 2.4-3.5 2" fill={color} stroke="none" />
  </Svg>
)

export const YtBell = XBell

/* ------------------------------------------------------------------ */
/* Reddit                                                              */
/* ------------------------------------------------------------------ */

export const RdUp = ({ size = 18, color = 'currentColor', filled = false, strokeWidth = 2 }) => (
  <Svg size={size} color={color} fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth={strokeWidth}>
    <path d="M12 3.4 21 20H3L12 3.4Z" />
  </Svg>
)

export const RdDown = ({ size = 18, color = 'currentColor', filled = false, strokeWidth = 2 }) => (
  <Svg size={size} color={color} fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth={strokeWidth}>
    <path d="M12 20.6 3 4h18L12 20.6Z" />
  </Svg>
)

export const RdComment = ({ size = 20, color = 'currentColor', strokeWidth = 1.8 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <path d="M20.8 11.6c0 4.3-4 7.8-8.8 7.8-1 0-2-.1-2.9-.4L4.4 21l1-3.7a7.3 7.3 0 0 1-2.2-5.2c0-4.3 4-7.8 8.8-7.8s8.8 3.5 8.8 7.7Z" />
  </Svg>
)

export const RdShare = XShare

/* ------------------------------------------------------------------ */
/* iOS                                                                 */
/* ------------------------------------------------------------------ */

export const IosPlus = ({ size = 30, color = 'currentColor', bg = '#E9E9EB' }) => (
  <Svg size={size} color={color} viewBox="0 0 30 30">
    <circle cx="15" cy="15" r="14.2" fill={bg} />
    <path d="M15 9.4v11.2M9.4 15h11.2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
)

export const IosMic = ({ size = 20, color = 'currentColor', strokeWidth = 1.6 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <rect x="9.1" y="2.6" width="5.8" height="11.2" rx="2.9" />
    <path d="M5.9 11.4a6.1 6.1 0 0 0 12.2 0M12 17.6v4" />
  </Svg>
)

export const IosVideo = ({ size = 25, color = 'currentColor', strokeWidth = 1.7 }) => (
  <Svg size={size} color={color} stroke={color} strokeWidth={strokeWidth}>
    <rect x="2.4" y="6" width="13.4" height="12" rx="3.4" />
    <path d="m16.8 10.6 4-2.4a.7.7 0 0 1 1.1.6v6.4a.7.7 0 0 1-1.1.6l-4-2.4" />
  </Svg>
)

export const IosFaceTime = IosVideo
