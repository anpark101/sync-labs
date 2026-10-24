/**
 * Platform registry — the visual source of truth for the studio.
 * Screen types are rendered by src/screens/registry.jsx
 */
export const PLATFORMS = [
  {
    id: 'imessage',
    name: 'iMessage',
    group: 'Messaging',
    tint: '#34C759',
    accent: '#0a84ff',
    theme: 'light',
    blurb: 'Blue bubbles, voice notes, group chats and read receipts.',
    screens: [
      { type: 'chat', label: 'Chat', hint: 'One-on-one or group thread', icon: 'MessageCircle' },
      { type: 'lockscreen', label: 'Lock Screen', hint: 'Cinematic notification stack', icon: 'Lock' },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    group: 'Social',
    tint: '#E1306C',
    accent: '#E1306C',
    theme: 'light',
    blurb: 'Feed posts, stories, profiles and DMs.',
    screens: [
      { type: 'post', label: 'Feed Post', hint: 'Photo, caption, likes & comments', icon: 'Square' },
      { type: 'story', label: 'Story', hint: 'Photo with stickers and a poll', icon: 'Circle' },
      { type: 'profile', label: 'Profile', hint: 'Bio, highlights and grid', icon: 'UserRound' },
      { type: 'dm', label: 'Direct Message', hint: 'A private two-person thread', icon: 'MessagesSquare' },
    ],
  },
  {
    id: 'x',
    name: 'X',
    group: 'Social',
    tint: '#e7e9ea',
    accent: '#1d9bf0',
    theme: 'dark',
    blurb: 'Posts, serialized threads and profiles.',
    screens: [
      { type: 'post', label: 'Post', hint: 'A viral (or cursed) post', icon: 'MessageSquareText' },
      { type: 'thread', label: 'Thread', hint: 'A connected run of posts', icon: 'ListTree' },
      { type: 'profile', label: 'Profile', hint: 'Banner, bio and timeline', icon: 'UserRound' },
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    group: 'Video',
    tint: '#25F4EE',
    accent: '#FE2C55',
    theme: 'dark',
    blurb: 'For-You videos and creator profiles.',
    screens: [
      { type: 'video', label: 'Video', hint: 'Full-screen vertical video', icon: 'Play' },
      { type: 'profile', label: 'Profile', hint: 'Creator bio and video grid', icon: 'UserRound' },
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    group: 'Messaging',
    tint: '#25D366',
    accent: '#00a884',
    theme: 'light',
    blurb: 'Texts with time stamps, replies and that beige wallpaper.',
    screens: [{ type: 'chat', label: 'Chat', hint: 'Personal or group conversation', icon: 'MessageCircle' }],
  },
  {
    id: 'discord',
    name: 'Discord',
    group: 'Messaging',
    tint: '#5865F2',
    accent: '#5865F2',
    theme: 'dark',
    blurb: 'Server chat with roles, replies and reactions.',
    screens: [{ type: 'chat', label: 'Server Chat', hint: 'A channel full of chaos', icon: 'MessagesSquare' }],
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    group: 'Messaging',
    tint: '#FFFC00',
    accent: '#FFFC00',
    theme: 'dark',
    blurb: 'Disappearing chats, streaks and snaps.',
    screens: [{ type: 'chat', label: 'Chat', hint: 'Yellow, fleeting and dramatic', icon: 'Ghost' }],
  },
  {
    id: 'spotify',
    name: 'Spotify',
    group: 'Culture',
    tint: '#1DB954',
    accent: '#1DB954',
    theme: 'dark',
    blurb: 'Now-playing screens and the song that says it all.',
    screens: [{ type: 'nowplaying', label: 'Now Playing', hint: 'The song that means everything', icon: 'Music' }],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    group: 'Video',
    tint: '#FF0033',
    accent: '#FF0033',
    theme: 'dark',
    blurb: 'Video pages, channels and comment sections.',
    screens: [{ type: 'video', label: 'Video', hint: 'A video everyone is talking about', icon: 'Play' }],
  },
  {
    id: 'reddit',
    name: 'Reddit',
    group: 'Social',
    tint: '#FF4500',
    accent: '#FF4500',
    theme: 'dark',
    blurb: 'Anonymous confessions and unhinged replies.',
    screens: [{ type: 'post', label: 'Post & Comments', hint: 'A thread the whole internet sees', icon: 'MessageSquareText' }],
  },
]

export const PLATFORM_GROUPS = ['Messaging', 'Social', 'Video', 'Culture']

export const getPlatform = (id) => PLATFORMS.find((p) => p.id === id) || PLATFORMS[0]

export const getScreenMeta = (platformId, type) => {
  const platform = getPlatform(platformId)
  return platform.screens.find((s) => s.type === type) || platform.screens[0]
}

export const platformCount = PLATFORMS.length
export const screenTypeCount = PLATFORMS.reduce((n, p) => n + p.screens.length, 0)

/** Status bar colouring for full-bleed screens */
export const BLEED_SCREENS = new Set(['instagram/story', 'tiktok/video', 'imessage/lockscreen'])
