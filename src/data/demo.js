import { newProject, newCharacter } from '../lib/schema.js'
import { makeScreenData } from './defaults.js'
import { uid } from '../lib/util.js'

const screen = (project, platformId, type, title, data) => ({
  id: uid('s'),
  platformId,
  type,
  title,
  data: { ...makeScreenData(platformId, type, project), ...data },
  design: {},
})

/**
 * The sample AU that ships with the studio.
 * A slow-burn story, told across eight screens.
 */
export const buildDemoProject = () => {
  const juno = newCharacter({
    name: 'Juno Vale',
    handle: 'junolately',
    avatar: 'media/demo/juno.jpg',
    color: '#c9b6f5',
    verified: true,
    bio: 'photographer. fairly unreasonable. mostly in the darkroom.',
    followers: 28400,
    following: 312,
    link: 'junovale.studio',
  })
  const ari = newCharacter({
    name: 'Ari Nakamura',
    handle: 'ariwrites',
    avatar: 'media/demo/ari.jpg',
    color: '#f0a07c',
    bio: 'records & bad timing.\nmarigold records, after 10pm.',
    followers: 18400,
    following: 240,
  })
  const kai = newCharacter({
    name: 'Kai Reyes',
    handle: 'kaireyes',
    avatar: 'media/demo/kai.jpg',
    color: '#9fd6b4',
    bio: 'professional third wheel',
    followers: 8200,
    following: 401,
  })
  const sloane = newCharacter({
    name: 'Sloane Lin',
    handle: 'sloanewav',
    avatar: 'media/demo/sloane.jpg',
    color: '#e8c99a',
    bio: 'i know a guy',
    followers: 12100,
    following: 386,
  })

  const project = newProject({
    title: 'After Hours',
    tagline: 'A slow-burn AU told entirely through screens.',
    synopsis:
      'Juno runs on 3am and film grain. Ari closes the record shop at midnight and keeps finding reasons not to leave. A story about the songs we send instead of the things we mean.',
    fandom: 'Original',
    tags: ['slow burn', 'late night', 'record shop'],
    demo: true,
    cast: [juno, ari, kai, sloane],
    style: {
      theme: 'auto',
      frame: 'iphone',
      frameColor: 'black',
      island: true,
      statusBar: true,
      time: '1:14',
      battery: 42,
      watermark: false,
      watermarkText: 'elsewhere',
    },
  })

  const screens = [
    screen(project, 'instagram', 'post', 'the post', {
      castId: juno.id,
      images: ['media/stock/vinyl.jpg'],
      caption:
        "he kept the record i gave him. i kept the receipt. we're both a little pathetic like that.\n\n#afterhours #recordstore",
      location: 'Marigold Records',
      music: 'Dandelions',
      musicArtist: 'Ruth B.',
      likes: 1284,
      likedBy: 'ariwrites and 1,283 others',
      comments: [
        { id: uid('cm'), castId: kai.id, text: 'you two are exhausting (affectionate)', likes: 42, time: '1h' },
        { id: uid('cm'), castId: sloane.id, text: "the receipt is in the frame. i can't.", likes: 88, time: '1h' },
      ],
      time: '2 hours ago',
      liked: true,
      saved: true,
    }),
    screen(project, 'imessage', 'chat', 'the first text', {
      contactId: juno.id,
      time: '1:12 AM',
      messages: [
        { id: uid('m'), kind: 'time', text: 'Today 1:12 AM' },
        { id: uid('m'), from: 'them', text: "you're still at the shop." },
        { id: uid('m'), from: 'me', text: 'how did you know' },
        { id: uid('m'), from: 'them', text: 'your story. the neon sign gives you away.' },
        { id: uid('m'), from: 'them', kind: 'audio', duration: '0:14' },
        { id: uid('m'), from: 'me', text: "i'm not listening to that in public" },
        { id: uid('m'), from: 'them', text: "you're alone at 1am in a record store. there's no public." },
        { id: uid('m'), from: 'me', text: "fine. it's a good song." },
        { id: uid('m'), from: 'them', text: 'i wrote it about you. obviously.' },
        { id: uid('m'), from: 'them', kind: 'image', image: 'media/stock/city.jpg' },
      ],
      receipt: 'Read',
    }),
    screen(project, 'instagram', 'story', 'the story', {
      castId: ari.id,
      image: 'media/stock/city.jpg',
      caption: "she said she'd come. it's 2:14 and i'm still here.",
      location: 'Marigold Records',
      music: 'Dandelions',
      musicArtist: 'Ruth B.',
      time: '12m',
      progress: 2,
      progressTotal: 4,
      pollOn: true,
      pollQuestion: 'should i text first?',
      pollA: 'yes, obviously',
      pollB: 'no, suffer',
      pollVotesA: 68,
      pollVotesB: 32,
    }),
    screen(project, 'x', 'post', 'the parking lot', {
      castId: juno.id,
      text: 'he said “i’ll be there in five.” that was forty minutes ago. i’ve never been happier to wait in a parking lot. #afterhours',
      images: ['media/stock/city.jpg'],
      likes: 38200,
      replies: 412,
      reposts: 1240,
      views: 482000,
      time: '2h',
      timestamp: '2:14 AM · Oct 12, 2026',
      liked: true,
      repliesList: [
        { id: uid('r'), castId: kai.id, text: 'the way this is the most romantic thing to ever happen in this city', likes: 8214, time: '1h' },
        { id: uid('r'), castId: sloane.id, text: 'update account', likes: 912, time: '52m' },
      ],
    }),
    screen(project, 'instagram', 'dm', 'the jacket', {
      castId: juno.id,
      messages: [
        { id: uid('m'), from: 'them', text: 'you left your jacket here' },
        { id: uid('m'), from: 'me', text: 'keep it. it looks better on you anyway' },
        { id: uid('m'), from: 'them', text: 'smooth.' },
        { id: uid('m'), from: 'them', text: "i'm outside the shop. open the door." },
        { id: uid('m'), from: 'me', text: "you're impossible" },
        { id: uid('m'), from: 'them', text: 'and yet.' },
      ],
      seen: true,
    }),
    screen(project, 'tiktok', 'video', 'the sprint', {
      castId: ari.id,
      cover: 'media/stock/rooftop.jpg',
      caption:
        "POV: you told the girl at the record store you'd be there in five and now you're sprinting across the city at 2am #afterhours #booktok",
      music: 'Dandelions (sped up)',
      musicArtist: 'ruth b.',
      likes: 48200,
      comments: 1231,
      saves: 6240,
      shares: 3110,
      liked: false,
    }),
    screen(project, 'spotify', 'nowplaying', 'the song', {
      title: 'Dandelions',
      artist: 'Ruth B.',
      album: 'Safe Haven',
      cover: 'media/stock/vinyl.jpg',
      progress: 62,
      duration: 214,
      liked: true,
      playlist: 'after hours // him',
      note: "he played this at 1:14 am and now it's the only song that exists",
      accent: '#4a3b52',
    }),
    screen(project, 'imessage', 'lockscreen', '1:14 am', {
      wallpaper: 'media/stock/neon.jpg',
      date: 'Saturday, October 11',
      time: '2:14',
      weather: '14°  Clear',
      event: 'Record fair · 10:00 AM',
      notifications: [
        { id: uid('n'), app: 'imessage', castId: juno.id, title: 'Juno', body: "i'm outside. don't make me knock.", time: 'now' },
        { id: uid('n'), app: 'instagram', castId: juno.id, title: 'Instagram', body: 'junolately replied to your story: “come outside.”', time: '1m ago' },
        { id: uid('n'), app: 'spotify', title: 'Spotify', body: 'Your 1AM mix is ready. 42 songs, one feeling.', time: '4m ago' },
      ],
    }),
  ]

  project.screens = screens
  project.coverScreenId = screens[0].id
  return project
}
