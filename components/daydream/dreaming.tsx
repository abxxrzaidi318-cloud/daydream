"use client"

import { motion } from "framer-motion"

export function Dreaming() {
  return (
    <motion.section
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(12px)" }}
      transition={{ duration: 0.6 }}
      className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
      aria-live="polite"
      role="status"
    >
      <motion.div
        className="text-3xl tracking-[0.4em] text-primary"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-hidden="true"
      >
        ✦ ✧ ✦
      </motion.div>

      <motion.div
        className="mt-6 text-6xl"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        ☁️
      </motion.div>

      <h2 className="mt-8 font-display text-3xl font-bold text-foreground">Dreaming…</h2>
      <p className="mt-2 text-muted-foreground">Putting your perfect day together.</p>

      <div className="mt-6 flex items-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-primary"
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.section>
  )
}
