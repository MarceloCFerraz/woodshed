export type NoteValue = 'quarter' | 'eighth' | 'sixteenth' | 'thirtySecond'

/** Clicks per quarter-note beat; BPM always refers to the quarter note. */
export const CLICKS_PER_BEAT: Record<NoteValue, number> = {
  quarter: 1,
  eighth: 2,
  sixteenth: 4,
  thirtySecond: 8,
}

export const MIN_BPM = 20
export const MAX_BPM = 300

export function clampBpm(bpm: number): number {
  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(bpm)))
}

const SCHEDULE_AHEAD_S = 0.1
const LOOKAHEAD_MS = 25
export const BEAT_FREQ_HZ = 1800
export const SUBDIVISION_FREQ_HZ = 850
const SUBDIVISION_GAIN = 0.28
const CLICK_DURATION_S = 0.03

/**
 * Web Audio lookahead metronome: a coarse setInterval loop schedules clicks
 * ahead of time on the AudioContext clock, which is sample-accurate.
 */
export class Metronome {
  /** Called on each quarter-note beat, aligned to the audible click. */
  onBeat: (() => void) | null = null

  private readonly createContext: () => AudioContext
  private ctx: AudioContext | null = null
  private timerId: ReturnType<typeof setInterval> | null = null
  private nextClickTime = 0
  private clickCount = 0
  private bpm: number
  private noteValue: NoteValue

  constructor(createContext: () => AudioContext, bpm = 120, noteValue: NoteValue = 'quarter') {
    this.createContext = createContext
    this.bpm = clampBpm(bpm)
    this.noteValue = noteValue
  }

  get isRunning(): boolean {
    return this.timerId !== null
  }

  setBpm(bpm: number): void {
    this.bpm = clampBpm(bpm)
  }

  setNoteValue(noteValue: NoteValue): void {
    this.noteValue = noteValue
  }

  start(): void {
    if (this.isRunning) return
    this.ctx ??= this.createContext()
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
    this.nextClickTime = this.ctx.currentTime + 0.05
    this.clickCount = 0
    this.timerId = setInterval(() => this.scheduleClicks(), LOOKAHEAD_MS)
    this.scheduleClicks()
  }

  stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }

  private scheduleClicks(): void {
    const ctx = this.ctx
    if (ctx === null) return
    while (this.nextClickTime < ctx.currentTime + SCHEDULE_AHEAD_S) {
      const isBeat = this.clickCount % CLICKS_PER_BEAT[this.noteValue] === 0
      this.playClick(ctx, this.nextClickTime, isBeat)
      if (isBeat) {
        this.scheduleBeatCallback(ctx, this.nextClickTime)
      }
      this.clickCount += 1
      this.nextClickTime += 60 / this.bpm / CLICKS_PER_BEAT[this.noteValue]
    }
  }

  private scheduleBeatCallback(ctx: AudioContext, time: number): void {
    if (this.onBeat === null) return
    const delayMs = Math.max(0, (time - ctx.currentTime) * 1000)
    setTimeout(() => {
      if (this.isRunning) this.onBeat?.()
    }, delayMs)
  }

  private playClick(ctx: AudioContext, time: number, isBeat: boolean): void {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = isBeat ? BEAT_FREQ_HZ : SUBDIVISION_FREQ_HZ
    gain.gain.setValueAtTime(isBeat ? 1 : SUBDIVISION_GAIN, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + CLICK_DURATION_S)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(time)
    osc.stop(time + CLICK_DURATION_S)
  }
}
