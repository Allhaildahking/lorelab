import type { TopicCandidate } from "./types"

export function selectBestTopic(topics: TopicCandidate[]): TopicCandidate | null {
  if (!topics.length) return null

  return [...topics].sort((a, b) => {
    const scoreA = a.trendScore * 0.45 + a.curiosityScore * 0.35 + a.visualScore * 0.2
    const scoreB = b.trendScore * 0.45 + b.curiosityScore * 0.35 + b.visualScore * 0.2
    return scoreB - scoreA
  })[0]
}
