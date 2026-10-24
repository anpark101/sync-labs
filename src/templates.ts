import type { AppState, Character, Moment, PlatformId, Project } from './types';
import { uid } from './util';

type Store = {
  addCharacter: (c?: Partial<Character>) => Character;
  addProject: (p: { title: string; description: string; tags?: string[]; moments?: Moment[] }) => Project;
};

const m = (platform: PlatformId, title: string, storyTime: string, config: any, notes = ''): Moment => ({
  id: uid(),
  platform,
  title,
  storyTime,
  notes,
  config,
  updatedAt: Date.now(),
});

export function buildTemplates(store: Store, idx?: number) {
  const builders = [t1, t2, t3];
  if (idx === undefined) builders.forEach((b) => b(store));
  else builders[idx]?.(store);
}

function t1(store: Store) {
  // ============ Template 1: The 2AM Confession ============
  const you1 = store.addCharacter({
    name: 'You',
    emoji: '☁️',
    color: '#7c5cff',
    bio: 'the main character',
    handles: { instagram: 'cloudfall', x: 'cloudfall', tiktok: 'cloudfall', whatsapp: 'you', telegram: 'you', snapchat: 'cloudfall', reddit: 'you', facebook: 'you' },
  });
  const mj = store.addCharacter({
    name: 'Minjun',
    emoji: '🌙',
    color: '#3b82f6',
    bio: 'tall, quiet, always online at 2am',
    handles: { instagram: 'mj.moon', x: 'mjmoon', tiktok: 'mj.moon', whatsapp: 'mj', telegram: 'minjun', snapchat: 'mj.moon', reddit: 'mjmoon', facebook: 'mj' },
    verified: true,
  });
  store.addProject({
    title: 'The 2AM Confession',
    description: 'One late night, one group project deadline, and a confession that was never meant to be sent.',
    tags: ['romance', 'slowburn'],
    moments: [
      m(
        'whatsapp',
        'the message that broke me',
        'Day 1 · 02:14',
        {
          kind: 'chat',
          title: 'Minjun',
          members: [mj.id],
          group: false,
          subtitle: 'last seen today at 02:41',
          time: '02:41',
          messages: [
            { id: uid(), sender: 'me', text: 'are you still up? it’s 2am', time: '02:14', status: 'read' },
            { id: uid(), sender: mj.id, text: 'yeah. can’t sleep', time: '02:15' },
            { id: uid(), sender: mj.id, text: 'you should be asleep though', time: '02:15' },
            { id: uid(), sender: 'me', text: 'I have something I’ve been meaning to say for like three months', time: '02:18', status: 'read' },
            { id: uid(), sender: mj.id, text: '...okay', time: '02:19' },
            { id: uid(), sender: mj.id, text: 'I’m nervous', time: '02:19' },
            { id: uid(), sender: 'me', text: 'I really like you. not in a “you’re my study buddy” way', time: '02:21', status: 'read' },
            { id: uid(), sender: mj.id, text: 'oh my god', time: '02:22' },
            { id: uid(), sender: mj.id, text: 'I’ve liked you since September', time: '02:22' },
          ],
        },
        'The confession. Keep the gap between your messages tight — it sells the panic.'
      ),
      m(
        'imessage',
        'voice note (he was crying)',
        'Day 1 · 02:47',
        {
          kind: 'chat',
          title: 'Minjun',
          members: [mj.id],
          group: false,
          subtitle: 'Read',
          time: '02:47',
          messages: [
            { id: uid(), sender: mj.id, voice: 42, time: '02:43' },
            { id: uid(), sender: 'me', text: 'I’m listening. I’m not going anywhere', time: '02:44', status: 'read', reaction: '❤️' },
            { id: uid(), sender: mj.id, text: 'I just keep thinking about you', time: '02:46' },
          ],
        }
      ),
      m(
        'ig_story',
        'he posted it anyway',
        'Day 1 · 03:02',
        {
          kind: 'ig_story',
          author: mj.id,
          image: '',
          time: '03:02',
          ago: '24m',
          ring: true,
        },
        'Add a moon or sky photo for maximum effect.'
      ),
      m(
        'x',
        'the tweet that broke the internet',
        'Day 2 · 08:12',
        {
          kind: 'x',
          author: mj.id,
          theme: 'dark',
          items: [
            {
              id: uid(),
              author: 'self',
              text: 'I almost didn’t send it. I held the message for 6 whole minutes and my hand was shaking. best. worst. thing. I’ve ever done.',
              time: '8:12 AM',
              date: 'Mar 25',
              reply: 214,
              repost: 987,
              like: 24800,
              view: 1840000,
              liked: true,
            },
            {
              id: uid(),
              author: 'self',
              text: 'she answered at 2:21am with “I really like you. not in a study buddy way” and I have not recovered since',
              time: '8:15 AM',
              date: 'Mar 25',
              reply: 89,
              repost: 412,
              like: 12300,
              view: 902000,
            },
          ],
        },
        'Classic SMAU energy: the “I’m not okay about this” tweet thread.'
      ),
      m(
        'lockscreen',
        'the 3am notification',
        'Day 1 · 03:00',
        {
          kind: 'lockscreen',
          wallpaper: '',
          time: '3:00',
          date: 'Sunday, March 24',
          notifications: [
            { id: uid(), app: 'messages', name: 'Minjun', body: 'I just keep thinking about you', time: 'now' },
            { id: uid(), app: 'instagram', name: 'Instagram', body: 'mj.moon liked your photo.', time: '4m' },
            { id: uid(), app: 'whatsapp', name: 'Minjun', body: 'I’ve liked you since September', time: '18m' },
          ],
        },
        'The money shot. Screenshot this one at 2x — it’s the thumbnail for the whole thread.'
      ),
    ],
  });

}
function t2(store: Store) {
  // ============ Template 2: Anonymous Rivalry ============
  const you2 = store.addCharacter({
    name: 'You',
    emoji: '⚡',
    color: '#f59e0b',
    bio: 'top of the class, bottom of their patience',
    handles: { instagram: 'volt', x: 'volt', tiktok: 'volt', whatsapp: 'you', telegram: 'volt', snapchat: 'volt', reddit: 'voltage', facebook: 'volt' },
  });
  const fox = store.addCharacter({
    name: 'Rex',
    emoji: '🦊',
    color: '#ef4444',
    bio: 'my rival since first period',
    handles: { instagram: 'rexfam', x: 'rexfam', tiktok: 'rexfam', whatsapp: 'rex', telegram: 'rex', snapchat: 'rexfam', reddit: 'rexfam', facebook: 'rex' },
    verified: true,
  });
  const bestie = store.addCharacter({
    name: 'Moss',
    emoji: '🍀',
    color: '#10b981',
    bio: 'the witness',
    handles: { instagram: 'mossy', x: 'mossy', tiktok: 'mossy', whatsapp: 'moss', telegram: 'mossy', snapchat: 'mossy', reddit: 'mossy', facebook: 'mossy' },
  });
  store.addProject({
    title: 'Anonymous Rivalry',
    description: 'The school group chat, an anonymous account, and the project that forced us together.',
    tags: ['school', 'rivals', 'humor'],
    moments: [
      m(
        'x',
        'the anonymous account appears',
        'Day 1 · 07:45',
        {
          kind: 'x',
          author: you2.id,
          theme: 'light',
          items: [
            {
              id: uid(),
              author: 'self',
              text: 'hot take: rex and I work better together than with anyone else and we both hate that we’re right',
              time: '7:45 AM',
              date: 'Apr 2',
              reply: 88,
              repost: 31,
              like: 942,
              view: 45000,
            },
            {
              id: uid(),
              author: fox.id,
              text: 'the group project results speak for themselves',
              time: '7:52 AM',
              date: 'Apr 2',
              reply: 156,
              repost: 210,
              like: 4300,
              view: 120000,
              liked: true,
            },
          ],
        }
      ),
      m(
        'imessage',
        'the group chat finds out',
        'Day 1 · 08:03',
        {
          kind: 'chat',
          title: 'Project Squad 📚',
          members: [fox.id, bestie.id],
          group: true,
          subtitle: 'You, Rex, Moss',
          time: '08:03',
          messages: [
            { id: uid(), sender: bestie.id, text: 'GUYS THE ANON ACCOUNT IS YOU', time: '08:01' },
            { id: uid(), sender: fox.id, text: 'I have known for weeks', time: '08:02' },
            { id: uid(), sender: fox.id, text: 'I was waiting for the right moment', time: '08:02' },
            { id: uid(), sender: 'me', text: 'THE RIGHT MOMENT IS NEVER GOING TO COME', time: '08:03', status: 'read' },
            { id: uid(), sender: bestie.id, text: 'so the “hot take” was you 💀', time: '08:04', reaction: '😂' },
          ],
        }
      ),
      m(
        'tiktok',
        'POV: the whole school knows',
        'Day 2 · 12:30',
        {
          kind: 'tiktok',
          author: bestie.id,
          image: '',
          caption: 'POV: your rival and you were caught in the same group project and the school has opinions #school #rivals #pov',
          song: 'original sound - mossy',
          likes: 48200,
          commentCount: 2304,
          shares: 8900,
          saves: 12400,
          showComments: true,
          comments: [
            { id: uid(), author: fox.id, text: '“caught” is a strong word for “forced into one room for 6 weeks”', likes: 1200 },
            { id: uid(), author: bestie.id, text: 'I have never seen either of you this soft in my life', likes: 3400 },
          ],
        }
      ),
      m(
        'reddit',
        'an unusual question',
        'Day 2 · 14:11',
        {
          kind: 'reddit',
          sub: 'school',
          author: you2.id,
          flair: 'confession',
          title: 'my rival and I are stuck in a group project and it’s getting uncomfortable',
          body: 'we literally cannot stand each other outside of school but inside the library we have this... system. he brings the food. I bring the notes. nobody talks about it. this is not a situation. this is an emergency.',
          score: 12400,
          commentCount: 892,
          timeAgo: '5h',
          comments: [
            { id: uid(), author: bestie.id, text: 'bro is in the building', score: 4300, isOP: false, timeAgo: '4h' },
            { id: uid(), author: fox.id, text: 'the food was a strategic decision. I planned this.', score: 8900, isOP: false, timeAgo: '4h' },
          ],
        }
      ),
      m(
        'snapchat',
        'the snap that ended it all',
        'Day 2 · 15:44',
        {
          kind: 'snapchat',
          mode: 'snap',
          title: 'Rex',
          members: [fox.id],
          subtitle: 'Opened',
          messages: [],
          time: '15:44',
          snapImage: '',
          snapName: 'Rex',
          snapText: 'we did it. 98%. no one can say anything now.',
          doodle: 'star',
          snapAgo: '2h',
        },
        'Add a photo of you two (or just the finished project) for this one.'
      ),
    ],
  });

}
function t3(store: Store) {
  // ============ Template 3: Group Chat Chaos ============
  const g1 = store.addCharacter({
    name: 'You',
    emoji: '🫧',
    color: '#7c5cff',
    bio: 'chaos coordinator',
    handles: { instagram: 'bubbleg', x: 'bubbleg', tiktok: 'bubbleg', whatsapp: 'you', telegram: 'bubbleg', snapchat: 'bubbleg', reddit: 'bubbleg', facebook: 'bubbleg' },
  });
  const hana = store.addCharacter({
    name: 'Hana',
    emoji: '🍑',
    color: '#f472b6',
    bio: 'plans everything, remembers everything',
    handles: { instagram: 'hana.exe', x: 'hanaexe', tiktok: 'hana.exe', whatsapp: 'hana', telegram: 'hana', snapchat: 'hana.exe', reddit: 'hanaexe', facebook: 'hana' },
  });
  const joon = store.addCharacter({
    name: 'Joon',
    emoji: '',
    color: '#60a5fa',
    bio: 'the one we’re surprising',
    handles: { instagram: 'joon.moon', x: 'joonmoon', tiktok: 'joon.moon', whatsapp: 'joon', telegram: 'joon', snapchat: 'joon.moon', reddit: 'joonmoon', facebook: 'joon' },
  });
  const sam = store.addCharacter({
    name: 'Sam',
    emoji: '🎧',
    color: '#34d399',
    bio: 'supplies the music',
    handles: { instagram: 'sam.wav', x: 'samwav', tiktok: 'sam.wav', whatsapp: 'sam', telegram: 'sam', snapchat: 'sam.wav', reddit: 'samwav', facebook: 'sam' },
  });
  store.addProject({
    title: 'Group Chat Chaos',
    description: 'The surprise party plan, from first spark to total group chat collapse.',
    tags: ['friends', 'party', 'humor'],
    moments: [
      m(
        'imessage',
        'the plan is hatched',
        'Day 1 · 18:22',
        {
          kind: 'chat',
          title: 'THE MISSION 🎂',
          members: [hana.id, joon.id, sam.id],
          group: true,
          subtitle: 'You, Hana, Joon, Sam',
          time: '18:22',
          messages: [
            { id: uid(), sender: 'me', text: 'so. who’s turning 22 next week', time: '18:20', status: 'read' },
            { id: uid(), sender: hana.id, text: 'JOON. we are doing a thing.', time: '18:21' },
            { id: uid(), sender: sam.id, text: 'I’ll handle the playlist. no talking', time: '18:22' },
            { id: uid(), sender: joon.id, text: 'why is this group chat suddenly so loud', time: '18:23' },
            { id: uid(), sender: hana.id, text: 'NOTHING 🤫', time: '18:23', reaction: '🤫' },
          ],
        },
        'The victim is IN the group chat. Do not change this. This is the genre.'
      ),
      m(
        'ig_feed',
        'the decoy post',
        'Day 2 · 12:05',
        {
          kind: 'ig_feed',
          author: joon.id,
          image: '',
          caption: 'just a chill week ahead ✌️ (there is no party, don’t believe anything)',
          location: 'Downtown',
          song: '',
          likes: 3841,
          timeLabel: '5 hours ago',
          comments: [
            { id: uid(), author: hana.id, text: 'chillllll 💀' },
            { id: uid(), author: sam.id, text: '“there is no party” this is the post that started the war' },
          ],
          viewAllLabel: 'View all 214 comments',
        }
      ),
      m(
        'ig_reel',
        'the countdown reel',
        'Day 2 · 19:48',
        {
          kind: 'ig_reel',
          author: hana.id,
          image: '',
          caption: '3 days until the biggest surprise in our group chat history. Joon if you’re watching: we see you. 💀',
          song: 'Countdown - Original Audio',
          likes: 18200,
          comments: 934,
          following: true,
        }
      ),
      m(
        'whatsapp',
        'the day-of panic',
        'Day 3 · 17:55',
        {
          kind: 'chat',
          title: 'THE MISSION 🎂 (wa)',
          members: [hana.id, sam.id],
          group: true,
          subtitle: '3 in thread',
          time: '17:55',
          messages: [
            { id: uid(), sender: hana.id, text: 'HE ASKED WHY THE DOORS ARE BLACKED OUT', time: '17:52' },
            { id: uid(), sender: 'me', text: '“there was a leak on the ceiling”', time: '17:53', status: 'read' },
            { id: uid(), sender: sam.id, text: 'the playlist is loaded. I am shaking', time: '17:54' },
            { id: uid(), sender: hana.id, text: 'he’s in 10 minutes. FINAL REHEARSAL GO', time: '17:55' },
            { id: uid(), sender: 'me', voice: 8, time: '17:55', status: 'read' },
          ],
        }
      ),
      m(
        'facebook',
        'the aftermath',
        'Day 3 · 22:10',
        {
          kind: 'facebook',
          author: joon.id,
          text: 'I thought I knew this group. I was wrong. thank you all — I’m never living this down 😭🎂',
          image: '',
          timeAgo: '3h',
          privacy: 'globe',
          likes: 1204,
          comments: 48,
          shares: 12,
          reactions: [
            { emoji: '👍', count: 800 },
            { emoji: '❤️', count: 310 },
            { emoji: '😂', count: 96 },
          ],
          commentList: [
            { id: uid(), author: hana.id, text: 'we’ll see you next year 🤫', timeAgo: '2h' },
            { id: uid(), author: sam.id, text: 'the playlist was worth it', timeAgo: '1h' },
          ],
          showComments: true,
        }
      ),
    ],
  });
}
