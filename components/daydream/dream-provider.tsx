"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { playSfx, setSfxMuted, type SfxType, unlockAudio } from "@/lib/daydream-sound"

type DreamCtx = {
  soundOn: boolean
  cursorOn: boolean
  toggleSound: () => void
  toggleCursor: () => void
  /** Play an interaction sound (respects the sound preference). */
  play: (t: SfxType) => void
  /** Resume audio from within a user gesture. */
  unlock: () => void
}

const Ctx = createContext<DreamCtx | null>(null)

export function useDream(): DreamCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error("useDream must be used within <DreamProvider>")
  return c
}

export function DreamProvider({ children }: { children: React.ReactNode }) {
  const [soundOn, setSoundOn] = useState(true)
  const [cursorOn, setCursorOn] = useState(true)
  const soundRef = useRef(true)

  // Restore preferences for the session.
  useEffect(() => {
    try {
      const s = localStorage.getItem("dd-sound")
      if (s !== null) setSoundOn(s === "1")
      const cu = localStorage.getItem("dd-cursor")
      if (cu !== null) setCursorOn(cu === "1")
    } catch {
      /* localStorage unavailable — use defaults */
    }
  }, [])

  // Keep the SFX engine + ref in sync with the sound preference.
  useEffect(() => {
    soundRef.current = soundOn
    setSfxMuted(!soundOn)
  }, [soundOn])

  const play = useCallback((t: SfxType) => {
    if (soundRef.current) playSfx(t)
  }, [])

  const unlock = useCallback(() => unlockAudio(), [])

  const toggleSound = useCallback(() => {
    setSoundOn((v) => {
      const next = !v
      try {
        localStorage.setItem("dd-sound", next ? "1" : "0")
      } catch {}
      if (next) {
        unlockAudio()
        setSfxMuted(false)
        playSfx("click")
      }
      return next
    })
  }, [])

  const toggleCursor = useCallback(() => {
    setCursorOn((v) => {
      const next = !v
      try {
        localStorage.setItem("dd-cursor", next ? "1" : "0")
      } catch {}
      if (soundRef.current) playSfx("click")
      return next
    })
  }, [])

  return (
    <Ctx.Provider value={{ soundOn, cursorOn, toggleSound, toggleCursor, play, unlock }}>
      {children}
    </Ctx.Provider>
  )
}
