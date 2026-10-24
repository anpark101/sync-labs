import React from 'react';
import type { Character, StoryMessage } from '../../types';
import { seeded } from '../../util';

export interface ChatTheme {
  in: string;
  inText: string;
  out: string;
  outText: string;
  inTime: string;
  outTime: string;
  /** whatsapp/telegram style double checks */
  checks?: boolean;
  /** checks color when read (else gray) */
  checkRead?: string;
  /** iMessage style "Read" / "Delivered" receipt under last outgoing */
  receipts?: boolean;
  /** show in-bubble timestamp (WA / IG DM / snap) */
  timeInBubble?: boolean;
  /** tapback pill above bubble (iMessage) vs corner reaction (others) */
  reactionStyle?: 'tapback' | 'corner';
  /** group chats: show sender name above bubbles */
  groupNames?: boolean;
}

export const THEMES: Record<string, ChatTheme> = {
  imessage: {
    in: '#E9E9EB', inText: '#000', out: '#0A84FF', outText: '#fff',
    inTime: '#8E8E93', outTime: '#8E8E93', receipts: true, reactionStyle: 'tapback',
  },
  whatsapp: {
    in: '#FFFFFF', inText: '#111B21', out: '#D9FDD3', outText: '#111B21',
    inTime: '#667781', outTime: '#57737B', checks: true, checkRead: '#53BDEB', timeInBubble: true, reactionStyle: 'corner',
  },
  telegram: {
    in: '#FFFFFF', inText: '#000', out: '#E3F2FD', outText: '#000',
    inTime: '#9AA5B1', outTime: '#7B8794', checks: true, checkRead: '#3390EC', timeInBubble: true, reactionStyle: 'corner',
  },
  snapchat: {
    in: '#F1F2F4', inText: '#111', out: '#3EB6F0', outText: '#fff',
    inTime: '#9AA0A6', outTime: 'rgba(255,255,255,.75)', timeInBubble: true, reactionStyle: 'corner',
  },
  igdm: {
    in: '#EFEFF1', inText: '#0f0f0f', out: '#3797EF', outText: '#fff',
    inTime: '#8e8e8e', outTime: 'rgba(255,255,255,.75)', timeInBubble: true, reactionStyle: 'corner',
  },
};

