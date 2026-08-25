import type { TopicCandidate } from "./types"

export function retentionScore(topic: TopicCandidate): number {
  const hook = topic.curiosityScore
  const stakes = Math.round((topic.trendScore + topic.curiosityScore) / 2)
  const payoff = topic.visualScore
  return Math.round(hook * 0.45 + stakes * 0.35 + payoff * 0.2)
}

export function scoreTopic(topic: TopicCandidate): number {
  return Math.round(topic.trendScore * 0.35 + topic.curiosityScore * 0.3 + topic.visualScore * 0.15 + topic.retentionScore * 0.2)
}

export function rankTopics(topics: TopicCandidate[]): TopicCandidate[] {
  return [...topics].map(topic => ({ ...topic, retentionScore: retentionScore(topic) })).sort((a, b) => scoreTopic(b) - scoreTopic(a))
}
