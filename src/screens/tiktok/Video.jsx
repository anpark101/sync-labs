import React from 'react'
import { useStudioTheme, castMapOf } from '../useTheme.js'
import { Avatar, Icon, Img, RichText, Verified, mediaSrc } from '../ui.jsx'
import { TtComment, TtFriends, TtInbox, TtShare } from '../glyphs.jsx'
import { cn, compact } from '../../lib/util.js'

const TikTokNav = ({ avatar, name }) => (
  <div className="tt-nav">
    <span className="tt-nav-item active">
      <Icon.home size={22} filled />
      <em>Home</em>
    </span>
    <span className="tt-nav-item">
      <TtFriends size={23} />
      <em>Friends</em>
    </span>
    <span className="tt-nav-create">
      <i /><i />
      <span />
    </span>
    <span className="tt-nav-item">
      <TtInbox size={23} />
      <em>Inbox</em>
    </span>
    <span className="tt-nav-item">
      <span className="tt-nav-avatar"><Avatar src={avatar} name={name} size={25} /></span>
      <em>Profile</em>
    </span>
  </div>
)

export default function TikTokVideo({ project, screen, data }) {
  const theme = useStudioTheme(project, screen)
  const dark = theme === 'dark'
  const castMap = castMapOf(project)
  const author = castMap[data.castId] || project.cast[0]
  return (
    <div className={cn('app tt-app bleed', dark && 'is-dark')}>
      {data.cover ? (
        <img className="tt-cover" src={mediaSrc(data.cover)} alt="" draggable={false} />
      ) : (
        <Img src="" className="tt-cover tt-cover-empty" seed={author?.name || 'tiktok'} alt="" />
      )}
      <div className="tt-shade top" />
      <div className="tt-shade bottom" />

      <div className="tt-top">
        <div className="tt-top-tabs">
          <span>Following</span>
          <span className="active">For You</span>
        </div>
        <span className="tt-top-search">
          <Icon.search size={23} color="#fff" />
        </span>
      </div>

      <div className="tt-rail">
        <div className="tt-rail-avatar">
          <Avatar src={author?.avatar} name={author?.name} size={45} ring />
          <span className="tt-follow-badge">+</span>
        </div>
        <div className="tt-rail-item">
          <Icon.heart size={33} color="#fff" filled={!!data.liked} />
          <em>{compact(data.likes)}</em>
        </div>
        <div className="tt-rail-item">
          <TtComment size={32} color="#fff" />
          <em>{compact(data.comments)}</em>
        </div>
        <div className="tt-rail-item">
          <Icon.bookmark size={30} color="#fff" filled={!!data.saved} />
          <em>{compact(data.saves)}</em>
        </div>
        <div className="tt-rail-item">
          <TtShare size={30} color="#fff" />
          <em>{compact(data.shares)}</em>
        </div>
        <div className="tt-disc">
          <span className="tt-disc-cover">
            <Avatar src={author?.avatar} name={author?.name} size={32} />
          </span>
          <span className="tt-disc-notes"><Icon.music size={12} color="#fff" /></span>
        </div>
      </div>

      <div className="tt-bottom">
        <div className="tt-author">
          @{author?.handle || 'username'}
          {author?.verified ? <Verified size={14} color="#20d5ec" variant="circle" /> : null}
        </div>
        <p className="tt-caption">
          <RichText text={data.caption} accent="#fff" />
        </p>
        <div className="tt-music">
          <Icon.music size={15} color="#fff" />
          <div className="tt-music-track">
            <span>{data.music || 'original sound'}{data.musicArtist ? ` - ${data.musicArtist}` : ''}</span>
          </div>
        </div>
      </div>

      {data.showNav !== false ? <TikTokNav avatar={author?.avatar} name={author?.name} /> : null}
    </div>
  )
}
