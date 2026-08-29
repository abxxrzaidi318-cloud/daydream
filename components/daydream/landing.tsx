"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Sparkles } from "lucide-react"

export function Landing({ onBegin }: { onBegin: () => void }) {
  const reduced = useReducedMotion()

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className={reduced ? "" : "animate-float-soft"}
        style={{ animationDuration: "6s" }}
      >
        <Sparkles className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.8 }}
        className="mt-5 font-display text-6xl font-bold tracking-[0.14em] text-foreground sm:text-7xl md:text-8xl"
      >
        DAYDREAM
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-4 font-display text-xl text-foreground/80 sm:text-2xl text-balance"
      >
        Design your perfect day.
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.62, duration: 0.8 }}
        className="mt-2 text-base text-muted-foreground sm:text-lg text-pretty"
      >
        A little journey made just for you.
      </motion.p>

      <motion.button
        type="button"
        onClick={onBegin}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="mt-10 rounded-full bg-primary px-10 py-4 font-display text-lg font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-shadow hover:shadow-primary/50"
      >
        ✨ Begin Dreaming
      </motion.button>
    </motion.section>
  )
}
