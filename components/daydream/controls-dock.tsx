"use client"

import { motion } from "framer-motion"
import { MousePointer2, Sparkles, Volume2, VolumeX } from "lucide-react"
import { useEffect, useState } from "react"
import { useDream } from "./dream-provider"

/**
 * A small floating cluster of cute, glassy toggles that belong to the DAYDREAM
 * world — one for sound (music + effects), one for the custom "cursor magic".
 * The cursor toggle only shows on fine-pointer devices.
 */
export function ControlsDock() {
  const { soundOn, cursorOn, toggleSound, toggleCursor } = useDream()
  const [finePointer, setFinePointer] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(pointer: fine)")
    const apply = () => setFinePointer(mq.matches)
    apply()
    mq.addEventListener?.("change", apply)
    return () => mq.removeEventListener?.("change", apply)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
    >
      {finePointer && (
        <DockButton
          active={cursorOn}
          onClick={toggleCursor}
          icon={cursorOn ? <Sparkles className="h-4 w-4" /> : <MousePointer2 className="h-4 w-4" />}
          label="Cursor magic"
          state={cursorOn ? "On" : "Off"}
          ariaLabel={cursorOn ? "Turn cursor magic off" : "Turn cursor magic on"}
        />
      )}
      <DockButton
        active={soundOn}
        onClick={toggleSound}
        icon={soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        label="Dream sound"
        state={soundOn ? "On" : "Off"}
        ariaLabel={soundOn ? "Mute sound" : "Unmute sound"}
      />
    </motion.div>
  )
}

function DockButton({
  active,
  onClick,
  icon,
  label,
  state,
  ariaLabel,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  state: string
  ariaLabel: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      className={`glass group flex items-center gap-2 rounded-full py-2 pl-3 pr-3.5 text-sm shadow-md shadow-primary/10 transition-colors ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
          active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </span>
      <span className="hidden font-display font-semibold sm:inline">{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
          active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {state}
      </span>
    </motion.button>
  )
}
