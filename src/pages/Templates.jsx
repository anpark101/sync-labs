import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, Sparkles } from 'lucide-react'
import Shell from '../components/Shell.jsx'
import { PhoneArtboard } from '../screens/Phone.jsx'
import { useStudio } from '../lib/store.jsx'
import { TEMPLATES } from '../data/templates.js'
import { getPlatform } from '../data/platforms.js'
import { cn } from '../lib/util.js'

const FILTERS = [
  { id: 'all', label: 'All starters' },
  { id: 'romance', label: 'Romance' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'angst', label: 'Angst' },
  { id: 'found family', label: 'Found family' },
  { id: 'music', label: 'Music' },
]

const matchesFilter = (template, filter) => {
  if (filter === 'all') return true
  if (filter === 'romance') return template.tags.some((t) => ['romance', 'fake dating', 'rivals'].includes(t))
  if (filter === 'angst') return template.tags.some((t) => ['angst', 'long distance', 'second chance'].includes(t))
  if (filter === 'music') return template.tags.some((t) => ['music', 'band'].includes(t))
  return template.tags.includes(filter)
}

export default function Templates() {
  const navigate = useNavigate()
  const { createProject } = useStudio()
  const [filter, setFilter] = useState('all')
  const previews = useMemo(
    () =>
      TEMPLATES.map((t) => {
        const project = t.build()
        return { template: t, project, screen: project.screens[0] }
      }),
    []
  )
  const visible = previews.filter((p) => matchesFilter(p.template, filter))

  const start = (templateId) => {
    const project = createProject({ templateId })
    navigate(`/p/${project.id}`)
  }

  return (
    <Shell>
      <div className="page">
        <header className="page-head">
          <span className="eyebrow">Story starters</span>
          <h1 className="display">Start from a <em className="accent" style={{ fontStyle: 'italic' }}>feeling.</em></h1>
          <p>
            Six ready-made universes, each with a cast, a mood, and a few screens already in place. Change every name,
            photo and word — then take it somewhere new. Everything autosaves as your own private copy.
          </p>
        </header>
        <div className="row-wrap" style={{ marginBottom: 22 }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={cn('btn btn-sm', filter === f.id ? 'btn-primary' : 'btn-outline')}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="template-grid">
          {visible.map(({ template, project, screen }) => {
            const platform = screen ? getPlatform(screen.platformId) : null
            return (
              <button
                key={template.id}
                className="template-card"
                onClick={() => start(template.id)}
                style={{ '--tint': template.tint }}
              >
                <div className="template-cover">
                  {screen ? (
                    <div className="mini-phone" aria-hidden="true">
                      <PhoneArtboard project={project} screen={screen} exportMode />
                    </div>
                  ) : null}
                </div>
                <div className="template-info">
                  <div className="row">
                    <h3>{template.name}</h3>
                    <ArrowRight size={16} className="muted" />
                  </div>
                  <p>{template.description}</p>
                  <div className="template-tags">
                    <span className="template-tag">{project.screens.length} screens</span>
                    {platform ? <span className="template-tag">{platform.name}</span> : null}
                    {template.tags.slice(0, 2).map((t) => <span className="template-tag" key={t}>{t}</span>)}
                  </div>
                </div>
              </button>
            )
          })}
          {filter === 'all' ? (
            <button className="blank-card" onClick={() => start('blank')}>
              <span className="plus-circle" style={{ width: 44, height: 44, borderRadius: 14, border: '1px solid var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={20} />
              </span>
              <span className="serif" style={{ fontSize: 26, color: 'var(--text)' }}>Blank canvas</span>
              <span className="tiny" style={{ maxWidth: 220, lineHeight: 1.5 }}>Two starter characters and no rules. Add your first screen from the studio.</span>
            </button>
          ) : null}
        </div>
        <div className="center muted tiny" style={{ padding: '0 0 46px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Sparkles size={13} /> Starters are yours to edit — nothing is shared or published anywhere.
        </div>
      </div>
    </Shell>
  )
}
