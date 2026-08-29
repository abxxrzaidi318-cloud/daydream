// ---------------------------------------------------------------------------
// DAYDREAM data + scoring logic
// All choices live in a structured array so new options can be added easily.
// Each option carries a trait profile (0-100) used for scoring + personality.
// ---------------------------------------------------------------------------

export type TraitKey = "peaceful" | "adventurous" | "creative" | "social"

export type Trait = {
  key: TraitKey
  label: string
  emoji: string
}

export const TRAITS: Trait[] = [
  { key: "peaceful", label: "Peaceful", emoji: "🌿" },
  { key: "adventurous", label: "Adventurous", emoji: "⚡" },
  { key: "creative", label: "Creative", emoji: "🎨" },
  { key: "social", label: "Social", emoji: "❤️" },
]

export type Choice = {
  id: string
  emoji: string
  title: string
  description: string
  // trait contribution for this choice (each 0-100)
  traits: Record<TraitKey, number>
}

export type Stage = {
  id: "morning" | "afternoon" | "evening"
  index: number
  label: string
  title: string
  question: string
  cta: string
  choices: Choice[]
}

export const STAGES: Stage[] = [
  {
    id: "morning",
    index: 0,
    label: "Morning",
    title: "Good Morning ☀️",
    question: "How would you like your perfect day to begin?",
    cta: "Continue",
    choices: [
      {
        id: "sunrise",
        emoji: "🌅",
        title: "Sunrise Walk",
        description: "Start slowly and enjoy the quiet.",
        traits: { peaceful: 95, adventurous: 40, creative: 45, social: 20 },
      },
      {
        id: "pancakes",
        emoji: "🥞",
        title: "Pancake Morning",
        description: "Good food. No rush.",
        traits: { peaceful: 80, adventurous: 25, creative: 40, social: 70 },
      },
      {
        id: "creative",
        emoji: "🎨",
        title: "Creative Morning",
        description: "Make something before the world gets busy.",
        traits: { peaceful: 65, adventurous: 35, creative: 95, social: 25 },
      },
    ],
  },
  {
    id: "afternoon",
    index: 1,
    label: "Afternoon",
    title: "Beautiful Afternoon 🌤️",
    question: "Where does your day take you?",
    cta: "Continue",
    choices: [
      {
        id: "adventure",
        emoji: "🌊",
        title: "Adventure",
        description: "Go somewhere you've never been.",
        traits: { peaceful: 30, adventurous: 95, creative: 55, social: 45 },
      },
      {
        id: "games",
        emoji: "🎮",
        title: "Game Time",
        description: "Lose track of time doing something fun.",
        traits: { peaceful: 45, adventurous: 60, creative: 80, social: 55 },
      },
      {
        id: "friends",
        emoji: "🧑‍🤝‍🧑",
        title: "Friends",
        description: "Spend the day with your favorite people.",
        traits: { peaceful: 40, adventurous: 45, creative: 40, social: 95 },
      },
    ],
  },
  {
    id: "evening",
    index: 2,
    label: "Evening",
    title: "Golden Evening 🌙",
    question: "How do you want your perfect day to end?",
    cta: "Create My Perfect Day",
    choices: [
      {
        id: "stargazing",
        emoji: "🌌",
        title: "Stargazing",
        description: "End the day under the sky.",
        traits: { peaceful: 90, adventurous: 55, creative: 70, social: 30 },
      },
      {
        id: "movie",
        emoji: "🎬",
        title: "Movie Night",
        description: "Something cozy. Something familiar.",
        traits: { peaceful: 85, adventurous: 20, creative: 45, social: 65 },
      },
      {
        id: "music",
        emoji: "🎵",
        title: "Music & Chill",
        description: "Put on your favorite playlist and relax.",
        traits: { peaceful: 80, adventurous: 30, creative: 75, social: 40 },
      },
    ],
  },
]

export type Selections = {
  morning: string | null
  afternoon: string | null
  evening: string | null
}

export const EMPTY_SELECTIONS: Selections = {
  morning: null,
  afternoon: null,
  evening: null,
}

/** Resolve the chosen Choice objects for the current selections. */
export function getSelectedChoices(selections: Selections) {
  return STAGES.map((stage) => {
    const id = selections[stage.id]
    const choice = stage.choices.find((c) => c.id === id) ?? null
    return { stage, choice }
  })
}

/**
 * Personality analysis.
 * Averages each trait across the three chosen options so the profile always
 * reflects the user's actual combination of choices.
 */
export function computePersonality(selections: Selections): Record<TraitKey, number> {
  const chosen = getSelectedChoices(selections)
    .map((s) => s.choice)
    .filter((c): c is Choice => c !== null)

  const totals: Record<TraitKey, number> = { peaceful: 0, adventurous: 0, creative: 0, social: 0 }
  if (chosen.length === 0) return totals

  for (const c of chosen) {
    for (const t of TRAITS) totals[t.key] += c.traits[t.key]
  }
  for (const t of TRAITS) totals[t.key] = Math.round(totals[t.key] / chosen.length)
  return totals
}

/**
 * Perfect-Day score (0-100), fully deterministic from the selections.
 * Base = how strong the day's dominant vibe is (average of the two highest
 * traits) plus a small "harmony" bonus when choices reinforce each other.
 * Different combinations yield different scores; identical combos are stable.
 */
export function computeScore(selections: Selections): number {
  const p = computePersonality(selections)
  const values = TRAITS.map((t) => p[t.key]).sort((a, b) => b - a)

  // dominant vibe: the two strongest traits carry the day
  const dominant = (values[0] + values[1]) / 2

  // harmony: reward a clear, cohesive identity (low spread across top traits)
  const spread = values[0] - values[3]
  const harmony = Math.max(0, 18 - spread * 0.15)

  const raw = dominant * 0.82 + harmony
  // keep it feel-good but never a flat 100
  return Math.max(72, Math.min(98, Math.round(raw)))
}

export function scoreSubtitle(score: number): string {
  if (score >= 92) return "This day is basically made for you. ✨"
  if (score >= 85) return "A wonderfully you kind of day. 🌸"
  return "Soft, lovely, and completely yours. ☁️"
}

/** Personalized message driven by the two highest personality traits. */
export function personalMessage(selections: Selections): string {
  const p = computePersonality(selections)
  const ranked = [...TRAITS].sort((a, b) => p[b.key] - p[a.key])
  const top = ranked[0].key
  const second = ranked[1].key
  const has = (a: TraitKey, b: TraitKey) =>
    (top === a && second === b) || (top === b && second === a)

  if (has("peaceful", "creative"))
    return "Your perfect day feels soft, peaceful, and full of little moments worth remembering. You like having space to breathe and create."
  if (has("adventurous", "social"))
    return "Your perfect day is meant to be shared. You love discovering new places and making memories with people you care about."
  if (top === "social")
    return "For you, the best days are better when they're shared. Your perfect day is filled with laughter, connection, and people who make you happy."
  if (top === "adventurous")
    return "Your perfect day needs a little unpredictability. You love discovering something new and making the ordinary feel like an adventure."
  if (top === "creative")
    return "Your ideal day gives your imagination room to breathe. A little inspiration, a little quiet, and plenty of time to make something yours."
  if (top === "peaceful")
    return "Your perfect day moves at your own gentle pace — calm, unhurried, and full of quiet joy that feels just right."
  return "Your perfect day is a beautiful mix of calm moments, fun experiences, and things that make you feel like yourself."
}
