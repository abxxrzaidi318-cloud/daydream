"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useMemo } from "react"

export type Phase = "landing" | "morning" | "afternoon" | "evening" | "dreaming" | "result"

/**
 * DaySky — the signature living environment.
 * A single mounted component that smoothly interpolates the sun's arc, the moon,
 * the sky gradient, cloud tint, and star brightness as the journey moves from
 * sunrise → midday → sunset → dreamy night. Clouds drift continuously across
 * phase changes because the component never unmounts.
 */

// Base sky gradient per phase. Kept light in the reading area for contrast;
// night mood at the result comes from the deep-purple corner glows + stars.
const SKY: Record<Phase, string> = {
  landing: "radial-gradient(125% 120% at 30% 15%, #e8f0ff 0%, #efe6ff 50%, #ffe7f1 100%)",
  morning: "linear-gradient(180deg, #cfe4ff 0%, #e6dbff 34%, #ffe3cf 72%, #fff4e8 100%)",
  afternoon: "linear-gradient(180deg, #bfe1ff 0%, #dbeeff 44%, #ffe7f1 100%)",
  evening: "linear-gradient(180deg, #b6a3df 0%, #e7aec6 38%, #ffc39c 70%, #ffe7d0 100%)",
  dreaming: "linear-gradient(180deg, #8574bf 0%, #b49ede 32%, #e6c9ea 68%, #ffe7f1 100%)",
  result: "linear-gradient(180deg, #cdbcf0 0%, #dccbf1 34%, #f1d9ee 68%, #fff4f9 100%)",
}

// Sun position (as % of viewport), size, opacity and colour per phase.
const SUN: Record<Phase, { left: string; top: string; scale: number; opacity: number; core: string; glow: string }> = {
  landing: { left: "50%", top: "84%", scale: 0.9, opacity: 0.5, core: "#ffe3b4", glow: "#ffd39a" },
  morning: { left: "20%", top: "62%", scale: 1.0, opacity: 1, core: "#ffdca6", glow: "#ffcb85" },
  afternoon: { left: "50%", top: "15%", scale: 1.18, opacity: 1, core: "#fff4d2", glow: "#ffe7ac" },
  evening: { left: "80%", top: "66%", scale: 1.06, opacity: 0.95, core: "#ff9f6c", glow: "#ff7b52" },
  dreaming: { left: "88%", top: "106%", scale: 0.9, opacity: 0.15, core: "#ff8a5c", glow: "#ff6a45" },
  result: { left: "88%", top: "118%", scale: 0.8, opacity: 0, core: "#ff8a5c", glow: "#ff6a45" },
}

const MOON_OPACITY: Record<Phase, number> = {
  landing: 0, morning: 0, afternoon: 0, evening: 0.28, dreaming: 0.7, result: 1,
}
const STAR_OPACITY: Record<Phase, number> = {
  landing: 0.12, morning: 0.04, afternoon: 0.03, evening: 0.5, dreaming: 0.8, result: 1,
}
// Deep-purple glow bleeding from the top corners (night mood) — kept off the
// horizontal centre so headings stay readable.
const NIGHT_GLOW: Record<Phase, number> = {
  landing: 0, morning: 0, afternoon: 0, evening: 0.25, dreaming: 0.5, result: 0.6,
}
// Warm/cool cloud tint.
const CLOUD_TINT: Record<Phase, string> = {
  landing: "#ffffff", morning: "#fff3ec", afternoon: "#ffffff", evening: "#ffd9c8", dreaming: "#e9dcf5", result: "#ede4fa",
}

type CloudDef = { top: string; size: number; duration: number; delay: number; opacity: number }
type StarDef = { top: string; left: string; size: number; duration: number; delay: number }

const EASE = [0.4, 0, 0.2, 1] as const

