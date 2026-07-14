export const TAP_RESET_MS = 2000
export const MAX_TAPS = 5

export function addTap(taps: number[], timestamp: number): number[] {
  const last = taps[taps.length - 1]
  if (last !== undefined && timestamp - last > TAP_RESET_MS) {
    return [timestamp]
  }
  return [...taps, timestamp].slice(-MAX_TAPS)
}

export function bpmFromTaps(taps: number[]): number | null {
  if (taps.length < 2) return null
  const elapsed = taps[taps.length - 1] - taps[0]
  const meanIntervalMs = elapsed / (taps.length - 1)
  return Math.round(60000 / meanIntervalMs)
}
