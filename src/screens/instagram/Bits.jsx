import React from 'react'
import { Avatar, Icon } from '../ui.jsx'
import { cn } from '../../lib/util.js'

export const IgWordmark = ({ dark = false }) => (
  <span className={cn('ig-wordmark', dark && 'on-dark')}>Instagram</span>
)

export const IgTopBar = ({ right = 'both', dark = false }) => (
  <div className={cn('ig-topbar', dark && 'on-dark')}>
    <IgWordmark dark={dark} />
    <div className="ig-topbar-icons">
      {right !== 'none' ? (
        <span className="ig-topicon">
          <Icon.heart size={23} color="currentColor" />
          <i className="ig-badge-dot" />
        </span>
      ) : null}
      {right === 'both' ? (
        <span className="ig-topicon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 4 3 11l7 2.4L21 4Z" />
            <path d="m10 13.4 3 6.6 8-16" />
          </svg>
          <i className="ig-badge-dot second" />
        </span>
      ) : null}
    </div>
  </div>
)

const NavIcon = ({ type, active, avatar, project }) => {
  if (type === 'home')
    return (
      <span className={cn('ig-nav-icon', active && 'active')}>
        <Icon.home size={24} filled={active} />
      </span>
    )
  if (type === 'search')
    return (
      <span className={cn('ig-nav-icon', active && 'active')}>
        <Icon.search size={24} />
      </span>
    )
  if (type === 'reels')
    return (
      <span className={cn('ig-nav-icon', active && 'active')}>
        <Icon.reels size={24} />
      </span>
    )
  if (type === 'shop')
    return (
      <span className={cn('ig-nav-icon', active && 'active')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M4 8h16l-1.2 12.2a1.3 1.3 0 0 1-1.3 1.2H6.5a1.3 1.3 0 0 1-1.3-1.2L4 8Z" />
          <path d="M8.5 10V6.3a3.5 3.5 0 0 1 7 0V10" />
        </svg>
      </span>
    )
  return (
    <span className={cn('ig-nav-avatar', active && 'active')}>
      <Avatar src={avatar} name={project?.name} size={26} />
    </span>
  )
}

export const IgBottomNav = ({ active = 0, project, dark = false, profileAvatar }) => {
  const tabs = ['home', 'search', 'reels', 'shop', 'profile']
  return (
    <div className={cn('ig-nav', dark && 'on-dark')}>
      {tabs.map((tab, i) => (
        <NavIcon key={tab} type={tab} active={active === i} project={{ name: 'you' }} avatar={profileAvatar} />
      ))}
    </div>
  )
}

export const IgVerifiedName = ({ name, verified, dark, size = 13 }) => (
  <span className={cn('ig-username', dark && 'on-dark')} style={{ fontSize: size }}>
    {name}
    {verified ? <span className="ig-verified">✓</span> : null}
  </span>
)

export const IgStoryRing = ({ children, active = true }) => (
  <span className={cn('ig-ring', active && 'active')}>{children}</span>
)
