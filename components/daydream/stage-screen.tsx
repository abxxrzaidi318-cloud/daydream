"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import type { Stage } from "@/lib/daydream-data"
import { ChoiceCard } from "./choice-card"
import { Progress } from "./progress"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 24 } },
}

export function StageScreen({
  stage,
  selected,
  onSelect,
  onContinue,
}: {
  stage: Stage
  selected: string | null
  onSelect: (id: string) => void
  onContinue: () => void
}) {
  const isLast = stage.index === 2

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-10 sm:py-14"
      aria-labelledby={`stage-${stage.id}-title`}
    >
      <motion.div variants={item} className="mb-10 w-full">
        <Progress active={stage.index} />
      </motion.div>

      <motion.h1
        variants={item}
        id={`stage-${stage.id}-title`}
        className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
      >
        {stage.title}
      </motion.h1>
      <motion.p
        variants={item}
        className="mt-3 max-w-lg text-center text-base text-muted-foreground sm:text-lg text-pretty"
      >
        {stage.question}
      </motion.p>

      <motion.div
        variants={item}
        role="radiogroup"
        aria-label={stage.question}
        className="mt-9 grid w-full gap-4 sm:grid-cols-3"
      >
        {stage.choices.map((choice) => (
          <ChoiceCard
            key={choice.id}
            choice={choice}
            selected={selected === choice.id}
            onSelect={() => onSelect(choice.id)}
          />
        ))}
      </motion.div>

      <motion.div variants={item} className="mt-10">
        <button
          type="button"
          onClick={onContinue}
          disabled={!selected}
          className={`group flex items-center gap-2 rounded-full px-8 py-3.5 font-display text-base font-semibold shadow-lg transition-all duration-300 ${
            selected
              ? "bg-primary text-primary-foreground shadow-primary/25 hover:scale-105 hover:shadow-primary/40 active:scale-95"
              : "cursor-not-allowed bg-muted text-muted-foreground/60 shadow-none"
          }`}
        >
          {isLast && <Sparkles className="h-4 w-4" />}
          {stage.cta}
          {!isLast && (
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </button>
      </motion.div>
    </motion.section>
  )
}
