import { useCallback, useEffect, useRef, useState } from 'react'
import { BpmControl } from './components/BpmControl'
import { HistoryList } from './components/HistoryList'
import { NoteValueSelector } from './components/NoteValueSelector'
import { TapTempo } from './components/TapTempo'
import { ThemeToggle } from './components/ThemeToggle'
import { Transport } from './components/Transport'
import { useMetronome } from './hooks/useMetronome'
import type { NoteValue } from './lib/metronome'
import { useSession } from './hooks/useSession'
import { useTheme } from './hooks/useTheme'

const BEAT_FLASH_MS = 90

function App() {
  const { theme, toggle: toggleTheme } = useTheme()
  const session = useSession()

  const [beatOn, setBeatOn] = useState(false)
  const beatTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const flashBeat = useCallback(() => {
    setBeatOn(true)
    if (beatTimeout.current !== null) clearTimeout(beatTimeout.current)
    beatTimeout.current = setTimeout(() => setBeatOn(false), BEAT_FLASH_MS)
  }, [])
  useEffect(
    () => () => {
      if (beatTimeout.current !== null) clearTimeout(beatTimeout.current)
    },
    [],
  )

  const metronome = useMetronome(undefined, flashBeat)

  const handleToggleTransport = () => {
    if (metronome.isRunning) {
      metronome.stop()
      session.stop()
      setBeatOn(false)
    } else {
      metronome.start()
      session.start(metronome.bpm, metronome.noteValue)
    }
  }

  const handleBpmChange = (value: number) => {
    const clamped = metronome.setBpm(value)
    session.switchSettings(clamped, metronome.noteValue)
  }

  const handleNoteValueChange = (value: NoteValue) => {
    metronome.setNoteValue(value)
    session.switchSettings(metronome.bpm, value)
  }

  return (
    <div className="min-h-screen bg-maple font-sans text-walnut transition-colors dark:bg-lacquer dark:text-bone">
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 py-5">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">Woodshed</h1>
            <p className="text-xs uppercase tracking-[0.25em] text-walnut-soft dark:text-bone-soft">
              Practice journal
            </p>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        <main className="flex flex-1 flex-col items-center gap-9 pt-14">
          <BpmControl bpm={metronome.bpm} onChange={handleBpmChange} />

          <div className="flex flex-wrap items-stretch justify-center gap-3">
            <NoteValueSelector value={metronome.noteValue} onChange={handleNoteValueChange} />
            <TapTempo onBpm={handleBpmChange} />
          </div>

          <Transport
            isRunning={metronome.isRunning}
            elapsedSeconds={session.elapsedSeconds}
            beatOn={beatOn}
            onToggle={handleToggleTransport}
          />

          <HistoryList entries={session.history} onClear={session.clear} />
        </main>
      </div>
    </div>
  )
}

export default App
