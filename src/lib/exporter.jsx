import React from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { toBlob } from 'html-to-image'
import { PhoneArtboard } from '../screens/Phone.jsx'
import { getPlatform, getScreenMeta } from '../data/platforms.js'
import { downloadFile, slugify } from './util.js'

const raf = () => new Promise((r) => requestAnimationFrame(() => r()))

const waitForImages = async (node) => {
  const images = Array.from(node.querySelectorAll('img'))
  await Promise.all(
    images.map(async (img) => {
      if (!img.complete) {
        await new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true })
          img.addEventListener('error', resolve, { once: true })
        })
      }
      try {
        await img.decode?.()
      } catch {
        /* an image may fail to decode — the export still continues */
      }
    })
  )
}

/** Renders the exact 390×844 artboard offscreen and returns a PNG blob. */
export async function renderScreenBlob(project, screen, { pixelRatio = 2 } = {}) {
  const host = document.createElement('div')
  host.setAttribute('aria-hidden', 'true')
  host.style.cssText =
    'position:fixed;left:-20000px;top:0;width:390px;height:844px;overflow:hidden;pointer-events:none;opacity:1;z-index:-1;background:#000;'
  document.body.appendChild(host)
  const root = createRoot(host)
  flushSync(() => {
    root.render(<PhoneArtboard project={project} screen={screen} exportMode />)
  })
  await raf()
  try {
    await document.fonts?.ready
    await Promise.all([
      document.fonts?.load('400 28px "Grand Hotel"').catch(() => {}),
      document.fonts?.load('400 24px "Instrument Serif"').catch(() => {}),
      document.fonts?.load('600 15px "Inter Variable"').catch(() => {}),
    ])
  } catch {
    /* fonts are best-effort */
  }
  await waitForImages(host)
  await raf()
  const node = host.querySelector('.artboard') || host
  const options = {
    pixelRatio,
    width: 390,
    height: 844,
    cacheBust: true,
    style: { transform: 'none', margin: '0', borderRadius: '0' },
  }
  let blob = null
  try {
    blob = await toBlob(node, options)
  } catch (err) {
    // Some browsers refuse to inline local webfonts. Retry with system fonts.
    blob = await toBlob(node, { ...options, skipFonts: true })
  } finally {
    root.unmount()
    host.remove()
  }
  if (!blob) throw new Error('The screenshot could not be rendered. Try again, or export with a smaller scale.')
  return blob
}

export async function exportScreenPng(project, screen, { pixelRatio = 2, index = 0 } = {}) {
  const blob = await renderScreenBlob(project, screen, { pixelRatio })
  const meta = getScreenMeta(screen.platformId, screen.type)
  const platform = getPlatform(screen.platformId)
  const label = screen.title || `${platform.name} ${meta.label}`
  const filename = `${slugify(project.title)}-${String(index + 1).padStart(2, '0')}-${slugify(label)}.png`
  downloadFile(blob, filename)
  return filename
}

export const downloadBackup = (projects) => {
  const payload = {
    app: 'elsewhere-au-studio',
    version: 1,
    exportedAt: new Date().toISOString(),
    projects,
  }
  const stamp = new Date().toISOString().slice(0, 10)
  downloadFile(JSON.stringify(payload, null, 2), `elsewhere-backup-${stamp}.elsewhere.json`, 'application/json')
  return payload
}

