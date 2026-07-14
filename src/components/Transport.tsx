import { formatDuration } from '../lib/formatDuration'
import { MIN_LOGGED_SECONDS } from '../hooks/useSession'

interface TransportProps {
  isRunning: boolean
  elapsedSeconds: number
  beatOn: boolean
  onToggle: () => void
}

/** Start/stop, the pilot lamp pulsing on each beat, and the running stopwatch. */
export function Transport({ isRunning, elapsedSeconds, beatOn, onToggle }: TransportProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-6">
        <span
          data-testid="beat-lamp"
          aria-hidden="true"
          className={
            'size-3.5 rounded-full border transition-all duration-75 ' +
            (isRunning && beatOn
              ? 'border-glow bg-glow shadow-[0_0_14px_3px_theme(colors.glow/60%)]'
              : 'border-walnut/30 bg-walnut/10 dark:border-bone/25 dark:bg-bone/10')
          }
        />
        <button
          type="button"
          onClick={onToggle}
          className={
            'min-w-36 rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] transition-colors ' +
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass ' +
            (isRunning
              ? 'bg-walnut text-parchment hover:bg-walnut/85 dark:bg-bone dark:text-lacquer dark:hover:bg-bone/85'
              : 'bg-brass text-parchment hover:bg-brass/90 dark:bg-brass-bright dark:text-lacquer dark:hover:bg-brass-bright/90')
          }
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <span
          aria-label="Elapsed time"
          className={
            'font-mono text-2xl tabular-nums ' +
            (isRunning ? 'text-walnut dark:text-bone' : 'text-walnut-soft/60 dark:text-bone-soft/60')
          }
        >
          {formatDuration(elapsedSeconds)}
        </span>
      </div>
      <p className="text-xs text-walnut-soft/80 dark:text-bone-soft/80">
        Sessions under {MIN_LOGGED_SECONDS} seconds aren't logged.
      </p>
    </div>
  )
}
