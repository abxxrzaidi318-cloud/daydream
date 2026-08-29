"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { EMPTY_SELECTIONS, STAGES, type Selections } from "@/lib/daydream-data"
import { Atmosphere, type Phase } from "./atmosphere"
import { Dreaming } from "./dreaming"
import { Landing } from "./landing"
import { MusicControl } from "./music-control"
import { ResultScreen } from "./result-screen"
import { StageScreen } from "./stage-screen"

type Step = "landing" | 0 | 1 | 2 | "dreaming" | "result"

export function DaydreamApp() {
  const [step, setStep] = useState<Step>("landing")
  const [selections, setSelections] = useState<Selections>(EMPTY_SELECTIONS)
  const [audioEnabled, setAudioEnabled] = useState(false)

  // Map the current step to a background phase.
  const phase: Phase =
    step === "landing"
      ? "landing"
      : step === "dreaming"
        ? "dreaming"
        : step === "result"
          ? "result"
          : (STAGES[step].id as Phase)

  // Run the ~2s "Dreaming…" transition before showing the result.
  useEffect(() => {
    if (step !== "dreaming") return
    const t = setTimeout(() => setStep("result"), 2000)
    return () => clearTimeout(t)
  }, [step])

  const begin = () => {
    setAudioEnabled(true) // audio only starts after this user gesture
    setStep(0)
  }

  const select = (id: string) => {
    if (typeof step !== "number") return
    setSelections((prev) => ({ ...prev, [STAGES[step].id]: id }))
  }

  const advance = () => {
    if (typeof step !== "number") return
    if (step < 2) setStep((step + 1) as Step)
    else setStep("dreaming")
  }

  const remix = () => {
    setSelections(EMPTY_SELECTIONS)
    setStep(0)
  }

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden">
      <Atmosphere phase={phase} luminous={step === "result"} />
      <MusicControl enabled={audioEnabled} />

      <AnimatePresence mode="wait">
        {step === "landing" && <Landing key="landing" onBegin={begin} />}

        {typeof step === "number" && (
          <motion.div
            key={`stage-${step}`}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <StageScreen
              stage={STAGES[step]}
              selected={selections[STAGES[step].id]}
              onSelect={select}
              onContinue={advance}
            />
          </motion.div>
        )}

        {step === "dreaming" && <Dreaming key="dreaming" />}

        {step === "result" && (
          <ResultScreen key="result" selections={selections} onRemix={remix} />
        )}
      </AnimatePresence>
    </main>
  )
}
