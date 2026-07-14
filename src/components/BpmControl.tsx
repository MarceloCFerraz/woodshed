import { useState } from 'react'
import { MAX_BPM, MIN_BPM } from '../lib/metronome'
import { NoteGlyph } from './NoteGlyph'

interface BpmControlProps {
  bpm: number
  onChange: (bpm: number) => void
}

const stepButton =
  'grid size-11 place-items-center rounded-full border border-walnut/25 text-2xl leading-none ' +
  'text-walnut-soft transition-colors hover:border-brass hover:text-brass ' +
  'dark:border-bone/25 dark:text-bone-soft dark:hover:border-brass-bright dark:hover:text-brass-bright ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass'

/** Score-style tempo marking (♩ = N) with ± steppers and a click-to-type number. */
export function BpmControl({ bpm, onChange }: BpmControlProps) {
  const [draft, setDraft] = useState<string | null>(null)

  const commit = () => {
    if (draft === null) return
    const parsed = Number.parseInt(draft, 10)
    if (!Number.isNaN(parsed)) onChange(parsed)
    setDraft(null)
  }

  return (
    <div className="flex items-center gap-5">
      <button type="button" aria-label="Decrease BPM" className={stepButton} onClick={() => onChange(bpm - 1)}>
        −
      </button>

      <div className="flex items-baseline gap-3 font-display">
        <NoteGlyph flags={0} className="h-14 self-center text-walnut dark:text-bone" />
        <span className="text-4xl text-walnut-soft dark:text-bone-soft">=</span>
        {draft === null ? (
          <button
            type="button"
            aria-label={`Current BPM ${bpm}. Click to type a value`}
            className="text-8xl font-medium tabular-nums tracking-tight text-walnut transition-colors hover:text-brass dark:text-bone dark:hover:text-brass-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
            onClick={() => setDraft(String(bpm))}
          >
            {bpm}
          </button>
        ) : (
          <input
            autoFocus
            aria-label="Enter BPM"
            inputMode="numeric"
            value={draft}
            min={MIN_BPM}
            max={MAX_BPM}
            className="w-[2.6ch] bg-transparent text-8xl font-medium tabular-nums tracking-tight text-brass outline-none dark:text-brass-bright"
            onFocus={(event) => event.target.select()}
            onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commit()
              if (event.key === 'Escape') setDraft(null)
            }}
          />
        )}
        <span className="text-sm uppercase tracking-[0.2em] text-walnut-soft dark:text-bone-soft">bpm</span>
      </div>

      <button type="button" aria-label="Increase BPM" className={stepButton} onClick={() => onChange(bpm + 1)}>
        +
      </button>
    </div>
  )
}
