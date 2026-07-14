import type { Theme } from '../hooks/useTheme'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      onClick={onToggle}
      className="relative h-7 w-13 rounded-full border border-walnut/25 bg-walnut/10 transition-colors dark:border-bone/25 dark:bg-bone/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
    >
      <span
        className={
          'absolute top-0.5 grid size-5.5 place-items-center rounded-full bg-parchment text-[11px] shadow transition-[left] dark:bg-lacquer-panel ' +
          (dark ? 'left-[calc(100%-1.5rem)]' : 'left-0.5')
        }
      >
        {dark ? '☾' : '☀'}
      </span>
    </button>
  )
}
