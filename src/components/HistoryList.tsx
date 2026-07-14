import { downloadCsv } from '../lib/csv'
import { formatDuration } from '../lib/formatDuration'
import type { HistoryEntry } from '../lib/history'
import { NoteGlyph } from './NoteGlyph'

interface HistoryListProps {
  entries: HistoryEntry[]
  onClear: () => void
}

const textButton =
  'rounded px-2 py-1 text-[11px] uppercase tracking-wider text-walnut-soft transition-colors ' +
  'hover:text-brass dark:text-bone-soft dark:hover:text-brass-bright ' +
  'focus-visible:outline-2 focus-visible:outline-brass'

function formatEndedAt(endedAt: number): string {
  return new Date(endedAt).toLocaleString(undefined, {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function HistoryList({ entries, onClear }: HistoryListProps) {
  return (
    <section aria-label="History" className="w-full max-w-md">
      <header className="flex items-baseline justify-between border-b border-walnut/20 pb-2 dark:border-bone/15">
        <h2 className="font-display text-lg text-walnut dark:text-bone">History</h2>
        {entries.length > 0 && (
          <div className="flex gap-2">
            <button type="button" className={textButton} onClick={() => downloadCsv(entries)}>
              Export CSV
            </button>
            <button
              type="button"
              className={textButton}
              onClick={() => {
                if (window.confirm('Clear all history?')) onClear()
              }}
            >
              Clear
            </button>
          </div>
        )}
      </header>

      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-walnut-soft dark:text-bone-soft">
          Nothing logged yet. Play for at least 30 seconds to create the first entry.
        </p>
      ) : (
        <ul className="divide-y divide-walnut/10 dark:divide-bone/10">
          {entries.map((entry) => (
            <li key={entry.endedAt} className="flex items-center justify-between py-2.5">
              <span className="flex items-center gap-1.5 font-medium text-walnut dark:text-bone">
                <NoteGlyph flags={0} className="h-4 text-walnut-soft dark:text-bone-soft" />
                <span className="sr-only">BPM </span>
                {entry.bpm}
              </span>
              <span className="font-mono tabular-nums text-walnut dark:text-bone">
                {formatDuration(entry.durationSeconds)}
              </span>
              <span className="w-28 text-right text-xs text-walnut-soft dark:text-bone-soft">
                {formatEndedAt(entry.endedAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
