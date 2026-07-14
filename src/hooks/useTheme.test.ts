import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { installMatchMedia } from '../test/mockMatchMedia'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('follows the system preference by default', () => {
    installMatchMedia(true)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('reacts to system preference changes when not overridden', () => {
    const media = installMatchMedia(false)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    act(() => media.setDark(true))
    expect(result.current.theme).toBe('dark')
  })

  it('toggle overrides the system preference and persists it', () => {
    installMatchMedia(false)
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle())
    expect(result.current.theme).toBe('dark')
    expect(localStorage.getItem('woodshed.theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('override wins over a conflicting system change', () => {
    const media = installMatchMedia(false)
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle()) // dark override on a light system
    act(() => media.setDark(true))
    act(() => media.setDark(false))
    expect(result.current.theme).toBe('dark')
  })

  it('toggling back to the system value resumes following the system', () => {
    const media = installMatchMedia(false)
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle()) // override: dark
    act(() => result.current.toggle()) // back to light == system -> follow again
    expect(localStorage.getItem('woodshed.theme')).toBeNull()
    act(() => media.setDark(true))
    expect(result.current.theme).toBe('dark')
  })

  it('restores a persisted override on mount', () => {
    installMatchMedia(false)
    localStorage.setItem('woodshed.theme', 'dark')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
  })
})
