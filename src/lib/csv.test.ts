import { describe, expect, it } from 'vitest'
import type { HistoryEntry } from './history'
import { toCsv } from './csv'

describe('toCsv', () => {
  it('produces a header for an empty history', () => {
    expect(toCsv([])).toBe('ended_at,bpm,duration_seconds,duration\n')
  })

  it('renders one row per entry with ISO timestamp and formatted duration', () => {
    const entries: HistoryEntry[] = [
      { bpm: 120, durationSeconds: 754, endedAt: Date.UTC(2026, 6, 13, 10, 30, 0) },
      { bpm: 90, durationSeconds: 45, endedAt: Date.UTC(2026, 6, 13, 10, 0, 0) },
    ]
    expect(toCsv(entries)).toBe(
      'ended_at,bpm,duration_seconds,duration\n' +
        '2026-07-13T10:30:00.000Z,120,754,12:34\n' +
        '2026-07-13T10:00:00.000Z,90,45,0:45\n',
    )
  })
})
