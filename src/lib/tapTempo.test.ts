import { describe, expect, it } from 'vitest'
import { MAX_TAPS, TAP_RESET_MS, addTap, bpmFromTaps } from './tapTempo'

describe('addTap', () => {
  it('appends a tap to the sequence', () => {
    expect(addTap([1000], 1500)).toEqual([1000, 1500])
  })

  it('starts a new sequence when the pause exceeds the reset window', () => {
    expect(addTap([1000], 1000 + TAP_RESET_MS + 1)).toEqual([1000 + TAP_RESET_MS + 1])
  })

  it('keeps only the most recent taps', () => {
    const taps = [0, 500, 1000, 1500, 2000]
    expect(addTap(taps, 2500)).toEqual([500, 1000, 1500, 2000, 2500])
    expect(addTap(taps, 2500)).toHaveLength(MAX_TAPS)
  })
})

describe('bpmFromTaps', () => {
  it('returns null with fewer than two taps', () => {
    expect(bpmFromTaps([])).toBeNull()
    expect(bpmFromTaps([1000])).toBeNull()
  })

  it('computes bpm from a steady interval', () => {
    // 500ms between taps -> 120 bpm
    expect(bpmFromTaps([0, 500, 1000, 1500])).toBe(120)
  })

  it('averages uneven intervals', () => {
    // intervals 400, 600 -> mean 500ms -> 120 bpm
    expect(bpmFromTaps([0, 400, 1000])).toBe(120)
  })

  it('rounds to the nearest whole bpm', () => {
    // 430ms interval -> 139.53 bpm -> 140
    expect(bpmFromTaps([0, 430])).toBe(140)
  })
})
