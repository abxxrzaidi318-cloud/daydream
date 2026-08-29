"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Unobtrusive ambient sound, generated with the Web Audio API so there's no
 * asset dependency. Never autoplays — `enabled` is only turned on after the
 * user clicks "Begin Dreaming". The whole app works fine if audio is blocked.
 */
export function MusicControl({ enabled }: { enabled: boolean }) {
  const [muted, setMuted] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const startedRef = useRef(false)

  const start = useCallback(() => {
    if (startedRef.current) return
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      if (!AC) return
      const ctx: AudioContext = new AC()
      const master = ctx.createGain()
      master.gain.value = 0.0
      master.connect(ctx.destination)

      // Two detuned soft sine pads = calm ambient chord.
      const freqs = [220, 277.18, 329.63]
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator()
        osc.type = "sine"
        osc.frequency.value = f
        const g = ctx.createGain()
        g.gain.value = i === 0 ? 0.5 : 0.25
        // gentle tremolo
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
      })

      // fade in
      master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2.5)
      ctxRef.current = ctx
      gainRef.current = master
      startedRef.current = true
    } catch {
      // Audio unavailable — silently ignore.
    }
  }, [])

  useEffect(() => {
    if (enabled && !muted) {
      start()
      ctxRef.current?.resume?.()
      if (gainRef.current && ctxRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(0.05, ctxRef.current.currentTime + 1.2)
      }
    }
    if (muted && gainRef.current && ctxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0.0, ctxRef.current.currentTime + 0.4)
    }
  }, [enabled, muted, start])

  useEffect(() => {
    return () => {
      ctxRef.current?.close?.()
    }
  }, [])

  if (!enabled) return null

  return (
    <button
      type="button"
      onClick={() => setMuted((m) => !m)}
      aria-pressed={muted}
      aria-label={muted ? "Unmute ambient sound" : "Mute ambient sound"}
      className="glass fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full text-primary shadow-md shadow-primary/10 transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </button>
  )
}
