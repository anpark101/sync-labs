import React from 'react';
import type { ChatConfig } from '../../types';
import { PhoneFrame } from './PhoneFrame';
import { ChatRenderer, THEMES } from './ChatRenderer';
import type { Character } from '../../types';

export function IMessagesMock({ cfg, char }: { cfg: ChatConfig; char: (id: string) => Character | undefined }) {
  const main = cfg.members[0] ? char(cfg.members[0]) : undefined;
  return (
    <PhoneFrame time={cfg.time} bg="#fff">
      <div className="im-head">
        <span className="im-back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A84FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </span>
        <div className="im-center">
          <span className="im-av">
            {main?.avatar ? <img src={main.avatar} alt="" /> : <span style={{ background: main?.color || '#B0B0B8', color: '#fff', fontSize: 16 }}>{main?.emoji || main?.name?.[0]?.toUpperCase() || '?'}</span>}
          </span>
          <span className="im-name">{cfg.group ? cfg.title : main?.name || cfg.title || 'Messages'}</span>
        </div>
        <span className="im-video">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A84FF"><path d="M4 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm10.5 5.5L18.6 10a1 1 0 0 1 1.4.9v2.2a1 1 0 0 1-1.4.9l-4.1-2.5Z" /></svg>
        </span>
      </div>
      <div className="im-body">
        <ChatRenderer cfg={cfg} theme={THEMES.imessage} char={char} />
      </div>
      <div className="im-inputbar">
        <span className="im-plus">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
        <span className="im-field"><span className="im-field-ph">iMessage</span><span className="im-mic">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0A84FF" strokeWidth="2" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
        </span></span>
      </div>
    </PhoneFrame>
  );
}
