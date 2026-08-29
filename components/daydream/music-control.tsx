"use client"

import { useCallback, useEffect, useRef } from "react"
import type { Phase } from "./day-sky"

/**
 * Headless ambient music. Generates a calm sine-pad chord with the Web Audio
 * API (no asset dependency) so it can't fail to load. Never autoplays — only
 * starts once `started` is true (set after the user clicks "Begin Dreaming").
 * The chord subtly shifts brightness with the phase, and volume follows the
 * global sound preference. Rendering nothing; it's pure audio.
 */

// Root chord per phase — brighter by day, warmer/calmer at night.
const CHORDS: Record<Phase, number[]> = {
  landing: [220, 277.18, 329.63],
  morning: [261.63, 329.63, 392.0],
  afternoon: [293.66, 369.99, 440.0],
  evening: [220, 277.18, 349.23],
  dreaming: [196, 261.63, 329.63],
  result: [174.61, 261.63, 349.23],
}

export function AmbientMusic({ started, muted, phase }: { started: boolean; muted: boolean; phase: Phase }) {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const oscRef = useRef<OscillatorNode[]>([])
  const startedRef = useRef(false)

  const start = useCallback(() => {
    if (startedRef.current) return
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return
      const ctx: AudioContext = new AC()
      const master = ctx.createGain()
      master.gain.value = 0
      master.connect(ctx.destination)

      const chord = CHORDS.landing
      chord.forEach((f, i) => {
        const osc = ctx.createOscillator()
        osc.type = "sine"
        osc.frequency.value = f
        const g = ctx.createGain()
        g.gain.value = i === 0 ? 0.5 : 0.28
        // gentle tremolo for a dreamy shimmer
        const lfo = ctx.createOscillator()
        lfo.frequency.value = 0.08 + i * 0.03
        const lfoGain = ctx.createGain()
        lfoGain.gain.value = 0.08
        lfo.connect(lfoGain)
        lfoGain.connect(g.gain)
        osc.connect(g)
        g.connect(master)
        osc.start()
        lfo.start()
        oscRef.current.push(osc)
      })

      master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2.5)
      ctxRef.current = ctx
      masterRef.current = master
      startedRef.current = true
    } catch {
      /* audio unavailable */
    }
  }, [])

  // Start after the first gesture, and follow the mute preference.
  useEffect(() => {
    if (started && !muted) {
      start()
      ctxRef.current?.resume?.()
      if (masterRef.current && ctxRef.current) {
        masterRef.current.gain.linearRampToValueAtTime(0.05, ctxRef.current.currentTime + 1.2)
      }
    }
    if (muted && masterRef.current && ctxRef.current) {
      masterRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.4)
    }
  }, [started, muted, start])

  // Crossfade the chord to match the phase (glide oscillator frequencies).
  useEffect(() => {
    const ctx = ctxRef.current
    if (!ctx || oscRef.current.length === 0) return
    const chord = CHORDS[phase]
    oscRef.current.forEach((osc, i) => {
      if (chord[i] != null) osc.frequency.linearRampToValueAtTime(chord[i], ctx.currentTime + 1.4)
    })
  }, [phase])

  useEffect(() => {
    return () => {
      ctxRef.current?.close?.()
    }
  }, [])

  return null
}
