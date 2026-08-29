"use client"

import { motion } from "framer-motion"
import { TRAITS, type TraitKey } from "@/lib/daydream-data"
import { useDream } from "./dream-provider"

export function PersonalityBars({
  values,
  delay = 0,
}: {
  values: Record<TraitKey, number>
  delay?: number
}) {
  const { play } = useDream()
  const lastIndex = TRAITS.length - 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="glass mx-auto w-full max-w-md rounded-3xl border border-white/60 p-6 shadow-xl shadow-primary/10 sm:p-7"
    >
      <h3 className="mb-5 text-center font-display text-xl font-bold text-foreground">
        Your Day Personality
      </h3>
      <ul className="flex flex-col gap-4">
        {TRAITS.map((trait, i) => {
          const v = values[trait.key]
          return (
            <li key={trait.key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <span aria-hidden="true">{trait.emoji}</span>
                  {trait.label}
                </span>
                <span className="font-display font-semibold text-primary">{v}%</span>
              </div>
              <div
                className="relative h-3 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={v}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={trait.label}
              >
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${v}%` }}
                  transition={{ delay: delay + 0.2 + i * 0.15, duration: 0.9, ease: "easeOut" }}
                  onAnimationComplete={() => {
                    // a single soft sparkle once the final bar settles
                    if (i === lastIndex) play("sparkle")
                  }}
                />
                {/* sparkle at the tip when this bar finishes */}
                <motion.span
                  className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white"
                  style={{ left: `calc(${v}% - 4px)`, boxShadow: "0 0 8px 2px color-mix(in oklch, var(--primary) 60%, transparent)" }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0] }}
                  transition={{ delay: delay + 0.2 + i * 0.15 + 0.9, duration: 0.7 }}
                  aria-hidden="true"
                />
              </div>
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}
