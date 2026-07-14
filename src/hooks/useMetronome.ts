import { useRef, useState } from 'react'
import { Metronome, type NoteValue, clampBpm } from '../lib/metronome'

const defaultContextFactory = () => new AudioContext()

export function useMetronome(
  createContext: () => AudioContext = defaultContextFactory,
  onBeat?: () => void,
) {
  const engineRef = useRef<Metronome | null>(null)
  const [bpm, setBpmState] = useState(120)
  const [noteValue, setNoteValueState] = useState<NoteValue>('quarter')
  const [isRunning, setIsRunning] = useState(false)

  const engine = (engineRef.current ??= new Metronome(createContext, 120))
  engine.onBeat = onBeat ?? null

  const setBpm = (value: number): number => {
    const clamped = clampBpm(value)
    engine.setBpm(clamped)
    setBpmState(clamped)
    return clamped
  }

  const setNoteValue = (value: NoteValue) => {
    engine.setNoteValue(value)
    setNoteValueState(value)
  }

  const start = () => {
    engine.start()
    setIsRunning(true)
  }

  const stop = () => {
    engine.stop()
    setIsRunning(false)
  }

  return { bpm, setBpm, noteValue, setNoteValue, isRunning, start, stop }
}
