import type { NoteValue } from '../lib/metronome'

export const NOTE_VALUE_META: Record<NoteValue, { label: string; flags: 0 | 1 | 2 | 3 }> = {
  quarter: { label: 'Quarter', flags: 0 },
  eighth: { label: 'Eighth', flags: 1 },
  sixteenth: { label: 'Sixteenth', flags: 2 },
  thirtySecond: { label: 'Thirty-second', flags: 3 },
}

interface NoteGlyphProps {
  /** Number of flags on the stem: 0 = quarter, 1 = eighth, 2 = sixteenth, 3 = thirty-second. */
  flags: 0 | 1 | 2 | 3
  className?: string
}

export function NoteGlyph({ flags, className }: NoteGlyphProps) {
  return (
    <svg viewBox="0 0 34 64" className={className} aria-hidden="true" fill="currentColor">
      <ellipse cx="12" cy="55" rx="10" ry="6.8" transform="rotate(-20 12 55)" />
      <rect x="19.4" y="5" width="2.8" height="50" />
      {Array.from({ length: flags }, (_, i) => (
        <path key={i} d={`M22.2 ${5 + i * 9} c 9 5 11.5 12 6.5 20 c 2.5 -8 0.5 -12.5 -6.5 -15.5 z`} />
      ))}
    </svg>
  )
}
