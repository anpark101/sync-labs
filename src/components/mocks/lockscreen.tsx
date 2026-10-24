import React from 'react';
import type { Character, LockscreenConfig, NotifApp } from '../../types';
import { PhoneFrame } from './PhoneFrame';
import { IcoInstagram, IcoTikTok, IcoWhatsApp, IcoTelegram, IcoSnapchat, IcoFacebook, IcoX } from '../icons';

const APP_META: Record<NotifApp, { name: string; icon: (s: number) => React.ReactNode }> = {
  messages: {
    name: 'Messages',
    icon: (s) => (
      <span style={{ width: s, height: s, borderRadius: s * 0.24, background: 'linear-gradient(180deg,#5CF777,#0DBC2E)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width={s * 0.62} height={s * 0.62} viewBox="0 0 24 24" fill="#fff"><path d="M12 5.6c-4 0-7.2 2.6-7.2 5.9 0 1.9 1.1 3.6 2.8 4.7-.1.9-.5 1.8-1.2 2.5-.2.2 0 .5.3.4 1.4-.2 2.6-.7 3.5-1.4.9.3 1.8.4 2.8.4 4 0 7.2-2.7 7.2-6S16 5.6 12 5.6Z" /></svg>
      </span>
    ),
  },
  instagram: { name: 'Instagram', icon: (s) => <span style={{ width: s, height: s, display: 'inline-block', borderRadius: s * 0.24, overflow: 'hidden', flexShrink: 0 }}><IcoInstagram size={s} /></span> },
  x: { name: 'X', icon: (s) => <span style={{ width: s, height: s, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: s * 0.24, overflow: 'hidden', flexShrink: 0, background: '#000' }}><IcoX size={s * 0.62} color="#fff" /></span> },
  tiktok: { name: 'TikTok', icon: (s) => <span style={{ width: s, height: s, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: s * 0.24, overflow: 'hidden', flexShrink: 0, background: '#000' }}><IcoTikTok size={s * 0.62} /></span> },
  whatsapp: { name: 'WhatsApp', icon: (s) => <span style={{ width: s, height: s, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: s * 0.24, overflow: 'hidden', flexShrink: 0, background: '#fff' }}><IcoWhatsApp size={s * 0.9} /></span> },
  snapchat: { name: 'Snapchat', icon: (s) => <span style={{ width: s, height: s, display: 'inline-block', borderRadius: s * 0.24, overflow: 'hidden', flexShrink: 0 }}><IcoSnapchat size={s} /></span> },
  facebook: { name: 'Facebook', icon: (s) => <span style={{ width: s, height: s, display: 'inline-block', borderRadius: s * 0.24, overflow: 'hidden', flexShrink: 0 }}><IcoFacebook size={s} /></span> },
  telegram: { name: 'Telegram', icon: (s) => <span style={{ width: s, height: s, display: 'inline-block', borderRadius: s * 0.24, overflow: 'hidden', flexShrink: 0 }}><IcoTelegram size={s} /></span> },
  phone: {
    name: 'Phone',
    icon: (s) => (
      <span style={{ width: s, height: s, borderRadius: s * 0.24, background: 'linear-gradient(180deg,#6BE585,#28C840)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width={s * 0.55} height={s * 0.55} viewBox="0 0 24 24" fill="#fff"><path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z" /></svg>
      </span>
    ),
  },
  mail: {
    name: 'Mail',
    icon: (s) => (
      <span style={{ width: s, height: s, borderRadius: s * 0.24, background: 'linear-gradient(180deg,#43A2FF,#0A7CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>
      </span>
    ),
  },
};

const DEFAULT_WALLPAPER =
  'linear-gradient(160deg,#1b2a6b 0%,#3b2f8f 30%,#b0459c 65%,#f08a5d 100%)';

export function LockscreenMock({ cfg, char: _char }: { cfg: LockscreenConfig; char: (id: string) => Character | undefined }) {
  const wall = cfg.wallpaper ? `url(${cfg.wallpaper}) center / cover no-repeat` : DEFAULT_WALLPAPER;
  return (
    <PhoneFrame time={cfg.time} statusDark bg={wall}>
      <div className="ls-inner">
        <div className="ls-lock">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,.9)"><path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1.5Zm2 0h5V7.5a2.5 2.5 0 0 0-5 0V10Z" /></svg>
        </div>
        <div className="ls-date">{cfg.date}</div>
        <div className="ls-time">{cfg.time}</div>
        <div className="ls-notifs">
          {cfg.notifications.map((n, i) => (
            <div className={'ls-notif' + (i === 0 ? ' first' : '')} key={n.id}>
              <span className="ls-notif-icon">{APP_META[n.app].icon(36)}</span>
              <div className="ls-notif-main">
                <div className="ls-notif-row">
                  <span className="ls-notif-name">{n.name}</span>
                  <span className="ls-notif-time">{n.time}</span>
                </div>
                <div className="ls-notif-body">{n.body}</div>
              </div>
            </div>
          ))}
          {cfg.notifications.length === 0 ? <div className="ls-empty">No notifications</div> : null}
        </div>
        <div className="ls-bottom">
          <span className="ls-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round"><path d="M12 3v2M12 10a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0v-6a3 3 0 0 1 3-3Z" /><path d="M10 13h4M10 16h4" /></svg>
          </span>
          <span className="ls-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9"><path d="M4 7h4l2-2h4l2 2h4v13H4V7Z" /><circle cx="12" cy="13" r="3.5" /></svg>
          </span>
        </div>
      </div>
    </PhoneFrame>
  );
}
