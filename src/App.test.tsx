import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { MockAudioContext } from './test/mockAudioContext'
import { installMatchMedia } from './test/mockMatchMedia'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    installMatchMedia(false)
    vi.stubGlobal('AudioContext', MockAudioContext)
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-13T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('renders the default tempo marking', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /Current BPM 120/ })).toBeInTheDocument()
  })

  it('adjusts bpm with the step buttons', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Increase BPM' }))
    expect(screen.getByRole('button', { name: /Current BPM 121/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Decrease BPM' }))
    fireEvent.click(screen.getByRole('button', { name: 'Decrease BPM' }))
    expect(screen.getByRole('button', { name: /Current BPM 119/ })).toBeInTheDocument()
  })

  it('accepts a typed bpm and clamps it to the valid range', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Current BPM 120/ }))
    const input = screen.getByRole('textbox', { name: 'Enter BPM' })
    fireEvent.change(input, { target: { value: '87' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByRole('button', { name: /Current BPM 87/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Current BPM 87/ }))
    const again = screen.getByRole('textbox', { name: 'Enter BPM' })
    fireEvent.change(again, { target: { value: '999' } })
    fireEvent.blur(again)
    expect(screen.getByRole('button', { name: /Current BPM 300/ })).toBeInTheDocument()
  })

  it('selects a subdivision', () => {
    render(<App />)
    const thirtySecond = screen.getByRole('button', { name: 'Thirty-second' })
    fireEvent.click(thirtySecond)
    expect(thirtySecond).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Quarter' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('runs a session and logs it to the history on stop', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    vi.advanceTimersByTime(45_000)
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
    const history = screen.getByRole('region', { name: 'History' })
    expect(history).toHaveTextContent('120')
    expect(history).toHaveTextContent('0:45')
  })

  it('discards sessions shorter than 30 seconds', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    vi.advanceTimersByTime(10_000)
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
    expect(screen.getByText(/Nothing logged yet/)).toBeInTheDocument()
  })

  it('splits the log when bpm changes mid-session', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    vi.advanceTimersByTime(60_000)
    fireEvent.click(screen.getByRole('button', { name: 'Increase BPM' }))
    vi.advanceTimersByTime(40_000)
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
    const rows = screen.getAllByRole('listitem')
    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveTextContent('121')
    expect(rows[0]).toHaveTextContent('0:40')
    expect(rows[1]).toHaveTextContent('120')
    expect(rows[1]).toHaveTextContent('1:00')
  })

  it('toggles dark mode via the switch', () => {
    render(<App />)
    const toggle = screen.getByRole('switch', { name: 'Dark mode' })
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('clears the history after confirmation', () => {
    localStorage.setItem(
      'woodshed.history',
      JSON.stringify([{ bpm: 100, durationSeconds: 120, endedAt: Date.now() }]),
    )
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByText(/Nothing logged yet/)).toBeInTheDocument()
  })
})
