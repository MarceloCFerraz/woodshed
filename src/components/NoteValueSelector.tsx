import type { NoteValue } from '../lib/metronome'
import { NoteGlyph } from './NoteGlyph'

interface NoteValueSelectorProps {
  value: NoteValue
  onChange: (value: NoteValue) => void
}

const OPTIONS: { value: NoteValue; label: string; flags: 0 | 1 | 2 | 3 }[] = [
  { value: 'quarter', label: 'Quarter', flags: 0 },
  { value: 'eighth', label: 'Eighth', flags: 1 },
  { value: 'sixteenth', label: 'Sixteenth', flags: 2 },
  { value: 'thirtySecond', label: 'Thirty-second', flags: 3 },
]

/** Subdivision of the beat: how many clicks each quarter note gets. */
export function NoteValueSelector({ value, onChange }: NoteValueSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Beat subdivision"
      className="flex overflow-hidden rounded-lg border border-walnut/25 dark:border-bone/20"
    >
      {OPTIONS.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={
              'flex flex-col items-center gap-1 px-4 py-2.5 text-[11px] uppercase tracking-wider transition-colors ' +
              'not-last:border-r not-last:border-walnut/25 dark:not-last:border-bone/20 ' +
              'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brass ' +
              (selected
                ? 'bg-brass text-parchment dark:bg-brass-bright dark:text-lacquer'
                : 'text-walnut-soft hover:bg-walnut/5 dark:text-bone-soft dark:hover:bg-bone/5')
            }
          >
            <NoteGlyph flags={option.flags} className="h-6" />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
