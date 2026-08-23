import type { TopicCandidate } from "./types"

export function scoreTopic(topic: TopicCandidate): number {
  return Math.round(
    topic.trendScore * 0.4 + topic.curiosityScore * 0.4 + topic.visualScore * 0.2,
  )
}

export function rankTopics(topics: TopicCandidate[]): TopicCandidate[] {
  return [...topics].sort((a, b) => scoreTopic(b) - scoreTopic(a))
}
