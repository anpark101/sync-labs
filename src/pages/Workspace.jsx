import React, { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  Copy,
  Download,
  Eye,
  Images,
  Layers,
  LayoutGrid,
  Palette,
  Pencil,
  Plus,
  Smartphone,
  Star,
  Trash2,
  Users,
  Check,
  AlertCircle,
} from 'lucide-react'
import Shell from '../components/Shell.jsx'
import Modal from '../components/Modal.jsx'
import Menu from '../components/Menu.jsx'
import { useStudio } from '../lib/store.jsx'
import { useFeedback } from '../components/Feedback.jsx'
import { addScreen, newCharacter, projectStats, stripCastReferences, DEFAULT_STYLE } from '../lib/schema.js'
import { PLATFORMS, getPlatform, getScreenMeta, platformCount } from '../data/platforms.js'
import { summarizeScreen } from '../data/defaults.js'
import { PhoneArtboard, PhoneMock } from '../screens/Phone.jsx'
import { Avatar, BrandIcon } from '../screens/ui.jsx'
import { AvatarField, Field, NumField, Section, TextArea, TextInput, Toggle } from '../editor/fields.jsx'
import { cn, formatCount, relativeDate, uid } from '../lib/util.js'

const TABS = [
  { id: 'screens', label: 'Screens', icon: <Layers size={15} /> },
  { id: 'cast', label: 'Cast', icon: <Users size={15} /> },
  { id: 'look', label: 'Look & details', icon: <Palette size={15} /> },
]

