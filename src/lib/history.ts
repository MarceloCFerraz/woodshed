export interface HistoryEntry {
  bpm: number
  durationSeconds: number
  /** Epoch milliseconds of when the segment ended. */
  endedAt: number
}

const STORAGE_KEY = 'woodshed.history'

export function loadHistory(): HistoryEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function appendEntry(entry: HistoryEntry): HistoryEntry[] {
  const entries = [entry, ...loadHistory()]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  return entries
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
