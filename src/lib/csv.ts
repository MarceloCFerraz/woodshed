import { formatDuration } from './formatDuration'
import type { HistoryEntry } from './history'

export function toCsv(entries: HistoryEntry[]): string {
  const rows = entries.map(
    (e) =>
      `${new Date(e.endedAt).toISOString()},${e.bpm},${e.noteValue ?? 'quarter'},${e.durationSeconds},${formatDuration(e.durationSeconds)}`,
  )
  return ['ended_at,bpm,note_value,duration_seconds,duration', ...rows, ''].join('\n')
}

export function csvFilename(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const stamp = [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('-')
  return `woodshed-history-${stamp}.csv`
}

export function downloadCsv(entries: HistoryEntry[]): void {
  const blob = new Blob([toCsv(entries)], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = csvFilename(new Date())
  link.click()
  URL.revokeObjectURL(url)
}
