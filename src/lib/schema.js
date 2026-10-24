import { uid } from '../lib/util.js'
import { makeScreenData } from '../data/defaults.js'

export const DEFAULT_STYLE = {
  theme: 'auto', // auto | light | dark
  frame: 'iphone', // iphone | none
  frameColor: 'black', // black | silver | gold
  island: true,
  statusBar: true,
  time: '9:41',
  battery: 78,
  watermark: false,
  watermarkText: 'elsewhere',
}

export const newCharacter = (partial = {}) => ({
  id: uid('c'),
  name: 'New character',
  handle: 'newcharacter',
  avatar: '',
  color: '#e7a17a',
  verified: false,
  bio: '',
  followers: 1200,
  following: 240,
  link: '',
  ...partial,
})

export const newProject = (partial = {}) => {
  const now = new Date().toISOString()
  const project = {
    id: uid('p'),
    title: 'Untitled AU',
    tagline: '',
    synopsis: '',
    fandom: 'Original',
    tags: [],
    demo: false,
    createdAt: now,
    updatedAt: now,
    coverScreenId: null,
    cast: [],
    screens: [],
    style: { ...DEFAULT_STYLE },
    ...partial,
  }
  if (!project.cast.length) {
    project.cast = [
      newCharacter({ name: 'Ari', handle: 'ariwrites', bio: 'just a guy with a group chat' }),
      newCharacter({ name: 'Juno', handle: 'junolately', bio: 'not responsible for what I post at 2am' }),
    ]
  }
  if (!project.coverScreenId && project.screens.length) {
    project.coverScreenId = project.screens[0].id
  }
  return project
}

export const addScreen = (project, platformId, type) => {
  const meta = { platformId, type }
  const screen = {
    id: uid('s'),
    platformId,
    type,
    title: '',
    data: makeScreenData(platformId, type, project),
    design: {},
    createdAt: new Date().toISOString(),
  }
  return {
    project: {
      ...project,
      screens: [...project.screens, screen],
      coverScreenId: project.coverScreenId || screen.id,
      updatedAt: new Date().toISOString(),
    },
    screen,
  }
}

/** Light migration / defensive normalisation for imported or older files */
export const normalizeProject = (raw) => {
  if (!raw || typeof raw !== 'object') throw new Error('This file is not an Elsewhere project.')
  if (!raw.id || !Array.isArray(raw.screens) || !Array.isArray(raw.cast)) {
    throw new Error('This file is missing project data.')
  }
  const cast = raw.cast.map((c) => ({
    ...newCharacter({ id: c.id || uid('c') }),
    ...c,
    followers: Number(c.followers) || 0,
    following: Number(c.following) || 0,
  }))
  const castIds = new Set(cast.map((c) => c.id))
  const screens = raw.screens.map((s) => ({
    id: s.id || uid('s'),
    platformId: s.platformId,
    type: s.type,
    title: s.title || '',
    design: s.design || {},
    data: s.data || {},
    createdAt: s.createdAt || new Date().toISOString(),
  }))
  const project = {
    ...newProject({ cast }),
    ...raw,
    cast,
    screens,
    style: { ...DEFAULT_STYLE, ...(raw.style || {}) },
  }
  // Repair dangling cast references in common fields
  for (const s of project.screens) {
    const d = s.data
    if (d && typeof d === 'object') {
      if ('castId' in d && !castIds.has(d.castId) && d.castId) d.castId = cast[0]?.id || ''
      if ('contactId' in d && !castIds.has(d.contactId) && d.contactId) d.contactId = cast[0]?.id || ''
    }
  }
  if (!project.coverScreenId && project.screens[0]) project.coverScreenId = project.screens[0].id
  if (!project.cast.length) project.cast = newProject({ ...project, cast: [] }).cast
  return project
}

export const projectStats = (project) => ({
  screens: project.screens.length,
  characters: project.cast.length,
  words: project.screens.reduce((n, s) => n + countWords(s), 0),
  platforms: new Set(project.screens.map((s) => s.platformId)).size,
})

const countWords = (screen) => {
  let text = ''
  const walk = (v) => {
    if (typeof v === 'string') text += ` ${v}`
    else if (Array.isArray(v)) v.forEach(walk)
    else if (v && typeof v === 'object') Object.entries(v).forEach(([k, val]) => {
      if (!['avatar', 'image', 'images', 'cover', 'banner', 'wallpaper', 'thumb', 'link'].includes(k)) walk(val)
    })
  }
  walk(screen.data)
  return text.trim().split(/\s+/).filter(Boolean).length
}

/** Remove every reference to a character across screen data. */
export const stripCastReferences = (project, castId) => {
  const clean = (value) => {
    if (Array.isArray(value)) return value.filter((v) => v !== castId).map(clean)
    if (value && typeof value === 'object') {
      const next = {}
      for (const [k, v] of Object.entries(value)) {
        if ((k === 'castId' || k === 'contactId' || k === 'quotedCastId') && v === castId) next[k] = ''
        else if (k === 'participants' && Array.isArray(v)) next[k] = v.filter((id) => id !== castId)
        else next[k] = clean(v)
      }
      return next
    }
    return value
  }
  return {
    cast: project.cast.filter((c) => c.id !== castId),
    screens: project.screens.map((s) => ({ ...s, data: clean(s.data) })),
  }
}
