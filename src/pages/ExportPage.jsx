import React, { useEffect, useMemo, useState } from 'react'
import { Navigate, Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Download,
  FileText,
  Image as ImageIcon,
  Images,
  Loader2,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react'
import Shell from '../components/Shell.jsx'
import { useStudio } from '../lib/store.jsx'
import { useFeedback } from '../components/Feedback.jsx'
import { getPlatform, getScreenMeta } from '../data/platforms.js'
import { PhoneMock } from '../screens/Phone.jsx'
import { Segmented, Toggle } from '../editor/fields.jsx'
import { downloadBackup, exportScreenPng, storyMarkdown, zipScreens } from '../lib/exporter.jsx'
import { downloadFile, slugify } from '../lib/util.js'

export default function ExportPage() {
  const { projectId } = useParams()
  const { getProject, loaded, projects, markBackedUp } = useStudio()
  const { success, error } = useFeedback()
  const project = getProject(projectId)

  const [scale, setScale] = useState('2')
  const [includeScript, setIncludeScript] = useState(true)
  const [selected, setSelected] = useState(() => new Set(project?.screens.map((s) => s.id) || []))
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(null)
  const [single, setSingle] = useState(null)

  useEffect(() => {
    setSelected(new Set(project?.screens.map((s) => s.id) || []))
  }, [project?.id])

  const screens = project?.screens || []
  const chosen = useMemo(() => screens.filter((s) => selected.has(s.id)), [screens, selected])
  const ratio = Number(scale)
  const allOn = screens.length > 0 && chosen.length === screens.length

  if (!loaded) {
    return (
      <div className="loading-screen">
        <span className="loading-mark serif">elsewhere</span>
        <p className="muted small">Loading your screens…</p>
      </div>
    )
  }
  if (!project) {
    if (!projects.length) return <Navigate to="/" replace />
    return <Navigate to="/" replace />
  }

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => setSelected(allOn ? new Set() : new Set(screens.map((s) => s.id)))

  const runZip = async () => {
    if (!chosen.length || busy) return
    setBusy(true)
    setProgress({ current: 0, total: chosen.length })
    try {
      await zipScreens(project, chosen, {
        pixelRatio: ratio,
        includeScript,
        onProgress: (p) => setProgress(p),
      })
      success(`ZIP ready — ${chosen.length} screen${chosen.length === 1 ? '' : 's'} at ${ratio}×.`)
    } catch (e) {
      console.error(e)
      error('The ZIP failed partway through. Try fewer screens at a time.')
    } finally {
      setBusy(false)
      setProgress(null)
    }
  }

  const runSingle = async (screen) => {
    if (single) return
    setSingle(screen.id)
    try {
      const index = project.screens.findIndex((s) => s.id === screen.id)
      await exportScreenPng(project, screen, { pixelRatio: ratio, index })
      success('PNG downloaded.')
    } catch (e) {
      error('Could not export that screen.')
    } finally {
      setSingle(null)
    }
  }

  const downloadScript = () => {
    downloadFile(storyMarkdown(project), `${slugify(project.title) || 'au'}-script.md`, 'text/markdown')
    success('Story script downloaded as Markdown.')
  }

  const downloadProjectFile = () => {
    downloadBackup([project])
    markBackedUp?.()
    success('Project file downloaded. Restore it from Settings any time.')
  }

  return (
    <Shell>
      <div className="page export-page">
        <div className="export-top">
          <Link to={`/p/${project.id}`} className="back-link">
            <ArrowLeft size={15} /> Back to {project.title || 'studio'}
          </Link>
          <div className="export-head">
            <div>
              <span className="eyebrow">
                <Images size={13} /> Export studio
              </span>
              <h1 className="display">
                Take it <em className="accent">off the screen.</em>
              </h1>
              <p className="muted">
                Crisp PNGs at true phone resolution, a ZIP for posting, and a text script of the whole story. Everything is
                rendered from the same artboard you edit.
              </p>
            </div>
            <div className="export-head-badge">
              <span className="export-badge-preview">
                <PhoneMock
                  project={project}
                  screen={screens.find((s) => s.id === project.coverScreenId) || screens[0]}
                  showFrame={false}
                  maxWidth={104}
                />
              </span>
              <span>
                <b>
                  {screens.length} screen{screens.length === 1 ? '' : 's'}
                </b>
                <em>{new Set(screens.map((s) => s.platformId)).size} platforms · {project.cast.length} characters</em>
              </span>
            </div>
          </div>
        </div>

        <div className="export-layout">
          <section className="export-panel">
            <div className="section-heading">
              <h2>Export everything</h2>
              <span className="pill">{ratio * 390} × {ratio * 844} px</span>
            </div>
            <p className="help">
              A ZIP with one PNG per screen, a <code>story-script.md</code> of every caption and message, and the project
              file so the story can always be restored.
            </p>

            <div className="field-row">
              <div className="field">
                <label>Image quality</label>
                <Segmented
                  value={scale}
                  onChange={setScale}
                  options={[
                    { value: '1', label: '1× phone' },
                    { value: '2', label: '2× retina' },
                    { value: '3', label: '3× print' },
                  ]}
                />
                <p className="help">2× is what social apps expect. 3× is for close-up detail.</p>
              </div>
            </div>

            <Toggle
              checked={includeScript}
              onChange={setIncludeScript}
              label="Include the story script"
              hint="A readable Markdown file of every screen — useful for posting the AU as a thread."
            />

            <div className="export-selection-head">
              <span className="small muted">
                {chosen.length} of {screens.length} screens selected
              </span>
              <button className="btn-ghost btn-sm" onClick={toggleAll}>
                {allOn ? 'Deselect all' : 'Select all'}
              </button>
            </div>

            <div className="export-list">
              {screens.map((screen, i) => {
                const meta = getScreenMeta(screen.platformId, screen.type)
                const on = selected.has(screen.id)
                return (
                  <div className={`export-row ${on ? 'is-on' : ''}`} key={screen.id}>
                    <button
                      type="button"
                      className={`export-check ${on ? 'checked' : ''}`}
                      onClick={() => toggle(screen.id)}
                      aria-pressed={on}
                      aria-label={`${on ? 'Deselect' : 'Select'} screen ${i + 1}`}
                    >
                      {on ? <Check size={12} /> : null}
                    </button>
                    <span className="export-row-index serif">{String(i + 1).padStart(2, '0')}</span>
                    <span className="export-row-text">
                      <b>{screen.title || meta.label}</b>
                      <em>
                        {getPlatform(screen.platformId).name} · {meta.label}
                      </em>
                    </span>
                    <button
                      type="button"
                      className="btn-icon sm"
                      title="Download this PNG"
                      onClick={() => runSingle(screen)}
                      disabled={Boolean(single)}
                    >
                      {single === screen.id ? <Loader2 size={15} className="spin" /> : <Download size={15} />}
                    </button>
                  </div>
                )
              })}
            </div>

            <button
              className="btn btn-primary btn-block export-cta"
              onClick={runZip}
              disabled={!chosen.length || busy}
            >
              {busy ? <Loader2 size={16} className="spin" /> : <PackageCheck size={16} />}
              {busy ? 'Rendering screens…' : `Download ${chosen.length || ''} PNGs as ZIP`}
            </button>
            {progress ? (
              <div className="export-progress" role="status" aria-live="polite">
                <div className="export-progress-bar">
                  <i style={{ width: `${Math.round(((progress.current || 0) / (progress.total || 1)) * 100)}%` }} />
                </div>
                <span className="tiny muted">
                  {progress.packaging
                    ? `Packaging ZIP${progress.percent ? ` · ${Math.round(progress.percent)}%` : ''}`
                    : `Screen ${progress.current} of ${progress.total}`}
                </span>
              </div>
            ) : (
              <p className="help export-hint">
                <ShieldCheck size={13} /> Rendering happens on your device. Nothing is uploaded anywhere.
              </p>
            )}
          </section>

          <aside className="export-side">
            <div className="export-side-card">
              <span className="feature-icon"><FileText size={18} /></span>
              <h3>Story script</h3>
              <p className="small muted">Every caption, message and reply in reading order — paste it into a thread or a beta doc.</p>
              <button className="btn btn-outline btn-sm" onClick={downloadScript}>
                <FileText size={14} /> Download .md
              </button>
            </div>

            <div className="export-side-card">
              <span className="feature-icon"><Smartphone size={18} /></span>
              <h3>Project file</h3>
              <p className="small muted">
                A single JSON file with all screens, cast and images inside. This is the safest backup there is.
              </p>
              <button className="btn btn-outline btn-sm" onClick={downloadProjectFile}>
                <Download size={14} /> Download backup
              </button>
            </div>

            <div className="export-side-card muted-card">
              <span className="feature-icon"><Sparkles size={18} /></span>
              <h3>Reading link</h3>
              <p className="small muted">Want to reread it like a reader? Open the scroll-through view and save a screenshot.</p>
              <Link to={`/p/${project.id}/read`} className="btn btn-ghost btn-sm">
                <ImageIcon size={14} /> Open reader
              </Link>
            </div>

            <p className="export-fineprint">
              All platforms are fictional mock-ups for creative writing. Export for fun, not for impersonation.
            </p>
          </aside>
        </div>
      </div>
    </Shell>
  )
}
