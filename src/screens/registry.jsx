import IMessageChat from './imessage/Chat.jsx'
import LockScreen from './imessage/LockScreen.jsx'
import InstagramPost from './instagram/Post.jsx'
import InstagramStory from './instagram/Story.jsx'
import InstagramProfile from './instagram/Profile.jsx'
import InstagramDM from './instagram/DM.jsx'
import XPost from './x/Post.jsx'
import XThread from './x/Thread.jsx'
import XProfile from './x/Profile.jsx'
import TikTokVideo from './tiktok/Video.jsx'
import TikTokProfile from './tiktok/Profile.jsx'
import WhatsAppChat from './whatsapp/Chat.jsx'
import DiscordChat from './discord/Chat.jsx'
import SnapchatChat from './snapchat/Chat.jsx'
import SpotifyNowPlaying from './spotify/NowPlaying.jsx'
import YouTubeVideo from './youtube/Video.jsx'
import RedditPost from './reddit/Post.jsx'
import { ScreenPlaceholder } from './ui.jsx'

const RENDERERS = {
  'imessage/chat': IMessageChat,
  'imessage/lockscreen': LockScreen,
  'instagram/post': InstagramPost,
  'instagram/story': InstagramStory,
  'instagram/profile': InstagramProfile,
  'instagram/dm': InstagramDM,
  'x/post': XPost,
  'x/thread': XThread,
  'x/profile': XProfile,
  'tiktok/video': TikTokVideo,
  'tiktok/profile': TikTokProfile,
  'whatsapp/chat': WhatsAppChat,
  'discord/chat': DiscordChat,
  'snapchat/chat': SnapchatChat,
  'spotify/nowplaying': SpotifyNowPlaying,
  'youtube/video': YouTubeVideo,
  'reddit/post': RedditPost,
}

export const ScreenRenderer = ({ project, screen }) => {
  const key = `${screen?.platformId}/${screen?.type}`
  const Renderer = RENDERERS[key]
  if (!Renderer) return <ScreenPlaceholder label={`${screen?.platformId || 'Unknown'} screen`} />
  return <Renderer project={project} screen={screen} data={screen.data || {}} />
}

export default RENDERERS
