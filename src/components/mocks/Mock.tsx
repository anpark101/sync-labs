import React from 'react';
import type { Character, Moment } from '../../types';
import { IMessagesMock } from './imessage';
import { WhatsAppMock } from './whatsapp';
import { TelegramMock } from './telegram';
import { IgFeedMock, IgStoryMock, IgDmMock, IgReelMock } from './instagram';
import { XMock } from './xpost';
import { TikTokMock } from './tiktok';
import { SnapchatMock } from './snapchat';
import { RedditMock } from './reddit';
import { FacebookMock } from './facebook';
import { LockscreenMock } from './lockscreen';

export function Mock({ moment, char }: { moment: Moment; char: (id: string) => Character | undefined }) {
  const cfg = moment.config as any;
  switch (moment.platform) {
    case 'imessage':
      return <IMessagesMock cfg={cfg} char={char} />;
    case 'whatsapp':
      return <WhatsAppMock cfg={cfg} char={char} />;
    case 'telegram':
      return <TelegramMock cfg={cfg} char={char} />;
    case 'ig_feed':
      return <IgFeedMock cfg={cfg} char={char} />;
    case 'ig_story':
      return <IgStoryMock cfg={cfg} char={char} />;
    case 'ig_dm':
      return <IgDmMock cfg={cfg} char={char} />;
    case 'ig_reel':
      return <IgReelMock cfg={cfg} char={char} />;
    case 'x':
      return <XMock cfg={cfg} char={char} />;
    case 'tiktok':
      return <TikTokMock cfg={cfg} char={char} />;
    case 'snapchat':
      return <SnapchatMock cfg={cfg} char={char} />;
    case 'reddit':
      return <RedditMock cfg={cfg} char={char} />;
    case 'facebook':
      return <FacebookMock cfg={cfg} char={char} />;
    case 'lockscreen':
      return <LockscreenMock cfg={cfg} char={char} />;
    default:
      return null;
  }
}
