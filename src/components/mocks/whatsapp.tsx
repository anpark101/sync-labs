import React from 'react';
import type { ChatConfig, Character } from '../../types';
import { PhoneFrame } from './PhoneFrame';
import { ChatRenderer, THEMES } from './ChatRenderer';

const WA_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='%23d5cabb' fill-opacity='0.35'%3E%3Cpath d='M20 18l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z'/%3E%3Ccircle cx='78' cy='30' r='4'/%3E%3Cpath d='M95 70c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7Zm-2 3v10h4v-4h-3v-3h3v-3h-4Z'/%3E%3Cpath d='M35 78l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z'/%3E%3Ccircle cx='15' cy='100' r='3'/%3E%3Cpath d='M100 100l2 4 4 .6-3 3 .7 4.2-3.7-2-3.7 2 .7-4.2-3-3 4-.6z'/%3E%3Cpath d='M60 55l1.5 3.5 3.5.5-2.5 2.4.6 3.6-3.1-1.7-3.1 1.7.6-3.6-2.5-2.4 3.5-.5z'/%3E%3C/g%3E%3C/svg%3E\")";

export function WhatsAppMock({ cfg, char }: { cfg: ChatConfig; char: (id: string) => Character | undefined }) {
  const main = cfg.members[0] ? char(cfg.members[0]) : undefined;
  return (
    <PhoneFrame time={cfg.time} bg="#ECE5DD">
      <div className="wa-head">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111B21" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        <span className="wa-av">
          {main?.avatar ? <img src={main.avatar} alt="" /> : <span style={{ background: main?.color || '#8696A0', color: '#fff', fontSize: 14 }}>{main?.emoji || main?.name?.[0]?.toUpperCase() || '?'}</span>}
        </span>
        <div className="wa-titles">
          <div className="wa-name">{cfg.title || main?.name || 'WhatsApp'}</div>
          <div className="wa-sub">{cfg.subtitle}</div>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#54656F"><path d="M4 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm10.5 5.5L18.6 10a1 1 0 0 1 1.4.9v2.2a1 1 0 0 1-1.4.9l-4.1-2.5Z" /></svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#54656F"><path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z" /></svg>
      </div>
      <div className="wa-body" style={{ backgroundImage: WA_PATTERN }}>
        <div className="wa-datechip">TODAY</div>
        <ChatRenderer cfg={cfg} theme={{ ...THEMES.whatsapp, groupNames: cfg.group }} char={char} showTimeBlocks={false} />
      </div>
      <div className="wa-inputbar">
        <span className="wa-inputfield">
          <span className="wa-emoji">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656F" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8" strokeLinecap="round" /><circle cx="9" cy="9.5" r="1" fill="#54656F" stroke="none" /><circle cx="15" cy="9.5" r="1" fill="#54656F" stroke="none" /></svg>
          </span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656F" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
        <span className="wa-mic">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>
        </span>
      </div>
    </PhoneFrame>
  );
}
