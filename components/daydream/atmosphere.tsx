"use client"

import { useReducedMotion } from "framer-motion"
import { useMemo } from "react"

export type Phase = "landing" | "morning" | "afternoon" | "evening" | "dreaming" | "result"

// Background gradient tuned per phase — subtly warms then cools into evening.
const GRADIENTS: Record<Phase, string> = {
  landing:
    "radial-gradient(120% 120% at 20% 10%, #dfeaff 0%, #ece2ff 45%, #ffe6f2 100%)",
  morning:
    "radial-gradient(120% 120% at 25% 5%, #eaf3ff 0%, #f3ecff 45%, #fff0e6 100%)",
  afternoon:
    "radial-gradient(120% 120% at 30% 0%, #fff2e0 0%, #ffe9f0 45%, #ece1ff 100%)",
  evening:
    "radial-gradient(120% 120% at 70% 0%, #f0e6ff 0%, #e6ddff 45%, #efe0ff 100%)",
  dreaming:
    "radial-gradient(120% 120% at 50% 30%, #ece2ff 0%, #e5ddff 50%, #ffe6f4 100%)",
  result:
    "radial-gradient(120% 120% at 50% 0%, #f4ecff 0%, #efe4ff 40%, #ffe9f3 100%)",
}

type CloudDef = { top: string; size: number; duration: number; delay: number; opacity: number }
type StarDef = { top: string; left: string; size: number; duration: number; delay: number }

function Cloud({ style }: { style: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className="absolute rounded-full bg-white blur-[2px]"
      style={style}
    />
  )
}

export function Atmosphere({ phase, luminous = false }: { phase: Phase; luminous?: boolean }) {
  const reduced = useReducedMotion()

  const clouds = useMemo<CloudDef[]>(
    () => [
      { top: "12%", size: 150, duration: 70, delay: 0, opacity: 0.75 },
      { top: "26%", size: 100, duration: 95, delay: 12, opacity: 0.55 },
      { top: "48%", size: 190, duration: 85, delay: 6, opacity: 0.5 },
      { top: "68%", size: 120, duration: 110, delay: 20, opacity: 0.45 },
      { top: "82%", size: 90, duration: 78, delay: 30, opacity: 0.5 },
    ],
    [],
  )

  const stars = useMemo<StarDef[]>(() => {
    const seeds = [
      [8, 15], [22, 62], [35, 28], [48, 80], [60, 12], [72, 48], [85, 70],
      [18, 88], [40, 55], [55, 35], [66, 88], [90, 24], [12, 42], [78, 18],
    ]
    return seeds.map(([top, left], i) => ({
      top: `${top}%`,
      left: `${left}%`,
      size: 3 + (i % 4),
      duration: 3 + (i % 5),
      delay: (i % 6) * 0.5,
    }))
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-[background] duration-[1400ms] ease-in-out"
      style={{ background: GRADIENTS[phase] }}
    >
      {/* Soft glowing blobs */}
      <div
        className={`absolute -left-24 top-[-6rem] h-96 w-96 rounded-full bg-powder/60 blur-3xl ${reduced ? "" : "animate-blob"}`}
        style={{ animationDuration: "16s" }}
      />
      <div
        className={`absolute right-[-4rem] top-1/3 h-80 w-80 rounded-full bg-babypink/60 blur-3xl ${reduced ? "" : "animate-blob"}`}
        style={{ animationDuration: "20s", animationDelay: "2s" }}
      />
      <div
        className={`absolute bottom-[-6rem] left-1/3 h-96 w-96 rounded-full bg-lavender/60 blur-3xl ${reduced ? "" : "animate-blob"}`}
        style={{ animationDuration: "24s", animationDelay: "1s" }}
      />

      {/* Luminous wash on the result page */}
      <div
        className="absolute inset-0 bg-white transition-opacity duration-[1600ms] ease-in-out"
        style={{ opacity: luminous ? 0.28 : 0 }}
      />

      {/* Drifting clouds */}
      {clouds.map((c, i) => (
        <div
          key={i}
          className={reduced ? "absolute" : "absolute animate-drift"}
          style={{
            top: c.top,
            left: 0,
            animationDuration: `${c.duration}s`,
            animationDelay: `-${c.delay}s`,
            opacity: c.opacity,
          }}
        >
          <div className="relative" style={{ width: c.size, height: c.size * 0.4 }}>
            <Cloud style={{ width: c.size * 0.6, height: c.size * 0.6, left: 0, bottom: 0, opacity: 0.9 }} />
            <Cloud style={{ width: c.size * 0.7, height: c.size * 0.7, left: c.size * 0.28, bottom: 4, opacity: 0.95 }} />
            <Cloud style={{ width: c.size * 0.55, height: c.size * 0.55, left: c.size * 0.55, bottom: 0, opacity: 0.9 }} />
          </div>
        </div>
      ))}

      {/* Twinkling stars / sparkles */}
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
            boxShadow: "0 0 6px 1px rgba(255,255,255,0.8)",
          }}
        />
      ))}
    </div>
  )
}
