"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import type { Choice } from "@/lib/daydream-data"

export function ChoiceCard({
  choice,
  selected,
  onSelect,
}: {
  choice: Choice
  selected: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`glass group relative flex w-full flex-col items-center gap-3 rounded-3xl border p-6 text-center shadow-lg shadow-primary/5 transition-colors sm:p-7 ${
        selected
          ? "border-primary/70 ring-2 ring-primary/40"
          : "border-white/60 hover:border-primary/30"
      }`}
    >
      {/* Selected check badge */}
      <motion.span
        aria-hidden="true"
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
        initial={false}
        animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </motion.span>

      <motion.span
        className="text-5xl leading-none sm:text-6xl"
        animate={selected ? { scale: [1, 1.25, 1], rotate: [0, -6, 0] } : { scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {choice.emoji}
      </motion.span>

      <span className="font-display text-lg font-bold text-foreground sm:text-xl text-balance">
        {choice.title}
      </span>
      <span className="text-sm leading-relaxed text-muted-foreground text-pretty">
        {choice.description}
      </span>
    </motion.button>
  )
}