function t12(t: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t || '');
  if (!m) return t || '';
  let h = parseInt(m[1], 10) % 24;
  const min = m[2];
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${min} ${ap}`;
}

function timeOf(t: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t || '');
  if (!m) return 0;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function VoiceNote({ out, seed, dur, color }: { out: boolean; seed: string; dur: number; color: string }) {
  const bars = 26;
  return (
    <span className="chat-voice">
      <span className={'chat-voice-play' + (out ? ' out' : '')}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill={out ? '#fff' : '#000'}>
          <path d="M3 1.8v8.4c0 .5.55.8.98.55l6.4-4.2a.65.65 0 0 0 0-1.1L3.98 1.25a.65.65 0 0 0-.98.55Z" transform={out ? 'translate(0,0)' : 'translate(0,0)'} />
        </svg>
      </span>
      <span className="chat-voice-bars">
        {Array.from({ length: bars }).map((_, i) => {
          const h = 3 + seeded(seed, i) * 10;
          return <i key={i} style={{ height: h }} />;
        })}
      </span>
      <span className="chat-voice-dur" style={{ color }}>
        {`0:${String(Math.round(dur)).padStart(2, '0')}`}
      </span>
    </span>
  );
}

function Checks({ status, theme }: { status?: string; theme: ChatTheme }) {
  const read = status === 'read';
  const c = read && theme.checkRead ? theme.checkRead : undefined;
  return (
    <span className="chat-checks" style={{ color: c || undefined }}>
      {status === 'sent' ? (
        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l2.5 2.5L10 3" /></svg>
      ) : status ? (
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 6l2.5 2.5L9.5 3" /><path d="M7 6.5l1.7 2L15.5 3" /></svg>
      ) : null}
    </span>
  );
}

export function ChatRenderer({
  cfg,
  theme,
  char,
  showTimeBlocks = true,
}: {
  cfg: { messages: StoryMessage[] };
  theme: ChatTheme;
  char: (id: string) => Character | undefined;
  showTimeBlocks?: boolean;
}) {
  const msgs = cfg.messages;
  let prevTime = -999;
  let prevSender = '';
  return (
    <div className="chat-list">
      {msgs.map((m, i) => {
        const out = m.sender === 'me';
        const ch = out ? undefined : char(m.sender);
        const name = out ? 'You' : ch?.name || 'Unknown';
        const t = timeOf(m.time);
        const prev = i > 0 ? msgs[i - 1] : undefined;
        const firstOfRun = !prev || prev.sender !== m.sender || t - timeOf(prev.time) > 45;
        const showBlock = showTimeBlocks && (i === 0 || t - prevTime > 25);
        prevTime = t;
        prevSender = m.sender;
        return (
          <React.Fragment key={m.id}>
            {showBlock && (
              <div className="chat-timeblock">{t12(m.time)}</div>
            )}
            <div className={'chat-rowcol' + (out ? ' out' : '')}>
              {theme.groupNames && !out && firstOfRun ? (
                <div className="chat-gname" style={{ color: groupColor(m.sender) }}>{name}</div>
              ) : null}
              <div className={'chat-row' + (out ? ' out' : '')}>
              {theme.reactionStyle === 'tapback' && m.reaction ? (
                <div className="chat-tapback-wrap">
                  <span className={'chat-tapback' + (isTextReaction(m.reaction) ? ' text' : '')}>
                    {m.reaction}
                  </span>
                </div>
              ) : null}
              <div
                className={'chat-bubble' + (out ? ' out' : '') + (firstOfRun ? ' run-start' : '')}
                style={{ background: out ? theme.out : theme.in, color: out ? theme.outText : theme.inText }}
              >
                {m.quote ? (
                  <div className="chat-quote" style={{ borderColor: out ? 'rgba(255,255,255,.4)' : '#D1D7DB' }}>
                    <div className="chat-quote-name" style={{ color: out ? 'rgba(255,255,255,.75)' : '#667781' }}>{name}</div>
                    <div className="chat-quote-text">{m.quote}</div>
                  </div>
                ) : null}
                {m.image ? (
                  <img className="chat-img" src={m.image} alt="" />
                ) : null}
                {m.voice ? (
                  <VoiceNote out={out} seed={m.id} dur={m.voice} color={out ? 'rgba(255,255,255,.9)' : '#8E8E93'} />
                ) : null}
                {m.text ? <span className="chat-text" style={{ whiteSpace: 'pre-wrap' }}>{m.text}</span> : null}
                {theme.timeInBubble ? (
                  <span className="chat-bubble-meta" style={{ color: out ? theme.outTime : theme.inTime }}>
                    {t12(m.time)}
                    {out && theme.checks ? <Checks status={m.status || 'read'} theme={theme} /> : null}
                  </span>
                ) : null}
                {theme.reactionStyle === 'corner' && m.reaction ? (
                  <span className="chat-corner-react">{m.reaction}</span>
                ) : null}
              </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {theme.receipts && <ReceiptLine msgs={msgs} />}
    </div>
  );
}

function isTextReaction(r: string) {
  return /^(LOVE|LIKE|LAUGH|THANKS|DISLIKE)$/i.test(r.trim());
}

const GROUP_COLORS = ['#e91e63', '#3f51b5', '#009688', '#ff5722', '#607d8b', '#795548', '#673ab7', '#43a047'];
function groupColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 31) % 997;
  return GROUP_COLORS[h % GROUP_COLORS.length];
}

function ReceiptLine({ msgs }: { msgs: StoryMessage[] }) {
  const last = [...msgs].reverse().find((m) => m.sender === 'me');
  if (!last) return null;
  const label = last.status === 'read' ? `Read ${t12(last.time)}` : last.status === 'delivered' ? 'Delivered' : null;
  if (!label) return null;
  return <div className="chat-receipt">{label}</div>;
}

export { t12 };
