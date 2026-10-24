import React from 'react'
import { useStudioTheme, castMapOf } from '../useTheme.js'
import { Avatar, BrandIcon, Icon, Img, mediaSrc } from '../ui.jsx'
import { cn, compact, formatCount } from '../../lib/util.js'

const ThumbIcon = ({ down = false }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" style={{ transform: down ? 'rotate(180deg)' : 'none' }}>
    <path d="M7 10.5V21H4.5A1.5 1.5 0 0 1 3 19.5v-7.7a1.3 1.3 0 0 1 1.3-1.3H7Zm0 0 4-7.3a2.4 2.4 0 0 1 2.2 2.1l.5 4.2h5.1a1.8 1.8 0 0 1 1.8 2.2l-1.4 7.4a2 2 0 0 1-2 1.6H7" />
  </svg>
)

export default function YouTubeVideo({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const author = castMap[data.castId] || project.cast[0]
  const channel = data.channelName || author?.name || 'Channel'
  const comments = data.comments || []
  return (
    <div className={cn('app yt-app', dark && 'is-dark')}>
      <div className="yt-player">
        {data.thumb ? (
          <img src={mediaSrc(data.thumb)} className="yt-thumb" alt="" draggable={false} />
        ) : (
          <Img src="" className="yt-thumb" seed={data.title || 'video'} />
        )}
        <div className="yt-player-shade top" />
        <div className="yt-player-shade bottom" />
        <div className="yt-player-top">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="7" width="14" height="10" rx="2" /><path d="m17 11 4.2-2.3a.6.6 0 0 1 .8.5v5.6a.6.6 0 0 1-.8.5L17 13" /></svg>
          <div className="yt-player-top-right">
            <Icon.search size={21} color="#fff" />
            <Icon.more size={19} color="#fff" />
          </div>
        </div>
        <div className="yt-player-controls">
          <span className="yt-playpause">
            <Icon.play size={20} color="#fff" />
          </span>
          <span className="yt-next">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="#fff"><path d="M5 4.5 15 12 5 19.5v-15ZM17 4h2.5v16H17z" /></svg>
          </span>
          <span className="yt-time">4:21 / 12:04</span>
          <span className="yt-cc">CC</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M10.6 3h2.8l-.4 4.2h3.4V10h-3.8l-.4 4h3.2v2.8h-3.6L11.4 21H8.6l.4-4.2H5.6V14h3.8l.4-4H6.6V7.2h3.6L10.6 3Z" /></svg>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2v10h10A10 10 0 0 0 12 2Z" opacity=".9" /><circle cx="12" cy="12" r="10" fill="none" stroke="#fff" strokeWidth="1.6" /></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
        </div>
        <div className="yt-progress"><i style={{ width: '36%' }} /></div>
      </div>

      <div className="yt-scroll">
        <div className="yt-title">{data.title || 'Untitled video'}</div>
        <div className="yt-meta">
          {compact(data.views)} views · {data.uploaded || '2 days ago'}
          <span className="yt-meta-more"><Icon.more size={17} /></span>
        </div>

        <div className="yt-chips">
          <span className="yt-chip likes">
            <ThumbIcon />
            <b>{compact(data.likes)}</b>
          </span>
          <span className="yt-chip"><ThumbIcon down /></span>
          <span className="yt-chip">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V3M8 7l4-4 4 4M4 14v5.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V14" /></svg>
            Share
          </span>
          <span className="yt-chip">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 1 1 2.4 5.7L4 20l1.4-3.7A8 8 0 0 1 4 12Z" /></svg>
            Remix
          </span>
          <span className="yt-chip">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 10l5 5 5-5M4 19h16" /></svg>
            Download
          </span>
        </div>

        <div className="yt-channel">
          <Avatar src={author?.avatar} name={channel} size={37} />
          <div className="yt-channel-meta">
            <b>{channel}</b>
            <span>{compact(data.subscribers || 284000)} subscribers</span>
          </div>
          <span className="yt-join">Join</span>
          <span className={cn('yt-subscribe', data.subscribed && 'subscribed')}>
            {data.subscribed ? 'Subscribed' : 'Subscribe'}
          </span>
        </div>

        {data.description ? (
          <div className="yt-description">
            <p>{data.description}</p>
            <span>...more</span>
          </div>
        ) : null}

        <div className="yt-comments">
          <div className="yt-comments-head">
            <b>Comments <span>{compact(data.commentCount || 482)}</span></b>
            <span className="yt-sort">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M7 12h10M10 17h4" /></svg>
            </span>
          </div>
          {comments.slice(0, 2).map((c) => (
            <div className="yt-comment" key={c.id}>
              <Avatar name={c.user} size={27} />
              <div className="yt-comment-body">
                <div className="yt-comment-head"><b>@{c.user}</b><span>{c.time || '1 day ago'}</span></div>
                <p>{c.text}</p>
                <div className="yt-comment-actions">
                  <ThumbIcon />
                  <span>{compact(c.likes)}</span>
                  <ThumbIcon down />
                  <b>Reply</b>
                </div>
              </div>
            </div>
          ))}
          <div className="yt-view-more">View {compact(Math.max(0, (data.commentCount || 482) - 2))} more comments</div>
        </div>
      </div>

      <div className="yt-nav">
        <span className="active"><Icon.home size={22} filled /><em>Home</em></span>
        <span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="m13.5 2-8 12h6l-1 8 8-12h-6l1-8Z" /></svg>
          <em>Shorts</em>
        </span>
        <span className="yt-create"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></span>
        <span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" /></svg>
          <em>Subscriptions</em>
        </span>
        <span><Avatar src={author?.avatar} name={channel} size={23} /><em>You</em></span>
      </div>
    </div>
  )
}
