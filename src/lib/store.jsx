import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { storage } from './db'
import { newProject, normalizeProject } from './schema'
import { buildDemoProject } from '../data/demo.js'
import { buildTemplate } from '../data/templates.js'

const SETTINGS_KEY = 'elsewhere.settings.v1'
const SEED_KEY = 'elsewhere.seeded.v1'
const SAVE_DELAY = 700

const defaultSettings = {
  theme: 'dark', // dark | light | system
  name: '',
  lastBackupAt: null,
  hasSeenIntro: false,
  backupFolder: null,
  autosave: true,
  reduceMotion: false,
}

const loadSettings = () => {
  try {
    return { ...defaultSettings, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') || {}) }
  } catch {
    return { ...defaultSettings }
  }
}

const StudioContext = createContext(null)

export function StudioProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [saveState, setSaveState] = useState({ status: 'idle', at: null, error: null })
  const [settings, setSettings] = useState(loadSettings)
  const [storageEstimate, setStorageEstimate] = useState({ usage: 0, quota: 0, supported: false })

  const projectsRef = useRef([])
  const pendingRef = useRef(new Map())
  const deletedRef = useRef(new Set())
  const timerRef = useRef(null)
  const flushingRef = useRef(false)
  const settingsRef = useRef(settings)
  const channelRef = useRef(null)

  const setAll = useCallback((next) => {
    projectsRef.current = next
    setProjects(next)
  }, [])

  useEffect(() => {
    settingsRef.current = settings
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    } catch {
      /* ignore */
    }
    const root = document.documentElement
    const resolve = () => {
      if (settings.theme === 'system') {
        return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
      }
      return settings.theme
    }
    root.dataset.theme = resolve()
    if (settings.reduceMotion) root.dataset.reduceMotion = 'true'
    else delete root.dataset.reduceMotion
  }, [settings])

  const patchSettings = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const scheduleFlush = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setSaveState((s) => (s.status === 'saving' ? s : { ...s, status: 'unsaved' }))
    timerRef.current = setTimeout(() => {
      flushRef.current?.()
    }, SAVE_DELAY)
  }, [])

  const flush = useCallback(async () => {
    if (flushingRef.current) return
    flushingRef.current = true
    if (timerRef.current) clearTimeout(timerRef.current)
    const items = Array.from(pendingRef.current.values())
    const dels = Array.from(deletedRef.current)
    pendingRef.current.clear()
    deletedRef.current.clear()
    if (!items.length && !dels.length) {
      flushingRef.current = false
      return
    }
    setSaveState((s) => ({ ...s, status: 'saving' }))
    try {
      for (const item of items) await storage.put(item)
      for (const id of dels) await storage.remove(id)
      const at = Date.now()
      setSaveState({ status: 'saved', at, error: null })
      for (const item of items) {
        try {
          channelRef.current?.postMessage({ type: 'saved', id: item.id, updatedAt: item.updatedAt })
        } catch {
          /* ignore */
        }
      }
      channelRef.current?.postMessage({ type: 'saved-bulk' })
    } catch (err) {
      for (const item of items) pendingRef.current.set(item.id, item)
      setSaveState({ status: 'error', at: null, error: err?.message || 'Could not save to this browser.' })
    } finally {
      flushingRef.current = false
      if (pendingRef.current.size || deletedRef.current.size) scheduleFlush()
    }
  }, [scheduleFlush])
  const flushRef = useRef(flush)
  flushRef.current = flush

  // initial load + seed
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      let list = []
      try {
        list = await storage.getAll()
      } catch {
        list = []
      }
      const seeded = (() => {
        try {
          return localStorage.getItem(SEED_KEY) === '1'
        } catch {
          return false
        }
      })()
      if (!seeded) {
        try {
          localStorage.setItem(SEED_KEY, '1')
        } catch {
          /* ignore */
        }
        if (!list.length) {
          const demo = buildDemoProject()
          list = [demo]
          try {
            await storage.put(demo)
          } catch {
            /* ignore */
          }
        }
      }
      if (cancelled) return
      setAll(list.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')))
      setLoaded(true)
      storage.requestPersistence().then((granted) => {
        if (granted) console.info('[elsewhere] persistent storage granted')
      })
      storage.estimate().then(setStorageEstimate)
    })()
    return () => {
      cancelled = true
    }
  }, [setAll])

  // pagehide / visibility flush
  useEffect(() => {
    const onHide = () => {
      if (pendingRef.current.size) flushRef.current?.()
    }
    const onBeforeUnload = (e) => {
      if (pendingRef.current.size) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', onHide)
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('pagehide', onHide)
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [])

  // cross-tab sync (read-only refresh when another tab saves this project)
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    const ch = new BroadcastChannel('elsewhere-studio')
    channelRef.current = ch
    ch.onmessage = async (e) => {
      if (!e.data || e.data.type !== 'saved-bulk') return
      let list = []
      try {
        list = await storage.getAll()
      } catch {
        return
      }
      // Only adopt projects with no unsaved local changes
      const pendingIds = new Set(pendingRef.current.keys())
      const next = projectsRef.current.map((p) => {
        if (pendingIds.has(p.id)) return p
        const fresh = list.find((x) => x.id === p.id)
        if (fresh && fresh.updatedAt > p.updatedAt) return fresh
        return p
      })
      list.forEach((fresh) => {
        if (!next.some((p) => p.id === fresh.id)) next.push(fresh)
      })
      const aliveIds = new Set(list.map((p) => p.id))
      const merged = next.filter((p) => aliveIds.has(p.id) || pendingIds.has(p.id))
      if (JSON.stringify(merged) !== JSON.stringify(projectsRef.current)) {
        setAll(merged)
      }
    }
    return () => {
      ch.close()
      channelRef.current = null
    }
  }, [setAll])

  // reload storage bar when projects change
  useEffect(() => {
    if (!loaded) return
    const t = setTimeout(() => storage.estimate().then(setStorageEstimate), 1200)
    return () => clearTimeout(t)
  }, [projects, loaded])

  const patchProject = useCallback(
    (id, patchOrFn) => {
      const prev = projectsRef.current.find((p) => p.id === id)
      if (!prev) return null
      const patch = typeof patchOrFn === 'function' ? patchOrFn(prev) : patchOrFn
      const next = { ...prev, ...patch, updatedAt: new Date().toISOString() }
      setAll(projectsRef.current.map((p) => (p.id === id ? next : p)))
      pendingRef.current.set(id, next)
      scheduleFlush()
      return next
    },
    [scheduleFlush, setAll]
  )

  const createProject = useCallback(
    ({ templateId = 'blank', title, ...rest } = {}) => {
      const project = templateId === 'blank' ? newProject({ title: title || 'Untitled AU', ...rest }) : buildTemplate(templateId)
      if (title) project.title = title
      setAll([project, ...projectsRef.current])
      pendingRef.current.set(project.id, project)
      scheduleFlush()
      return project
    },
    [scheduleFlush, setAll]
  )

  const importProject = useCallback(
    (raw, { duplicate = false } = {}) => {
      const normalized = normalizeProject(raw)
      let project = {
        ...normalized,
        updatedAt: new Date().toISOString(),
      }
      if (duplicate || projectsRef.current.some((p) => p.id === project.id)) {
        project = {
          ...project,
          id: `${project.id}_${Math.random().toString(36).slice(2, 6)}`,
          title: duplicate ? `${project.title} (copy)` : project.title,
          demo: false,
          // remap internal ids to avoid collisions and dangling references
          screens: project.screens.map((s) => ({ ...s, id: `${s.id}_${Math.random().toString(36).slice(2, 5)}` })),
        }
        project.coverScreenId = project.screens.find((s) => s.id.startsWith(normalized.coverScreenId || '___'))?.id || project.screens[0]?.id || null
      }
      project.demo = false
      setAll([project, ...projectsRef.current])
      pendingRef.current.set(project.id, project)
      scheduleFlush()
      return project
    },
    [scheduleFlush, setAll]
  )

  const duplicateProject = useCallback(
    (id) => {
      const src = projectsRef.current.find((p) => p.id === id)
      if (!src) return null
      return importProject(src, { duplicate: true })
    },
    [importProject]
  )

  const deleteProject = useCallback(
    (id) => {
      setAll(projectsRef.current.filter((p) => p.id !== id))
      pendingRef.current.delete(id)
      deletedRef.current.add(id)
      scheduleFlush()
    },
    [scheduleFlush, setAll]
  )

  const value = useMemo(
    () => ({
      projects,
      loaded,
      saveState,
      settings,
      patchSettings,
      storageEstimate,
      getProject: (id) => projects.find((p) => p.id === id),
      patchProject,
      createProject,
      duplicateProject,
      deleteProject,
      importProject,
      flush,
      markBackedUp: () => patchSettings({ lastBackupAt: new Date().toISOString() }),
      reload: async () => {
        const list = await storage.getAll()
        setAll(list.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')))
        storage.estimate().then(setStorageEstimate)
      },
    }),
    [
      projects,
      loaded,
      saveState,
      settings,
      patchSettings,
      storageEstimate,
      patchProject,
      createProject,
      duplicateProject,
      deleteProject,
      importProject,
      flush,
      setAll,
    ]
  )

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}

export const useStudio = () => {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used inside StudioProvider')
  return ctx
}
