import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MockAudioContext } from '../test/mockAudioContext'
import { BEAT_FREQ_HZ, Metronome, SUBDIVISION_FREQ_HZ, clampBpm } from './metronome'

function advance(ctx: MockAudioContext, ms: number) {
  // Keep the mock audio clock in lockstep with the fake setInterval clock.
  for (let elapsed = 0; elapsed < ms; elapsed += 25) {
    vi.advanceTimersByTime(25)
    ctx.currentTime += 0.025
  }
}

describe('clampBpm', () => {
  it('clamps below the minimum to 20', () => {
    expect(clampBpm(3)).toBe(20)
  })

  it('clamps above the maximum to 300', () => {
    expect(clampBpm(999)).toBe(300)
  })

  it('rounds fractional values', () => {
    expect(clampBpm(120.6)).toBe(121)
  })
})

describe('Metronome', () => {
  let ctx: MockAudioContext

  beforeEach(() => {
    vi.useFakeTimers()
    ctx = new MockAudioContext()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function makeMetronome(bpm = 120) {
    return new Metronome(() => ctx.asAudioContext(), bpm)
  }

  it('schedules clicks at 60/bpm intervals', () => {
    const m = makeMetronome(120)
    m.start()
    advance(ctx, 1000)
    const intervals = ctx.clickTimes.slice(1).map((t, i) => t - ctx.clickTimes[i])
    expect(intervals.length).toBeGreaterThan(0)
    for (const interval of intervals) {
      expect(interval).toBeCloseTo(0.5, 5)
    }
  })

  it('doubles the click rate for eighth notes', () => {
    const m = makeMetronome(120)
    m.setNoteValue('eighth')
    m.start()
    advance(ctx, 1000)
    const intervals = ctx.clickTimes.slice(1).map((t, i) => t - ctx.clickTimes[i])
    for (const interval of intervals) {
      expect(interval).toBeCloseTo(0.25, 5)
    }
  })

  it('applies bpm changes live to subsequent clicks', () => {
    const m = makeMetronome(60)
    m.start()
    advance(ctx, 1000)
    m.setBpm(120)
    const before = ctx.clickTimes.length
    advance(ctx, 1000)
    const after = ctx.clickTimes.slice(before)
    const intervals = after.slice(1).map((t, i) => t - after[i])
    for (const interval of intervals) {
      expect(interval).toBeCloseTo(0.5, 5)
    }
  })

  it('stops scheduling after stop()', () => {
    const m = makeMetronome(120)
    m.start()
    advance(ctx, 500)
    m.stop()
    const count = ctx.clickTimes.length
    advance(ctx, 1000)
    expect(ctx.clickTimes.length).toBe(count)
    expect(m.isRunning).toBe(false)
  })

  it('reports isRunning while started', () => {
    const m = makeMetronome()
    expect(m.isRunning).toBe(false)
    m.start()
    expect(m.isRunning).toBe(true)
  })

  it('resumes a suspended context on start', () => {
    ctx.state = 'suspended'
    const m = makeMetronome()
    m.start()
    expect(ctx.resume).toHaveBeenCalled()
  })

  it('accents the beat click and softens subdivision clicks', () => {
    const m = makeMetronome(120)
    m.setNoteValue('sixteenth') // 4 clicks per beat
    m.start()
    advance(ctx, 1000)
    expect(ctx.clickFreqs.length).toBeGreaterThanOrEqual(8)
    for (const [i, freq] of ctx.clickFreqs.entries()) {
      expect(freq).toBe(i % 4 === 0 ? BEAT_FREQ_HZ : SUBDIVISION_FREQ_HZ)
    }
  })

  it('plays every click accented when the subdivision is the quarter note', () => {
    const m = makeMetronome(120)
    m.start()
    advance(ctx, 1000)
    expect(ctx.clickFreqs.length).toBeGreaterThan(0)
    for (const freq of ctx.clickFreqs) {
      expect(freq).toBe(BEAT_FREQ_HZ)
    }
  })

  it('fires onBeat once per quarter note regardless of subdivision', () => {
    const m = makeMetronome(120) // beat every 0.5s
    m.setNoteValue('sixteenth') // 4 clicks per beat
    const onBeat = vi.fn()
    m.onBeat = onBeat
    m.start()
    advance(ctx, 2000)
    expect(ctx.clickTimes.length).toBeGreaterThan(onBeat.mock.calls.length * 3)
    expect(onBeat.mock.calls.length).toBeGreaterThanOrEqual(3)
    expect(onBeat.mock.calls.length).toBeLessThanOrEqual(5)
  })

  it('stops firing onBeat after stop()', () => {
    const m = makeMetronome(120)
    const onBeat = vi.fn()
    m.onBeat = onBeat
    m.start()
    advance(ctx, 500)
    m.stop()
    const calls = onBeat.mock.calls.length
    advance(ctx, 1000)
    expect(onBeat.mock.calls.length).toBe(calls)
  })

  it('reuses the same context across start/stop cycles', () => {
    const factory = vi.fn(() => ctx.asAudioContext())
    const m = new Metronome(factory, 120)
    m.start()
    m.stop()
    m.start()
    expect(factory).toHaveBeenCalledTimes(1)
  })
})
