import type { ContentFormat, TopicCandidate } from "./types"
import { rankTopics, retentionScore } from "./scoring"

const seedTopics: TopicCandidate[] = [
  { id: "roman-guards", title: "The Roman Emperor His Own Guards Turned Against", angle: "A powerful ruler discovers that the people protecting him are the people who want him dead.", summary: "A betrayal-driven Roman history story built around power, paranoia, and a shocking reversal.", trendScore: 78, curiosityScore: 94, visualScore: 91, retentionScore: 0, sourceQualityScore: 95, factualConfidence: 95, sources: [] },
  { id: "black-death", title: "The Strange Things People Did During the Black Death", angle: "Fear pushed ordinary people into choices that sound unbelievable today.", summary: "A human-behavior angle on one of history's most devastating pandemics.", trendScore: 71, curiosityScore: 90, visualScore: 88, retentionScore: 0, sourceQualityScore: 95, factualConfidence: 95, sources: [] },
  { id: "samurai-betrayal", title: "The Samurai Betrayal That Changed a Dynasty", angle: "One decision turned loyalty into a political weapon.", summary: "A compact story about loyalty, betrayal, and the consequences of choosing the wrong side.", trendScore: 69, curiosityScore: 87, visualScore: 93, retentionScore: 0, sourceQualityScore: 95, factualConfidence: 95, sources: [] },
]

export function discoverTopics(format: ContentFormat): TopicCandidate[] {
  const scored = seedTopics.map((topic) => ({ ...topic, retentionScore: retentionScore(topic) }))
  return rankTopics(scored).map((topic) => ({ ...topic, angle: `${format === "short" ? "Short-form" : "Long-form"}: ${topic.angle}` }))
}
