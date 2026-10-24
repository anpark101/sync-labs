import React from 'react'
import { InstagramDMForm, InstagramPostForm, InstagramProfileForm, InstagramStoryForm } from './forms/InstagramForms.jsx'
import { XPostForm, XProfileForm, XThreadForm } from './forms/XForms.jsx'
import { DiscordForm, IMessageForm, LockScreenForm, SnapchatForm, WhatsAppForm } from './forms/ChatForms.jsx'
import { RedditForm, SpotifyForm, TikTokProfileForm, TikTokVideoForm, YouTubeForm } from './forms/MiscForms.jsx'

export default function ScreenForm({ project, screen, set }) {
  const key = `${screen.platformId}/${screen.type}`
  const props = { project, screen, data: screen.data || {}, set }
  switch (key) {
    case 'imessage/chat':
      return <IMessageForm {...props} />
    case 'imessage/lockscreen':
      return <LockScreenForm {...props} />
    case 'instagram/post':
      return <InstagramPostForm {...props} />
    case 'instagram/story':
      return <InstagramStoryForm {...props} />
    case 'instagram/profile':
      return <InstagramProfileForm {...props} />
    case 'instagram/dm':
      return <InstagramDMForm {...props} />
    case 'x/post':
      return <XPostForm {...props} />
    case 'x/thread':
      return <XThreadForm {...props} />
    case 'x/profile':
      return <XProfileForm {...props} />
    case 'tiktok/video':
      return <TikTokVideoForm {...props} />
    case 'tiktok/profile':
      return <TikTokProfileForm {...props} />
    case 'whatsapp/chat':
      return <WhatsAppForm {...props} />
    case 'discord/chat':
      return <DiscordForm {...props} />
    case 'snapchat/chat':
      return <SnapchatForm {...props} />
    case 'spotify/nowplaying':
      return <SpotifyForm {...props} />
    case 'youtube/video':
      return <YouTubeForm {...props} />
    case 'reddit/post':
      return <RedditForm {...props} />
    default:
      return <p className="help">No editor for this screen type yet.</p>
  }
}
