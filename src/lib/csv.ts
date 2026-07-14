import { formatDuration } from './formatDuration'
import type { HistoryEntry } from './history'

export function toCsv(entries: HistoryEntry[]): string {
  const rows = entries.map(
    (e) =>
      `${new Date(e.endedAt).toISOString()},${e.bpm},${e.durationSeconds},${formatDuration(e.durationSeconds)}`,
  )
  return ['ended_at,bpm,duration_seconds,duration', ...rows, ''].join('\n')
}

export function downloadCsv(entries: HistoryEntry[]): void {
  const blob = new Blob([toCsv(entries)], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'woodshed-history.csv'
  link.click()
  URL.revokeObjectURL(url)
}
