import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Images,
  Pencil,
  Smartphone,
  Sparkles,
  Type,
} from 'lucide-react'
import Menu from '../components/Menu.jsx'
import { useStudio } from '../lib/store.jsx'
import { useFeedback } from '../components/Feedback.jsx'
import { getPlatform, getScreenMeta } from '../data/platforms.js'
import { PhoneMock } from '../screens/Phone.jsx'
import { Avatar } from '../screens/ui.jsx'
import { downloadBackup, exportScreenPng } from '../lib/exporter.jsx'
import { cn } from '../lib/util.js'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Reader() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects, loaded, getProject, settings } = useStudio()
  const { success, error } = useFeedback()

  const project = getProject(projectId)
  const screens = project?.screens || []

  const [active, setActive] = useState(0)
  const [captions, setCaptions] = useState(true)
  const [frame, setFrame] = useState(true)
  const [busy, setBusy] = useState(false)
  const scrollerRef = useRef(null)
  const beatRefs = useRef([])
  const coverRef = useRef(null)
  const endRef = useRef(null)

  const reduced = settings?.reduceMotion || prefersReducedMotion()

  const scrollToBeat = useCallback(
    (index) => {
      const target = index < 0 ? coverRef.current : index >= screens.length ? endRef.current : beatRefs.current[index]
      target?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    },
    [reduced, screens.length]
  )

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const nodes = [coverRef.current, ...beatRefs.current, endRef.current].filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const index = nodes.indexOf(visible.target)
        if (index <= 0) setActive(0)
        else if (index <= screens.length) setActive(index - 1)
        else setActive(screens.length - 1)
      },
      { root: scroller, threshold: [0.25, 0.5, 0.75], rootMargin: '-10% 0px -20% 0px' }
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [screens.length, project?.id])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        scrollToBeat(Math.min(active + 1, screens.length))
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        scrollToBeat(Math.max(active - 1, -1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, screens.length, scrollToBeat])

  const coverScreen = useMemo(() => {
    if (!project) return null
    return screens.find((s) => s.id === project.coverScreenId) || screens[0] || null
  }, [project, screens])

  const platformTotal = useMemo(() => new Set(screens.map((s) => s.platformId)).size, [screens])

  if (!loaded) {
    return (
      <div className="loading-screen">
        <span className="loading-mark serif">elsewhere</span>
        <p className="muted small">Opening your story…</p>
      </div>
    )
  }
  if (!project) {
    if (!projects.length) return <Navigate to="/" replace />
    return <Navigate to="/" replace />
  }
  if (!screens.length) {
    return (
      <div className="reader reader-empty">
        <div className="reader-bar">
          <Link to={`/p/${project.id}`} className="btn btn-ghost btn-icon sm" aria-label="Back to workspace">
            <ArrowLeft size={18} />
          </Link>
          <div className="reader-bar-title">
            <b>{project.title}</b>
            <span>Nothing to read yet</span>
          </div>
        </div>
        <div className="reader-blank">
          <Sparkles size={26} />
          <h1 className="display">A story with no scenes — yet.</h1>
          <p>Add your first screen and this becomes a scrollable read-through, one beat at a time.</p>
          <Link to={`/p/${project.id}`} className="btn btn-primary">
            <Pencil size={15} /> Open the studio
          </Link>
        </div>
      </div>
    )
  }

  const progress = Math.round(((Math.min(active + 1, screens.length)) / screens.length) * 100)

  const backup = () => {
    downloadBackup([project])
    success('Backup downloaded — keep it somewhere safe.')
  }

  const saveCurrent = async () => {
    const screen = screens[active] || screens[0]
    if (!screen || busy) return
    setBusy(true)
    try {
      await exportScreenPng(project, screen, { pixelRatio: 2, index: active })
      success('Screenshot saved to your downloads.')
    } catch (e) {
      error('Could not export that screen. Try the Export page instead.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="reader">
      <div className="reader-progress" aria-hidden="true">
        <i style={{ width: `${progress}%` }} />
      </div>

      <div className="reader-bar">
        <button className="btn btn-ghost btn-icon sm" aria-label="Back to workspace" onClick={() => navigate(`/p/${project.id}`)}>
          <ArrowLeft size={18} />
        </button>
        <div className="reader-bar-title">
          <b>{project.title}</b>
          <span>
            {active + 1 > screens.length ? 'The end' : `Screen ${Math.max(active + 1, 1)} of ${screens.length}`}
            {platformTotal ? ` · ${platformTotal} platform${platformTotal === 1 ? '' : 's'}` : ''}
          </span>
        </div>
        <span className="reader-bar-count serif">
          {String(Math.max(active + 1, 1)).padStart(2, '0')}
          <em>/{String(screens.length).padStart(2, '0')}</em>
        </span>
        <Menu
          className="btn btn-ghost btn-icon sm"
          label="Reader options"
          items={[
            { icon: <Type size={15} />, label: captions ? 'Hide captions' : 'Show captions', onClick: () => setCaptions((v) => !v) },
            { icon: <Smartphone size={15} />, label: frame ? 'Hide phone frame' : 'Show phone frame', onClick: () => setFrame((v) => !v) },
            { separator: true },
            { icon: <Download size={15} />, label: 'Save this screen', onClick: saveCurrent },
            { icon: <FileText size={15} />, label: 'Backup project file', onClick: backup },
            { icon: <Images size={15} />, label: 'Export studio', onClick: () => navigate(`/p/${project.id}/export`) },
            { icon: <Pencil size={15} />, label: 'Edit screens', onClick: () => navigate(`/p/${project.id}`) },
          ]}
        />
      </div>

      <div className="reader-scroll" ref={scrollerRef}>
        <header className="reader-cover" ref={coverRef}>
          <div className="reader-cover-glow" style={{ backgroundImage: `radial-gradient(70% 60% at 50% 0%, ${project.style?.accent || '#e7a17a'}33, transparent 70%)` }} />
          <div className="reader-cover-inner">
            <span className="eyebrow">
              <Sparkles size={13} /> A social media AU
            </span>
            <h1 className="display reader-title">{project.title}</h1>
            {project.tagline ? <p className="reader-tagline serif">{project.tagline}</p> : null}
            {project.synopsis ? <p className="reader-synopsis">{project.synopsis}</p> : null}

            {project.cast.length ? (
              <div className="reader-cast">
                {project.cast.slice(0, 6).map((c) => (
                  <div className="reader-cast-item" key={c.id}>
                    <Avatar src={c.avatar} name={c.name} size={38} ring />
                    <span>
                      <b>{c.name}</b>
                      <em>@{c.handle}</em>
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="reader-meta">
              <span>{screens.length} screens</span>
              <i />
              <span>{getPlatform(screens[0]?.platformId).name} to {getPlatform(screens[screens.length - 1]?.platformId).name}</span>
              {project.tags?.length ? (
                <>
                  <i />
                  <span>{project.tags.slice(0, 3).map((t) => `#${t}`).join(' ')}</span>
                </>
              ) : null}
            </div>

            <div className="reader-cover-actions">
              <button className="btn btn-primary" onClick={() => scrollToBeat(0)}>
                <ArrowDown size={15} /> Start reading
              </button>
              <Link to={`/p/${project.id}`} className="btn btn-outline">
                <Pencil size={15} /> Edit
              </Link>
            </div>
            <p className="reader-note">Scroll, or use the arrow keys. Every screen is exactly as it will export.</p>
          </div>
        </header>

        {screens.map((screen, i) => {
          const meta = getScreenMeta(screen.platformId, screen.type)
          const platform = getPlatform(screen.platformId)
          return (
            <article
              className={cn('reader-beat', captions && 'has-caption')}
              key={screen.id}
              ref={(node) => (beatRefs.current[i] = node)}
              aria-label={`${platform.name} ${meta.label} — screen ${i + 1} of ${screens.length}`}
            >
              <div className="reader-beat-inner">
                {captions ? (
                  <div className="reader-caption">
                    <span className="reader-caption-num serif">{String(i + 1).padStart(2, '0')}</span>
                    <span className="reader-caption-text">
                      <em>
                        {platform.name} · {meta.label}
                      </em>
                      <b>{screen.title || meta.hint}</b>
                    </span>
                  </div>
                ) : null}
                <button
                  type="button"
                  className="reader-phone"
                  onClick={() => scrollToBeat(i + 1)}
                  aria-label={`Screen ${i + 1}: tap to continue`}
                >
                  <PhoneMock project={project} screen={screen} showFrame={frame} maxWidth={352} />
                </button>
                {i < screens.length - 1 ? (
                  <span className="reader-next-hint" aria-hidden="true">
                    <ArrowDown size={13} /> next
                  </span>
                ) : null}
              </div>
            </article>
          )
        })}

        <footer className="reader-end" ref={endRef}>
          <span className="eyebrow">End of the thread</span>
          <h2 className="display">That’s the story so far.</h2>
          <p className="muted">Fictional. Invented. Screenshotted nowhere else. Keep building it — everything you write here is saved automatically.</p>
          <div className="reader-end-actions">
            <Link to={`/p/${project.id}/export`} className="btn btn-primary">
              <Images size={15} /> Export all screens
            </Link>
            <Link to={`/p/${project.id}`} className="btn btn-outline">
              <Pencil size={15} /> Back to studio
            </Link>
            <button className="btn btn-ghost" onClick={() => scrollToBeat(-1)}>
              <ArrowUp size={15} /> Start over
            </button>
          </div>
        </footer>
      </div>

      <div className="reader-arrows" aria-hidden={active >= screens.length}>
        <button className="btn btn-ghost btn-icon" onClick={() => scrollToBeat(Math.max(active - 1, -1))} aria-label="Previous screen">
          <ChevronLeft size={18} />
        </button>
        <button className="btn btn-ghost btn-icon" onClick={() => scrollToBeat(Math.min(active + 1, screens.length))} aria-label="Next screen">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
