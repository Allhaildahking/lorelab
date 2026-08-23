import type { ContentFormat, TopicCandidate } from "./types"

const seedTopics: TopicCandidate[] = [
  {
    id: "roman-guards",
    title: "The Roman Emperor His Own Guards Turned Against",
    angle: "A powerful ruler discovers that the people protecting him are the people who want him dead.",
    summary: "A betrayal-driven Roman history story built around power, paranoia, and a shocking reversal.",
    trendScore: 78,
    curiosityScore: 94,
    visualScore: 91,
    sources: [],
  },
  {
    id: "black-death",
    title: "The Strange Things People Did During the Black Death",
    angle: "Fear pushed ordinary people into choices that sound unbelievable today.",
    summary: "A human-behavior angle on one of history's most devastating pandemics.",
    trendScore: 71,
    curiosityScore: 90,
    visualScore: 88,
    sources: [],
  },
  {
    id: "samurai-betrayal",
    title: "The Samurai Betrayal That Changed a Dynasty",
    angle: "One decision turned loyalty into a political weapon.",
    summary: "A compact story about loyalty, betrayal, and the consequences of choosing the wrong side.",
    trendScore: 69,
    curiosityScore: 87,
    visualScore: 93,
    sources: [],
  },
]

export function discoverTopics(format: ContentFormat): TopicCandidate[] {
  // Temporary deterministic seeds. Live web research replaces these in the research integration step.
  return [...seedTopics]
    .sort((a, b) => {
      const scoreA = a.trendScore * 0.4 + a.curiosityScore * 0.4 + a.visualScore * 0.2
      const scoreB = b.trendScore * 0.4 + b.curiosityScore * 0.4 + b.visualScore * 0.2
      return scoreB - scoreA
    })
    .map((topic) => ({
      ...topic,
      angle: `${format === "short" ? "Short-form" : "Long-form"}: ${topic.angle}`,
    }))
}
