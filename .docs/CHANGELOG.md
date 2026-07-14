# Changelog

## 2026-07-13 — History shows subdivision; softer subdivision click

Two enhancements requested by Marcelo after playing with the accented clicks:

- **History entries now record and display the subdivision** the segment was played with (glyph in the row with a tooltip/sr-only label, `note_value` column in the CSV). `HistoryEntry.noteValue` is optional — entries logged before this change fall back to quarter on display and export. Consequence: changing the subdivision mid-run now splits the segment exactly like a BPM change (`useSession.switchBpm` became `switchSettings(bpm, noteValue)`), otherwise a row could claim a subdivision it wasn't fully played at. Note-value label/flag metadata was centralized in `NOTE_VALUE_META` (`src/components/NoteGlyph.tsx`), shared by the selector and the history list.
- **Subdivision click dropped further**: 1100 Hz → 850 Hz and 45% → 28% gain (`src/lib/metronome.ts`), so the off-beat ticks sit clearly under the 1800 Hz beat.
- **CSV export filename gets a local-time timestamp suffix** (`woodshed-history-2026-07-13-22-17-32.csv`) so repeated exports don't overwrite each other (`csvFilename` in `src/lib/csv.ts`).

## 2026-07-13 — Accented beat clicks

Subdivision clicks now sound distinct from the beat: the on-beat click keeps the bright 1800 Hz tone at full gain, while subdivision clicks play at 1100 Hz and 45% gain (`BEAT_FREQ_HZ` / `SUBDIVISION_FREQ_HZ` in `src/lib/metronome.ts`). Requested by Marcelo after trying the first build — with a uniform click you can't hear where the beat falls when subdividing.

## 2026-07-13 — Initial version (web phase)

New app: practice metronome with a session stopwatch and persistent history. Built as phase 1 (web only) of a two-phase plan; phase 2 will wrap the same frontend with Tauri 2 for a native macOS build.

- Scaffolded with Vite + React 19 + TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`, class-based `dark` variant), Vitest + React Testing Library.
- `src/lib/metronome.ts`: Web Audio lookahead scheduler (setInterval loop schedules oscillator clicks ~100 ms ahead on the AudioContext clock — sample-accurate, no drift). Synthesized click, no audio assets. `onBeat` callback drives the UI pilot lamp, aligned to the audible click.
- Beat subdivision (quarter/eighth/sixteenth/thirty-second) multiplies clicks per beat; BPM always refers to the quarter note, so the score-style tempo marking always shows the quarter-note glyph.
- `src/hooks/useSession.ts`: stopwatch coupled to the transport. Segments log to localStorage on stop or on BPM change mid-run; segments under 30 s are discarded. Durations measured via `Date.now()` deltas, not accumulated ticks.
- History list with CSV export (`src/lib/csv.ts`) and clear-with-confirm.
- Theme: follows OS `prefers-color-scheme`, top-right switch sets a persistent override; toggling back to the OS value clears the override (`src/hooks/useTheme.ts`).
- Design: "practice room" direction — aged maple + brass (light), warm amp-lacquer black + amber pilot lamp (dark); Fraunces display for the tempo marking, Work Sans UI, JetBrains Mono timer digits (all self-hosted via Fontsource, Tauri-friendly).
- Language note: UI copy and note names were initially written in pt-BR (the request mentioned "semicolcheia"); Marcelo asked for everything in English, so all copy, note values (`NoteValue` union), docs, and tests were converted the same day.
- Verified: 59 unit/integration tests, `tsc` + production build clean, headless Chrome smoke (screenshots light/dark, start/stop, subdivision switch, typed BPM, zero console errors).
