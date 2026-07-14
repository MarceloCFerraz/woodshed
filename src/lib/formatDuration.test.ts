import { describe, expect, it } from 'vitest'
import { formatDuration } from './formatDuration'

describe('formatDuration', () => {
  it('formats seconds-only durations as 0:SS', () => {
    expect(formatDuration(45)).toBe('0:45')
  })

  it('pads seconds to two digits', () => {
    expect(formatDuration(5)).toBe('0:05')
  })

  it('formats minutes and seconds as M:SS without hours', () => {
    expect(formatDuration(12 * 60 + 34)).toBe('12:34')
  })

  it('formats hours as H:MM:SS', () => {
    expect(formatDuration(3600 + 2 * 60 + 3)).toBe('1:02:03')
  })

  it('formats the last second before an hour as 59:59', () => {
    expect(formatDuration(59 * 60 + 59)).toBe('59:59')
  })

  it('formats exact minute boundaries with zero seconds', () => {
    expect(formatDuration(300)).toBe('5:00')
  })

  it('formats zero as 0:00', () => {
    expect(formatDuration(0)).toBe('0:00')
  })

  it('truncates fractional seconds', () => {
    expect(formatDuration(89.7)).toBe('1:29')
  })
})
