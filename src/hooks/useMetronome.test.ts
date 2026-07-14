import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MockAudioContext } from '../test/mockAudioContext'
import { useMetronome } from './useMetronome'

describe('useMetronome', () => {
  let ctx: MockAudioContext

  beforeEach(() => {
    vi.useFakeTimers()
    ctx = new MockAudioContext()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function render() {
    return renderHook(() => useMetronome(() => ctx.asAudioContext()))
  }

  it('starts and stops the engine', () => {
    const { result } = render()
    act(() => result.current.start())
    expect(result.current.isRunning).toBe(true)
    act(() => {
      vi.advanceTimersByTime(100)
      ctx.currentTime += 0.1
    })
    expect(ctx.clickTimes.length).toBeGreaterThan(0)
    act(() => result.current.stop())
    expect(result.current.isRunning).toBe(false)
  })

  it('clamps bpm and returns the clamped value', () => {
    const { result } = render()
    let clamped = 0
    act(() => {
      clamped = result.current.setBpm(1000)
    })
    expect(clamped).toBe(300)
    expect(result.current.bpm).toBe(300)
  })

  it('exposes the selected note value', () => {
    const { result } = render()
    act(() => result.current.setNoteValue('sixteenth'))
    expect(result.current.noteValue).toBe('sixteenth')
  })
})
