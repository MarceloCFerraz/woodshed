# Woodshed

Metronome with a practice stopwatch for guitar study sessions. Set an audible BPM, time how long you played at each tempo, and keep the history locally.

## Features

- **Metronome** with a synthesized click via Web Audio (lookahead scheduling on the audio clock — no drift).
- **BPM 20–300**: −/+ steppers, click the number to type a value, and tap tempo.
- **Beat subdivision**: quarter, eighth, sixteenth, or thirty-second notes (BPM always refers to the quarter note).
- **Coupled stopwatch**: starts and stops with the metronome. Stopping (or changing BPM mid-run) logs the segment to the history — segments under 30 seconds are discarded.
- **Persistent history** (localStorage) with CSV export and a clear button.
- **Dark mode**: follows the OS preference by default; the switch in the top-right corner sets a persistent override (toggling back to the OS value resumes following it).

## Stack

Vite + React 19 + TypeScript, Tailwind CSS v4, Vitest + React Testing Library. No runtime dependencies beyond React and self-hosted fonts (Fontsource). Ready to receive a Tauri 2 wrapper in a later phase (the frontend is a plain Vite app).

## Commands

```bash
npm run dev     # dev server (http://localhost:5173)
npm test        # test suite
npm run build   # typecheck + production build in dist/
npm run lint    # oxlint
```

## Structure

- `src/lib/` — pure logic: metronome engine (`metronome.ts`), duration formatting, tap tempo, history, and CSV.
- `src/hooks/` — `useMetronome`, `useSession` (stopwatch + logging rules), `useTheme`.
- `src/components/` — UI (BPM control, subdivision selector, transport, history, theme switch).

Flow docs and changelog live in `.docs/`.
