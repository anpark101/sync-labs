import React from 'react'
import { useStudioTheme, castMapOf } from '../useTheme.js'
import { Avatar, Icon, RichText } from '../ui.jsx'
import { XReply, XRepost, XShare } from '../glyphs.jsx'
import { XHandle, XMedia, XName, XNav, XTopBar } from './Bits.jsx'
import { cn, compact } from '../../lib/util.js'

export default function XThread({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const author = castMap[data.castId] || project.cast[0]
  const posts = data.posts || []
  return (
    <div className={cn('app x-app', dark && 'is-dark')}>
      <XTopBar title="Thread" back right="more" />
      <div className="x-scroll">
        <div className="x-thread">
          {posts.map((p, i) => (
            <div className={cn('x-thread-post', i < posts.length - 1 && 'connected')} key={p.id || i}>
              <div className="x-thread-rail">
                <Avatar src={author?.avatar} name={author?.name} size={40} />
                {i < posts.length - 1 ? <span className="x-thread-line" /> : null}
              </div>
              <div className="x-thread-content">
                <div className="x-detail-author">
                  <XName cast={author} />
                  <XHandle handle={author?.handle} time={p.time || (i === 0 ? '2h' : '')} />
                  <span className="x-detail-more"><Icon.more size={16} /></span>
                </div>
                <p className="x-thread-text">
                  <RichText text={p.text} accent="#1d9bf0" />
                </p>
                <XMedia images={p.images || []} />
                <div className="x-thread-meta">
                  <span>{compact(p.views || 0)} <em>Views</em></span>
                  {p.likes ? <><span className="x-dot">·</span><span>{compact(p.likes)} <em>Likes</em></span></> : null}
                </div>
                <div className="x-thread-actions">
                  <span><XReply size={17} />{p.replies ? ` ${compact(p.replies)}` : ''}</span>
                  <span><XRepost size={17} />{p.reposts ? ` ${compact(p.reposts)}` : ''}</span>
                  <span><Icon.heart size={17} />{p.likes ? ` ${compact(p.likes)}` : ''}</span>
                  <span><Icon.bookmark size={17} /></span>
                  <span><XShare size={17} /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="x-thread-end">
          <span>End of thread</span>
          <small>{posts.length} posts · {compact(posts.reduce((n, p) => n + (p.likes || 0), 0))} likes</small>
        </div>
      </div>
      {data.showNav !== false ? <XNav /> : null}
    </div>
  )
}
