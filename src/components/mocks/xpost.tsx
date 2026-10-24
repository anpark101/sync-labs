import React from 'react';
import type { Character, XConfig, XItem } from '../../types';
import { fmtNum } from '../../util';
import { VerifiedBadge } from '../icons';

type C = (id: string) => Character | undefined;

function handleOf(char: Character | undefined) {
  return (char?.handles?.x as string) || char?.name?.toLowerCase()?.replace(/\s+/g, '') || 'user';
}

function XAvatar({ char, size = 42 }: { char?: Character; size?: number }) {
  return (
    <span className="x-av" style={{ width: size, height: size, background: char?.avatar ? 'transparent' : char?.color || '#555' }}>
      {char?.avatar ? (
        <img src={char.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <span style={{ fontSize: size * 0.48, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{char?.emoji || char?.name?.[0]?.toUpperCase() || '?'}</span>
      )}
    </span>
  );
}

function XItemCard({ item, mainAuthor, char, isLast }: { item: XItem; mainAuthor: string; char: C; isLast: boolean }) {
  const authorId = item.author === 'self' ? mainAuthor : item.author;
  const author = char(authorId);
  const dark = true; // theme handled by parent class
  return (
    <div className={'x-item' + (isLast ? '' : ' not-last')}>
      <XAvatar char={author} />
      <div className="x-main">
        <div className="x-headline">
          <span className="x-name">{author?.name || 'Unknown'}</span>
          {author?.verified ? <VerifiedBadge size={15} color="#1D9BF0" /> : null}
          <span className="x-handle">@{handleOf(author)} · {item.time}{item.date ? ' · ' + item.date : ''}</span>
        </div>
        {item.text ? <div className="x-text">{item.text}</div> : null}
        {item.image ? <div className="x-img"><img src={item.image} alt="" /></div> : null}
        <div className="x-actions">
          <span className="x-act">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1L3 20l1.1-4.3a8.4 8.4 0 0 1-1.1-4.2A8.5 8.5 0 0 1 11.5 3 8.5 8.5 0 0 1 21 11.5Z" /></svg>
            <span>{fmtNum(item.reply)}</span>
          </span>
          <span className={'x-act' + (item.reposted ? ' green' : '')}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2.5 21 6.5l-4 4" /><path d="M21 6.5H8a4 4 0 0 0-4 4V13" /><path d="M7 21.5 3 17.5l4-4" /><path d="M3 17.5h13a4 4 0 0 0 4-4V11" /></svg>
            <span>{fmtNum(item.repost)}</span>
          </span>
          <span className={'x-act' + (item.liked ? ' pink' : '')}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill={item.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"><path d="M12 20.5s-7.5-4.7-9.3-9A5.2 5.2 0 0 1 12 6.5a5.2 5.2 0 0 1 9.3 5c-1.8 4.3-9.3 9-9.3 9Z" /></svg>
            <span>{fmtNum(item.like)}</span>
          </span>
          <span className="x-act">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M4 18h3v4H4v-4Zm5.5-6h3v10h-3V12Zm5.5-8h3v18h-3V4Z" /></svg>
            <span>{fmtNum(item.view)}</span>
          </span>
          <span className="x-spacer" />
          <span className="x-bookmark">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1Z" /></svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export function XMock({ cfg, char }: { cfg: XConfig; char: C }) {
  const dark = cfg.theme === 'dark';
  return (
    <div className={'x-card' + (dark ? ' dark' : '')}>
      {cfg.items.map((item, i) => (
        <XItemCard key={item.id} item={item} mainAuthor={cfg.author} char={char} isLast={i === cfg.items.length - 1} />
      ))}
    </div>
  );
}
