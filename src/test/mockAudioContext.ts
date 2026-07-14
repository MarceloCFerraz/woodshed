import { vi } from 'vitest'

/**
 * Minimal AudioContext stand-in that records oscillator start times so tests
 * can assert the click schedule. Advance `currentTime` manually alongside
 * vi.advanceTimersByTime to simulate the audio clock.
 */
export class MockAudioContext {
  currentTime = 0
  state: AudioContextState = 'running'
  destination = {} as AudioDestinationNode
  clickTimes: number[] = []
  clickFreqs: number[] = []
  resume = vi.fn(async () => {
    this.state = 'running'
  })

  createOscillator() {
    const record = (time: number, freq: number) => {
      this.clickTimes.push(time)
      this.clickFreqs.push(freq)
    }
    const osc = {
      frequency: { value: 0 },
      connect: vi.fn(),
      start(time: number) {
        record(time, osc.frequency.value)
      },
      stop: vi.fn(),
    }
    return osc
  }

  createGain() {
    return {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    }
  }

  asAudioContext(): AudioContext {
    return this as unknown as AudioContext
  }
}
