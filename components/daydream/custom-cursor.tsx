"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDream } from "./dream-provider"

type Burst = { id: number; x: number; y: number }

const INTERACTIVE = 'a, button, [role="radio"], input, select, textarea, [data-cursor="hover"]'

/**
 * A tiny glowing star that trails the pointer with a soft halo, grows over
 * interactive elements, and sprinkles a sparkle burst on click. Desktop /
 * fine-pointer only, never blocks clicks (pointer-events: none), and driven by
 * requestAnimationFrame for smooth, cheap motion. Toggle lives in the dock.
 */
export function CustomCursor() {
  const { cursorOn, play } = useDream()
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [down, setDown] = useState(false)
  const [bursts, setBursts] = useState<Burst[]>([])

  const starRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: -100, y: -100 })
  const halo = useRef({ x: -100, y: -100 })
  const raf = useRef<number>(0)
  const burstId = useRef(0)

  // Only enable on devices with a fine pointer (mouse).
  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(pointer: fine)")
    const apply = () => setEnabled(mq.matches)
    apply()
    mq.addEventListener?.("change", apply)
    return () => mq.removeEventListener?.("change", apply)
  }, [])

  const active = enabled && cursorOn

  // Hide the native cursor only while the custom one is active.
  useEffect(() => {
    const cls = "dd-cursor-active"
    document.documentElement.classList.toggle(cls, active)
    return () => document.documentElement.classList.remove(cls)
  }, [active])

  const spawnBurst = useCallback((x: number, y: number) => {
    const id = burstId.current++
    setBursts((b) => [...b, { id, x, y }])
    setTimeout(() => setBursts((b) => b.filter((p) => p.id !== id)), 650)
  }, [])

  useEffect(() => {
    if (!active) return

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
      if (starRef.current) {
        // inner star follows tightly
        starRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      }
    }
    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(INTERACTIVE)
      setHovering(!!el)
    }
    const onDown = (e: MouseEvent) => {
      setDown(true)
      if (!reduced) spawnBurst(e.clientX, e.clientY)
    }
    const onUp = () => setDown(false)

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mouseover", onOver, { passive: true })
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)

    // halo lerps toward the pointer for a fluid trailing feel
    const tick = () => {
      halo.current.x += (target.current.x - halo.current.x) * 0.18
      halo.current.y += (target.current.y - halo.current.y) * 0.18
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${halo.current.x}px, ${halo.current.y}px, 0) translate(-50%, -50%)`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseover", onOver)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      cancelAnimationFrame(raf.current)
    }
  }, [active, reduced, spawnBurst])

  if (!active) return null

  return (
    <>
      {/* soft trailing halo */}
      <div
        ref={haloRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] h-8 w-8 rounded-full transition-[width,height,opacity] duration-200"
        style={{
          background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 45%, transparent) 0%, transparent 70%)",
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
          opacity: hovering ? 0.9 : 0.6,
        }}
      />
      {/* glowing star core */}
      <div
        ref={starRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[61] flex items-center justify-center transition-[transform] duration-75"
      >
        <motion.span
          animate={{ scale: down ? 0.7 : hovering ? 1.35 : 1, rotate: hovering ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="text-[15px] leading-none text-primary"
          style={{ filter: "drop-shadow(0 0 6px color-mix(in oklch, var(--primary) 70%, transparent))" }}
        >
          ✦
        </motion.span>
      </div>

      {/* click sparkle bursts */}
      <AnimatePresence>
        {bursts.map((b) => (
          <BurstParticles key={b.id} x={b.x} y={b.y} />
        ))}
      </AnimatePresence>
    </>
  )
}

function BurstParticles({ x, y }: { x: number; y: number }) {
  const particles = useRef(
    Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2
      return { dx: Math.cos(angle) * 22, dy: Math.sin(angle) * 22 }
    }),
  ).current

  return (
    <div className="pointer-events-none fixed z-[62]" style={{ left: x, top: y }} aria-hidden="true">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-primary"
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ boxShadow: "0 0 6px 1px color-mix(in oklch, var(--primary) 60%, transparent)" }}
        />
      ))}
    </div>
  )
}
