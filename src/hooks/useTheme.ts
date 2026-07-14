import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'woodshed.theme'
const QUERY = '(prefers-color-scheme: dark)'

function loadOverride(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

function systemTheme(): Theme {
  return window.matchMedia(QUERY).matches ? 'dark' : 'light'
}

/**
 * Follows the OS color scheme until the user toggles an explicit override.
 * Toggling back to the OS value clears the override, so the switch resumes
 * following the system.
 */
export function useTheme() {
  const [override, setOverride] = useState<Theme | null>(loadOverride)
  const [system, setSystem] = useState<Theme>(systemTheme)

  const theme: Theme = override ?? system

  useEffect(() => {
    const query = window.matchMedia(QUERY)
    const onChange = (event: MediaQueryListEvent) => {
      setSystem(event.matches ? 'dark' : 'light')
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    if (next === system) {
      setOverride(null)
      localStorage.removeItem(STORAGE_KEY)
    } else {
      setOverride(next)
      localStorage.setItem(STORAGE_KEY, next)
    }
  }

  return { theme, toggle }
}
