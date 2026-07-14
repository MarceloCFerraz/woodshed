import { useEffect, useState } from 'react'
import { type HistoryEntry, appendEntry, clearHistory, loadHistory } from '../lib/history'
import type { NoteValue } from '../lib/metronome'

export const MIN_LOGGED_SECONDS = 30

interface Segment {
  bpm: number
  noteValue: NoteValue
  startedAt: number
}

/**
 * Stopwatch tied to the metronome transport. Each run at a given BPM and
 * subdivision is a segment; closing one (stop, or a BPM/subdivision change
 * while running) logs it to the persistent history when it lasted at least
 * MIN_LOGGED_SECONDS.
 */
export function useSession() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory)
  const [segment, setSegment] = useState<Segment | null>(null)
  const [now, setNow] = useState(0)

  useEffect(() => {
    if (segment === null) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [segment])

  const closeSegment = (current: Segment) => {
    const endedAt = Date.now()
    const durationSeconds = Math.floor((endedAt - current.startedAt) / 1000)
    if (durationSeconds >= MIN_LOGGED_SECONDS) {
      setHistory(
        appendEntry({ bpm: current.bpm, noteValue: current.noteValue, durationSeconds, endedAt }),
      )
    }
  }

  const start = (bpm: number, noteValue: NoteValue) => {
    const startedAt = Date.now()
    setNow(startedAt)
    setSegment({ bpm, noteValue, startedAt })
  }

  const stop = () => {
    if (segment === null) return
    closeSegment(segment)
    setSegment(null)
  }

  const switchSettings = (bpm: number, noteValue: NoteValue) => {
    if (segment === null || (bpm === segment.bpm && noteValue === segment.noteValue)) return
    closeSegment(segment)
    start(bpm, noteValue)
  }

  const clear = () => {
    clearHistory()
    setHistory([])
  }

  const elapsedSeconds = segment === null ? 0 : Math.max(0, Math.floor((now - segment.startedAt) / 1000))

  return { history, elapsedSeconds, isRunning: segment !== null, start, stop, switchSettings, clear }
}
