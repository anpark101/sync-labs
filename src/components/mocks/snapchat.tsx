import React from 'react';
import type { Character, SnapConfig } from '../../types';
import { PhoneFrame } from './PhoneFrame';
import { ChatRenderer, THEMES } from './ChatRenderer';

type C = (id: string) => Character | undefined;

function handleOf(char: Character | undefined, key: keyof Character['handles']) {
  return (char?.handles?.[key] as string) || char?.name?.toLowerCase()?.replace(/\s+/g, '') || 'user';
}

const SC_AV = ({ char, size = 34 }: { char?: Character; size?: number }) => (
  <span className="sc-av" style={{ width: size, height: size, background: char?.avatar ? 'transparent' : char?.color || '#555' }}>
    {char?.avatar ? (
      <img src={char.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    ) : (
      <span style={{ fontSize: size * 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{char?.emoji || '?'}</span>
    )}
  </span>
);

function Doodle({ kind, color = '#FFFC00' }: { kind: string; color?: string }) {
  const s = { fill: 'none', stroke: color, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (kind) {
    case 'heart':
      return (
        <svg className="sc-doodle" viewBox="0 0 120 110" {...s}>
          <path d="M60 95C40 78 12 60 14 36c1.5-16 16-25 28-20 8 3 14 9 18 16 4-7 10-13 18-16 12-5 26.5 4 28 20 2 24-26 42-46 59Z" />
        </svg>
      );
    case 'star':
      return (
        <svg className="sc-doodle" viewBox="0 0 120 120" {...s}>
          <path d="M60 12l13 30 33 4-24 23 6 33-28-16-28 16 6-33-24-23 33-4Z" />
        </svg>
      );
    case 'lightning':
      return (
        <svg className="sc-doodle" viewBox="0 0 100 130" {...s}>
          <path d="M58 6 20 72h26L38 124l52-74H60L78 6Z" />
        </svg>
      );
    case 'smile':
      return (
        <svg className="sc-doodle" viewBox="0 0 120 120" {...s}>
          <circle cx="60" cy="60" r="46" />
          <path d="M40 68c6 10 34 10 40 0" />
          <circle cx="44" cy="46" r="3.5" fill={color} stroke="none" />
          <circle cx="76" cy="46" r="3.5" fill={color} stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

export function SnapchatMock({ cfg, char }: { cfg: SnapConfig; char: C }) {
  if (cfg.mode === 'snap') {
    const contact = char(cfg.members[0] || '');
    return (
      <PhoneFrame time={cfg.time} statusDark wallpaper={cfg.snapImage || undefined} bg="#111">
        {!cfg.snapImage ? <div className="sc-media-ph" /> : null}
        <div className="sc-snap-top">
          <span className="sc-progress"><span style={{ width: '34%' }} /></span>
          <div className="sc-snap-userrow">
            {contact ? <SC_AV char={contact} size={34} /> : <span className="sc-av" style={{ width: 34, height: 34, background: '#333' }}>👻</span>}
            <span className="sc-snap-name">{cfg.snapName || contact?.name || 'Snap'}</span>
            <span className="sc-snap-ago">{cfg.snapAgo}</span>
            <span className="sc-send">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFC00"><path d="M21 3 3 10.5l7 3.5 2 7.5 3-5 5-3.5L21 3Zm-8.5 8.5L6.5 9l11-4-6 8Z" /></svg>
            </span>
          </div>
        </div>
        {cfg.snapText ? <div className="sc-snap-text">{cfg.snapText}</div> : null}
        <Doodle kind={cfg.doodle} />
      </PhoneFrame>
    );
  }
  const contact = char(cfg.members[0] || '');
  return (
    <PhoneFrame time={cfg.time} bg="#fff">
      <div className="sc-chat-head">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        {contact ? <SC_AV char={contact} /> : <span className="sc-av" style={{ width: 34, height: 34, background: '#333' }}>👻</span>}
        <div className="sc-chat-titles">
          <div className="sc-chat-name">{cfg.title || contact?.name || handleOf(contact, 'snapchat')}</div>
          <div className="sc-chat-sub">{cfg.subtitle}</div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8"><path d="M4 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" /><path d="M18.5 10.5 21 9v6l-2.5-1.5" /></svg>
      </div>
      <div className="sc-chat-body">
        <ChatRenderer cfg={cfg} theme={THEMES.snapchat} char={char} showTimeBlocks={false} />
      </div>
      <div className="sc-chat-inputbar">
        <span className="sc-snap-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 4.8c1.7 0 3.2 1.4 3.3 3.2l.1 1.2c0 .3.3.4.5.4l.9-.3c.3-.1.6.1.5.4 0 .2-.1.3-.3.4-.4.2-.8.4-1.1.6-.1.1-.1.3 0 .4.6.6 1.4 1 2.3 1.1.3 0 .4.3.2.5-.3.6-1 1-1.6 1.2 0 .3-.2.4-.4.4h-.4c-.3 0-.4.1-.5.3l-.4 1c-.1.3-.3.4-.5.4h-.9c-.2 0-.3.1-.4.3l-.1.3c-.1.3-.3.4-.5.4h-.7c-.3 0-.4-.1-.5-.3l-.3-.5c-.1-.2-.3-.3-.5-.3h-.8c-.2 0-.3.1-.4.3l-.3.5c-.1.2-.3.3-.5.3h-.7c-.2 0-.4-.1-.5-.4l-.1-.3c0-.2-.2-.3-.4-.3h-.5c-.2 0-.4-.1-.4-.4-.6-.2-1.3-.6-1.6-1.2-.2-.2-.1-.5.2-.5.9-.1 1.7-.5 2.3-1.1.1-.1.1-.3 0-.4-.3-.2-.7-.4-1.1-.6-.2-.1-.3-.2-.3-.4 0-.3.3-.5.5-.4l.9.3c.3.1.5 0 .5-.4l.1-1.2C8.8 6.2 10.3 4.8 12 4.8Z" />
          </svg>
        </span>
        <span className="sc-chat-field"><span className="sc-chat-ph">Chat</span></span>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="#111"><path d="M4 7h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Zm8 1.5A4.5 4.5 0 0 0 7.5 13 4.5 4.5 0 0 0 12 17.5 4.5 4.5 0 0 0 16.5 13 4.5 4.5 0 0 0 12 8.5Z" fillRule="evenodd" /></svg>
      </div>
    </PhoneFrame>
  );
}
