import { newProject, newCharacter, DEFAULT_STYLE } from '../lib/schema.js'
import { makeScreenData } from './defaults.js'
import { uid } from '../lib/util.js'

const from = ({ title, tagline, synopsis, tags = [], cast = [], screens = [], time = '9:41', battery = 78, cover = 0 }) => {
  const chars = cast.map((c) => newCharacter(c))
  const project = newProject({
    title,
    tagline,
    synopsis,
    tags,
    cast: chars,
    style: { ...DEFAULT_STYLE, time, battery },
  })
  project.screens = screens.map((s) => ({
    id: uid('s'),
    platformId: s.p,
    type: s.t,
    title: s.title || '',
    design: s.design || {},
    data: { ...makeScreenData(s.p, s.t, project), ...s.data(chars) },
  }))
  project.coverScreenId = project.screens[cover]?.id || project.screens[0]?.id || null
  return project
}

const msg = (from, text, extra = {}) => ({ id: uid('m'), from, text, ...extra })

export const TEMPLATES = [
  {
    id: 'group-chat',
    name: 'The Group Chat',
    blurb: 'Four friends, one karaoke room, zero survivors.',
    description: 'Every terrible idea starts with someone typing “hypothetically.” A found-family comedy told in unread messages and voice notes.',
    tags: ['comedy', 'found family', 'group chat'],
    tint: 'rgba(159, 214, 180, 0.18)',
    platform: 'imessage',
    build: () =>
      from({
        title: 'The Group Chat',
        tagline: 'Four friends. One karaoke room. Zero survivors.',
        synopsis:
          'Mara has a cat and a personality. Theo has a plan. Iris has the audacity to enable him. Benji is already in the Uber. A no-plot, all-chaos AU.',
        tags: ['comedy', 'found family', 'group chat'],
        time: '8:12',
        cast: [
          { name: 'Mara Quinn', handle: 'maravale', avatar: 'media/demo/juno.jpg', color: '#c9b6f5', bio: 'cat person. reluctant participant.', followers: 4200, following: 380 },
          { name: 'Theo Park', handle: 'theodore', avatar: 'media/demo/kai.jpg', color: '#9fd6b4', bio: 'the ideas guy (derogatory)', followers: 3100, following: 512 },
          { name: 'Iris Bell', handle: 'irises', avatar: 'media/demo/sloane.jpg', color: '#e8c99a', bio: 'enabler. photographer. menace.', followers: 8900, following: 290 },
          { name: 'Benji Wu', handle: 'benjithegreat', avatar: 'media/demo/ari.jpg', color: '#f0a07c', bio: 'already in the uber', followers: 2600, following: 602 },
        ],
        screens: [
          {
            p: 'imessage',
            t: 'chat',
            title: 'the plan',
            data: ([mara, theo, iris, benji]) => ({
              contactId: theo.id,
              participants: [theo.id, iris.id, benji.id],
              title: 'the group chat',
              time: '8:12 PM',
              messages: [
                { id: uid('m'), kind: 'time', text: 'Today 8:12 PM' },
                msg('them', 'hypothetically. if i told you i booked a karaoke room for 9', { castId: theo.id }),
                msg('them', "i would say you're a coward for saying hypothetically", { castId: iris.id }),
                msg('me', "i'm wearing pyjamas"),
                msg('them', 'great. no one can see pyjamas through a microphone', { castId: theo.id }),
                msg('them', "this is the worst plan you've had", { castId: benji.id }),
                msg('them', "i'm in", { castId: benji.id }),
                msg('me', 'i hate all of you'),
                msg('them', 'that’s not a no', { castId: iris.id }),
              ],
              receipt: 'Read',
            }),
          },
          {
            p: 'discord',
            t: 'chat',
            title: 'bad ideas',
            data: ([mara, theo, iris, benji]) => ({
              serverName: 'the group chat',
              channelName: 'bad ideas',
              topic: 'hypothetically speaking',
              dateLabel: 'Today',
              messages: [
                { id: uid('d'), castId: iris.id, text: 'who added a channel called bad ideas', time: 'Today at 8:14 PM', reactions: [{ emoji: '💀', count: 8 }] },
                { id: uid('d'), castId: theo.id, text: "me. it's where benji lives now", time: 'Today at 8:14 PM', reactions: [{ emoji: '😭', count: 4 }] },
                { id: uid('d'), castId: benji.id, text: 'i feel seen', time: 'Today at 8:15 PM', reactions: [{ emoji: '❤️', count: 2 }] },
                { id: uid('d'), castId: mara.id, text: "i'm not going. i have a cat and a personality.", time: 'Today at 8:16 PM', replyTo: { author: 'Theo', text: 'hypothetically.' }, reactions: [{ emoji: '😂', count: 9 }] },
                { id: uid('d'), castId: theo.id, text: 'the cat can come', time: 'Today at 8:16 PM', reactions: [] },
              ],
            }),
          },
          {
            p: 'x',
            t: 'post',
            title: 'the aftermath',
            data: ([mara, theo, iris, benji]) => ({
              castId: mara.id,
              text: 'hypothetically i have the best friends in the world. unfortunately they made me sing karaoke tonight and there is footage. #thegroupchat',
              images: ['media/stock/concert.jpg'],
              likes: 12400,
              replies: 213,
              reposts: 862,
              views: 284000,
              time: '3h',
              timestamp: '11:48 PM · Oct 11, 2026',
              liked: true,
              repliesList: [
                { id: uid('r'), castId: theo.id, text: 'post the footage', likes: 3200, time: '2h' },
                { id: uid('r'), castId: iris.id, text: 'post the footage', likes: 2800, time: '2h' },
                { id: uid('r'), castId: benji.id, text: 'i have the footage', likes: 4100, time: '1h' },
              ],
            }),
          },
        ],
      }),
  },
  {
    id: 'soft-launch',
    name: 'Soft Launch',
    blurb: 'No caption. He knows who he is.',
    description: 'June posts a photo with a wrist in it. Elliot sees his own watch. The internet, and both their mothers, do the rest.',
    tags: ['romance', 'fluff', 'social media'],
    tint: 'rgba(240, 160, 124, 0.18)',
    platform: 'instagram',
    build: () =>
      from({
        title: 'Soft Launch',
        tagline: 'No caption. He knows who he is.',
        synopsis:
          'It starts with a coffee cup and a wrist. Three posts later, June’s mother has called, Noor has made a group chat, and Elliot is learning what “hard launch” means.',
        tags: ['romance', 'fluff', 'soft launch'],
        time: '9:41',
        cast: [
          { name: 'June Park', handle: 'junewrites', avatar: 'media/demo/juno.jpg', color: '#c9b6f5', verified: true, bio: 'writer. terrible at keeping secrets.\ncurrently: soft launching someone.', followers: 24800, following: 301 },
          { name: 'Elliot Han', handle: 'elliotfyi', avatar: 'media/demo/ari.jpg', color: '#f0a07c', bio: 'the boy in the reflection. apparently.', followers: 9400, following: 288 },
          { name: 'Noor Haddad', handle: 'noor.jpg', avatar: 'media/demo/sloane.jpg', color: '#e8c99a', bio: 'chief witness. group chat admin.', followers: 11200, following: 403 },
        ],
        screens: [
          {
            p: 'instagram',
            t: 'post',
            title: 'the soft launch',
            data: ([june, elliot, noor]) => ({
              castId: june.id,
              images: ['media/stock/cafe.jpg'],
              caption: 'soft launch. no caption needed, he knows who he is. ☕️ #softlaunch',
              location: 'Café Marigold',
              likes: 2140,
              likedBy: 'elliotfyi and 2,139 others',
              comments: [
                { id: uid('cm'), castId: noor.id, text: 'OH MY GOD', likes: 102, time: '41m' },
                { id: uid('cm'), castId: elliot.id, text: 'who is he though', likes: 214, time: '38m' },
              ],
              time: '1 hour ago',
              liked: true,
              saved: false,
            }),
          },
          {
            p: 'instagram',
            t: 'story',
            title: 'his story',
            data: ([june, elliot]) => ({
              castId: elliot.id,
              image: 'media/stock/coffee.jpg',
              caption: "she posted me. i've been staring at it for eleven minutes.",
              music: 'Sweet',
              musicArtist: 'Cigarettes After Sex',
              time: '28m',
              progress: 1,
              progressTotal: 3,
              pollOn: true,
              pollQuestion: 'is this a date?',
              pollA: 'yes, obviously',
              pollB: 'it’s been three years',
              pollVotesA: 82,
              pollVotesB: 18,
            }),
          },
          {
            p: 'instagram',
            t: 'dm',
            title: 'the mother incident',
            data: ([june, elliot]) => ({
              castId: elliot.id,
              time: '9:41 AM',
              messages: [
                { id: uid('m'), from: 'them', text: "so we're doing this" },
                { id: uid('m'), from: 'me', text: 'apparently' },
                { id: uid('m'), from: 'them', text: 'good' },
                { id: uid('m'), from: 'them', text: 'i already told my mom' },
                { id: uid('m'), from: 'me', text: 'you WHAT' },
                { id: uid('m'), from: 'them', text: 'she says hi' },
              ],
              seen: true,
            }),
          },
          {
            p: 'x',
            t: 'post',
            title: 'the fallout',
            data: ([june, elliot, noor]) => ({
              castId: june.id,
              text: 'hard launched a boy on instagram and my mother called me before he did. the system works.',
              likes: 12400,
              replies: 213,
              reposts: 418,
              views: 390000,
              time: '2h',
              timestamp: '10:02 AM · Oct 12, 2026',
              liked: false,
              repliesList: [
                { id: uid('r'), castId: noor.id, text: 'the way i was on facetime for this', likes: 1200, time: '1h' },
                { id: uid('r'), castId: elliot.id, text: 'your mom is my favourite person in this story', likes: 2400, time: '1h' },
              ],
            }),
          },
        ],
      }),
  },
  {
    id: 'long-distance',
    name: 'Four Thousand Miles',
    blurb: 'A love story with a time difference.',
    description: 'Sena is in Seoul. Miles is in London. They are very good at texting and very bad at goodbyes.',
    tags: ['angst', 'long distance', 'second chance'],
    tint: 'rgba(148, 186, 230, 0.18)',
    platform: 'whatsapp',
    build: () =>
      from({
        title: 'Four Thousand Miles',
        tagline: 'A love story with a time difference.',
        synopsis:
          'Four thousand three hundred and eighty-two miles. Fourteen hours of flying. One song played twice at the airport because neither of them moved first.',
        tags: ['angst', 'long distance', 'second chance'],
        time: '6:14',
        cast: [
          { name: 'Sena Yoon', handle: 'se.na', avatar: 'media/demo/juno.jpg', color: '#c9b6f5', bio: 'seoul → london → home, eventually.\nfilm student.', followers: 6200, following: 341 },
          { name: 'Miles Avery', handle: 'milesaway', avatar: 'media/demo/ari.jpg', color: '#f0a07c', bio: 'london. terrible at goodbyes.', followers: 4100, following: 287 },
        ],
        screens: [
          {
            p: 'imessage',
            t: 'chat',
            title: '3:47 am',
            data: ([sena, miles]) => ({
              contactId: miles.id,
              time: '3:47 AM',
              messages: [
                { id: uid('m'), kind: 'time', text: 'Today 3:47 AM' },
                msg('them', 'are you awake'),
                msg('me', 'always'),
                msg('them', 'i did the math. 4,382 miles.'),
                msg('me', 'and?'),
                msg('them', "and i love you, but i don't know how to do this from here."),
                msg('me', "don't say that."),
                msg('them', "don't say what."),
                msg('me', "that you love me like it's a reason to leave."),
              ],
              receipt: 'Delivered',
            }),
          },
          {
            p: 'whatsapp',
            t: 'chat',
            title: 'the flight',
            data: ([sena, miles]) => ({
              contactId: miles.id,
              online: false,
              showEncryption: false,
              messages: [
                { id: uid('m'), from: 'them', text: 'boarding now', time: '06:12' },
                { id: uid('m'), from: 'me', text: "i'll be there in 14 hours", time: '06:13' },
                { id: uid('m'), from: 'them', text: "i'll be at arrivals. i'll be the one crying.", time: '06:13' },
                { id: uid('m'), from: 'me', text: "i'd hope so", time: '06:14' },
                { id: uid('m'), from: 'them', text: 'window seat. 14 hours. i’m counting.', time: '06:14' },
              ],
              dayLabel: 'TODAY',
            }),
          },
          {
            p: 'spotify',
            t: 'nowplaying',
            title: 'the airport song',
            data: () => ({
              title: 'Linger',
              artist: 'The Cranberries',
              album: "Everybody Else Is Doing It, So Why Can't We?",
              cover: 'media/stock/beach.jpg',
              progress: 38,
              duration: 274,
              liked: true,
              playlist: 'for the flight',
              note: 'we played it at the airport twice, because neither of us moved.',
              accent: '#33444f',
            }),
          },
          {
            p: 'imessage',
            t: 'lockscreen',
            title: 'arrivals',
            data: ([sena, miles]) => ({
              wallpaper: 'media/stock/rain.jpg',
              date: 'Sunday, March 8',
              time: '06:14',
              weather: '8°  Rain',
              event: 'Landing · 07:40',
              notifications: [
                { id: uid('n'), app: 'imessage', castId: miles.id, title: 'Miles', body: "i'm here. i'm the one crying.", time: 'now' },
                { id: uid('n'), app: 'whatsapp', castId: miles.id, title: 'WhatsApp', body: 'Miles: look out the window.', time: '2m ago' },
              ],
            }),
          },
        ],
      }),
  },
  {
    id: 'fake-dating',
    name: 'Fake Dating (Allegedly)',
    blurb: 'A contract, a group chat, and one very real problem.',
    description: 'Rafe announces he’s dating Cleo to get out of a press tour. Cleo finds out on the timeline. The problem isn’t the lie. It’s everything after it.',
    tags: ['fake dating', 'comedy', 'romance'],
    tint: 'rgba(230, 160, 190, 0.18)',
    platform: 'x',
    build: () =>
      from({
        title: 'Fake Dating (Allegedly)',
        tagline: 'A contract, a group chat, and one very real problem.',
        synopsis:
          'One publicist-approved lie. Two people who are terrible at lying. Three weeks until the contract ends, and neither of them is counting down.',
        tags: ['fake dating', 'comedy', 'romance'],
        time: '9:41',
        cast: [
          { name: 'Cleo Marsh', handle: 'cleostars', avatar: 'media/demo/juno.jpg', color: '#c9b6f5', verified: true, bio: 'actress. tired. in that order.', followers: 1840000, following: 212 },
          { name: 'Rafe Okafor', handle: 'rafewrites', avatar: 'media/demo/ari.jpg', color: '#f0a07c', verified: true, bio: 'musician. allegedly charming.', followers: 2410000, following: 89 },
          { name: 'Priya Raman', handle: 'priyaclose', avatar: 'media/demo/sloane.jpg', color: '#e8c99a', bio: 'the publicist. the witness. the judge.', followers: 42800, following: 512 },
        ],
        screens: [
          {
            p: 'x',
            t: 'post',
            title: 'the announcement',
            data: ([cleo, rafe, priya]) => ({
              castId: rafe.id,
              text: 'cleo and i are dating. please stop asking. (this is a joke. unless.)',
              likes: 88200,
              replies: 3120,
              reposts: 4120,
              views: 2400000,
              time: '4h',
              timestamp: '1:02 PM · Oct 12, 2026',
              liked: true,
              repliesList: [
                { id: uid('r'), castId: priya.id, text: 'this is not how you announce a fake relationship', likes: 41200, time: '3h' },
                { id: uid('r'), castId: cleo.id, text: "he's kidding. we're not. he's not.", likes: 38400, time: '3h' },
              ],
            }),
          },
          {
            p: 'instagram',
            t: 'story',
            title: 'the flowers',
            data: ([cleo]) => ({
              castId: cleo.id,
              image: 'media/stock/flowers.jpg',
              caption: "he brought me flowers 'for the paparazzi.' there are no paparazzi.",
              music: 'Risk',
              musicArtist: 'Gracie Abrams',
              time: '2h',
              progress: 3,
              progressTotal: 4,
              pollOn: true,
              pollQuestion: 'should i sue?',
              pollA: 'yes',
              pollB: 'no, kiss him',
              pollVotesA: 21,
              pollVotesB: 79,
            }),
          },
          {
            p: 'instagram',
            t: 'post',
            title: 'the hard launch',
            data: ([cleo, rafe, priya]) => ({
              castId: cleo.id,
              images: ['media/stock/coffee.jpg'],
              caption: 'hard launch — @rafewrites (contractually obligated) 🩷',
              location: 'Somewhere off Sunset',
              likes: 248000,
              likedBy: 'rafewrites and 247,999 others',
              comments: [
                { id: uid('cm'), castId: priya.id, text: 'the contract said no feelings', likes: 18200, time: '2h' },
                { id: uid('cm'), castId: rafe.id, text: 'i have a copy', likes: 24100, time: '1h' },
              ],
              time: '3 hours ago',
              liked: true,
            }),
          },
          {
            p: 'x',
            t: 'thread',
            title: 'the thread',
            data: ([cleo]) => ({
              castId: cleo.id,
              posts: [
                { id: uid('tp'), text: 'a thread of reasons i am definitely not in love with rafe:', likes: 42100, replies: 812, reposts: 6200, views: 1800000, time: '1h' },
                { id: uid('tp'), text: '1. he remembers how i take my coffee. that’s just good manners. it doesn’t mean anything that he wrote it on the back of his hand.', likes: 51200, replies: 1200, reposts: 8100, views: 2200000, time: '' },
                { id: uid('tp'), text: '2. he stayed on the phone until i fell asleep. friends do that. i’ve never had a friend do that. that’s not the point.', likes: 68400, replies: 2100, reposts: 12400, views: 3100000, time: '' },
                { id: uid('tp'), text: "i'm going to stop now. for legal reasons.", likes: 91200, replies: 3200, reposts: 18200, views: 4200000, time: '' },
              ],
            }),
          },
        ],
      }),
  },
  {
    id: 'rival-cafes',
    name: 'Fern & Foam',
    blurb: 'Two cafés. One street. No feelings involved.',
    description: 'Wren opens a plant-filled café. Nico opens an espresso bar directly across the street with a sign that says “better oat milk.” It escalates from there.',
    tags: ['rivals', 'romance', 'coffee'],
    tint: 'rgba(146, 207, 169, 0.18)',
    platform: 'reddit',
    build: () =>
      from({
        title: 'Fern & Foam',
        tagline: 'Two cafés. One street. Absolutely no feelings involved.',
        synopsis:
          'A café with too many plants, an espresso bar with too much confidence, and a street that has picked sides. The oat milk is a metaphor. Probably.',
        tags: ['rivals', 'romance', 'coffee'],
        time: '8:05',
        cast: [
          { name: 'Wren Ellis', handle: 'wrenmakes', avatar: 'media/demo/juno.jpg', color: '#c9b6f5', verified: true, bio: 'owner of fern & foam.\ni don’t talk about the place across the street.', followers: 14200, following: 288, link: 'fernandfoam.co' },
          { name: 'Nico Alvarez', handle: 'nicopour', avatar: 'media/demo/ari.jpg', color: '#f0a07c', bio: 'nicopour espresso. better oat milk. ask anyone.', followers: 11800, following: 301, link: 'nicopour.coffee' },
        ],
        screens: [
          {
            p: 'instagram',
            t: 'profile',
            title: 'fern & foam',
            data: ([wren]) => ({
              castId: wren.id,
              posts: 84,
              followers: 14200,
              following: 288,
              bio: 'plants, pastries, and one (1) very good espresso machine.\nopen 7–5 · closed mondays',
              link: 'fernandfoam.co',
              category: 'café · plant parent',
              showFollowing: false,
              highlights: [
                { id: uid('h'), name: 'the café', image: 'media/stock/cafe.jpg' },
                { id: uid('h'), name: 'menu', image: 'media/stock/coffee.jpg' },
                { id: uid('h'), name: 'enemies', image: 'media/stock/neon.jpg' },
              ],
              grid: [
                { id: uid('g'), image: 'media/stock/cafe.jpg' },
                { id: uid('g'), image: 'media/stock/coffee.jpg', pinned: true },
                { id: uid('g'), image: 'media/stock/flowers.jpg' },
                { id: uid('g'), image: 'media/stock/books.jpg' },
                { id: uid('g'), image: 'media/stock/street.jpg' },
                { id: uid('g'), image: 'media/stock/vinyl.jpg', type: 'reels' },
              ],
            }),
          },
          {
            p: 'instagram',
            t: 'post',
            title: 'the sign',
            data: ([wren, nico]) => ({
              castId: nico.id,
              images: ['media/stock/coffee.jpg'],
              caption:
                "somebody put a sign in my window that says 'our oat milk is better.' i have a suspect. ☕️ #cafewars #nicopour",
              location: 'Nicopour',
              music: 'Espresso',
              musicArtist: 'Sabrina Carpenter',
              likes: 4210,
              likedBy: 'wrenmakes and 4,209 others',
              comments: [
                { id: uid('cm'), castId: wren.id, text: 'well?', likes: 302, time: '2h' },
                { id: uid('cm'), castId: nico.id, text: 'slander.', likes: 188, time: '1h' },
              ],
              time: '3 hours ago',
              liked: true,
            }),
          },
          {
            p: 'reddit',
            t: 'post',
            title: 'the confession',
            data: ([wren, nico]) => ({
              subreddit: 'r/barista',
              castId: nico.id,
              title: 'AITA for starting a war with the café across the street?',
              body:
                "throwaway. i (28m) opened an espresso bar opposite a café run by a woman (26f) who i may have... noticed. i put up a sign. she put up a bigger sign. now the whole street is involved and i think i'm losing. she also keeps bringing me pastries she says are 'defective' but they're clearly perfect.",
              flair: 'Not the A-hole',
              votes: 18400,
              commentCount: 2140,
              time: '6h',
              comments: [
                { id: uid('rc'), user: 'throwaway_9210', votes: 9200, time: '5h', text: 'INFO: is the war about oat milk, or is the war about the fact that you like her? Because the pastries are not defective, my guy.', replies: [{ id: uid('rr'), user: 'op_is_confused', votes: 3100, time: '4h', text: 'the war is about oat milk.' }] },
                { id: uid('rc'), user: 'notyourbarista', votes: 2100, time: '3h', text: 'NTA for the sign. YTA for pretending this is about coffee. Ask her out before the street has to stage an intervention.', replies: [] },
              ],
            }),
          },
        ],
      }),
  },
  {
    id: 'band-au',
    name: 'Silvers',
    blurb: 'The band that recorded their first album in a kitchen.',
    description: 'Sol writes the songs. Dax breaks the drums. Mimi keeps them alive. A story about the noise you make before anyone knows your name.',
    tags: ['band', 'found family', 'music'],
    tint: 'rgba(190, 170, 240, 0.2)',
    platform: 'tiktok',
    build: () =>
      from({
        title: 'Silvers',
        tagline: 'The band that recorded their first album in a kitchen.',
        synopsis:
          'Three people, one van, and a demo recorded on a phone at 3am. A story about making it — or at least making something that matters to eleven people and then a thousand.',
        tags: ['band', 'found family', 'music'],
        time: '11:11',
        cast: [
          { name: 'Sol Reyes', handle: 'solace', avatar: 'media/demo/juno.jpg', color: '#c9b6f5', verified: true, bio: 'guitar for silvers / bad at math / good at noise.', followers: 84200, following: 128, link: 'silvers.band' },
          { name: 'Dax Kim', handle: 'daxnoise', avatar: 'media/demo/kai.jpg', color: '#9fd6b4', bio: 'drums. manager. apparently.', followers: 31200, following: 210 },
          { name: 'Mimi Sato', handle: 'mimibeat', avatar: 'media/demo/sloane.jpg', color: '#e8c99a', bio: 'bass + mixing + keeping them alive.', followers: 28400, following: 344 },
        ],
        screens: [
          {
            p: 'tiktok',
            t: 'video',
            title: 'the show',
            data: ([sol, dax, mimi]) => ({
              castId: sol.id,
              cover: 'media/stock/concert.jpg',
              caption:
                "POV: our drummer quit three hours before the show so our manager went on drums and honestly? he's the best in the city now. #silvers #localband #originalsound",
              music: 'Static Bloom (demo)',
              musicArtist: 'silvers',
              likes: 342000,
              comments: 4821,
              saves: 28400,
              shares: 12400,
              following: false,
            }),
          },
          {
            p: 'spotify',
            t: 'nowplaying',
            title: 'kitchen demos',
            data: () => ({
              title: 'Static Bloom',
              artist: 'silvers',
              album: 'Kitchen Demos',
              cover: 'media/stock/concert.jpg',
              progress: 31,
              duration: 238,
              liked: true,
              playlist: 'silvers — kitchen demos',
              note: 'recorded on a phone in my kitchen. mixed by mimi. drums by the best in the city.',
              accent: '#5a2f3b',
            }),
          },
          {
            p: 'instagram',
            t: 'profile',
            title: 'silvers',
            data: ([sol]) => ({
              castId: sol.id,
              posts: 61,
              followers: 84200,
              following: 128,
              bio: 'silvers. guitar / vocals.\nkitchen demos out now.\nnext: the 200-cap room we sold out.',
              link: 'silvers.band',
              category: 'musician/band',
              highlights: [
                { id: uid('h'), name: 'tour', image: 'media/stock/street.jpg' },
                { id: uid('h'), name: 'demos', image: 'media/stock/vinyl.jpg' },
                { id: uid('h'), name: 'the band', image: 'media/stock/concert.jpg' },
              ],
              grid: [
                { id: uid('g'), image: 'media/stock/concert.jpg', type: 'reels' },
                { id: uid('g'), image: 'media/stock/vinyl.jpg' },
                { id: uid('g'), image: 'media/stock/neon.jpg' },
                { id: uid('g'), image: 'media/stock/rooftop.jpg' },
                { id: uid('g'), image: 'media/stock/cafe.jpg', type: 'carousel' },
                { id: uid('g'), image: 'media/stock/city.jpg' },
              ],
            }),
          },
          {
            p: 'x',
            t: 'post',
            title: 'the news',
            data: ([sol, dax, mimi]) => ({
              castId: sol.id,
              text: 'we sold out the 200-cap room. i’m going to be insufferable about this forever. thank you to everyone who listened to a demo recorded in a kitchen. #silvers',
              likes: 28400,
              replies: 412,
              reposts: 1820,
              views: 920000,
              time: '5h',
              timestamp: '6:02 PM · Oct 12, 2026',
              liked: true,
              repliesList: [
                { id: uid('r'), castId: mimi.id, text: 'you cried in the van. i have video.', likes: 14200, time: '4h' },
                { id: uid('r'), castId: dax.id, text: 'the best in the city, etc.', likes: 8200, time: '3h' },
              ],
            }),
          },
        ],
      }),
  },
]

export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id)

export function buildTemplate(id) {
  const template = getTemplate(id)
  if (!template) return newProject({ title: 'Untitled AU' })
  return template.build()
}
