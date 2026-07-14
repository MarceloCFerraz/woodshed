import { beforeEach, describe, expect, it } from 'vitest'
import { type HistoryEntry, appendEntry, clearHistory, loadHistory } from './history'

const entry: HistoryEntry = { bpm: 120, durationSeconds: 754, endedAt: 1770000000000 }

describe('history storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns an empty list when nothing is stored', () => {
    expect(loadHistory()).toEqual([])
  })

  it('persists appended entries', () => {
    appendEntry(entry)
    expect(loadHistory()).toEqual([entry])
  })

  it('appends newest entries first', () => {
    const older: HistoryEntry = { bpm: 100, durationSeconds: 60, endedAt: 1 }
    appendEntry(older)
    appendEntry(entry)
    expect(loadHistory()).toEqual([entry, older])
  })

  it('returns an empty list when stored data is corrupt', () => {
    localStorage.setItem('woodshed.history', 'not json')
    expect(loadHistory()).toEqual([])
  })

  it('clears all entries', () => {
    appendEntry(entry)
    clearHistory()
    expect(loadHistory()).toEqual([])
  })
})
