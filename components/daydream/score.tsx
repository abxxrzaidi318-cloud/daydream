"use client"

import { animate, motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { scoreSubtitle } from "@/lib/daydream-data"

export function Score({ value, delay = 0 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0)
  const reduced = useReducedMotion()
  const circumference = 2 * Math.PI * 52

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      return
    }
    const controls = animate(0, value, {
      duration: 1.6,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [value, delay, reduced])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
      className="glass mx-auto flex w-full max-w-md flex-col items-center rounded-3xl border border-white/60 p-8 shadow-xl shadow-primary/10"
    >
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--muted)" strokeWidth="10" />
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (circumference * value) / 100 }}
            transition={{ duration: 1.6, delay, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-4xl font-bold text-foreground" aria-hidden="true">
            {display}%
          </span>
        </div>
      </div>

      <p className="mt-5 font-display text-sm font-bold uppercase tracking-[0.2em] text-primary">
        Perfect-Day Energy
      </p>
      <p className="mt-2 text-center text-muted-foreground text-pretty">{scoreSubtitle(value)}</p>
      <span className="sr-only">Your perfect-day score is {value} percent.</span>
    </motion.div>
  )
}
