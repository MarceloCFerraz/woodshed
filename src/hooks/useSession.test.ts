import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadHistory } from '../lib/history'
import { useSession } from './useSession'

describe('useSession', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-13T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('ticks elapsed seconds while running', () => {
    const { result } = renderHook(() => useSession())
    act(() => result.current.start(120))
    act(() => vi.advanceTimersByTime(5_000))
    expect(result.current.elapsedSeconds).toBe(5)
    expect(result.current.isRunning).toBe(true)
  })

  it('logs a segment of at least 30s on stop and persists it', () => {
    const { result } = renderHook(() => useSession())
    act(() => result.current.start(120))
    act(() => vi.advanceTimersByTime(31_000))
    act(() => result.current.stop())
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0]).toMatchObject({ bpm: 120, durationSeconds: 31 })
    expect(loadHistory()).toHaveLength(1)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.elapsedSeconds).toBe(0)
  })

  it('discards segments shorter than 30s', () => {
    const { result } = renderHook(() => useSession())
    act(() => result.current.start(120))
    act(() => vi.advanceTimersByTime(29_000))
    act(() => result.current.stop())
    expect(result.current.history).toHaveLength(0)
  })

  it('splits the segment when the bpm changes mid-run', () => {
    const { result } = renderHook(() => useSession())
    act(() => result.current.start(100))
    act(() => vi.advanceTimersByTime(40_000))
    act(() => result.current.switchBpm(110))
    expect(result.current.history[0]).toMatchObject({ bpm: 100, durationSeconds: 40 })
    expect(result.current.isRunning).toBe(true)
    expect(result.current.elapsedSeconds).toBe(0)
    act(() => vi.advanceTimersByTime(35_000))
    act(() => result.current.stop())
    expect(result.current.history[0]).toMatchObject({ bpm: 110, durationSeconds: 35 })
    expect(result.current.history).toHaveLength(2)
  })

  it('ignores switchBpm to the same bpm', () => {
    const { result } = renderHook(() => useSession())
    act(() => result.current.start(100))
    act(() => vi.advanceTimersByTime(40_000))
    act(() => result.current.switchBpm(100))
    expect(result.current.history).toHaveLength(0)
    expect(result.current.elapsedSeconds).toBe(40)
  })

  it('ignores switchBpm while stopped', () => {
    const { result } = renderHook(() => useSession())
    act(() => result.current.switchBpm(140))
    expect(result.current.isRunning).toBe(false)
    expect(result.current.history).toHaveLength(0)
  })

  it('clears the persisted history', () => {
    const { result } = renderHook(() => useSession())
    act(() => result.current.start(120))
    act(() => vi.advanceTimersByTime(31_000))
    act(() => result.current.stop())
    act(() => result.current.clear())
    expect(result.current.history).toHaveLength(0)
    expect(loadHistory()).toHaveLength(0)
  })
})
