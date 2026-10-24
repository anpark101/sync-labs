import React from 'react'
import { useStudioTheme, castMapOf } from '../useTheme.js'
import { Avatar, Icon, RichText } from '../ui.jsx'
import { XActions, XHandle, XMedia, XName, XNav, XTopBar } from './Bits.jsx'
import { cn, compact, formatCount } from '../../lib/util.js'

export default function XPost({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const author = castMap[data.castId] || project.cast[0]
  const replies = data.repliesList || []

  return (
    <div className={cn('app x-app', dark && 'is-dark')}>
      <XTopBar title="Post" back right="more" />
      <div className="x-scroll">
        <article className="x-detail">
          <div className="x-detail-row">
            <Avatar src={author?.avatar} name={author?.name} size={40} />
            <div className="x-detail-main">
              <div className="x-detail-author">
                <XName cast={author} />
                <XHandle handle={author?.handle} />
                {data.time ? <span className="x-handle x-detail-time">· {data.time}</span> : null}
                <span className="x-detail-more"><Icon.more size={18} /></span>
              </div>
              {data.replyingTo ? (
                <div className="x-replying">Replying to <span>@{data.replyingTo.replace(/^@/, '')}</span></div>
              ) : null}
              <p className="x-detail-text">
                <RichText text={data.text} accent="#1d9bf0" />
              </p>
              <XMedia images={data.images || []} />
              {data.quotedText ? (
                <div className="x-quote">
                  <div className="x-quote-head">
                    <Avatar src={castMap[data.quotedCastId]?.avatar} name={castMap[data.quotedCastId]?.name || 'quote'} size={20} />
                    <b>{castMap[data.quotedCastId]?.name || 'Quoted user'}</b>
                    <span>@{castMap[data.quotedCastId]?.handle || 'user'}</span>
                  </div>
                  <p>{data.quotedText}</p>
                </div>
              ) : null}
              <div className="x-detail-meta">
                {data.timestamp || '9:41 AM · Oct 12, 2026'}
                <span className="x-dot">·</span>
                <b>{compact(data.views)}</b> <span className="x-dim">Views</span>
              </div>
            </div>
          </div>
          <div className="x-detail-stats">
            <span><b>{formatCount(data.reposts || 0)}</b> <em>Reposts</em></span>
            <span><b>{formatCount(Math.round((data.likes || 0) * 1.18))}</b> <em>Quotes</em></span>
            <span><b>{formatCount(data.likes || 0)}</b> <em>Likes</em></span>
            <span><b>{formatCount(data.bookmarks || Math.round((data.likes || 0) * 0.2))}</b> <em>Bookmarks</em></span>
          </div>
          <div className="x-detail-actions">
            <XActions data={data} />
          </div>
        </article>

        {replies.length ? (
          <div className="x-replies">
            {replies.slice(0, 2).map((r) => {
              const user = castMap[r.castId]
              return (
                <div className="x-reply" key={r.id}>
                  <Avatar src={user?.avatar} name={user?.name || 'user'} size={34} />
                  <div className="x-reply-main">
                    <div className="x-reply-head">
                      <XName cast={user} small />
                      <XHandle handle={user?.handle || 'user'} time={r.time || '1h'} />
                      <span className="x-detail-more"><Icon.more size={15} /></span>
                    </div>
                    <p>{r.text}</p>
                    <div className="x-reply-actions">
                      <span><Icon.comment size={15} /> {r.replies ? compact(r.replies) : ''}</span>
                      <span><Icon.heart size={15} /> {r.likes ? compact(r.likes) : ''}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
      {data.showNav !== false ? <XNav /> : null}
    </div>
  )
}
