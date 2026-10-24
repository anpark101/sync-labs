import React from 'react';
import type { ChatConfig, Character } from '../../types';
import { PhoneFrame } from './PhoneFrame';
import { ChatRenderer, THEMES } from './ChatRenderer';

const TG_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cg fill='%23a8c4dd' fill-opacity='0.16'%3E%3Cpath d='M25 20l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z'/%3E%3Ccircle cx='105' cy='35' r='3.4'/%3E%3Cpath d='M115 90l1.6 3.4 3.7.5-2.7 2.6.6 3.7-3.2-1.8-3.2 1.8.6-3.7-2.7-2.6 3.7-.5z'/%3E%3Ccircle cx='40' cy='100' r='3'/%3E%3Cpath d='M70 55l1.4 3 3.3.5-2.4 2.3.6 3.3-2.9-1.6-2.9 1.6.6-3.3-2.4-2.3 3.3-.5z'/%3E%3Cpath d='M20 60l1.8 3.8 4 .6-2.9 2.9.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.9 4-.6z'/%3E%3C/g%3E%3C/svg%3E\")";

export function TelegramMock({ cfg, char }: { cfg: ChatConfig; char: (id: string) => Character | undefined }) {
  const main = cfg.members[0] ? char(cfg.members[0]) : undefined;
  return (
    <PhoneFrame time={cfg.time} bg="#FFFFFF">
      <div className="tg-head">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        <span className="tg-av">
          {main?.avatar ? <img src={main.avatar} alt="" /> : <span style={{ background: main?.color || '#74b3f0', color: '#fff', fontSize: 14 }}>{main?.emoji || main?.name?.[0]?.toUpperCase() || '?'}</span>}
        </span>
        <div className="tg-titles">
          <div className="tg-name">{cfg.title || main?.name || 'Telegram'}</div>
          <div className={'tg-sub' + (/online/i.test(cfg.subtitle) ? ' online' : '')}>{cfg.subtitle}</div>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F1620" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" /></svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#0F1620"><circle cx="12" cy="5" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="12" cy="19" r="1.7" /></svg>
      </div>
      <div className="tg-body" style={{ backgroundImage: TG_PATTERN }}>
        <ChatRenderer cfg={cfg} theme={THEMES.telegram} char={char} showTimeBlocks={false} />
      </div>
      <div className="tg-inputbar">
        <span className="tg-inputfield">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7D8B99" strokeWidth="1.8" strokeLinecap="round"><path d="M21 12l-8.5 8.5a5 5 0 0 1-7-7L14 5a3.3 3.3 0 0 1 4.7 4.7L10 18.5" /></svg>
          <span className="tg-ph">Message</span>
        </span>
        <span className="tg-mic">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3390EC" strokeWidth="2" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
        </span>
      </div>
    </PhoneFrame>
  );
}
