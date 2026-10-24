import React from 'react';
import type { Character, FeedPostConfig, StoryConfig, IgDmConfig, ReelConfig } from '../../types';
import { fmtCount, fmtNum } from '../../util';
import { PhoneFrame } from './PhoneFrame';
import { ChatRenderer, THEMES } from './ChatRenderer';

type C = (id: string) => Character | undefined;

function IGAvatar({ char, size, ring }: { char?: Character; size: number; ring?: boolean }) {
  return (
    <span
      style={{
        width: size + (ring ? 4 : 0),
        height: size + (ring ? 4 : 0),
        borderRadius: '50%',
        flexShrink: 0,
        ...(ring
          ? {
              padding: 2,
              background: 'conic-gradient(#f9ce34, #ee2a7b, #6228d7, #f9ce34)',
            }
          : {}),
      }}
    >
      <span style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', display: 'block', background: char?.avatar ? 'transparent' : char?.color || '#555' }}>
        {char?.avatar ? (
          <img src={char.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <span style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, color: '#fff' }}>{char?.emoji || char?.name?.[0]?.toUpperCase() || '?'}</span>
        )}
      </span>
    </span>
  );
}

const handle = (char: Character | undefined, key: keyof Character['handles']) =>
  (char?.handles?.[key] as string) || char?.name?.toLowerCase()?.replace(/\s+/g, '_') || 'user';

// ---------------- Feed post (card) ----------------
export function IgFeedMock({ cfg, char }: { cfg: FeedPostConfig; char: C }) {
  const author = char(cfg.author);
  const h = handle(author, 'instagram');
  return (
    <div className="ig-card ig-feed">
      <div className="ig-feed-head">
        <IGAvatar char={author} size={34} ring />
        <div className="ig-feed-names">
          <div className="ig-feed-user">@{h}</div>
          {cfg.location ? <div className="ig-feed-loc">{cfg.location}</div> : null}
        </div>
        <span className="ig-more">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f0f0f"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
        </span>
      </div>
      <div className="ig-media">
        {cfg.image ? <img src={cfg.image} alt="" /> : <div className="ig-media-ph" />}
        {cfg.song ? (
          <div className="ig-song">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M9 18V5l12-2v13" fill="none" stroke="#fff" strokeWidth="2" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
            {cfg.song}
          </div>
        ) : null}
      </div>
      <div className="ig-actions">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="1.8"><path d="M12 20.5s-7.5-4.7-9.3-9A5.2 5.2 0 0 1 12 6.5a5.2 5.2 0 0 1 9.3 5c-1.8 4.3-9.3 9-9.3 9Z" /></svg>
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1L3 20l1.1-4.3a8.4 8.4 0 0 1-1.1-4.2A8.5 8.5 0 0 1 11.5 3 8.5 8.5 0 0 1 21 11.5Z" /></svg>
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="1.8" strokeLinejoin="round"><path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" /></svg>
        <span className="ig-spacer" />
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="1.8" strokeLinejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1Z" /></svg>
      </div>
      <div className="ig-likes">{fmtCount(cfg.likes)} likes</div>
      <div className="ig-caption">
        <span className="ig-cap-user">@{h}</span> {cfg.caption}
      </div>
      {cfg.viewAllLabel ? <div className="ig-viewall">{cfg.viewAllLabel}</div> : null}
      {cfg.comments.slice(0, 2).map((c) => {
        const cc = char(c.author);
        return (
          <div className="ig-comment" key={c.id}>
            <span className="ig-cap-user">@{handle(cc, 'instagram')}</span> {c.text}
          </div>
        );
      })}
      <div className="ig-time">{cfg.timeLabel.toUpperCase()}</div>
    </div>
  );
}

// ---------------- Story (phone) ----------------
export function IgStoryMock({ cfg, char }: { cfg: StoryConfig; char: C }) {
  const author = char(cfg.author);
  const h = handle(author, 'instagram');
  return (
    <PhoneFrame time={cfg.time} statusDark wallpaper={cfg.image || undefined} bg="#111">
      {!cfg.image ? <div className="ig-media-ph story-ph" /> : null}
      <div className="story-top">
        <div className="story-progress"><span style={{ width: '62%' }} /></div>
        <div className="story-userrow">
          <IGAvatar char={author} size={32} ring={cfg.ring} />
          <span className="story-username">@{h}</span>
          <span className="story-ago">{cfg.ago}</span>
          <span className="story-dots">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><circle cx="5" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="19" cy="12" r="1.7" /></svg>
          </span>
        </div>
      </div>
      <div className="story-bottom">
        <span className="story-reply"><span>Message @{h}</span></span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 20.5s-7.5-4.7-9.3-9A5.2 5.2 0 0 1 12 6.5a5.2 5.2 0 0 1 9.3 5c-1.8 4.3-9.3 9-9.3 9Z" /></svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"><path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" /></svg>
      </div>
    </PhoneFrame>
  );
}