const screenTextLines = (project, screen) => {
  const d = screen.data || {}
  const cast = (id) => project.cast.find((c) => c.id === id)?.name || ''
  const lines = []
  const msgLines = (messages = [], { whatsapp = false } = {}) => {
    for (const m of messages) {
      if (m.kind === 'time' || m.kind === 'image' || m.kind === 'post') {
        if (m.kind === 'time') lines.push(`— ${m.text || ''} —`)
        else if (m.text) lines.push(`${m.from === 'me' ? 'Me' : cast(m.castId) || 'Them'}: [${m.kind === 'post' ? 'shared post' : 'photo'}] ${m.text}`)
        else lines.push(`${m.from === 'me' ? 'Me' : cast(m.castId) || 'Them'}: [${m.kind === 'post' ? 'shared post' : 'photo'}]`)
        continue
      }
      const who = m.from === 'me' ? 'Me' : cast(m.castId) || 'Them'
      const suffix = whatsapp && m.time ? ` (${m.time})` : ''
      if (m.text) lines.push(`${who}: ${m.text}${suffix}`)
      else if (m.kind === 'audio') lines.push(`${who}: [voice note ${m.duration || ''}]`)
      else if (m.kind === 'emoji') lines.push(`${who}: ${m.text || ''}`)
    }
  }
  const suffix = (arr) => (arr || []).map((x) => `  @${x.user || cast(x.castId) || 'someone'}: ${x.text || ''}`)
  switch (`${screen.platformId}/${screen.type}`) {
    case 'imessage/chat':
      lines.push(`Conversation with ${cast(d.contactId) || (d.participants || []).map(cast).join(', ') || '—'}`)
      msgLines(d.messages)
      if (d.receipt) lines.push(`[${d.receipt}]`)
      break
    case 'imessage/lockscreen':
      lines.push(`${d.date || ''} · ${d.time || ''}`)
      for (const n of d.notifications || []) lines.push(`${n.app}: ${n.title || ''} — ${n.body || ''}`)
      break
    case 'instagram/post':
      lines.push(`@${project.cast.find((c) => c.id === d.castId)?.handle || ''}${d.location ? ` · ${d.location}` : ''}`)
      if (d.caption) lines.push(d.caption)
      lines.push(`${(d.likes || 0).toLocaleString()} likes`)
      lines.push(...suffix(d.comments))
      break
    case 'instagram/story':
      lines.push(d.caption || '')
      if (d.music) lines.push(`♪ ${d.music}`)
      if (d.pollOn) lines.push(`Poll: ${d.pollQuestion || ''} — ${d.pollA || ''} / ${d.pollB || ''}`)
      break
    case 'instagram/profile':
    case 'x/profile':
    case 'tiktok/profile':
      lines.push(`${cast(d.castId)} (@${project.cast.find((c) => c.id === d.castId)?.handle || ''})`)
      if (d.bio) lines.push(d.bio)
      for (const p of d.posts || []) if (p.text) lines.push(`· ${p.text}`)
      break
    case 'instagram/dm':
      lines.push(`Direct messages with ${cast(d.castId)}`)
      msgLines(d.messages)
      break
    case 'x/post':
      lines.push(d.text || '')
      if (d.quotedText) lines.push(`> ${d.quotedText}`)
      lines.push(`${(d.likes || 0).toLocaleString()} likes · ${(d.reposts || 0).toLocaleString()} reposts`)
      lines.push(...suffix(d.repliesList))
      break
    case 'x/thread':
      for (const [i, p] of (d.posts || []).entries()) lines.push(`${i + 1}. ${p.text || ''}`)
      break
    case 'tiktok/video':
      lines.push(`@${project.cast.find((c) => c.id === d.castId)?.handle || ''}`)
      if (d.caption) lines.push(d.caption)
      if (d.music) lines.push(`♪ ${d.music}${d.musicArtist ? ` — ${d.musicArtist}` : ''}`)
      break
    case 'whatsapp/chat':
      lines.push(`WhatsApp with ${cast(d.contactId) || '—'}`)
      msgLines(d.messages, { whatsapp: true })
      break
    case 'discord/chat':
      lines.push(`#${d.channelName || 'general'}${d.serverName ? ` in ${d.serverName}` : ''}`)
      for (const m of d.messages || []) lines.push(`${cast(m.castId) || 'user'}: ${m.text || ''}`)
      break
    case 'snapchat/chat':
      lines.push(`Snapchat with ${cast(d.contactId) || '—'}`)
      for (const m of d.messages || []) lines.push(`${m.from === 'me' ? 'Me' : cast(d.contactId) || 'Them'}: ${m.kind === 'snap' ? `[snap] ${m.text || ''}` : m.text || ''}`)
      break
    case 'spotify/nowplaying':
      lines.push(`${d.title || ''} — ${d.artist || ''}${d.album ? ` (${d.album})` : ''}`)
      if (d.note) lines.push(`“${d.note}”`)
      break
    case 'youtube/video':
      lines.push(`${d.title || ''}`)
      if (d.description) lines.push(d.description)
      lines.push(...suffix(d.comments))
      break
    case 'reddit/post':
      lines.push(`${d.title || ''}`)
      if (d.body) lines.push(d.body)
      const walk = (list, indent = '  ') => {
        for (const c of list || []) {
          lines.push(`${indent}u/${c.user || cast(c.castId) || 'someone'}: ${c.text || ''}`)
          walk(c.replies, `${indent}  `)
        }
      }
      walk(d.comments)
      break
    default:
      break
  }
  return lines.filter((l) => l !== undefined && l !== null && String(l).trim() !== '')
}

