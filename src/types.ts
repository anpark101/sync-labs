export type PlatformId =
  | 'imessage'
  | 'whatsapp'
  | 'telegram'
  | 'ig_feed'
  | 'ig_story'
  | 'ig_dm'
  | 'ig_reel'
  | 'x'
  | 'tiktok'
  | 'snapchat'
  | 'reddit'
  | 'facebook'
  | 'lockscreen';

export interface PlatformMeta {
  id: PlatformId;
  name: string;
  short: string;
  group: 'Chats' | 'Social' | 'Screens';
}

export const PLATFORMS: PlatformMeta[] = [
  { id: 'imessage', name: 'iMessage', short: 'SMS', group: 'Chats' },
  { id: 'whatsapp', name: 'WhatsApp', short: 'WA', group: 'Chats' },
  { id: 'telegram', name: 'Telegram', short: 'TG', group: 'Chats' },
  { id: 'snapchat', name: 'Snapchat', short: 'SC', group: 'Chats' },
  { id: 'ig_dm', name: 'Instagram DM', short: 'IG DM', group: 'Chats' },
  { id: 'ig_feed', name: 'Instagram Post', short: 'IG', group: 'Social' },
  { id: 'ig_story', name: 'Instagram Story', short: 'IG S', group: 'Social' },
  { id: 'ig_reel', name: 'Instagram Reel', short: 'IG R', group: 'Social' },
  { id: 'x', name: 'X (Twitter)', short: '𝕏', group: 'Social' },
  { id: 'tiktok', name: 'TikTok', short: 'TT', group: 'Social' },
  { id: 'reddit', name: 'Reddit', short: 'RD', group: 'Social' },
  { id: 'facebook', name: 'Facebook', short: 'FB', group: 'Social' },
  { id: 'lockscreen', name: 'Lock Screen', short: '🔒', group: 'Screens' },
];

export const platformMeta = (id: PlatformId): PlatformMeta =>
  PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0];

export type HandleKey =
  | 'instagram'
  | 'x'
  | 'tiktok'
  | 'whatsapp'
  | 'telegram'
  | 'snapchat'
  | 'reddit'
  | 'facebook';

export interface Character {
  id: string;
  name: string;
  emoji: string;
  avatar?: string; // dataURL
  color: string;
  handles: Partial<Record<HandleKey, string>>;
  bio?: string;
  verified?: boolean;
  updatedAt: number;
}

export interface StoryMessage {
  id: string;
  sender: string; // character id or 'me'
  text?: string;
  image?: string;
  voice?: number; // seconds
  time: string; // "10:42"
  reaction?: string; // tapback / reaction emoji or "LOVE"
  status?: 'sent' | 'delivered' | 'read';
  quote?: string; // quoted/replied text
}

export interface ChatConfig {
  kind: 'chat';
  title: string; // contact or group name
  members: string[]; // character ids (first = primary contact / "me" side handled via sender 'me')
  group: boolean;
  subtitle: string; // "online" / "last seen..." / "Active now"
  messages: StoryMessage[];
  time: string; // status bar time
}

export interface FeedPostConfig {
  kind: 'ig_feed';
  author: string;
  image?: string;
  caption: string;
  location?: string;
  song?: string;
  likes: number;
  timeLabel: string; // "2 HOURS AGO"
  comments: { id: string; author: string; text: string }[];
  viewAllLabel: string; // "View all 32 comments"
}

export interface StoryConfig {
  kind: 'ig_story';
  author: string;
  image: string;
  time: string; // "10:42"
  ago: string; // "2h"
  ring: boolean; // unread story ring
}

export interface IgDmConfig {
  kind: 'ig_dm';
  title: string; // chat name
  members: string[];
  group: boolean;
  active: boolean; // show "Active now"
  messages: StoryMessage[];
  time: string;
}

export interface ReelConfig {
  kind: 'ig_reel';
  author: string;
  image: string;
  caption: string;
  song: string;
  likes: number;
  comments: number;
  following: boolean;
}

export interface XItem {
  id: string;
  author: string; // character id, 'self' = same as main author
  text: string;
  image?: string;
  time: string;
  date: string;
  reply: number;
  repost: number;
  like: number;
  view: number;
  liked?: boolean;
  reposted?: boolean;
}

export interface XConfig {
  kind: 'x';
  author: string;
  theme: 'light' | 'dark';
  items: XItem[];
}

export interface TikTokConfig {
  kind: 'tiktok';
  author: string;
  image: string;
  caption: string;
  song: string;
  likes: number;
  commentCount: number;
  shares: number;
  saves: number;
  showComments: boolean;
  comments: { id: string; author: string; text: string; likes: number }[];
}

export interface SnapConfig {
  kind: 'snapchat';
  mode: 'chat' | 'snap';
  // chat
  title: string;
  members: string[];
  subtitle: string; // "Opened" / "Active now"
  messages: StoryMessage[];
  time: string;
  // snap
  snapImage: string;
  snapName: string; // "You & Joon"
  snapText: string;
  doodle: 'none' | 'heart' | 'star' | 'lightning' | 'smile';
  snapAgo: string; // "1d"
}

export interface RedditComment {
  id: string;
  author: string;
  text: string;
  score: number;
  isOP: boolean;
  timeAgo: string;
}

export interface RedditConfig {
  kind: 'reddit';
  sub: string;
  author: string;
  flair: string;
  title: string;
  body: string;
  image?: string;
  score: number;
  commentCount: number;
  timeAgo: string;
  comments: RedditComment[];
}

export interface FacebookComment {
  id: string;
  author: string;
  text: string;
  timeAgo: string;
}

export interface FacebookConfig {
  kind: 'facebook';
  author: string;
  text: string;
  image?: string;
  timeAgo: string;
  privacy: 'globe' | 'friends';
  likes: number;
  comments: number;
  shares: number;
  reactions: { emoji: string; count: number }[];
  commentList: FacebookComment[];
  showComments: boolean;
}

export type NotifApp =
  | 'messages'
  | 'instagram'
  | 'x'
  | 'tiktok'
  | 'whatsapp'
  | 'snapchat'
  | 'facebook'
  | 'telegram'
  | 'phone'
  | 'mail';

export interface Notif {
  id: string;
  app: NotifApp;
  name: string;
  body: string;
  time: string; // "now" / "2m"
}

export interface LockscreenConfig {
  kind: 'lockscreen';
  wallpaper?: string;
  time: string;
  date: string; // "Friday, March 24"
  notifications: Notif[];
}

export type MomentConfig =
  | ChatConfig
  | FeedPostConfig
  | StoryConfig
  | IgDmConfig
  | ReelConfig
  | XConfig
  | TikTokConfig
  | SnapConfig
  | RedditConfig
  | FacebookConfig
  | LockscreenConfig;

export interface Moment {
  id: string;
  platform: PlatformId;
  title: string;
  storyTime: string; // in-story marker, e.g. "Day 1 · 21:44"
  notes: string;
  config: MomentConfig;
  updatedAt: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  cover?: string;
  tags: string[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
  moments: Moment[];
}

export interface AppState {
  v: 1;
  updatedAt: number;
  projects: Project[];
  characters: Character[];
}

export type SyncStatus = 'loading' | 'local' | 'syncing' | 'cloud' | 'offline';
