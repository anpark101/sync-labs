import { uid } from '../lib/util.js'
import { stockSrc } from './stock.js'

const castAt = (project, i = 0) => project.cast?.[i % (project.cast?.length || 1)]?.id || ''

export const newMsg = (partial = {}) => ({ id: uid('m'), from: 'them', kind: 'text', text: '', ...partial })
export const newComment = (partial = {}) => ({ id: uid('cm'), castId: '', user: '', text: '', likes: 0, time: '1h', ...partial })

const baseDesign = {}

/**
 * Fresh, ready-to-edit content for every screen type.
 * Keeps the editor from ever showing an empty white rectangle.
 */
export const makeScreenData = (platformId, type, project) => {
  const [a, b, c, d] = [0, 1, 2, 3].map((i) => castAt(project, i))
  const key = `${platformId}/${type}`
  switch (key) {
    case 'imessage/chat':
      return {
        contactId: a,
        participants: [],
        title: '',
        messages: [
          newMsg({ from: 'them', text: 'you awake?' }),
          newMsg({ from: 'me', text: 'unfortunately' }),
          newMsg({ from: 'them', text: 'good. i have a terrible idea' }),
        ],
      }
    case 'imessage/lockscreen':
      return {
        wallpaper: stockSrc('neon'),
        date: 'Monday, October 12',
        time: '',
        notifications: [
          { id: uid('n'), app: 'imessage', castId: a, title: 'Messages', body: 'are you still coming tonight?', time: 'now' },
          { id: uid('n'), app: 'instagram', castId: b, title: 'Instagram', body: 'junolately mentioned you in their story', time: '2m ago' },
        ],
      }
    case 'instagram/post':
      return {
        castId: a,
        images: [stockSrc('cafe')],
        caption: '',
        location: '',
        music: '',
        musicArtist: '',
        likes: 1428,
        likedBy: '',
        comments: [
          newComment({ castId: b, text: 'this is so unfair', likes: 12 }),
          newComment({ castId: c, text: 'no thoughts just this', likes: 4 }),
        ],
        time: '2h',
        saved: false,
        liked: true,
        showNav: true,
      }
    case 'instagram/story':
      return {
        castId: a,
        image: stockSrc('city'),
        caption: '',
        location: '',
        music: '',
        musicArtist: '',
        time: '2h',
        progress: 2,
        progressTotal: 4,
        pollOn: false,
        pollQuestion: 'be honest',
        pollA: 'yes',
        pollB: 'absolutely not',
        pollVotesA: 68,
        pollVotesB: 32,
        showReply: true,
      }
    case 'instagram/profile':
      return {
        castId: a,
        posts: 128,
        followers: 12400,
        following: 312,
        bio: '',
        link: '',
        highlights: [],
        grid: ['cafe', 'city', 'vinyl', 'flowers', 'street', 'rooftop'].map((id) => ({ id: uid('g'), image: stockSrc(id) })),
        showNav: true,
      }
    case 'instagram/dm':
      return {
        castId: a,
        messages: [
          newMsg({ from: 'them', text: 'you left your jacket here' }),
          newMsg({ from: 'me', text: 'keep it. it looks better on you anyway' }),
          newMsg({ from: 'them', text: 'smooth' }),
        ],
        showReply: true,
      }
    case 'x/post':
      return {
        castId: a,
        text: "working overtime all day but somehow don't feel tired at all. there's always a reason to smile :)",
        images: [],
        likes: 38200,
        replies: 412,
        reposts: 1240,
        views: 482000,
        time: '2h',
        timestamp: '9:41 AM · Oct 12, 2026',
        liked: true,
        bookmarked: false,
        repliesList: [
          { id: uid('r'), castId: b, text: 'the reason being me. obviously.', likes: 8214, time: '1h' },
          { id: uid('r'), castId: c, text: 'get a room omg', likes: 912, time: '52m' },
        ],
        showNav: true,
      }
    case 'x/thread':
      return {
        castId: a,
        posts: [
          {
            id: uid('tp'),
            text: "okay so. something happened tonight and i need to tell someone before i lose my mind. a thread:",
            likes: 5210,
            replies: 98,
            reposts: 340,
            views: 92100,
          },
          {
            id: uid('tp'),
            text: '1. he showed up at the shop at closing. soaked. didn’t say anything, just held out the umbrella i left at his place three weeks ago.',
            likes: 8900,
            replies: 201,
            reposts: 720,
            views: 214000,
          },
          {
            id: uid('tp'),
            text: '2. i said “you could have just texted.” and he said, “i know.” and then he STOOD THERE. in the rain. for a full minute.',
            likes: 12400,
            replies: 388,
            reposts: 1900,
            views: 401000,
          },
        ],
        showNav: true,
      }
    case 'x/profile':
      return {
        castId: a,
        banner: '',
        bio: '',
        location: '',
        website: '',
        joined: 'Joined March 2021',
        followers: 18400,
        following: 312,
        posts: [
          { id: uid('xp'), text: 'some nights are for writing. this one is for thinking about you instead.', time: '3h', likes: 812, replies: 24, reposts: 62, views: 12400 },
          { id: uid('xp'), text: 'the playlist is getting out of hand. send help (songs).', time: '1d', likes: 1200, replies: 63, reposts: 91, views: 22100 },
        ],
        showNav: true,
      }
    case 'tiktok/video':
      return {
        castId: a,
        cover: stockSrc('concert'),
        caption: `POV: you said "i'll be there in five" and I believed you`,
        music: 'original sound',
        musicArtist: 'ariwrites',
        likes: 48200,
        comments: 1231,
        saves: 6240,
        shares: 3110,
        following: false,
        showNav: true,
      }
    case 'tiktok/profile':
      return {
        castId: a,
        bio: '',
        link: '',
        followers: 84200,
        following: 128,
        likes: 1200000,
        videos: ['concert', 'city', 'neon', 'rooftop', 'vinyl', 'street'].map((id, i) => ({ id: uid('v'), image: stockSrc(id), views: [482000, 92100, 1300000, 62000, 210000, 18000][i] })),
        showNav: true,
      }
    case 'whatsapp/chat':
      return {
        contactId: a,
        participants: [],
        messages: [
          newMsg({ from: 'them', text: 'Are you home?', time: '21:32' }),
          newMsg({ from: 'me', text: 'Just got in', time: '21:34' }),
          newMsg({ from: 'them', text: 'Good. Don’t disappear on me again.', time: '21:34' }),
        ],
        wallpaper: '',
        online: true,
      }
    case 'discord/chat':
      return {
        serverName: 'the fall out',
        channelName: 'general',
        topic: 'no thoughts head empty',
        messages: [
          { id: uid('d'), castId: b, text: 'who changed the server name', time: 'Yesterday at 23:41', reactions: [{ emoji: '💀', count: 8 }] },
          { id: uid('d'), castId: c, text: "it's accurate", time: 'Yesterday at 23:42', reactions: [] },
          { id: uid('d'), castId: a, text: 'can everyone stop talking about me in my own server', time: 'Today at 00:02', reactions: [{ emoji: '😂', count: 12 }, { emoji: '❤️', count: 4 }] },
        ],
      }
    case 'snapchat/chat':
      return {
        contactId: a,
        messages: [
          { id: uid('sp'), from: 'them', kind: 'snap', text: 'Sent a Snap', sub: 'Opened', time: '2m' },
          newMsg({ from: 'me', text: 'you can’t just send that and leave' }),
          newMsg({ from: 'them', text: 'watch me' }),
        ],
        streak: 42,
      }
    case 'spotify/nowplaying':
      return {
        title: 'Wave to Earth',
        artist: 'wave to earth',
        album: '0.1 flaws and all.',
        cover: '',
        progress: 84,
        duration: 214,
        liked: true,
        playlist: 'songs for the drive home',
        showNav: true,
        note: '',
      }
    case 'youtube/video':
      return {
        channelName: '',
        castId: a,
        title: 'we tried to recreate our first date (it went badly)',
        thumb: stockSrc('rooftop'),
        views: 482000,
        uploaded: '2 days ago',
        likes: 24100,
        subscribed: false,
        description: '',
        comments: [
          { id: uid('yc'), user: 'miraaa', text: 'the way he looks at her when he thinks nobody is watching 😭', likes: 4210, time: '1 day ago' },
          { id: uid('yc'), user: 'elliswrites', text: 'this is the only channel that understands me', likes: 812, time: '20 hours ago' },
        ],
      }
    case 'reddit/post':
      return {
        subreddit: 'r/AmITheAsshole',
        castId: a,
        title: 'AITA for not telling my best friend I’m moving in with her ex?',
        body: 'throwaway because she knows my main. we’ve been friends for 11 years and i genuinely don’t know how to bring this up.',
        image: '',
        flair: 'Not the A-hole',
        votes: 14200,
        comments: [
          { id: uid('rc'), user: 'throwaway_9210', votes: 8400, time: '9h', text: 'INFO: does she still have feelings for him? Because "we’re just roommates" is doing a lot of heavy lifting here.', replies: [{ id: uid('rr'), user: 'op_is_confused', votes: 2200, time: '8h', text: 'she says she’s over it. she also still has his hoodie.' }] },
          { id: uid('rc'), user: 'notyourlawyer', votes: 1200, time: '7h', text: 'YTA for the timing. NTA for the living situation. Please talk to her before she finds out from someone else.', replies: [] },
        ],
        showNav: true,
      }
    default:
      return {}
  }
}

