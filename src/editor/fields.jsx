import React, { useState } from 'react'
import { Image as ImageIcon, Link2, Trash2, Upload, Loader2, Images, Plus, X } from 'lucide-react'
import { STOCK } from '../data/stock.js'
import { compressImage, prettyBytes } from '../lib/media.js'
import { useFeedback } from '../components/Feedback.jsx'
import Modal from '../components/Modal.jsx'
import { Avatar, BrandIcon, mediaSrc } from '../screens/ui.jsx'
import { cn } from '../lib/util.js'

/* ------------------------------------------------------------------ */
/* primitives                                                          */
/* ------------------------------------------------------------------ */
export const Field = ({ label, hint, children, className = '', htmlFor }) => (
  <div className={cn('field', className)}>
    {label ? (
      <label className="label" htmlFor={htmlFor}>
        <span>{label}</span>
        {hint ? <span className="hint">{hint}</span> : null}
      </label>
    ) : null}
    {children}
  </div>
)

export const TextInput = ({ className = '', ...props }) => <input className={cn('input', className)} {...props} />
export const TextArea = ({ className = '', rows = 3, ...props }) => (
  <textarea className={cn('textarea', className)} rows={rows} {...props} />
)

export const NumField = ({ value, onChange, min = 0, step = 1, ...props }) => (
  <input
    type="number"
    inputMode="numeric"
    className="input"
    min={min}
    step={step}
    value={Number.isFinite(Number(value)) ? Number(value) : 0}
    onChange={(e) => onChange(e.target.value === '' ? 0 : Math.max(min, Number(e.target.value)))}
    {...props}
  />
)

export const Toggle = ({ checked, onChange, label, hint }) => (
  <label className="switch" style={{ justifyContent: 'space-between', width: '100%' }}>
    <span className="stack" style={{ gap: 1 }}>
      <span style={{ color: 'var(--text)', fontSize: 13 }}>{label}</span>
      {hint ? <span className="help">{hint}</span> : null}
    </span>
    <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
    <span className="switch-track" />
  </label>
)

export const Segmented = ({ value, onChange, options, label }) => (
  <div className="stack" style={{ gap: 6 }}>
    {label ? <span className="label">{label}</span> : null}
    <div className="segmented">
      {options.map((o) => (
        <button key={o.value} type="button" className={value === o.value ? 'active' : ''} onClick={() => onChange(o.value)}>
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  </div>
)

export const CastSelect = ({ project, value, onChange, label = 'Character', includeEmpty = true, emptyLabel = 'Choose a character…', hint }) => (
  <Field label={label} hint={hint}>
    <select className="select" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      {includeEmpty ? <option value="">{emptyLabel}</option> : null}
      {project.cast.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name} (@{c.handle})
        </option>
      ))}
    </select>
    {!project.cast.length ? <span className="help">Add a character in the Cast tab first.</span> : null}
  </Field>
)

export const EmojiPicker = ({ value, onChange, options = ['❤️', '😂', '😭', '😍', '🔥', '💀', '👀', '🥺', '👍', '🙄'] }) => (
  <div className="stack" style={{ gap: 5 }}>
    <input className="input sm" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="Reaction (optional)" maxLength={8} />
    <div className="row-wrap" style={{ gap: 4 }}>
      {options.map((e) => (
        <button key={e} type="button" className={cn('emoji-btn', value === e && 'active')} onClick={() => onChange(value === e ? '' : e)}>
          {e}
        </button>
      ))}
      {value ? <button type="button" className="btn btn-ghost btn-xs" onClick={() => onChange('')}><X size={11} /> Clear</button> : null}
    </div>
  </div>
)

/* ------------------------------------------------------------------ */
/* stock picker                                                        */
/* ------------------------------------------------------------------ */
export function StockPicker({ onPick, onClose, title = 'Choose a scene' }) {
  return (
    <Modal title={title} subtitle="Tucked-away stock images for when you need a scene, not a photo from your camera roll." onClose={onClose} size="lg">
      <div className="stock-grid">
        {STOCK.map((s) => (
          <button
            key={s.id}
            className="stock-item"
            onClick={() => {
              onPick(s.src)
              onClose()
            }}
          >
            <img src={mediaSrc(s.src)} alt={s.label} loading="lazy" />
            <span>{s.label}</span>
          </button>
        ))}
      </div>
      <p className="help" style={{ marginTop: 14 }}>
        These images are bundled with the studio and live only on your device. You can always upload your own photos instead.
      </p>
    </Modal>
  )
}

