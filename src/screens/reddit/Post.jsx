import React from 'react'
import { useStudioTheme, castMapOf } from '../useTheme.js'
import { Avatar, BrandIcon, Icon, Img, RichText } from '../ui.jsx'
import { cn, compact } from '../../lib/util.js'

const Upvote = ({ filled = false }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 3.5 21 13h-5v7H8v-7H3L12 3.5Z" /></svg>
)
const Downvote = ({ filled = false }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 20.5 3 11h5V4h8v7h5L12 20.5Z" /></svg>
)

const Comment = ({ c, castMap, opId, depth = 0 }) => (
  <div className={cn('rd-comment', depth > 0 && 'nested')}>
    {depth > 0 ? <span className="rd-comment-thread" /> : null}
    <div className="rd-comment-inner">
      <Avatar name={c.user || castMap[c.castId]?.name || 'user'} src={castMap[c.castId]?.avatar} size={26} />
      <div className="rd-comment-main">
        <div className="rd-comment-head">
          <b>{castMap[c.castId]?.handle ? `u/${castMap[c.castId].handle}` : `u/${c.user || 'user'}`}</b>
          {c.castId && c.castId === opId ? <span className="rd-op">OP</span> : null}
          <span>· {c.time || '9h'}</span>
        </div>
        <p><RichText text={c.text} accent="#4fbcff" /></p>
        <div className="rd-comment-actions">
          <span><Upvote /> {compact(c.votes)} <Downvote /></span>
          <span>Reply</span>
          <span>Share</span>
        </div>
        {(c.replies || []).slice(0, 1).map((r) => (
          <Comment key={r.id} c={r} castMap={castMap} opId={opId} depth={depth + 1} />
        ))}
      </div>
    </div>
  </div>
)

export default function RedditPost({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const author = castMap[data.castId] || project.cast[0]
  const comments = data.comments || []
  return (
    <div className={cn('app rd-app', dark && 'is-dark')}>
      <div className="rd-topbar">
        <span className="rd-back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
        </span>
        <span className="rd-community">
          <span className="rd-community-icon"><BrandIcon name="reddit" size={20} color="#fff" /></span>
          <span className="rd-community-meta">
            <b>r/{data.subreddit?.replace(/^r\//, '') || 'all'}</b>
            <em>{compact(data.members || 1240000)} members</em>
          </span>
        </span>
        <span className="rd-join">Join</span>
        <span className="rd-search"><Icon.search size={20} /></span>
      </div>

      <div className="rd-scroll">
        <div className="rd-post">
          <div className="rd-post-head">
            <span className="rd-sub">
              <span className="rd-sub-icon">r/</span>
              {data.subreddit?.replace(/^r\//, '') || 'all'}
            </span>
            <span className="rd-post-sub-meta">· {data.time || '9h'} · <span className="rd-public">Public</span></span>
            <span className="rd-post-more"><Icon.more size={17} /></span>
          </div>
          <h1 className="rd-title">{data.title || 'Untitled post'}</h1>
          {data.flair ? <span className="rd-flair">{data.flair}</span> : null}
          {data.body ? <p className="rd-body">{data.body}</p> : null}
          {data.image ? <Img src={data.image} className="rd-image" seed={data.title} alt="" /> : null}
          <div className="rd-post-meta">
            <span>u/{author?.handle || 'anonymous'}</span>
            <span>{compact(data.votes)} votes</span>
          </div>
          <div className="rd-actions">
            <span className="rd-vote">
              <Upvote filled />
              <b>{compact(data.votes)}</b>
              <Downvote />
            </span>
            <span className="rd-action-pill">
              <Icon.comment size={17} /> {compact(data.commentCount || comments.length)}
            </span>
            <span className="rd-action-pill">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V3M8 7l4-4 4 4M4 14v5.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V14" /></svg>
              Share
            </span>
            <span className="rd-action-pill">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M12 3 14.6 9l6 .5-4.6 3.9 1.4 6-5.4-3.2-5.4 3.2 1.4-6L3.4 9.5l6-.5L12 3Z" /></svg>
            </span>
          </div>
        </div>

        <div className="rd-sortbar">
          <span className="rd-sort active">Best <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m6 9 6 6 6-6" /></svg></span>
          <span className="rd-sort"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4 6h16M4 12h10M4 18h6" /></svg></span>
          <span className="rd-sort-icon">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-4.2-4.2" /></svg>
          </span>
        </div>

        <div className="rd-comments">
          {comments.map((c) => <Comment key={c.id} c={c} castMap={castMap} opId={author?.id} />)}
          <div className="rd-more-comments">View more comments</div>
        </div>
      </div>

      <div className="rd-nav">
        <span className="active"><Icon.home size={22} filled /><em>Home</em></span>
        <span><Icon.search size={22} /><em>Explore</em></span>
        <span className="rd-create"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></span>
        <span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4 5h16v11H9l-5 4V5Z" /></svg>
          <em>Chat</em>
        </span>
        <span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-2 7-2 8h16c0-1-2-1-2-8Z" /><path d="M10 20a2.2 2.2 0 0 0 4 0" /></svg>
          <em>Inbox</em>
        </span>
      </div>
    </div>
  )
}
