import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { get as idbGet, set as idbSet } from 'idb-keyval';
import type { AppState, Character, Project, SyncStatus } from './types';
import { uid } from './util';

const IDB_KEY = 'auverse-state';

/**
 * API base for cloud sync.
 * - Web (served by the studio server): same origin → '' (relative URLs).
 * - APK build: the app is served from the WebView's local origin, so the
 *   cloud server must be an absolute URL (baked in at build time).
 */
export const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? '';
const apiUrl = (path: string): string => `${API_BASE}${path}`;

const emptyState = (): AppState => ({ v: 1, updatedAt: 0, projects: [], characters: [] });

function defaultCharacters(): Character[] {
  const t = Date.now();
  return [
    {
      id: uid() + 'a',
      name: 'You',
      emoji: '🫧',
      color: '#7c5cff',
      handles: { instagram: 'you', x: 'you', tiktok: 'you', whatsapp: 'you', telegram: 'you', snapchat: 'you', reddit: 'you', facebook: 'you' },
      bio: 'the main character',
      updatedAt: t,
    },
    {
      id: uid() + 'b',
      name: 'Joon',
      emoji: '🌙',
      color: '#ff5ca8',
      handles: { instagram: 'joon', x: 'joon', tiktok: 'joon', whatsapp: 'joon', telegram: 'joon', snapchat: 'joon', reddit: 'joon', facebook: 'joon' },
      bio: 'your person',
      updatedAt: t,
    },
    {
      id: uid() + 'c',
      name: 'Hana',
      emoji: '🍑',
      color: '#2ec4b6',
      handles: { instagram: 'hana', x: 'hana', tiktok: 'hana', whatsapp: 'hana', telegram: 'hana', snapchat: 'hana', reddit: 'hana', facebook: 'hana' },
      bio: 'bestie',
      updatedAt: t,
    },
  ];
}

/** Merge two states entity-by-entity, keeping the newer version of each project/character. */
export function mergeStates(a: AppState, b: AppState): AppState {
  const pick = <T extends { id: string; updatedAt: number }>(listA: T[], listB: T[]) => {
    const map = new Map<string, T>();
    for (const item of [...listA, ...listB]) {
      const prev = map.get(item.id);
      if (!prev || item.updatedAt > prev.updatedAt) map.set(item.id, item);
    }
    return [...map.values()].sort((x, y) => y.updatedAt - x.updatedAt);
  };
  const bothEmpty = a.projects.length === 0 && b.projects.length === 0;
  return {
    v: 1,
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
    projects: bothEmpty ? [] : pick(a.projects, b.projects),
    characters: pick(a.characters, b.characters),
  };
}

interface StoreApi {
  state: AppState;
  loaded: boolean;
  sync: SyncStatus;
  lastCloudSync: number | null;
  mutate: (fn: (s: AppState) => AppState) => void;
  // project helpers
  addProject: (p: { title?: string; description?: string; cover?: string; tags?: string[]; moments?: Project['moments'] }) => Project;
  updateProject: (id: string, fn: (p: Project) => Project) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  // character helpers
  addCharacter: (c?: Partial<Character>) => Character;
  updateCharacter: (id: string, fn: (c: Character) => Character) => void;
  deleteCharacter: (id: string) => void;
  // data mgmt
  exportState: () => AppState;
  importState: (incoming: AppState) => { merged: number };
  clearAll: () => void;
  char: (id: string) => Character | undefined;
}

const Ctx = createContext<StoreApi>(null!);

