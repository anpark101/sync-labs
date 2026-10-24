import React from 'react'
import { Avatar, Icon, Img, Verified, mediaSrc } from '../ui.jsx'
import { castMapOf } from '../useTheme.js'
import { cn } from '../../lib/util.js'

export default function InstagramStory({ project, screen, data }) {
  const castMap = castMapOf(project)
  const author = castMap[data.castId] || project.cast[0]
  const total = Math.max(1, data.progressTotal || 4)
  const current = Math.min(total, Math.max(1, data.progress || 1))
  const polls = data.pollOn
  const votesA = Number(data.pollVotesA) || 0
  const votesB = Number(data.pollVotesB) || 0
  const totalVotes = Math.max(1, votesA + votesB)
  const pctA = Math.round((votesA / totalVotes) * 100)
  const pctB = 100 - pctA

  return (
    <div className="app ig-story-app bleed">
      {data.image ? (
        <img className="ig-story-bg" src={mediaSrc(data.image)} alt="" draggable={false} />
      ) : (
        <Img src="" className="ig-story-bg ig-story-bg-empty" seed={author?.name || 'story'} alt="" />
      )}
      <div className="ig-story-gradient top" />
      <div className="ig-story-gradient bottom" />

      <div className="ig-story-ui">
        <div className="ig-story-progress">
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={cn('ig-story-seg', i < current - 1 && 'done', i === current - 1 && 'active')}>
              <i />
            </span>
          ))}
        </div>

        <div className="ig-story-top">
          <div className="ig-story-owner">
            <Avatar src={author?.avatar} name={author?.name} size={32} />
            <div className="ig-story-owner-meta">
              <span className="ig-story-owner-name">
                {author?.handle || 'username'}
                {author?.verified ? <Verified size={13} color="#0095f6" /> : null}
                <span className="ig-story-time">{data.time || '2h'}</span>
              </span>
              {data.location ? <span className="ig-story-loc">{data.location}</span> : null}
            </div>
          </div>
          <div className="ig-story-controls">
            <span><Icon.more size={24} color="#fff" /></span>
            <span className="ig-story-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </span>
          </div>
        </div>

        <div className="ig-story-middle">
          {data.caption ? (
            <div className={cn('ig-story-caption', data.captionStyle || 'center')}>
              <span>{data.caption}</span>
            </div>
          ) : null}
          {data.music ? (
            <div className="ig-story-music">
              <Icon.music size={15} color="#fff" />
              <span>{data.music}</span>
              {data.musicArtist ? <em>· {data.musicArtist}</em> : null}
            </div>
          ) : null}
          {polls ? (
            <div className="ig-story-poll">
              <div className="ig-story-poll-q">{data.pollQuestion || 'be honest'}</div>
              <div className="ig-story-poll-options">
                <div className="ig-story-poll-opt">
                  <span>{data.pollA || 'yes'}</span>
                  <b>{pctA}%</b>
                  <i style={{ width: `${pctA}%` }} />
                </div>
                <div className="ig-story-poll-opt">
                  <span>{data.pollB || 'no'}</span>
                  <b>{pctB}%</b>
                  <i style={{ width: `${pctB}%` }} />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {data.showReply !== false ? (
          <div className="ig-story-footer">
            <div className="ig-story-reply">
              <span className="ig-story-cam">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M4.5 8.5h3l1.6-2.4h5.8l1.6 2.4h3A1.5 1.5 0 0 1 21 10v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-8a1.5 1.5 0 0 1 1.5-1.5Z" strokeLinejoin="round" />
                  <circle cx="12" cy="14" r="3.2" />
                </svg>
              </span>
              <span className="ig-story-reply-text">Send message</span>
            </div>
            <span className="ig-story-footicon">
              <Icon.heart size={25} color="#fff" />
            </span>
            <span className="ig-story-footicon">
              <Icon.share size={24} color="#fff" />
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
