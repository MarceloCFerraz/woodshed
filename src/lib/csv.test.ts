import { describe, expect, it } from 'vitest'
import type { HistoryEntry } from './history'
import { csvFilename, toCsv } from './csv'

describe('toCsv', () => {
  it('produces a header for an empty history', () => {
    expect(toCsv([])).toBe('ended_at,bpm,note_value,duration_seconds,duration\n')
  })

  it('renders one row per entry with ISO timestamp and formatted duration', () => {
    const entries: HistoryEntry[] = [
      { bpm: 120, noteValue: 'sixteenth', durationSeconds: 754, endedAt: Date.UTC(2026, 6, 13, 10, 30, 0) },
      { bpm: 90, noteValue: 'quarter', durationSeconds: 45, endedAt: Date.UTC(2026, 6, 13, 10, 0, 0) },
    ]
    expect(toCsv(entries)).toBe(
      'ended_at,bpm,note_value,duration_seconds,duration\n' +
        '2026-07-13T10:30:00.000Z,120,sixteenth,754,12:34\n' +
        '2026-07-13T10:00:00.000Z,90,quarter,45,0:45\n',
    )
  })

  it('names the file with a local-time timestamp suffix', () => {
    expect(csvFilename(new Date(2026, 6, 13, 22, 17, 32))).toBe(
      'woodshed-history-2026-07-13-22-17-32.csv',
    )
  })

  it('zero-pads every timestamp component', () => {
    expect(csvFilename(new Date(2026, 0, 5, 8, 3, 7))).toBe('woodshed-history-2026-01-05-08-03-07.csv')
  })

  it('falls back to quarter for legacy entries without a note value', () => {
    const entries: HistoryEntry[] = [
      { bpm: 100, durationSeconds: 60, endedAt: Date.UTC(2026, 6, 13, 9, 0, 0) },
    ]
    expect(toCsv(entries)).toContain('2026-07-13T09:00:00.000Z,100,quarter,60,1:00')
  })
})
