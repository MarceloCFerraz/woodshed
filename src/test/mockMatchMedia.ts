import { vi } from 'vitest'

/** Installs a controllable matchMedia mock; call setDark() to flip the OS preference. */
export function installMatchMedia(initialDark: boolean) {
  let matches = initialDark
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      get matches() {
        return matches
      },
      media: query,
      addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener)
      },
      removeEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener)
      },
    })),
  )

  return {
    setDark(dark: boolean) {
      matches = dark
      for (const listener of listeners) {
        listener({ matches } as MediaQueryListEvent)
      }
    },
  }
}
