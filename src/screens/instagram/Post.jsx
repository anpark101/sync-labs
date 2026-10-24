import React from 'react'
import { useStudioTheme } from '../useTheme.js'
import { Avatar, Icon, Img, RichText } from '../ui.jsx'
import { IgBottomNav, IgStoryRing, IgTopBar, IgVerifiedName } from './Bits.jsx'
import { castMapOf } from '../useTheme.js'
import { cn, formatCount } from '../../lib/util.js'

export default function InstagramPost({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const author = castMap[data.castId] || project.cast[0]
  const images = data.images?.length ? data.images : data.image ? [data.image] : []
  const comments = data.comments || []
  const liked = data.liked !== false
  const saved = !!data.saved

  return (
    <div className={cn('app ig-app', dark && 'is-dark')}>
      <IgTopBar dark={dark} />
      <div className="ig-post-scroll">
        <div className="ig-post-head">
          <IgStoryRing active>
            <Avatar src={author?.avatar} name={author?.name} size={31} />
          </IgStoryRing>
          <div className="ig-post-head-meta">
            <IgVerifiedName name={author?.handle || 'username'} verified={false} dark={dark} />
            {data.location ? <span className="ig-location">{data.location}</span> : null}
          </div>
          <span className="ig-post-more"><Icon.more size={20} /></span>
        </div>

        <div className="ig-media">
          {images.length ? (
            <Img src={images[0]} className="ig-media-img" seed={author?.name} alt="" />
          ) : (
            <Img src="" className="ig-media-img" seed={author?.name || 'post'} alt="" />
          )}
          {images.length > 1 ? (
            <>
              <span className="ig-carousel-count">1/{images.length}</span>
              <span className="ig-carousel-dots">
                {images.slice(0, 7).map((_, i) => (
                  <i key={i} className={i === 0 ? 'active' : ''} />
                ))}
              </span>
            </>
          ) : null}
          {data.music ? (
            <span className="ig-media-music">
              <Icon.music size={13} /> {data.music}
            </span>
          ) : null}
        </div>

        <div className="ig-actions">
          <div className="ig-actions-left">
            <span className={cn('ig-action', liked && 'liked')}>
              <Icon.heart size={25} filled={liked} color={liked ? '#ed4956' : 'currentColor'} />
            </span>
            <span className="ig-action"><Icon.comment size={24} /></span>
            <span className="ig-action"><Icon.share size={23} /></span>
          </div>
          <span className="ig-action"><Icon.bookmark size={24} filled={saved} /></span>
        </div>

        <div className="ig-likes">{formatCount(data.likes)} likes</div>

        {data.caption ? (
          <p className="ig-caption">
            <IgVerifiedName name={author?.handle || 'username'} verified={false} dark={dark} />
            <RichText text={data.caption} accent={dark ? '#e0f1ff' : '#00376b'} linkUnderline />
          </p>
        ) : null}

        {data.likedBy ? <div className="ig-likedby">Liked by <b>{data.likedBy}</b></div> : null}

        {comments.length ? (
          <>
            {comments.length > 2 ? (
              <div className="ig-viewcomments">View all {formatCount(comments.length + (data.extraComments || 0))} comments</div>
            ) : null}
            {comments.slice(0, 2).map((c) => {
              const user = castMap[c.castId]
              return (
                <div className="ig-comment" key={c.id}>
                  <span className="ig-comment-text">
                    <b>{user?.handle || c.user || 'someone'}</b> <RichText text={c.text} accent={dark ? '#e0f1ff' : '#00376b'} />
                  </span>
                  {c.likes ? <span className="ig-comment-like">{formatCount(c.likes)} likes</span> : null}
                </div>
              )
            })}
          </>
        ) : null}

        <div className="ig-time">{data.time || '2h'}</div>
      </div>

      <div className="ig-comment-bar">
        <Avatar name={author?.name || 'you'} size={26} />
        <span className="ig-comment-placeholder">Add a comment…</span>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </div>
      {data.showNav !== false ? <IgBottomNav active={0} dark={dark} profileAvatar={author?.avatar} /> : null}
    </div>
  )
}