export const storyMarkdown = (project) => {
  const lines = [`# ${project.title}`, '']
  if (project.tagline) lines.push(`*${project.tagline}*`, '')
  if (project.synopsis) lines.push(project.synopsis, '')
  lines.push(`**Fandom / world:** ${project.fandom || 'Original'}`)
  if (project.tags?.length) lines.push(`**Tags:** ${project.tags.join(', ')}`)
  lines.push('', '## Cast', '')
  for (const c of project.cast) {
    lines.push(`- **${c.name}** (@${c.handle})${c.bio ? ` — ${c.bio.replace(/\n/g, ' ')}` : ''}`)
  }
  lines.push('', '## Screens', '')
  project.screens.forEach((s, i) => {
    const meta = getScreenMeta(s.platformId, s.type)
    lines.push(`### ${String(i + 1).padStart(2, '0')} · ${getPlatform(s.platformId).name} ${meta.label}${s.title ? ` — ${s.title}` : ''}`, '')
    const text = screenTextLines(project, s)
    if (text.length) lines.push(...text, '')
  })
  lines.push('---', `Generated with Elsewhere AU Studio · ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`)
  return lines.join('\n')
}

export async function zipScreens(project, screens, { pixelRatio = 2, includeScript = true, onProgress } = {}) {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  const folder = zip.folder(slugify(project.title) || 'au')
  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i]
    if (onProgress) onProgress({ current: i + 1, total: screens.length, screen })
    const blob = await renderScreenBlob(project, screen, { pixelRatio })
    const meta = getScreenMeta(screen.platformId, screen.type)
    const globalIndex = project.screens.findIndex((s) => s.id === screen.id)
    const filename = `${String(globalIndex + 1).padStart(2, '0')}-${slugify(getPlatform(screen.platformId).name)}-${slugify(screen.title || meta.label) || 'screen'}.png`
    folder.file(filename, blob)
  }
  if (includeScript) folder.file('story-script.md', storyMarkdown(project))
  folder.file(
    'read-me.txt',
    [
      `${project.title}`,
      project.tagline ? `${project.tagline}` : '',
      '',
      `Exported ${new Date().toLocaleString()}`,
      `${screens.length} screen${screens.length === 1 ? '' : 's'} · ${pixelRatio}× export`,
      '',
      'Each PNG is 390 × 844 px at 1× — multiply by the scale above for final pixels.',
      'Made with Elsewhere AU Studio. This is a fictional work created by its author.',
    ]
      .filter(Boolean)
      .join('\n')
  )
  zip.file(
    'elsewhere-project.json',
    JSON.stringify({ app: 'elsewhere-au-studio', version: 1, exportedAt: new Date().toISOString(), project }, null, 2)
  )
  if (onProgress) onProgress({ current: screens.length, total: screens.length, packaging: true })
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } }, (meta) => {
    if (onProgress && meta.percent) onProgress({ current: screens.length, total: screens.length, packaging: true, percent: meta.percent })
  })
  const name = `${slugify(project.title)}-${pixelRatio}x.zip`
  downloadFile(blob, name)
  return name
}
