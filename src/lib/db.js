/**
 * Tiny IndexedDB wrapper with a localStorage fallback.
 * Every project is stored as a full document so exports/backups are trivial.
 */
const DB_NAME = 'elsewhere-au-studio'
const DB_VERSION = 1
const STORE = 'projects'
const META = 'meta'
const LS_FALLBACK = 'elsewhere.projects.v1'

let dbPromise = null
let idbBroken = false

const openDB = () => {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB unavailable'))
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' })
      if (!db.objectStoreNames.contains(META)) db.createObjectStore(META, { keyPath: 'key' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error || new Error('Could not open local database'))
    req.onblocked = () => reject(new Error('Local database is blocked by another tab'))
  }).catch((err) => {
    idbBroken = true
    throw err
  })
  return dbPromise
}

const tx = async (storeName, mode, fn) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode)
    const store = tx.objectStore(storeName)
    let result
    try {
      result = fn(store)
    } catch (err) {
      reject(err)
      return
    }
    tx.oncomplete = () => resolve(result)
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

const readFallback = () => {
  try {
    const raw = localStorage.getItem(LS_FALLBACK)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const writeFallback = (projects) => {
  try {
    localStorage.setItem(LS_FALLBACK, JSON.stringify(projects))
    return true
  } catch {
    return false
  }
}

const reqToPromise = (request) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

export const storage = {
  async getAll() {
    if (!idbBroken) {
      try {
        const db = await openDB()
        return await new Promise((resolve, reject) => {
          const t = db.transaction(STORE, 'readonly')
          const r = t.objectStore(STORE).getAll()
          r.onsuccess = () => resolve(r.result || [])
          r.onerror = () => reject(r.error)
        })
      } catch {
        /* fall through */
      }
    }
    return readFallback()
  },
  async put(project) {
    if (!idbBroken) {
      try {
        await tx(STORE, 'readwrite', (store) => store.put(project))
        return true
      } catch {
        /* fall through */
      }
    }
    const all = readFallback().filter((p) => p.id !== project.id)
    all.push(project)
    if (!writeFallback(all)) throw new Error('Storage is full. Export a backup and remove some images.')
    return true
  },
  async remove(id) {
    if (!idbBroken) {
      try {
        await tx(STORE, 'readwrite', (store) => store.delete(id))
        return true
      } catch {
        /* fall through */
      }
    }
    writeFallback(readFallback().filter((p) => p.id !== id))
    return true
  },
  async clear() {
    if (!idbBroken) {
      try {
        await tx(STORE, 'readwrite', (store) => store.clear())
      } catch {
        /* fall through */
      }
    }
    writeFallback([])
  },
  async estimate() {
    try {
      if (navigator.storage?.estimate) {
        const { usage = 0, quota = 0 } = await navigator.storage.estimate()
        return { usage, quota, supported: true }
      }
    } catch {
      /* ignore */
    }
    return { usage: 0, quota: 0, supported: false }
  },
  async setMeta(key, value) {
    if (!idbBroken) {
      try {
        await tx(META, 'readwrite', (store) => store.put({ key, value }))
      } catch {
        /* ignore */
      }
    }
    try {
      localStorage.setItem(`elsewhere.meta.${key}`, JSON.stringify(value))
    } catch {
      /* ignore */
    }
  },
  async getMeta(key) {
    if (!idbBroken) {
      try {
        const db = await openDB()
        const res = await new Promise((resolve, reject) => {
          const t = db.transaction(META, 'readonly')
          const r = t.objectStore(META).get(key)
          r.onsuccess = () => resolve(r.result)
          r.onerror = () => reject(r.error)
        })
        if (res) return res.value
      } catch {
        /* ignore */
      }
    }
    try {
      const raw = localStorage.getItem(`elsewhere.meta.${key}`)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  async requestPersistence() {
    try {
      if (navigator.storage?.persist) return await navigator.storage.persist()
    } catch {
      /* ignore */
    }
    return false
  },
}

export { reqToPromise }
