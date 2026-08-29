"use client"

import { motion } from "framer-motion"
import { STAGES } from "@/lib/daydream-data"

export function Progress({ active }: { active: number }) {
  return (
    <nav aria-label="Journey progress" className="mx-auto w-full max-w-md">
      <ol className="flex items-center justify-center">
        {STAGES.map((stage, i) => {
          const isActive = i === active
          const isDone = i < active
          return (
            <li key={stage.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  className="flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold font-display"
                  animate={{
                    backgroundColor: isActive || isDone ? "var(--primary)" : "rgba(255,255,255,0.55)",
                    color: isActive || isDone ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    borderColor: isActive || isDone ? "var(--primary)" : "var(--border)",
                    scale: isActive ? 1.12 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.div>
                <span
                  className={`text-[11px] font-medium tracking-wide transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground/70"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <div className="relative mx-1 mb-5 h-0.5 w-10 overflow-hidden rounded-full bg-border sm:w-16">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary"
                    initial={false}
                    animate={{ width: i < active ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
