import React from 'react';
import type { Character, RedditConfig } from '../../types';
import { fmtNum } from '../../util';

type C = (id: string) => Character | undefined;

export function RedditMock({ cfg, char }: { cfg: RedditConfig; char: C }) {
  const author = char(cfg.author);
  return (
    <div className="rd-page">
      <div className="rd-card">
        <div className="rd-meta">
          <span className="rd-subicon">{(cfg.sub || 'r/').replace('r/', '')?.slice(0, 1).toUpperCase()}</span>
          <span className="rd-subline">
            r/{cfg.sub.replace(/^r\//, '')}
            <span className="rd-dot">·</span> Posted by u/{author?.handles?.reddit || author?.name || 'user'}
            {cfg.flair ? <span className="rd-flair">{cfg.flair}</span> : null}
            <span className="rd-dot">·</span> {cfg.timeAgo}
          </span>
        </div>
        <div className="rd-title">{cfg.title}</div>
        {cfg.body ? <div className="rd-body">{cfg.body}</div> : null}
        {cfg.image ? <div className="rd-img"><img src={cfg.image} alt="" /></div> : null}
        <div className="rd-actions">
          <span className="rd-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
            {fmtNum(cfg.score)}
          </span>
          <span className="rd-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1L3 20l1.1-4.3a8.4 8.4 0 0 1-1.1-4.2A8.5 8.5 0 0 1 11.5 3 8.5 8.5 0 0 1 21 11.5Z" /></svg>
            {fmtNum(cfg.commentCount)} comments
          </span>
          <span className="rd-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" /></svg>
            Share
          </span>
          <span className="rd-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1Z" /></svg>
            Save
          </span>
        </div>
      </div>
      <div className="rd-comments">
        {cfg.comments.map((c) => {
          const cc = char(c.author);
          return (
            <div className="rd-comment" key={c.id}>
              <div className="rd-vote">
                <svg width="12" height="12" viewBox="0 0 24 24" fill={c.score >= 0 ? '#FF4500' : 'currentColor'}><path d="M12 4l8 9h-5v7H9v-7H4Z" /></svg>
                <span>{fmtNum(c.score)}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20l-8-9h5V4h6v7h5Z" /></svg>
              </div>
              <div className="rd-comment-main">
                <div className="rd-comment-meta">
                  <span className="rd-comment-user">u/{cc?.handles?.reddit || cc?.name || 'user'}</span>
                  {c.isOP ? <span className="rd-op">OP</span> : null}
                  <span className="rd-dot">·</span> {c.timeAgo}
                </div>
                <div className="rd-comment-text">{c.text}</div>
                <div className="rd-comment-actions"><span>Reply</span><span>Share</span><span>Report</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