// ---------------- DM (phone) ----------------
export function IgDmMock({ cfg, char }: { cfg: IgDmConfig; char: C }) {
  const main = cfg.members[0] ? char(cfg.members[0]) : undefined;
  const h = handle(main, 'instagram');
  return (
    <PhoneFrame time={cfg.time} bg="#fff">
      <div className="igdm-head">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        <span className="igdm-av">
          {main?.avatar ? <img src={main.avatar} alt="" /> : <span style={{ background: main?.color || '#555', color: '#fff', fontSize: 14 }}>{main?.emoji || main?.name?.[0]?.toUpperCase() || '?'}</span>}
        </span>
        <div className="igdm-titles">
          <div className="igdm-name">{cfg.group ? cfg.title : `@${h}`}</div>
          {cfg.active ? <div className="igdm-active">Active now</div> : null}
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="1.8"><path d="M4 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" /><path d="M18.5 10.5 21 9v6l-2.5-1.5" /></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="1.8"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
      </div>
      <div className="igdm-body">
        <ChatRenderer cfg={cfg} theme={THEMES.igdm} char={char} showTimeBlocks={false} />
      </div>
      <div className="igdm-inputbar">
        <span className="igdm-plus">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8e8e8e" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
        <span className="igdm-field"><span className="igdm-ph">Message...</span></span>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8e8e8e" strokeWidth="2" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
      </div>
    </PhoneFrame>
  );
}

// ---------------- Reel (phone-like full bleed) ----------------
export function IgReelMock({ cfg, char }: { cfg: ReelConfig; char: C }) {
  const author = char(cfg.author);
  const h = handle(author, 'instagram');
  return (
    <div className="ig-reel">
      <div className="ig-reel-bg">{cfg.image ? <img src={cfg.image} alt="" /> : <div className="ig-media-ph" />}</div>
      <div className="ig-reel-top">
        <span className="ig-reel-title">Reels</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M4 9l8 8 8-8" /></svg>
      </div>
      <div className="ig-reel-rail">
        <span className="ig-reel-act">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M12 20.5s-7.5-4.7-9.3-9A5.2 5.2 0 0 1 12 6.5a5.2 5.2 0 0 1 9.3 5c-1.8 4.3-9.3 9-9.3 9Z" /></svg>
          <span>{fmtNum(cfg.likes)}</span>
        </span>
        <span className="ig-reel-act">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1L3 20l1.1-4.3a8.4 8.4 0 0 1-1.1-4.2A8.5 8.5 0 0 1 11.5 3 8.5 8.5 0 0 1 21 11.5Z" /></svg>
          <span>{fmtNum(cfg.comments)}</span>
        </span>
        <span className="ig-reel-act">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round"><path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" /></svg>
          <span>{fmtNum(12)}</span>
        </span>
        <span className="ig-reel-more">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
        </span>
      </div>
      <div className="ig-reel-bottom">
        <div className="ig-reel-userrow">
          <IGAvatar char={author} size={32} />
          <span className="ig-reel-name">@{h}</span>
          <span className={'ig-reel-follow' + (cfg.following ? ' following' : '')}>{cfg.following ? 'Following' : 'Follow'}</span>
        </div>
        <div className="ig-reel-caption">
          <span className="ig-reel-capuser">@{h}</span> {cfg.caption}
        </div>
        <div className="ig-reel-song">
          <span className="ig-reel-vinyl">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
          </span>
          <span className="ig-reel-songtext">{cfg.song}</span>
        </div>
      </div>
      <div className="ig-reel-bar">
        <span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1L3 20l1.1-4.3a8.4 8.4 0 0 1-1.1-4.2A8.5 8.5 0 0 1 11.5 3 8.5 8.5 0 0 1 21 11.5Z" /></svg> Comment</span>
        <span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="1.8" strokeLinejoin="round"><path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" /></svg> Share</span>
        <span><svg width="18" height="18" viewBox="0 0 24 24" fill="#0f0f0f"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg> More</span>
      </div>
    </div>
  );
}