/* ------------------------------------------------------------------ */
/* image field                                                         */
/* ------------------------------------------------------------------ */
export function ImageField({
  value,
  onChange,
  label = 'Photo',
  hint,
  square = false,
  round = false,
  max = 1600,
  previewSize = 78,
  compact = false,
}) {
  const feedback = useFeedback()
  const [busy, setBusy] = useState(false)
  const [stockOpen, setStockOpen] = useState(false)

  const upload = () => {
    const el = document.createElement('input')
    el.type = 'file'
    el.accept = 'image/*'
    el.onchange = async () => {
      const file = el.files?.[0]
      if (!file) return
      setBusy(true)
      try {
        const dataUrl = await compressImage(file, { max, square })
        onChange(dataUrl)
      } catch (err) {
        feedback.error(err.message || 'Could not use that image.')
      } finally {
        setBusy(false)
      }
    }
    el.click()
  }

  const paste = async () => {
    const url = await feedback.prompt({
      title: 'Paste an image link',
      body: 'Use a direct image URL (ending in .jpg, .png or .webp). Links from social platforms usually expire — uploading is more reliable.',
      defaultValue: value?.startsWith('http') ? value : '',
      confirmLabel: 'Use link',
      placeholder: 'https://…',
    })
    if (url) onChange(url.trim())
  }

  return (
    <div className="field">
      {label ? (
        <span className="label">
          <span>{label}</span>
          {hint ? <span className="hint">{hint}</span> : null}
        </span>
      ) : null}
      <div className={cn('image-field', compact && 'compact')}>
        <div
          className={cn('image-field-preview', round && 'round', square && 'square')}
          style={{ width: previewSize, height: previewSize }}
        >
          {value ? (
            <img src={mediaSrc(value)} alt="" />
          ) : (
            <span className="image-field-empty"><ImageIcon size={18} /></span>
          )}
          {busy ? <span className="image-field-busy"><Loader2 size={16} className="spin" /></span> : null}
        </div>
        <div className="image-field-actions">
          <div className="row-wrap" style={{ gap: 6 }}>
            <button type="button" className="btn btn-secondary btn-xs" onClick={upload} disabled={busy}>
              <Upload size={12} /> Upload
            </button>
            <button type="button" className="btn btn-ghost btn-xs" onClick={() => setStockOpen(true)}>
              <Images size={12} /> Scenes
            </button>
            <button type="button" className="btn btn-ghost btn-xs" onClick={paste}>
              <Link2 size={12} /> Link
            </button>
            {value ? (
              <button type="button" className="btn btn-ghost btn-xs" onClick={() => onChange('')} aria-label="Remove image">
                <Trash2 size={12} />
              </button>
            ) : null}
          </div>
          <span className="help">
            {value
              ? `${square ? 'Square crop · ' : ''}${value.startsWith('data:') ? prettyBytes(value.length * 0.75) : 'linked image'} · stored on this device`
              : 'JPG, PNG, WebP or GIF · up to 25 MB'}
          </span>
        </div>
      </div>
      {stockOpen ? <StockPicker onClose={() => setStockOpen(false)} onPick={(src) => onChange(src)} /> : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* multi-image field (carousels, tweet media)                          */
/* ------------------------------------------------------------------ */
export function ImageListField({ values = [], onChange, label = 'Photos', max = 4, square = false }) {
  const feedback = useFeedback()
  const [busy, setBusy] = useState(false)
  const [stockOpen, setStockOpen] = useState(false)

  const addFiles = () => {
    const el = document.createElement('input')
    el.type = 'file'
    el.accept = 'image/*'
    el.multiple = true
    el.onchange = async () => {
      const files = Array.from(el.files || []).slice(0, max - values.length)
      if (!files.length) return
      setBusy(true)
      try {
        const imgs = []
        for (const f of files) imgs.push(await compressImage(f, { max: 1600, square }))
        onChange([...values, ...imgs].slice(0, max))
      } catch (err) {
        feedback.error(err.message || 'Could not use those images.')
      } finally {
        setBusy(false)
      }
    }
    el.click()
  }

  return (
    <div className="field">
      <span className="label">
        <span>{label}</span>
        <span className="hint">{values.length}/{max}</span>
      </span>
      <div className="image-list">
        {values.map((src, i) => (
          <div className="image-list-item" key={i}>
            <img src={mediaSrc(src)} alt="" />
            <button type="button" className="image-list-remove" onClick={() => onChange(values.filter((_, k) => k !== i))} aria-label="Remove image">
              <X size={12} />
            </button>
            {values.length > 1 ? <span className="image-list-index">{i + 1}</span> : null}
          </div>
        ))}
        {values.length < max ? (
          <>
            <button type="button" className="image-list-add" onClick={addFiles} disabled={busy}>
              {busy ? <Loader2 size={16} className="spin" /> : <Upload size={16} />}
              <span>Upload</span>
            </button>
            <button type="button" className="image-list-add" onClick={() => setStockOpen(true)}>
              <Plus size={16} />
              <span>Scene</span>
            </button>
          </>
        ) : null}
      </div>
      {stockOpen ? (
        <StockPicker
          onClose={() => setStockOpen(false)}
          onPick={(src) => onChange([...values, src].slice(0, max))}
          title={`Add scene (${values.length}/${max})`}
        />
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* avatar field                                                        */
/* ------------------------------------------------------------------ */
export function AvatarField({ value, onChange, name = 'Character' }) {
  const [stockOpen, setStockOpen] = useState(false)
  return (
    <div className="field">
      <span className="label">Profile photo</span>
      <div className="image-field">
        <Avatar src={value} name={name} size={78} className="avatar-preview" />
        <div className="image-field-actions">
          <AvatarFieldButtons onChange={onChange} onStock={() => setStockOpen(true)} />
          <span className="help">Square crop · 900px max · stored on device</span>
        </div>
      </div>
      {stockOpen ? <StockPicker onClose={() => setStockOpen(false)} onPick={(src) => onChange(src)} title="Choose a profile photo" /> : null}
    </div>
  )
}

const AvatarFieldButtons = ({ onChange, onStock }) => {
  const feedback = useFeedback()
  const [busy, setBusy] = useState(false)
  const upload = () => {
    const el = document.createElement('input')
    el.type = 'file'
    el.accept = 'image/*'
    el.onchange = async () => {
      const file = el.files?.[0]
      if (!file) return
      setBusy(true)
      try {
        onChange(await compressImage(file, { max: 900, square: true }))
      } catch (err) {
        feedback.error(err.message || 'Could not use that image.')
      } finally {
        setBusy(false)
      }
    }
    el.click()
  }
  return (
    <>
      <button type="button" className="btn btn-secondary btn-xs" onClick={upload} disabled={busy}>
        {busy ? <Loader2 size={12} className="spin" /> : <Upload size={12} />} Upload
      </button>
      <button type="button" className="btn btn-ghost btn-xs" onClick={onStock}><Images size={12} /> Scenes</button>
      <button type="button" className="btn btn-ghost btn-xs" onClick={() => onChange('')}><Trash2 size={12} /> Remove</button>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* section / repeat helpers                                            */
/* ------------------------------------------------------------------ */
export const Section = ({ title, hint, action, children, className = '' }) => (
  <section className={cn('panel', className)}>
    <div className="panel-head">
      <div className="grow">
        <h3>{title}</h3>
        {hint ? <p className="help">{hint}</p> : null}
      </div>
      {action}
    </div>
    <div className="panel-body">{children}</div>
  </section>
)

export function RepeatItem({ index, title, onRemove, onUp, onDown, children, subtitle, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? (index === 0 || !title))
  return (
    <div className={cn('repeat-item', open && 'open')}>
      <div className="repeat-head">
        <button type="button" className="repeat-toggle" onClick={() => setOpen((v) => !v)}>
          <span className="repeat-index">{index + 1}</span>
          <span className="repeat-title">
            <b>{title}</b>
            {subtitle ? <em>{subtitle}</em> : null}
          </span>
        </button>
        <div className="repeat-actions">
          {onUp ? <button type="button" className="btn btn-ghost btn-xs" onClick={onUp} aria-label="Move up">↑</button> : null}
          {onDown ? <button type="button" className="btn btn-ghost btn-xs" onClick={onDown} aria-label="Move down">↓</button> : null}
          {onRemove ? <button type="button" className="btn btn-ghost btn-xs" onClick={onRemove} aria-label="Remove"><Trash2 size={12} /></button> : null}
        </div>
      </div>
      {open ? <div className="repeat-body">{children}</div> : null}
    </div>
  )
}

export const AddButton = ({ children, onClick, block = true }) => (
  <button type="button" className={cn('btn btn-outline btn-sm', block && 'btn-block')} onClick={onClick} style={{ borderStyle: 'dashed' }}>
    <Plus size={14} /> {children}
  </button>
)

export const ColorInput = ({ value, onChange, label = 'Accent colour' }) => (
  <Field label={label}>
    <div className="row">
      <input type="color" value={value || '#f0a07c'} onChange={(e) => onChange(e.target.value)} style={{ width: 44, height: 40, borderRadius: 10, border: '1px solid var(--line)', background: 'transparent' }} />
      <input className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="#4a3b52" />
    </div>
  </Field>
)

export const PlatformBadge = ({ platformId, name }) => (
  <span className={cn('platform-badge', platformId === 'x' && 'brand-x')}>
    <BrandIcon name={platformId} size={12} color="currentColor" />
    {name}
  </span>
)
