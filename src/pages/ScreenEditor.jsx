import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createPortal } from 'react-dom'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Maximize2,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react'
import { useStudio } from '../lib/store.jsx'
import { useFeedback } from '../components/Feedback.jsx'
import { getPlatform, getScreenMeta } from '../data/platforms.js'
import { PhoneMock } from '../screens/Phone.jsx'
import { BrandIcon } from '../screens/ui.jsx'
import { SaveIndicator } from '../components/Shell.jsx'
import { exportScreenPng } from '../lib/exporter.jsx'
import { Field, Segmented, Section, TextInput } from '../editor/fields.jsx'
import ScreenForm from '../editor/ScreenForm.jsx'
import { cn } from '../lib/util.js'

function FullPreview({ project, screen, onClose, onExport, exporting }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])
  const platform = getPlatform(screen.platformId)
  const meta = getScreenMeta(screen.platformId, screen.type)
  return createPortal(
    <div className="preview-overlay">
      <div className="preview-overlay-bar">
        <div className="preview-overlay-title">
          <BrandIcon name={platform.id} size={16} color={platform.id === 'x' ? 'currentColor' : platform.tint} />
          <span>{platform.name} · {screen.title || meta.label}</span>
        </div>
        <button className="btn btn-ghost btn-icon sm" onClick={onClose} aria-label="Close preview"><X size={18} /></button>
      </div>
      <div className="preview-overlay-stage">
        <div className="preview-overlay-phone">
          <PhoneMock project={project} screen={screen} showFrame maxWidth={410} />
        </div>
      </div>
      <div className="preview-overlay-foot">
        <span className="tiny muted hide-mobile">390 × 844 · exported at 2× or 3×</span>
        <button className="btn btn-primary btn-sm" onClick={onExport} disabled={exporting}>
          <Download size={14} /> {exporting ? 'Rendering…' : 'Export PNG'}
        </button>
      </div>
    </div>,
    document.body
  )
}

