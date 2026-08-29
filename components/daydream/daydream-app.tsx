"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { EMPTY_SELECTIONS, STAGES, type Selections } from "@/lib/daydream-data"
import { ControlsDock } from "./controls-dock"
import { CustomCursor } from "./custom-cursor"
import { DaySky, type Phase } from "./day-sky"
import { DreamProvider, useDream } from "./dream-provider"
import { Dreaming } from "./dreaming"
import { Landing } from "./landing"
import { AmbientMusic } from "./music-control"
import { ResultScreen } from "./result-screen"
import { StageScreen } from "./stage-screen"

type Step = "landing" | 0 | 1 | 2 | "dreaming" | "result"

function DaydreamInner() {
  const { soundOn, play, unlock } = useDream()
  const [step, setStep] = useState<Step>("landing")
  const [selections, setSelections] = useState<Selections>(EMPTY_SELECTIONS)
  const [started, setStarted] = useState(false)

  const phase: Phase =
    step === "landing"
      ? "landing"
      : step === "dreaming"
        ? "dreaming"
        : step === "result"
          ? "result"
          : (STAGES[step].id as Phase)

  // Run the "Dreaming…" transition before revealing the result.
  useEffect(() => {
    if (step !== "dreaming") return
    const t = setTimeout(() => setStep("result"), 2200)
    return () => clearTimeout(t)
  }, [step])

  const begin = () => {
    unlock() // resume audio within this user gesture
    setStarted(true) // ambient music may now begin
    play("whoosh")
    setStep(0)
  }

  const select = (id: string) => {
    if (typeof step !== "number") return
    play("chime")
    setSelections((prev) => ({ ...prev, [STAGES[step].id]: id }))
  }

  const advance = () => {
    if (typeof step !== "number") return
    if (step < 2) {
      play("whoosh")
      setStep((step + 1) as Step)
    } else {
      play("whoosh")
      setStep("dreaming")
    }
  }

  const remix = () => {
    play("whoosh")
    setSelections(EMPTY_SELECTIONS)
    setStep(0)
  }

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden">
      <DaySky phase={phase} />
      <AmbientMusic started={started} muted={!soundOn} phase={phase} />
      <CustomCursor />
      <ControlsDock />

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

export function DaydreamApp() {
  return (
    <DreamProvider>
      <DaydreamInner />
    </DreamProvider>
  )
}
