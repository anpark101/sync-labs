import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Copy, Pencil, Trash2, ArrowUpRight, Images, Users, Layers } from 'lucide-react'
import { getPlatform } from '../data/platforms.js'
import { PhoneArtboard } from '../screens/Phone.jsx'
import { BrandIcon } from '../screens/ui.jsx'
import { useStudio } from '../lib/store.jsx'
import { useFeedback } from './Feedback.jsx'
import { compact, relativeDate } from '../lib/util.js'
import Menu from './Menu.jsx'

export const ProjectCard = ({ project }) => {
  const navigate = useNavigate()
  const { duplicateProject, deleteProject, patchProject } = useStudio()
  const feedback = useFeedback()
  const cover = project.screens.find((s) => s.id === project.coverScreenId) || project.screens[0]
  const platform = cover ? getPlatform(cover.platformId) : null
  const platformCount = new Set(project.screens.map((s) => s.platformId)).size
  const tint = platform?.tint || '#f0a07c'

  const rename = async () => {
    const value = await feedback.prompt({
      title: 'Rename this AU',
      defaultValue: project.title,
      confirmLabel: 'Save name',
      placeholder: 'e.g. After Hours',
    })
    if (value && value.trim()) patchProject(project.id, { title: value.trim() })
  }

  const remove = async () => {
    const ok = await feedback.confirm({
      title: `Delete “${project.title}”?`,
      body: 'This removes the AU and its images from this browser. Export a backup first if you might want it later.',
      confirmLabel: 'Delete AU',
      destructive: true,
    })
    if (!ok) return
    deleteProject(project.id)
    feedback.info('AU deleted.')
  }

  return (
    <article className="project-card">
      <div
        className="project-cover"
        style={{ '--cover-glow': `${tint}30` }}
        onClick={() => navigate(`/p/${project.id}`)}
        role="presentation"
      >
        {cover ? (
          <div className="mini-phone" aria-hidden="true">
            <PhoneArtboard project={project} screen={cover} exportMode />
          </div>
        ) : (
          <div className="mini-phone" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)' }}>
            <Images size={26} color="var(--muted)" />
          </div>
        )}
        {platform ? (
          <span className="project-cover-badge">
            <BrandIcon name={platform.id} size={11} color={platform.id === 'x' ? '#fff' : platform.tint} />
            {platform.name}
          </span>
        ) : null}
        {project.demo ? <span className="project-cover-badge" style={{ left: 'auto', right: 12, background: 'rgba(240,160,124,.18)', borderColor: 'rgba(240,160,124,.35)', color: '#f0c0a8' }}>Sample</span> : null}
        <span className="project-cover-more">
          {project.screens.length ? `${project.screens.length} screen${project.screens.length === 1 ? '' : 's'}` : 'No screens yet'}
        </span>
      </div>
      <div className="project-body">
        <div className="project-title-row">
          <Link to={`/p/${project.id}`} className="project-title">
            {project.title}
          </Link>
          <Menu
            items={[
              { label: 'Open AU', icon: <ArrowUpRight size={14} />, onClick: () => navigate(`/p/${project.id}`) },
              { label: 'Rename', icon: <Pencil size={14} />, onClick: rename },
              { label: 'Duplicate', icon: <Copy size={14} />, onClick: () => {
                const copy = duplicateProject(project.id)
                if (copy) {
                  feedback.success('Duplicated. It’s yours now.')
                  navigate(`/p/${copy.id}`)
                }
              } },
              { separator: true },
              { label: 'Delete', icon: <Trash2 size={14} />, danger: true, onClick: remove },
            ]}
          />
        </div>
        <p className="project-tagline">{project.tagline || project.synopsis || 'No description yet.'}</p>
        <div className="project-meta">
          <span><Layers size={12} /> {project.screens.length} screens</span>
          <i />
          <span>{platformCount} platform{platformCount === 1 ? '' : 's'}</span>
          <i />
          <span><Users size={12} /> {project.cast.length}</span>
          <i />
          <span>{relativeDate(project.updatedAt)}</span>
        </div>
        <div className="project-actions">
          <Link to={`/p/${project.id}`} className="btn btn-secondary btn-sm">
            Open studio
          </Link>
        </div>
      </div>
    </article>
  )
}