export function useStore(): StoreApi {
  return useContext(Ctx);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(emptyState);
  const [loaded, setLoaded] = useState(false);
  const [sync, setSync] = useState<SyncStatus>('loading');
  const [lastCloudSync, setLastCloudSync] = useState<number | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------- boot: load local, then merge cloud ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let local: AppState | null = null;
      try {
        const raw = await idbGet<string>(IDB_KEY);
        if (raw) local = JSON.parse(raw);
      } catch {
        /* ignore */
      }
      let next = local ?? emptyState();
      if (next.projects.length === 0 && next.characters.length === 0) {
        next = { ...next, characters: defaultCharacters() };
      }
      // fetch cloud (with hard timeout so the app always boots, even offline)
      let cloud: AppState | null = null;
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(apiUrl('/api/state'), { signal: controller.signal });
        clearTimeout(timer);
        if (res.ok) {
          const json = await res.json();
          if (json?.ok && json.state) cloud = json.state;
        }
      } catch {
        /* offline or timed out — local copy is enough */
      }
      if (cancelled) return;
      if (cloud) {
        const merged = mergeStates(next, cloud);
        next = merged;
        setLastCloudSync(Date.now());
        setSync('cloud');
        try {
          localStorage.setItem('auverse-cloudts', String(Date.now()));
        } catch {}
      } else {
        setSync('local');
      }
      try {
        const ts = localStorage.getItem('auverse-cloudts');
        if (ts && !cloud) setLastCloudSync(Number(ts));
      } catch {}
      setState(next);
      try {
        await idbSet(IDB_KEY, JSON.stringify(next));
      } catch {}
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pushCloud = useCallback((s: AppState) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSync('syncing');
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(apiUrl('/api/state'), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: stateRef.current }),
        });
        if (res.status === 409) {
          // someone newer exists on the server — merge it in
          const json = await res.json().catch(() => null);
          if (json?.state) {
            const merged = mergeStates(stateRef.current, json.state);
            stateRef.current = merged;
            setState(merged);
            idbSet(IDB_KEY, JSON.stringify(merged)).catch(() => {});
          }
          setSync('cloud');
          return;
        }
        if (!res.ok) throw new Error('bad status');
        const json = await res.json();
        setLastCloudSync(Date.now());
        setSync('cloud');
        try {
          localStorage.setItem('auverse-cloudts', String(json.savedAt ?? Date.now()));
        } catch {}
      } catch {
        setSync('offline');
      }
    }, 900);
  }, []);

  const mutate = useCallback(
    (fn: (s: AppState) => AppState) => {
      const next: AppState = { ...fn(stateRef.current), updatedAt: Date.now() };
      stateRef.current = next;
      setState(next);
      // 1) local save (instant, always)
      try {
        idbSet(IDB_KEY, JSON.stringify(next)).catch(() => {});
      } catch {}
      setSync('local');
      // 2) cloud sync (debounced)
      pushCloud(next);
    },
    [pushCloud]
  );

  const api = useMemo<StoreApi>(() => {
    const now = () => Date.now();
    return {
      state,
      loaded,
      sync,
      lastCloudSync,
      mutate,
      char: (id) => state.characters.find((c) => c.id === id),

      addProject: (p) => {
        const project: Project = {
          id: uid(),
          title: p.title || 'Untitled AU',
          description: p.description || '',
          cover: p.cover,
          tags: p.tags || [],
          createdAt: now(),
          updatedAt: now(),
          moments: p.moments || [],
        };
        mutate((s) => ({ ...s, projects: [project, ...s.projects] }));
        return project;
      },
      updateProject: (id, fn) => {
        mutate((s) => ({
          ...s,
          projects: s.projects.map((p) => (p.id === id ? { ...fn(p), updatedAt: now() } : p)),
        }));
      },
      deleteProject: (id) => {
        mutate((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== id) }));
      },
      duplicateProject: (id) => {
        mutate((s) => {
          const src = s.projects.find((p) => p.id === id);
          if (!src) return s;
          const copy: Project = JSON.parse(JSON.stringify(src));
          copy.id = uid();
          copy.title = src.title + ' (copy)';
          copy.createdAt = now();
          copy.updatedAt = now();
          return { ...s, projects: [copy, ...s.projects] };
        });
      },

      addCharacter: (c) => {
        const ch: Character = {
          id: uid(),
          name: c?.name || 'New Character',
          emoji: c?.emoji || '✨',
          avatar: c?.avatar,
          color: c?.color || '#7c5cff',
          handles: c?.handles || {},
          bio: c?.bio || '',
          verified: c?.verified ?? false,
          updatedAt: now(),
        };
        mutate((s) => ({ ...s, characters: [ch, ...s.characters] }));
        return ch;
      },
      updateCharacter: (id, fn) => {
        mutate((s) => ({
          ...s,
          characters: s.characters.map((c) => (c.id === id ? { ...fn(c), updatedAt: now() } : c)),
        }));
      },
      deleteCharacter: (id) => {
        mutate((s) => ({ ...s, characters: s.characters.filter((c) => c.id !== id) }));
      },

      exportState: () => stateRef.current,
      importState: (incoming) => {
        let merged = 0;
        mutate((s) => {
          const res = mergeStates(s, incoming);
          merged = res.projects.length + res.characters.length;
          return res;
        });
        return { merged };
      },
      clearAll: () => {
        mutate(() => emptyState());
        try {
          idbSet(IDB_KEY, JSON.stringify(emptyState())).catch(() => {});
        } catch {}
      },
    };
  }, [state, loaded, sync, lastCloudSync, mutate]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
