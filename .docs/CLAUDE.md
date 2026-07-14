# Documentation conventions — Woodshed

- `CHANGELOG.md` — every meaningful change gets an entry: date, what changed, why. Update incrementally as you work, not at the end.
- `flows/` — one markdown file per user-facing flow when a flow grows beyond what the code makes obvious. Currently the app is small enough that `README.md` + code cover it; create flow docs here when a flow spans multiple modules or gains non-obvious rules.
- Code is the source of truth; docs point at the right code, they don't duplicate it.

## Key domain rules (non-obvious)

- BPM always refers to the quarter note. The note-value selector sets the *subdivision* — clicks per beat (1/2/4/8) — it does not reinterpret the BPM. Showing "♪ = 120" would be musically wrong; the tempo marking always renders the quarter-note glyph.
- History segments shorter than 30 s are discarded (rule lives in `src/hooks/useSession.ts`, `MIN_LOGGED_SECONDS`).
- Changing BPM while running closes the current history segment and starts a new one.
- Theme override is cleared when the user toggles back to the current system value, so the switch resumes following the OS (`src/hooks/useTheme.ts`).
