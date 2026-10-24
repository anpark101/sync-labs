import React from 'react'
import { useStudioTheme, castMapOf } from '../useTheme.js'
import { Avatar, Icon, RichText, Verified, mediaSrc } from '../ui.jsx'
import { XMedia, XNav } from './Bits.jsx'
import { cn, compact } from '../../lib/util.js'

const MiniActions = ({ p }) => (
  <div className="x-mini-actions">
    <span><Icon.comment size={16} />{p.replies ? compact(p.replies) : ''}</span>
    <span><Icon.share size={16} />{p.reposts ? compact(p.reposts) : ''}</span>
    <span><Icon.heart size={16} />{p.likes ? compact(p.likes) : ''}</span>
    <span><Icon.bookmark size={16} /></span>
    <span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 16V3M8 7l4-4 4 4M4 14v5.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V14" />
      </svg>
    </span>
  </div>
)

export default function XProfile({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const author = castMap[data.castId] || project.cast[0]
  const posts = data.posts || []
  const banner = data.banner
  return (
    <div className={cn('app x-app x-profile-app', dark && 'is-dark')}>
      <div className="x-banner">
        {banner ? (
          <img src={mediaSrc(banner)} alt="" draggable={false} />
        ) : (
          <div className="x-banner-default" />
        )}
        <div className="x-banner-veil" />
        <div className="x-profile-floatingbar">
          <span className="x-circle-btn back">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          </span>
          <div className="x-profile-floatingbar-right">
            <span className="x-circle-btn"><Icon.search size={18} /></span>
            <span className="x-circle-btn"><Icon.more size={17} /></span>
          </div>
        </div>
      </div>

      <div className="x-profile-scroll">
        <div className="x-profile-avatar-row">
          <span className="x-profile-avatar"><Avatar src={author?.avatar} name={author?.name} size={78} /></span>
          <span className={cn('x-follow-btn', data.showFollowing && 'following')}>
            {data.showFollowing ? 'Following' : 'Follow'}
          </span>
        </div>
        <div className="x-profile-name">
          {author?.name || 'Character'}
          {author?.verified ? <Verified variant="x" size={19} color="#1d9bf0" /> : null}
        </div>
        <div className="x-profile-handle">@{author?.handle || 'user'}</div>
        <p className="x-profile-bio">
          <RichText text={data.bio || author?.bio || ''} accent="#1d9bf0" />
        </p>
        <div className="x-profile-meta">
          {data.location ? <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.4" /></svg>{data.location}</span> : null}
          {data.website ? <span className="x-link">{data.website}</span> : null}
          {data.joined ? <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" /></svg>{data.joined}</span> : null}
        </div>
        <div className="x-profile-counts">
          <span><b>{compact(data.following ?? author?.following ?? 0)}</b> Following</span>
          <span><b>{compact(data.followers ?? author?.followers ?? 0)}</b> Followers</span>
        </div>

        <div className="x-profile-tabs">
          {['Posts', 'Replies', 'Media', 'Likes'].map((t, i) => (
            <span key={t} className={i === 0 ? 'active' : ''}>{t}</span>
          ))}
        </div>

        <div className="x-profile-feed">
          {posts.map((p, i) => (
            <div className="x-profile-post" key={p.id || i}>
              <p><RichText text={p.text} accent="#1d9bf0" /></p>
              <XMedia images={p.images || []} />
              {p.time || p.views ? (
                <div className="x-profile-post-meta">
                  {p.time ? <span>{p.time}</span> : null}
                  {p.views ? <><span className="x-dot">·</span><b>{compact(p.views)}</b><span className="x-dim">Views</span></> : null}
                </div>
              ) : null}
              <MiniActions p={p} />
            </div>
          ))}
          {!posts.length ? (
            <div className="x-profile-empty">No posts yet.</div>
          ) : null}
        </div>
      </div>
      <XNav />
    </div>
  )
}
