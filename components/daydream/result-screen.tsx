"use client"

import { motion } from "framer-motion"
import { ArrowDown, RotateCcw } from "lucide-react"
import {
  computePersonality,
  computeScore,
  getSelectedChoices,
  personalMessage,
  type Selections,
} from "@/lib/daydream-data"
import { PersonalityBars } from "./personality-bars"
import { Score } from "./score"

export function ResultScreen({
  selections,
  onRemix,
}: {
  selections: Selections
  onRemix: () => void
}) {
  const items = getSelectedChoices(selections)
  const score = computeScore(selections)
  const personality = computePersonality(selections)
  const message = personalMessage(selections)

  // Timeline reveals first, then score, bars, message stack sequentially.
  const timelineDone = 0.3 + items.length * 0.35
  const scoreDelay = timelineDone + 0.2
  const barsDelay = scoreDelay + 0.6
  const messageDelay = barsDelay + 0.6

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mx-auto flex w-full max-w-md flex-col items-center px-5 py-12 sm:py-16"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-10 text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
      >
        ✨ Your Perfect Day ✨
      </motion.h1>

      {/* Vertical timeline — items reveal one-by-one */}
      <ol className="flex w-full flex-col items-center">
        {items.map(({ stage, choice }, i) => (
          <li key={stage.id} className="flex w-full flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.35, duration: 0.55, type: "spring", stiffness: 240, damping: 22 }}
              className="glass w-full rounded-3xl border border-white/60 p-5 shadow-lg shadow-primary/5"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl" aria-hidden="true">
                  {choice?.emoji}
                </span>
                <div>
                  <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    {stage.label}
                  </p>
                  <p className="font-display text-lg font-bold text-foreground">{choice?.title}</p>
                  <p className="text-sm text-muted-foreground text-pretty">{choice?.description}</p>
                </div>
              </div>
            </motion.div>

            {i < items.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 + i * 0.35, duration: 0.4 }}
                className="py-2 text-primary/60"
                aria-hidden="true"
              >
                <ArrowDown className="h-5 w-5" />
              </motion.div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-10 w-full">
        <Score value={score} delay={scoreDelay} />
      </div>

      <div className="mt-6 w-full">
        <PersonalityBars values={personality} delay={barsDelay} />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: messageDelay, duration: 0.7 }}
        className="mt-8 max-w-sm text-center text-base leading-relaxed text-foreground/80 text-pretty"
      >
        {message}
      </motion.p>

      <motion.button
        type="button"
        onClick={onRemix}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: messageDelay + 0.3, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-display font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/40"
      >
        <RotateCcw className="h-4 w-4" />
        Remix My Day
      </motion.button>
    </motion.section>
  )
}
