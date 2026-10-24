import React from 'react';
import type { Character, FacebookConfig } from '../../types';
import { fmtCount } from '../../util';

type C = (id: string) => Character | undefined;

export function FacebookMock({ cfg, char }: { cfg: FacebookConfig; char: C }) {
  const author = char(cfg.author);
  const h = author?.handles?.facebook || author?.name || 'user';
  return (
    <div className="fb-page">
      <div className="fb-card">
        <div className="fb-head">
          <span className="fb-av" style={{ background: author?.avatar ? 'transparent' : author?.color || '#555' }}>
            {author?.avatar ? (
              <img src={author.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <span style={{ fontSize: 17, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{author?.emoji || h[0]?.toUpperCase()}</span>
            )}
          </span>
          <div className="fb-headinfo">
            <div className="fb-name">{h}</div>
            <div className="fb-time">
              {cfg.timeAgo} · {cfg.privacy === 'globe' ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#65676B" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></svg>
              ) : (
                <svg width="13" height="12" viewBox="0 0 24 24" fill="none" stroke="#65676B" strokeWidth="1.8"><circle cx="8" cy="9" r="3.2" /><path d="M2 20a6 6 0 0 1 12 0" /><path d="M15 6a3.2 3.2 0 0 1 0 6M17 14a6 6 0 0 1 5 6" /></svg>
              )}
            </div>
          </div>
          <span className="fb-dots">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#65676B"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
          </span>
        </div>
        <div className="fb-text">{cfg.text}</div>
        {cfg.image ? <div className="fb-img"><img src={cfg.image} alt="" /></div> : null}
        <div className="fb-counts">
          <span className="fb-reactcluster">
            {cfg.reactions.length ? cfg.reactions.slice(0, 3).map((r, i) => (
              <span key={i} className="fb-react" style={{ marginLeft: i ? -7 : 0 }}>{r.emoji}</span>
            )) : (
              <span className="fb-react" style={{ background: '#1877F2' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M7 11v10H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h4Zm2 0 4-7c1.5 0 2.5 1 2.5 2.5V9H20a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 18.8 20H9V11Z" /></svg>
              </span>
            )}
          </span>
          <span className="fb-count">{fmtCount(cfg.likes)}</span>
          <span className="fb-spacer" />
          <span className="fb-count small">{cfg.comments} comments</span>
          <span className="fb-count small">{cfg.shares} shares</span>
        </div>
        <div className="fb-buttons">
          <span>
            <span className="fb-btnicon" style={{ background: '#E7F3FF' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2"><path d="M7 11v10H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h4Zm2 0 4-7c1.5 0 2.5 1 2.5 2.5V9H20a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 18.8 20H9V11Z" /></svg>
            </span>
            Like
          </span>
          <span>
            <span className="fb-btnicon" style={{ background: '#E7F3FF' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1L3 20l1.1-4.3a8.4 8.4 0 0 1-1.1-4.2A8.5 8.5 0 0 1 11.5 3 8.5 8.5 0 0 1 21 11.5Z" /></svg>
            </span>
            Comment
          </span>
          <span>
            <span className="fb-btnicon" style={{ background: '#E7F3FF' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2.5 21 6.5l-4 4" /><path d="M21 6.5H8a4 4 0 0 0-4 4V13" /><path d="M7 21.5 3 17.5l4-4" /><path d="M3 17.5h13a4 4 0 0 0 4-4V11" /></svg>
            </span>
            Share
          </span>
        </div>
      </div>
      {cfg.showComments ? (
        <div className="fb-comments">
          {cfg.commentList.map((c) => {
            const cc = char(c.author);
            return (
              <div className="fb-comment" key={c.id}>
                <span className="fb-cav" style={{ background: cc?.avatar ? 'transparent' : cc?.color || '#555' }}>
                  {cc?.avatar ? (
                    <img src={cc.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <span style={{ fontSize: 12, color: '#fff' }}>{cc?.emoji || '?'}</span>
                  )}
                </span>
                <div className="fb-comment-main">
                  <div className="fb-bubble">
                    <div className="fb-comment-name">{cc?.name || 'user'}</div>
                    <div className="fb-comment-text">{c.text}</div>
                  </div>
                  <div className="fb-comment-meta">
                    <span>Like</span><span>Reply</span><span>{c.timeAgo}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
