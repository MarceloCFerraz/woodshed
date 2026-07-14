import { useRef } from 'react'
import { addTap, bpmFromTaps } from '../lib/tapTempo'

interface TapTempoProps {
  onBpm: (bpm: number) => void
}

export function TapTempo({ onBpm }: TapTempoProps) {
  const tapsRef = useRef<number[]>([])

  const handleTap = () => {
    tapsRef.current = addTap(tapsRef.current, performance.now())
    const bpm = bpmFromTaps(tapsRef.current)
    if (bpm !== null) onBpm(bpm)
  }

  return (
    <button
      type="button"
      onClick={handleTap}
      className="rounded-lg border border-dashed border-walnut/35 px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] text-walnut-soft transition-colors hover:border-brass hover:text-brass active:scale-95 dark:border-bone/30 dark:text-bone-soft dark:hover:border-brass-bright dark:hover:text-brass-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
    >
      Tap tempo
    </button>
  )
}