export default function ScreenEditor() {
  const { projectId, screenId } = useParams()
  const navigate = useNavigate()
  const { projects, loaded, patchProject } = useStudio()
  const feedback = useFeedback()
  const project = projects.find((p) => p.id === projectId)
  const screen = project?.screens.find((s) => s.id === screenId)
  const [previewOpen, setPreviewOpen] = useState(true)
  const [fullPreview, setFullPreview] = useState(false)
  const [exporting, setExporting] = useState(false)

  if (!loaded) {
    return <div className="loading-screen"><span className="loading-mark"><span className="spinner" /></span>Opening screen…</div>
  }
  if (!project || !screen) {
    return (
      <div className="page narrow" style={{ paddingTop: 60 }}>
        <div className="empty-card" style={{ minHeight: 240 }}>
          <h2 className="serif" style={{ fontSize: 30, color: 'var(--text)' }}>That screen isn’t here.</h2>
          <p className="muted small">It may have been deleted. Head back to the studio to keep writing.</p>
          <Link to={project ? `/p/${project.id}` : '/'} className="btn btn-primary btn-sm">Back to studio</Link>
        </div>
      </div>
    )
  }

  const platform = getPlatform(screen.platformId)
  const meta = getScreenMeta(screen.platformId, screen.type)
  const index = project.screens.findIndex((s) => s.id === screen.id)
  const prev = project.screens[index - 1]
  const next = project.screens[index + 1]

  const patchScreen = (patch) =>
    patchProject(project.id, (prevProject) => ({
      screens: prevProject.screens.map((s) => (s.id === screen.id ? { ...s, ...patch } : s)),
    }))

  const setData = (patch) => {
    const value = typeof patch === 'function' ? patch(screen.data || {}) : patch
    patchProject(project.id, (prevProject) => ({
      screens: prevProject.screens.map((s) => (s.id === screen.id ? { ...s, data: { ...s.data, ...value } } : s)),
    }))
  }

  const patchDesign = (patch) => {
    const design = { ...(screen.design || {}), ...patch }
    Object.keys(design).forEach((k) => {
      if (design[k] === '' || design[k] === undefined) delete design[k]
    })
    patchScreen({ design })
  }

  const doExport = async () => {
    setExporting(true)
    try {
      const name = await exportScreenPng(project, screen, { pixelRatio: 2, index })
      feedback.success(`Saved ${name}`)
      setFullPreview(false)
    } catch (err) {
      console.error(err)
      feedback.error(err.message || 'Could not export this screen.')
    } finally {
      setExporting(false)
    }
  }

  const remove = async () => {
    const ok = await feedback.confirm({
      title: 'Delete this screen?',
      body: `${platform.name} · ${meta.label} will be removed from “${project.title}”.`,
      confirmLabel: 'Delete screen',
      destructive: true,
    })
    if (!ok) return
    const screens = project.screens.filter((s) => s.id !== screen.id)
    patchProject(project.id, {
      screens,
      coverScreenId: project.coverScreenId === screen.id ? screens[0]?.id || null : project.coverScreenId,
    })
    navigate(`/p/${project.id}`)
    feedback.info('Screen removed.')
  }

  const resetDesign = () => patchScreen({ design: {} })

  return (
    <div className="focus-shell">
      <header className="focus-bar">
        <div className="focus-bar-inner">
          <button className="btn btn-ghost btn-icon sm" onClick={() => navigate(`/p/${project.id}`)} aria-label="Back to studio">
            <ArrowLeft size={18} />
          </button>
          <div className="focus-bar-meta">
            <span className="focus-bar-platform">
              <BrandIcon name={platform.id} size={12} color={platform.id === 'x' ? 'currentColor' : platform.tint} />
              {platform.name}
            </span>
            <span className="focus-bar-screen">{screen.title || meta.label}</span>
          </div>
          <div className="focus-bar-actions">
            <SaveIndicator compact />
            <button className="btn btn-ghost btn-icon sm only-mobile" onClick={() => setPreviewOpen((v) => !v)} aria-label="Toggle preview">
              {previewOpen ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
            <button className="btn btn-outline btn-sm hide-mobile" onClick={() => setFullPreview(true)}>
              <Maximize2 size={13} /> Preview
            </button>
            <button className="btn btn-primary btn-sm" onClick={doExport} disabled={exporting}>
              <Download size={14} /> {exporting ? 'Rendering…' : 'Export'}
            </button>
          </div>
        </div>
      </header>

      <div className={cn('editor-layout', !previewOpen && 'preview-hidden')}>
        <aside className="editor-preview-col">
          <div className="editor-preview-card">
            <div className="editor-preview-head">
              <span className="row" style={{ gap: 6 }}><BrandIcon name={platform.id} size={12} color={platform.id === 'x' ? 'currentColor' : platform.tint} /> {platform.name}</span>
              <span className="editor-preview-type">{meta.label}</span>
            </div>
            <div className="editor-preview-phone">
              <PhoneMock project={project} screen={screen} showFrame maxWidth={340} />
            </div>
            <div className="editor-preview-actions">
              <button className="btn btn-ghost btn-xs" onClick={() => setFullPreview(true)}><Maximize2 size={12} /> Full screen</button>
              <button className="btn btn-ghost btn-xs only-mobile" onClick={() => setPreviewOpen(false)}><EyeOff size={12} /> Hide</button>
            </div>
          </div>
          <p className="editor-preview-note">Live preview. Exports are clean 390 × 844 screenshots — no phone bezel.</p>
        </aside>

        <div className="editor-form-col">
          <div className="editor-intro">
            <div>
              <span className="eyebrow">Screen {index + 1} of {project.screens.length}</span>
              <h1 className="display">{screen.title || meta.label}</h1>
              <p className="help">{meta.hint}. Changes save themselves.</p>
            </div>
            <Link to={`/p/${project.id}/read`} className="btn btn-outline btn-xs"><Eye size={12} /> Read story</Link>
          </div>

          <div className="panel" style={{ marginBottom: 14 }}>
            <div className="panel-body" style={{ display: 'grid', gap: 10 }}>
              <Field label="Screen label" hint="only visible in your studio">
                <TextInput value={screen.title || ''} onChange={(e) => patchScreen({ title: e.target.value })} placeholder={`${meta.label} ${index + 1}`} />
              </Field>
            </div>
          </div>

          <ScreenForm project={project} screen={screen} set={setData} />

          <Section title="This screen’s look" hint="Overrides for this screenshot only.">
            <div className="stack" style={{ gap: 13 }}>
              <Segmented
                label="Theme"
                value={screen.design?.theme || 'auto'}
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
                onChange={(v) => patchDesign({ theme: v })}
              />
              <div className="field-row">
                <Field label="Status bar time" hint="blank = project default">
                  <TextInput value={screen.design?.time || ''} onChange={(e) => patchDesign({ time: e.target.value })} placeholder={project.style?.time || '9:41'} />
                </Field>
                <Field label="Battery %" hint="blank = project default">
                  <TextInput
                    inputMode="numeric"
                    value={screen.design?.battery ?? ''}
                    onChange={(e) => patchDesign({ battery: e.target.value === '' ? '' : Math.max(1, Math.min(100, Number(e.target.value))) })}
                    placeholder={String(project.style?.battery ?? 78)}
                  />
                </Field>
              </div>
              <div className="row-wrap">
                <button className="btn btn-ghost btn-xs" onClick={resetDesign}><RotateCcw size={12} /> Reset screen look</button>
                <button className="btn btn-danger-ghost btn-xs" onClick={remove}><Trash2 size={12} /> Delete screen</button>
              </div>
            </div>
          </Section>

          <div className="editor-pager">
            {prev ? (
              <Link to={`/p/${project.id}/s/${prev.id}`} className="btn btn-outline btn-sm"><ChevronLeft size={15} /> Previous</Link>
            ) : <span />}
            <Link to={`/p/${project.id}`} className="btn btn-ghost btn-sm">Back to studio</Link>
            {next ? (
              <Link to={`/p/${project.id}/s/${next.id}`} className="btn btn-outline btn-sm">Next <ChevronRight size={15} /></Link>
            ) : <span />}
          </div>

          <div className="editor-autosave-note">
            <span className="save-dot saved" /> Autosaved locally. <Link to="/settings">Backup options</Link>
          </div>
        </div>
      </div>

      {fullPreview ? (
        <FullPreview
          project={project}
          screen={screen}
          onClose={() => setFullPreview(false)}
          onExport={doExport}
          exporting={exporting}
        />
      ) : null}
    </div>
  )
}
