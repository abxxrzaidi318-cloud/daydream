// ---------------------------------------------------------------------------
// DAYDREAM sound-effects engine
// Tiny one-shot tones synthesized with the Web Audio API so there are no asset
// dependencies. Every interaction sound routes through here and is silenced
// instantly when the user mutes sound. Safe no-op if audio is unavailable or
// before the first user gesture unlocks the AudioContext.
// ---------------------------------------------------------------------------

let ctx: AudioContext | null = null
let muted = false

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    try {
      ctx = new AC()
    } catch {
      return null
    }
  }
  return ctx
}

/** Resume the AudioContext — must be called from within a user gesture. */
export function unlockAudio() {
  ac()?.resume?.()
}

export function setSfxMuted(m: boolean) {
  muted = m
}

type ToneOpts = {
  freq: number
  type?: OscillatorType
  dur: number
  gain?: number
  slideTo?: number
  delay?: number
}

function tone({ freq, type = "sine", dur, gain = 0.14, slideTo, delay = 0 }: ToneOpts) {
  const c = ac()
  if (!c || muted) return
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  // soft attack + exponential release (never ramp to exactly 0)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

export type SfxType = "pop" | "chime" | "click" | "sparkle" | "whoosh"

/** Play a named interaction sound. Respects the global mute flag. */
export function playSfx(type: SfxType) {
  const c = ac()
  if (!c || muted) return
  c.resume?.()
  switch (type) {
    case "pop":
      tone({ freq: 380, type: "sine", dur: 0.12, gain: 0.09, slideTo: 560 })
      break
    case "click":
      tone({ freq: 300, type: "triangle", dur: 0.07, gain: 0.06, slideTo: 240 })
      break
    case "chime":
      // gentle major third — a "magical" confirmation
      ;[659.25, 987.77].forEach((f, i) => tone({ freq: f, type: "sine", dur: 0.5, gain: 0.09, delay: i * 0.05 }))
      break
    case "sparkle":
      // rising arpeggio of soft bells
      ;[880, 1174.66, 1567.98].forEach((f, i) => tone({ freq: f, type: "sine", dur: 0.34, gain: 0.06, delay: i * 0.05 }))
      break
    case "whoosh":
      // soft airy sweep for stage / remix transitions
      tone({ freq: 200, type: "sine", dur: 0.7, gain: 0.08, slideTo: 900 })
      tone({ freq: 520, type: "sine", dur: 0.7, gain: 0.04, slideTo: 1500, delay: 0.03 })
      break
  }
}
