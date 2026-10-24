import { useMemo } from 'react'
import { resolveTheme } from './Phone.jsx'

export const useStudioTheme = (project, screen, fallback = 'light') => {
  return useMemo(
    () => (project && screen ? resolveTheme(project, screen) : fallback),
    [project, screen, fallback]
  )
}

export const castOf = (project, id) => project?.cast?.find((c) => c.id === id) || null
export const castMapOf = (project) => Object.fromEntries((project?.cast || []).map((c) => [c.id, c]))