export function DaySky({ phase }: { phase: Phase }) {
  const reduced = useReducedMotion()

  const clouds = useMemo<CloudDef[]>(
    () => [
      { top: "10%", size: 160, duration: 74, delay: 0, opacity: 0.8 },
      { top: "24%", size: 105, duration: 96, delay: 14, opacity: 0.55 },
      { top: "44%", size: 200, duration: 88, delay: 6, opacity: 0.5 },
      { top: "63%", size: 125, duration: 112, delay: 22, opacity: 0.45 },
      { top: "80%", size: 95, duration: 80, delay: 32, opacity: 0.5 },
    ],
    [],
  )

  const stars = useMemo<StarDef[]>(() => {
    const seeds = [
      [6, 14], [14, 70], [20, 40], [10, 88], [26, 22], [30, 58], [34, 82],
      [42, 10], [46, 46], [52, 74], [58, 30], [64, 62], [70, 16], [76, 86],
      [82, 42], [88, 68], [90, 24], [18, 55], [38, 34], [50, 90],
    ]
    return seeds.map(([top, left], i) => ({
      top: `${top}%`,
      left: `${left}%`,
      size: 2 + (i % 4),
      duration: 3 + (i % 5),
      delay: (i % 6) * 0.5,
    }))
  }, [])

  const sun = SUN[phase]

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Sky gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: SKY[phase] }}
        transition={{ duration: 1.6, ease: EASE }}
        style={{ background: SKY[phase] }}
      />

      {/* Deep-purple night glow from the top corners */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: NIGHT_GLOW[phase] }}
        transition={{ duration: 1.6, ease: EASE }}
        style={{
          background:
            "radial-gradient(60% 55% at 0% 0%, rgba(58,44,110,0.9) 0%, transparent 70%), radial-gradient(60% 55% at 100% 0%, rgba(72,52,120,0.9) 0%, transparent 70%)",
        }}
      />

      {/* Sun */}
      <motion.div
        className="absolute"
        style={{ width: 150, height: 150, marginLeft: -75, marginTop: -75 }}
        animate={{ left: sun.left, top: sun.top, scale: sun.scale, opacity: sun.opacity }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        {/* rotating rays */}
        {!reduced && (
          <div
            className="absolute inset-[-40%] animate-spin-slow"
            style={{
              background:
                "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.5) 0deg 3deg, transparent 3deg 15deg)",
              WebkitMaskImage: "radial-gradient(closest-side, black 18%, transparent 68%)",
              maskImage: "radial-gradient(closest-side, black 18%, transparent 68%)",
            }}
          />
        )}
        {/* soft aura */}
        <div
          className={reduced ? "absolute inset-0 rounded-full blur-2xl" : "absolute inset-0 rounded-full blur-2xl animate-pulse-soft"}
          style={{ background: `radial-gradient(circle, ${sun.glow} 0%, transparent 70%)`, transform: "scale(1.7)" }}
        />
        {/* core */}
        <div
          className="absolute inset-[22%] rounded-full"
          style={{
            background: `radial-gradient(circle at 40% 35%, #ffffff 0%, ${sun.core} 45%, ${sun.glow} 100%)`,
            boxShadow: `0 0 60px 12px ${sun.glow}aa`,
          }}
        />
      </motion.div>

      {/* Moon (appears as day ends) */}
      <motion.div
        className="absolute right-[14%] top-[14%]"
        animate={{ opacity: MOON_OPACITY[phase] }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <div
          className={reduced ? "relative h-24 w-24 rounded-full" : "relative h-24 w-24 rounded-full animate-pulse-soft"}
          style={{
            background: "radial-gradient(circle at 38% 34%, #fffdf7 0%, #efe8ff 55%, #d9ceff 100%)",
            boxShadow: "0 0 50px 14px rgba(233,224,255,0.7)",
          }}
        >
          <div className="absolute left-[26%] top-[30%] h-3 w-3 rounded-full bg-[#dcd2f5]/70" />
          <div className="absolute left-[54%] top-[52%] h-4 w-4 rounded-full bg-[#dcd2f5]/60" />
          <div className="absolute left-[40%] top-[64%] h-2.5 w-2.5 rounded-full bg-[#dcd2f5]/60" />
        </div>
      </motion.div>

      {/* Drifting clouds */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: phase === "afternoon" ? 0.95 : phase === "result" || phase === "dreaming" ? 0.7 : 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        {clouds.map((c, i) => (
          <div
            key={i}
            className={reduced ? "absolute" : "absolute animate-drift"}
            style={{
              top: c.top,
              left: 0,
              animationDuration: `${phase === "afternoon" ? c.duration * 0.7 : c.duration}s`,
              animationDelay: `-${c.delay}s`,
              opacity: c.opacity,
            }}
          >
            <div className="relative" style={{ width: c.size, height: c.size * 0.4 }}>
              <Cloud tint={CLOUD_TINT[phase]} style={{ width: c.size * 0.6, height: c.size * 0.6, left: 0, bottom: 0 }} />
              <Cloud tint={CLOUD_TINT[phase]} style={{ width: c.size * 0.72, height: c.size * 0.72, left: c.size * 0.28, bottom: 4 }} />
              <Cloud tint={CLOUD_TINT[phase]} style={{ width: c.size * 0.55, height: c.size * 0.55, left: c.size * 0.56, bottom: 0 }} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Twinkling stars */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: STAR_OPACITY[phase] }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        {stars.map((s, i) => (
          <div
            key={i}
            className={reduced ? "absolute rounded-full bg-white" : "absolute rounded-full bg-white animate-twinkle"}
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              boxShadow: "0 0 6px 1px rgba(255,255,255,0.85)",
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

function Cloud({ tint, style }: { tint: string; style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full blur-[3px] transition-colors duration-1000"
      style={{ ...style, backgroundColor: tint }}
    />
  )
}
