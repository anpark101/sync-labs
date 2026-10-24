export const uid = (prefix = 'id') =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`

export const cn = (...args) => args.filter(Boolean).join(' ')

export const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

export const toInt = (v, fallback = 0) => {
  if (typeof v === 'number' && Number.isFinite(v)) return Math.max(0, Math.round(v))
  const parsed = parseInt(String(v ?? '').replace(/[^0-9-]/g, ''), 10)
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback
}

/** 1,428 */
export const formatCount = (n) => toInt(n).toLocaleString('en-US')

/** 1.4K / 2.1M — used by X, TikTok, YouTube */
export const compact = (n) => {
  const v = toInt(n)
  if (v < 1000) return String(v)
  if (v < 1000000) {
    const k = v / 1000
    return `${k < 10 ? trim(k) : Math.round(k)}K`
  }
  const m = v / 1000000
  return `${m < 10 ? trim(m) : Math.round(m)}M`
}
const trim = (n) => String(Number(n.toFixed(1))).replace(/\.0$/, '')

export const plural = (n, word, pluralWord) =>
  `${formatCount(n)} ${toInt(n) === 1 ? word : pluralWord || `${word}s`}`

export const truncate = (str = '', len = 120) =>
  str.length > len ? `${str.slice(0, len - 1).trimEnd()}…` : str

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || '?'

const AVATAR_COLORS = [
  ['#f5a97f', '#c2513a'],
  ['#b8a6f5', '#5a4bb3'],
  ['#94c9a9', '#2d6a4f'],
  ['#f2c48d', '#a35f1f'],
  ['#9fc6e8', '#2a5c8a'],
  ['#e8a2bd', '#8a335a'],
  ['#c9c19f', '#6b6444'],
]

/** Stable gradient for placeholder avatars */
export const gradientFor = (seed = '') => {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  const [a, b] = AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
  return `linear-gradient(140deg, ${a}, ${b})`
}

export const prettyDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const relativeDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return prettyDate(iso)
}

export const downloadFile = (data, filename, type = 'application/octet-stream') => {
  const blob = data instanceof Blob ? data : new Blob([data], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export const slugify = (str = 'au') =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'au'

export const randomBattery = () => 60 + Math.floor(Math.random() * 40)

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
      return true
    } catch {
      return false
    }
  }
}

export const byId = (arr = []) => Object.fromEntries(arr.map((x) => [x.id, x]))

export const moveItem = (arr, from, to) => {
  const copy = [...arr]
  if (to < 0 || to >= copy.length) return copy
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}

export const uidList = (items) => items.map((x) => ({ ...x, id: x.id || uid('i') }))
