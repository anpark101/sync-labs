import React from 'react';
import type { Character, TikTokConfig } from '../../types';
import { fmtNum } from '../../util';

type C = (id: string) => Character | undefined;

function handleOf(char: Character | undefined) {
  return (char?.handles?.tiktok as string) || char?.name?.toLowerCase()?.replace(/\s+/g, '') || 'user';
}

function TTAvatar({ char, size = 44 }: { char?: Character; size?: number }) {
  return (
    <span className="tt-av" style={{ width: size, height: size, background: char?.avatar ? 'transparent' : char?.color || '#555' }}>
      {char?.avatar ? (
        <img src={char.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <span style={{ fontSize: size * 0.45, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{char?.emoji || char?.name?.[0]?.toUpperCase() || '?'}</span>
      )}
    </span>
  );
}

export function TikTokMock({ cfg, char }: { cfg: TikTokConfig; char: C }) {
  const author = char(cfg.author);
  const h = handleOf(author);
  return (
    <div className="tt-phone">
      <div className="tt-bg">{cfg.image ? <img src={cfg.image} alt="" /> : <div className="tt-media-ph" />}</div>
      <div className="tt-top">
        <span className="tt-tab">Following</span>
        <span className="tt-tab active">For You</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" /></svg>
      </div>
      <div className="tt-rail">
        <span className="tt-avwrap">
          <TTAvatar char={author} />
          <span className="tt-plus">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>
          </span>
        </span>
        <span className="tt-act">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M12 21s-8-5-10-9.5C.5 7.5 3 4.5 6.2 4.5c2 0 3.6 1.1 4.3 2.6l1.5 2.7 1.5-2.7c.7-1.5 2.3-2.6 4.3-2.6 3.2 0 5.7 3 4.2 7-2 4.5-10 9.5-10 9.5Z" /></svg>
          <span>{fmtNum(cfg.likes)}</span>
        </span>
        <span className="tt-act">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1L3 20l1.1-4.3a8.4 8.4 0 0 1-1.1-4.2A8.5 8.5 0 0 1 11.5 3 8.5 8.5 0 0 1 21 11.5Z" /></svg>
          <span>{fmtNum(cfg.commentCount)}</span>
        </span>
        <span className="tt-act">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1Z" /></svg>
          <span>{fmtNum(cfg.saves)}</span>
        </span>
        <span className="tt-act">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round"><path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" /></svg>
          <span>{fmtNum(cfg.shares)}</span>
        </span>
        <span className="tt-vinyl">
          <span className="tt-vinyl-disc">
            {author?.avatar ? <img src={author.avatar} alt="" /> : <span style={{ background: author?.color || '#333', fontSize: 12, color: '#fff' }}>{author?.emoji || '♪'}</span>}
          </span>
        </span>
      </div>
      <div className="tt-info">
        <div className="tt-user">@{h}</div>
        <div className="tt-caption">{cfg.caption}</div>
        <div className="tt-song">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff"><path d="M9 18V5l12-2v13" fill="none" stroke="#fff" strokeWidth="2" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
          <span className="tt-songtext">{cfg.song}</span>
        </div>
      </div>
      <div className="tt-bar">
        <span className="tt-baritem">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1L3 20l1.1-4.3a8.4 8.4 0 0 1-1.1-4.2A8.5 8.5 0 0 1 11.5 3 8.5 8.5 0 0 1 21 11.5Z" /></svg>
          {fmtNum(cfg.commentCount)} comments
        </span>
        <span className="tt-baritem">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1Z" /></svg>
          {fmtNum(cfg.saves)} saves
        </span>
        <span className="tt-baritem">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><circle cx="5" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="19" cy="12" r="1.7" /></svg>
          More
        </span>
        <span className="tt-baritem">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"><path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" /></svg>
          Share
        </span>
      </div>
      {cfg.showComments ? (
        <div className="tt-comments">
          <div className="tt-comments-head">{fmtNum(cfg.commentCount)} comments</div>
          {cfg.comments.map((c) => {
            const cc = char(c.author);
            return (
              <div className="tt-comment" key={c.id}>
                <TTAvatar char={cc} size={34} />
                <div className="tt-comment-main">
                  <div className="tt-comment-user">{cc?.name || 'user'}</div>
                  <div className="tt-comment-text">{c.text}</div>
                  <div className="tt-comment-meta">
                    <span>· {cc ? `@${handleOf(cc)}` : ''}</span>
                    <span className="tt-comment-reply">Reply</span>
                  </div>
                </div>
                <span className="tt-comment-like">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M12 20.5s-7.5-4.7-9.3-9A5.2 5.2 0 0 1 12 6.5a5.2 5.2 0 0 1 9.3 5c-1.8 4.3-9.3 9-9.3 9Z" /></svg>
                  {fmtNum(c.likes)}
                </span>
              </div>
            );
          })}
          <div className="tt-comment-input">
            <span className="tt-ciph">Add comment...</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 21s-8-5-10-9.5C.5 7.5 3 4.5 6.2 4.5c2 0 3.6 1.1 4.3 2.6l1.5 2.7 1.5-2.7c.7-1.5 2.3-2.6 4.3-2.6 3.2 0 5.7 3 4.2 7-2 4.5-10 9.5-10 9.5Z" /></svg>
          </div>
        </div>
      ) : null}
    </div>
  );
}