export const emptyScreenData = (platformId, type, project) => {
  const data = makeScreenData(platformId, type, project)
  const key = `${platformId}/${type}`
  if (key === 'imessage/chat' || key === 'instagram/dm' || key === 'whatsapp/chat') return { ...data, messages: [] }
  if (key === 'instagram/post') return { ...data, caption: '', comments: [], images: [] }
  if (key === 'x/post') return { ...data, text: '', repliesList: [], images: [] }
  if (key === 'x/thread') return { ...data, posts: [] }
  if (key === 'imessage/lockscreen') return { ...data, notifications: [] }
  return data
}

/** Human summary used on screen cards */
export const summarizeScreen = (screen, project) => {
  const d = screen.data || {}
  const name = (id) => project.cast.find((c) => c.id === id)?.name || ''
  switch (`${screen.platformId}/${screen.type}`) {
    case 'imessage/chat':
    case 'whatsapp/chat':
      return d.participants?.length > 1
        ? `Group · ${d.participants.map(name).filter(Boolean).join(', ') || 'add members'}`
        : name(d.contactId) || 'Choose a contact'
    case 'imessage/lockscreen':
      return `${d.notifications?.length || 0} notification${d.notifications?.length === 1 ? '' : 's'}`
    case 'instagram/post':
    case 'instagram/story':
    case 'instagram/dm':
      return name(d.castId) ? `@${project.cast.find((c) => c.id === d.castId)?.handle || ''}` : 'Choose a character'
    case 'instagram/profile':
    case 'x/profile':
    case 'tiktok/profile':
      return name(d.castId) || 'Choose a character'
    case 'x/post':
      return (d.text || '').slice(0, 52) || 'Empty post'
    case 'x/thread':
      return `${d.posts?.length || 0} posts in thread`
    case 'tiktok/video':
      return (d.caption || '').slice(0, 52) || 'Empty video'
    case 'discord/chat':
      return `#${d.channelName || 'general'} · ${d.messages?.length || 0} messages`
    case 'snapchat/chat':
      return name(d.contactId) || 'Choose a contact'
    case 'spotify/nowplaying':
      return `${d.title || 'Untitled'} — ${d.artist || 'Unknown'}`
    case 'youtube/video':
      return (d.title || '').slice(0, 52) || 'Untitled video'
    case 'reddit/post':
      return (d.title || '').slice(0, 52) || 'Untitled post'
    default:
      return ''
  }
}