function AddScreenModal({ project, onClose, onAdd }) {
  return (
    <Modal
      title="Add a screen"
      subtitle="Pick a platform, then the kind of screen. You can edit every detail after."
      onClose={onClose}
      size="lg"
      className="add-screen-modal"
    >
      <div className="platform-picker">
        {PLATFORMS.map((platform) => (
          <div className="platform-picker-group" key={platform.id}>
            <div className="platform-picker-head">
              <span className="platform-picker-icon" style={{ color: platform.id === 'x' ? 'var(--text)' : platform.tint }}>
                <BrandIcon name={platform.id} size={17} />
              </span>
              <span className="grow">
                <b>{platform.name}</b>
                <em>{platform.blurb}</em>
              </span>
            </div>
            <div className="screen-type-grid">
              {platform.screens.map((s) => (
                <button key={s.type} className="screen-type-btn" onClick={() => onAdd(platform.id, s.type)}>
                  <span className="screen-type-label">{s.label}</span>
                  <span className="screen-type-hint">{s.hint}</span>
                  <Plus size={14} className="screen-type-plus" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

function CastEditor({ project, character, onClose, onSave }) {
  const isNew = !character?.id
  const [form, setForm] = useState(() => ({
    ...newCharacter({ name: '', handle: '', bio: '', followers: 1200, following: 240, ...character }),
  }))
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const cleanHandle = (v) => v.replace(/^@/, '').replace(/\s+/g, '').toLowerCase()
  const canSave = form.name.trim().length > 0
  return (
    <Modal
      title={isNew ? 'New character' : 'Edit character'}
      subtitle="Names, handles and photos are reused on every screen they appear in."
      onClose={onClose}
      size="md"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!canSave}
            onClick={() =>
              onSave({
                ...form,
                name: form.name.trim(),
                handle: cleanHandle(form.handle || form.name.replace(/\s+/g, '')),
              })
            }
          >
            {isNew ? 'Add to cast' : 'Save changes'}
          </button>
        </>
      }
    >
      <div className="stack" style={{ gap: 14 }}>
        <AvatarField value={form.avatar} onChange={(avatar) => set({ avatar })} name={form.name || 'Character'} />
        <div className="field-row">
          <Field label="Name">
            <TextInput
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Juno Vale"
              onBlur={() => {
                if (!form.handle && form.name) set({ handle: cleanHandle(form.name.replace(/\s+/g, '')) })
              }}
            />
          </Field>
          <Field label="Handle" hint="without @">
            <TextInput value={form.handle} onChange={(e) => set({ handle: cleanHandle(e.target.value) })} placeholder="junolately" />
          </Field>
        </div>
        <Field label="Bio" hint="shows on profiles">
          <TextArea rows={2} value={form.bio} onChange={(e) => set({ bio: e.target.value })} placeholder="photographer. fairly unreasonable." />
        </Field>
        <div className="field-row">
          <Field label="Followers">
            <NumField value={form.followers} onChange={(v) => set({ followers: v })} />
          </Field>
          <Field label="Following">
            <NumField value={form.following} onChange={(v) => set({ following: v })} />
          </Field>
        </div>
        <Field label="Link" hint="optional">
          <TextInput value={form.link} onChange={(e) => set({ link: e.target.value })} placeholder="junovale.studio" />
        </Field>
        <div className="field-row">
          <Field label="Name colour" hint="Discord roles & accents">
            <div className="row">
              <input type="color" value={form.color || '#f0a07c'} onChange={(e) => set({ color: e.target.value })} style={{ width: 44, height: 42, borderRadius: 10, border: '1px solid var(--line)', background: 'transparent' }} />
              <TextInput value={form.color} onChange={(e) => set({ color: e.target.value })} />
            </div>
          </Field>
          <div className="stack" style={{ justifyContent: 'flex-end', paddingBottom: 6 }}>
            <Toggle checked={form.verified} onChange={(v) => set({ verified: v })} label="Verified badge" hint="blue check on profiles" />
          </div>
        </div>
      </div>
    </Modal>
  )
}

const TagField = ({ project, onSave }) => {
  const [text, setText] = useState(project.tags.join(', '))
  return (
    <Field label="Tags" hint="comma separated">
      <TextInput
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onSave(text.split(',').map((t) => t.trim()).filter(Boolean))}
        placeholder="slow burn, late night, record shop"
      />
    </Field>
  )
}

function LookTab({ project, patch, navigate }) {
  const style = project.style || DEFAULT_STYLE
  const setStyle = (patchStyle) => patch({ style: { ...style, ...patchStyle } })
  const cover = project.screens.find((s) => s.id === project.coverScreenId) || project.screens[0]
  return (
    <div className="look-layout">
      <div className="look-preview">
        <div className="look-preview-inner">
          {cover ? <PhoneMock project={project} screen={cover} showFrame={style.frame === 'iphone'} maxWidth={340} /> : (
            <div className="empty-card" style={{ minHeight: 300 }}>
              <Images size={22} />
              <span className="small">Add a screen to see your look.</span>
            </div>
          )}
          <span className="look-preview-caption">Preview uses your cover screen.</span>
        </div>
      </div>
      <div className="stack look-controls" style={{ gap: 14 }}>
        <Section title="Device & status bar" hint="Applied to every screen. Each screen can override the theme.">
          <div className="stack" style={{ gap: 14 }}>
            <span className="label">Frame</span>
            <div className="segmented">
              <button className={style.frame === 'iphone' ? 'active' : ''} onClick={() => setStyle({ frame: 'iphone' })}>
                <Smartphone size={13} /> iPhone frame
              </button>
              <button className={style.frame === 'none' ? 'active' : ''} onClick={() => setStyle({ frame: 'none' })}>
                <LayoutGrid size={13} /> Export only
              </button>
            </div>
            <span className="label">Frame colour</span>
            <div className="color-swatches">
              {[
                ['black', '#111114'],
                ['silver', '#c9c9ce'],
                ['gold', '#c8ac82'],
              ].map(([id, color]) => (
                <button
                  key={id}
                  className={cn('color-swatch', style.frameColor === id && 'active')}
                  style={{ background: color }}
                  onClick={() => setStyle({ frameColor: id })}
                  aria-label={id}
                />
              ))}
              <span className="help" style={{ alignSelf: 'center', marginLeft: 4 }}>preview only — exports are clean screens</span>
            </div>
            <div className="field-row">
              <Field label="Status bar time">
                <TextInput value={style.time} onChange={(e) => setStyle({ time: e.target.value })} placeholder="9:41" maxLength={8} />
              </Field>
              <Field label="Battery %">
                <NumField value={style.battery} min={1} max={100} onChange={(v) => setStyle({ battery: Math.min(100, v) })} />
              </Field>
            </div>
            <div className="stack" style={{ gap: 10 }}>
              <Toggle checked={style.statusBar} onChange={(v) => setStyle({ statusBar: v })} label="Show iOS status bar" />
              <Toggle checked={style.island} onChange={(v) => setStyle({ island: v })} label="Dynamic Island" />
              <Toggle checked={style.watermark} onChange={(v) => setStyle({ watermark: v })} label="Small studio watermark" hint="tiny text at the bottom of exports" />
              {style.watermark ? (
                <TextInput className="input sm" value={style.watermarkText} onChange={(e) => setStyle({ watermarkText: e.target.value })} placeholder="elsewhere" />
              ) : null}
            </div>
            <span className="label">Theme</span>
            <div className="segmented">
              {['auto', 'light', 'dark'].map((t) => (
                <button key={t} className={style.theme === t ? 'active' : ''} onClick={() => setStyle({ theme: t })}>
                  {t === 'auto' ? 'Auto' : t === 'light' ? 'Light' : 'Dark'}
                </button>
              ))}
            </div>
            <span className="help">Auto uses each platform’s native look (X and TikTok are dark, Instagram is light). Override the theme per screen in the screen editor.</span>
          </div>
        </Section>

        <Section title="Story details" hint="Shown in your library and on exports.">
          <div className="stack" style={{ gap: 12 }}>
            <Field label="Title">
              <TextInput value={project.title} onChange={(e) => patch({ title: e.target.value })} />
            </Field>
            <Field label="Tagline">
              <TextInput value={project.tagline} onChange={(e) => patch({ tagline: e.target.value })} placeholder="A slow-burn AU told entirely through screens." />
            </Field>
            <Field label="Synopsis">
              <TextArea rows={3} value={project.synopsis} onChange={(e) => patch({ synopsis: e.target.value })} />
            </Field>
            <div className="field-row">
              <Field label="Fandom / world">
                <TextInput value={project.fandom} onChange={(e) => patch({ fandom: e.target.value })} placeholder="Original" />
              </Field>
              <Field label="Cover screen">
                <select className="select" value={project.coverScreenId || ''} onChange={(e) => patch({ coverScreenId: e.target.value })}>
                  {project.screens.map((s, i) => (
                    <option key={s.id} value={s.id}>
                      {i + 1}. {s.title || getScreenMeta(s.platformId, s.type).label} · {getPlatform(s.platformId).name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <TagField project={project} onSave={(tags) => patch({ tags })} />
          </div>
        </Section>

        <Section title="Story health" hint="Small checks before you export.">
          <div className="stack" style={{ gap: 9 }}>
            {[
              { ok: project.cast.length >= 2, text: `${project.cast.length} character${project.cast.length === 1 ? '' : 's'} in your cast` },
              { ok: project.screens.length >= 3, text: `${project.screens.length} screen${project.screens.length === 1 ? '' : 's'} in the story` },
              { ok: project.tagline || project.synopsis, text: 'A tagline or synopsis for your library' },
            ].map((check, i) => (
              <span key={i} className="row" style={{ gap: 8, fontSize: 12.5, color: check.ok ? 'var(--text-2)' : 'var(--muted)' }}>
                {check.ok ? <Check size={14} color="var(--success)" /> : <AlertCircle size={14} />}
                {check.text}
              </span>
            ))}
            <button className="btn btn-outline btn-sm" style={{ marginTop: 4 }} onClick={() => navigate(`/p/${project.id}/export`)}>
              <Download size={14} /> Open export studio
            </button>
          </div>
        </Section>
      </div>
    </div>
  )
}

export default function Workspace() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects, loaded, patchProject, duplicateProject, deleteProject } = useStudio()
  const feedback = useFeedback()
  const project = projects.find((p) => p.id === projectId)
  const [tab, setTab] = useState('screens')
  const [addOpen, setAddOpen] = useState(false)
  const [castEdit, setCastEdit] = useState(null)
  const [filter, setFilter] = useState('all')

  const stats = useMemo(() => (project ? projectStats(project) : null), [project])

  if (!loaded) {
    return (
      <Shell footer={false}>
        <div className="loading-screen"><span className="loading-mark"><span className="spinner" /></span>Opening your studio…</div>
      </Shell>
    )
  }
  if (!project) {
    return (
      <Shell>
        <div className="page narrow" style={{ paddingTop: 70 }}>
          <div className="empty-card" style={{ minHeight: 260 }}>
            <h2 className="serif" style={{ fontSize: 32, color: 'var(--text)' }}>This AU isn’t here.</h2>
            <p className="muted small">It may have been deleted, or this link is from another device. Your library lives in the browser where you created it.</p>
            <Link to="/" className="btn btn-primary btn-sm">Back to library</Link>
          </div>
        </div>
      </Shell>
    )
  }

  const patch = (value) => patchProject(project.id, value)

  const rename = async () => {
    const value = await feedback.prompt({ title: 'Rename this AU', defaultValue: project.title, confirmLabel: 'Save name' })
    if (value?.trim()) patch({ title: value.trim() })
  }

  const duplicate = () => {
    const copy = duplicateProject(project.id)
    if (copy) {
      feedback.success('A full copy is yours. All characters and screens came with it.')
      navigate(`/p/${copy.id}`)
    }
  }

  const remove = async () => {
    const ok = await feedback.confirm({
      title: `Delete “${project.title}”?`,
      body: 'This removes the AU, its characters and its photos from this browser. This can’t be undone.',
      confirmLabel: 'Delete AU',
      destructive: true,
    })
    if (!ok) return
    deleteProject(project.id)
    navigate('/')
    feedback.info('AU deleted.')
  }

  const handleAdd = (platformId, type) => {
    const { project: next, screen } = addScreen(project, platformId, type)
    patch({ screens: next.screens, coverScreenId: next.coverScreenId })
    setAddOpen(false)
    feedback.success(`${getPlatform(platformId).name} · ${getScreenMeta(platformId, type).label} added.`)
    navigate(`/p/${project.id}/s/${screen.id}`)
  }

  const duplicateScreen = (screen) => {
    const copy = { ...JSON.parse(JSON.stringify(screen)), id: uid('s'), title: screen.title ? `${screen.title} (copy)` : '' }
    const idx = project.screens.findIndex((s) => s.id === screen.id)
    const screens = [...project.screens]
    screens.splice(idx + 1, 0, copy)
    patch({ screens })
    feedback.success('Screen duplicated.')
  }

  const removeScreen = async (screen) => {
    const meta = getScreenMeta(screen.platformId, screen.type)
    const ok = await feedback.confirm({
      title: 'Delete this screen?',
      body: `${getPlatform(screen.platformId).name} · ${meta.label} will be removed from the story. Other screens aren’t affected.`,
      confirmLabel: 'Delete screen',
      destructive: true,
    })
    if (!ok) return
    const screens = project.screens.filter((s) => s.id !== screen.id)
    patch({ screens, coverScreenId: project.coverScreenId === screen.id ? screens[0]?.id || null : project.coverScreenId })
    feedback.info('Screen removed.')
  }

  const moveScreen = (screen, dir) => {
    const idx = project.screens.findIndex((s) => s.id === screen.id)
    const to = idx + dir
    if (to < 0 || to >= project.screens.length) return
    const screens = [...project.screens]
    const [item] = screens.splice(idx, 1)
    screens.splice(to, 0, item)
    patch({ screens })
  }

  const saveCast = (character) => {
    const exists = project.cast.some((c) => c.id === character.id)
    patch({
      cast: exists ? project.cast.map((c) => (c.id === character.id ? character : c)) : [...project.cast, character],
    })
    setCastEdit(null)
    feedback.success(exists ? 'Character updated everywhere.' : 'Character added to your cast.')
  }

  const deleteCast = async (character) => {
    const ok = await feedback.confirm({
      title: `Remove ${character.name}?`,
      body: 'Their name and photo will be cleared from screens that reference them. Screens themselves stay put.',
      confirmLabel: 'Remove character',
      destructive: true,
    })
    if (!ok) return
    const stripped = stripCastReferences(project, character.id)
    patch(stripped)
    feedback.info('Character removed.')
  }

  const platformFilters = useMemo(() => {
    const seen = []
    for (const s of project.screens) if (!seen.find((x) => x.id === s.platformId)) seen.push(getPlatform(s.platformId))
    return seen
  }, [project.screens])
  const visibleScreens = filter === 'all' ? project.screens : project.screens.filter((s) => s.platformId === filter)
  const cover = project.screens.find((s) => s.id === project.coverScreenId) || project.screens[0]

  return (
    <Shell footer={false}>
      <div className="page studio-page">
        <div className="studio-topline">
          <Link to="/" className="back-link"><ArrowLeft size={15} /> Library</Link>
          <div className="row" style={{ gap: 7 }}>
            <span className="muted tiny">{relativeDate(project.updatedAt)}</span>
            <span className="tiny muted">·</span>
            <span className="tiny muted">stored on this device</span>
          </div>
        </div>

        {project.demo ? (
          <div className="demo-banner">
            <span className="demo-banner-icon"><Star size={15} /></span>
            <div className="grow">
              <b>You’re editing the sample AU.</b>
              <span> Changes save here too. Duplicate it if you want a clean copy to make your own.</span>
            </div>
            <button className="btn btn-secondary btn-xs" onClick={duplicate}><Copy size={12} /> Make it mine</button>
          </div>
        ) : null}

        <header className="project-head">
          <div className="project-head-copy">
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              {project.fandom || 'Original'} · {project.tags.slice(0, 3).join(' · ') || 'no tags yet'}
            </div>
            <h1 className="display project-h1">
              {project.title}
              <button className="btn btn-ghost btn-icon sm" onClick={rename} aria-label="Rename AU" style={{ marginLeft: 4, verticalAlign: 'middle' }}>
                <Pencil size={14} />
              </button>
            </h1>
            <p className="project-tagline-lg">{project.tagline || 'No tagline yet — add one in Look & details.'}</p>
            <div className="project-stats">
              <span><Layers size={13} /> <b>{stats.screens}</b> screens</span>
              <span><LayoutGrid size={13} /> <b>{stats.platforms}</b> platforms</span>
              <span><Users size={13} /> <b>{stats.characters}</b> cast</span>
              <span>~<b>{formatCount(stats.words)}</b> words</span>
            </div>
          </div>
          <div className="project-head-actions">
            <Link to={`/p/${project.id}/read`} className="btn btn-outline btn-sm"><Eye size={14} /> Read story</Link>
            <Link to={`/p/${project.id}/export`} className="btn btn-primary btn-sm"><Download size={14} /> Export</Link>
            <Menu
              className="btn btn-ghost btn-icon sm"
              items={[
                { label: 'Duplicate AU', icon: <Copy size={14} />, onClick: duplicate },
                { label: 'Story details', icon: <Palette size={14} />, onClick: () => setTab('look') },
                { separator: true },
                { label: 'Delete AU', icon: <Trash2 size={14} />, danger: true, onClick: remove },
              ]}
            />
          </div>
        </header>

        <nav className="studio-tabs" aria-label="Studio sections">
          {TABS.map((t) => (
            <button key={t.id} className={cn('studio-tab', tab === t.id && 'active')} onClick={() => setTab(t.id)}>
              {t.icon}
              {t.label}
              {t.id === 'screens' ? <span className="tab-count">{project.screens.length}</span> : null}
              {t.id === 'cast' ? <span className="tab-count">{project.cast.length}</span> : null}
            </button>
          ))}
        </nav>

        {tab === 'screens' ? (
          <div className="studio-section">
            <div className="section-toolbar">
              <div className="filter-chips">
                <button className={cn('filter-chip', filter === 'all' && 'active')} onClick={() => setFilter('all')}>All screens</button>
                {platformFilters.map((p) => (
                  <button key={p.id} className={cn('filter-chip', filter === p.id && 'active')} onClick={() => setFilter(p.id)}>
                    <BrandIcon name={p.id} size={11} color={p.id === 'x' ? 'currentColor' : p.tint} />
                    {p.name}
                  </button>
                ))}
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}><Plus size={14} /> Add screen</button>
            </div>

            {project.screens.length ? (
              <div className="screen-grid">
                {visibleScreens.map((s) => {
                  const platform = getPlatform(s.platformId)
                  const meta = getScreenMeta(s.platformId, s.type)
                  const isCover = s.id === project.coverScreenId
                  return (
                    <article className={cn('screen-card', isCover && 'is-cover')} key={s.id}>
                      <button className="screen-thumb" onClick={() => navigate(`/p/${project.id}/s/${s.id}`)} style={{ '--cover-glow': `${platform.tint}2c` }}>
                        <span className="screen-thumb-badge">
                          <BrandIcon name={platform.id} size={11} color={platform.id === 'x' ? '#fff' : platform.tint} />
                          {platform.name}
                        </span>
                        {isCover ? <span className="screen-thumb-cover" title="Cover screen"><Star size={10} /> <em>Cover</em></span> : null}
                        <div className="mini-phone screen-mini" aria-hidden="true">
                          <PhoneArtboard project={project} screen={s} exportMode />
                        </div>
                      </button>
                      <div className="screen-card-body">
                        <div className="screen-card-title">
                          {s.title || meta.label}
                        </div>
                        <div className="screen-card-sub">{summarizeScreen(s, project) || meta.hint}</div>
                        <div className="screen-card-actions">
                          <Link to={`/p/${project.id}/s/${s.id}`} className="btn btn-secondary btn-xs">
                            <Pencil size={11} /> Edit
                          </Link>
                          <Menu
                            className="project-more"
                            items={[
                              { label: 'Edit screen', icon: <Pencil size={13} />, onClick: () => navigate(`/p/${project.id}/s/${s.id}`) },
                              { label: 'Set as cover', icon: <Star size={13} />, onClick: () => { patch({ coverScreenId: s.id }); feedback.success('Cover updated.') } },
                              { label: 'Duplicate', icon: <Copy size={13} />, onClick: () => duplicateScreen(s) },
                              { label: 'Move up', onClick: () => moveScreen(s, -1) },
                              { label: 'Move down', onClick: () => moveScreen(s, 1) },
                              { separator: true },
                              { label: 'Delete screen', icon: <Trash2 size={13} />, danger: true, onClick: () => removeScreen(s) },
                            ]}
                          />
                        </div>
                      </div>
                    </article>
                  )
                })}
                <button className="add-screen-card" onClick={() => setAddOpen(true)}>
                  <span className="plus-circle"><Plus size={18} /></span>
                  <b>Add a screen</b>
                  <span className="tiny muted">{platformCount} platforms · {project.screens.length ? 'mix as many as you like' : 'start anywhere'}</span>
                </button>
              </div>
            ) : (
              <div className="studio-empty">
                <span className="feature-icon"><Layers size={20} /></span>
                <h2 className="serif">A blank universe, <em className="accent">for now.</em></h2>
                <p className="muted small">Add your first screen. Most stories start with a chat, a post, or a 2am lock screen.</p>
                <button className="btn btn-primary" onClick={() => setAddOpen(true)}><Plus size={15} /> Add your first screen</button>
                <div className="row-wrap" style={{ justifyContent: 'center', marginTop: 4 }}>
                  {[['imessage', 'chat'], ['instagram', 'post'], ['x', 'post']].map(([p, t]) => (
                    <button key={p} className="btn btn-outline btn-xs" onClick={() => handleAdd(p, t)}>
                      <BrandIcon name={p} size={11} color="currentColor" /> {getPlatform(p).name} {getScreenMeta(p, t).label.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {tab === 'cast' ? (
          <div className="studio-section">
            <div className="section-toolbar">
              <div>
                <h2 className="section-title">The cast</h2>
                <p className="help">Shared across every screen. Update a name or photo once and it changes everywhere.</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setCastEdit({})}><Plus size={14} /> Add character</button>
            </div>
            <div className="cast-grid">
              {project.cast.map((c) => {
                const uses = project.screens.filter((s) => JSON.stringify(s.data).includes(c.id)).length
                return (
                  <article className="cast-card" key={c.id}>
                    <Avatar src={c.avatar} name={c.name} size={64} />
                    <div className="cast-card-main">
                      <div className="cast-name">
                        {c.name}
                        {c.verified ? <span className="verified-mini">✓</span> : null}
                      </div>
                      <div className="cast-handle">@{c.handle}</div>
                      <p className="cast-bio">{c.bio || 'No bio yet.'}</p>
                      <div className="cast-meta">
                        <span>{formatCount(c.followers)} followers</span>
                        <i />
                        <span>in {uses} screen{uses === 1 ? '' : 's'}</span>
                      </div>
                    </div>
                    <Menu
                      className="project-more"
                      items={[
                        { label: 'Edit character', icon: <Pencil size={13} />, onClick: () => setCastEdit(c) },
                        { separator: true },
                        { label: 'Remove', icon: <Trash2 size={13} />, danger: true, onClick: () => deleteCast(c) },
                      ]}
                    />
                  </article>
                )
              })}
              <button className="add-screen-card cast-add" onClick={() => setCastEdit({})}>
                <span className="plus-circle"><Plus size={18} /></span>
                <b>Add a character</b>
                <span className="tiny muted">Names, handles, faces and bios</span>
              </button>
            </div>
          </div>
        ) : null}

        {tab === 'look' ? <div className="studio-section"><LookTab project={project} patch={patch} navigate={navigate} /></div> : null}

        <div className="studio-footer-note">
          <span><Check size={13} /> Autosave is on. Everything is stored privately in this browser.</span>
          <Link to="/settings" className="row" style={{ gap: 5 }}>Backup settings <ArrowUpRight size={12} /></Link>
        </div>
      </div>

      {addOpen ? <AddScreenModal project={project} onClose={() => setAddOpen(false)} onAdd={handleAdd} /> : null}
      {castEdit !== null ? (
        <CastEditor
          project={project}
          character={castEdit}
          onClose={() => setCastEdit(null)}
          onSave={saveCast}
        />
      ) : null}
    </Shell>
  )
}
