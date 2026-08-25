export type ContentFormat = "short" | "long"

export type TopicCandidate = {
  id: string
  title: string
  angle: string
  summary: string
  trendScore: number
  curiosityScore: number
  visualScore: number
  retentionScore: number
  sourceQualityScore: number
  factualConfidence: number
  sources: string[]
}

export type ResearchRequest = { format: ContentFormat; niche: "history" }
export type ResearchResponse = { format: ContentFormat; candidates: TopicCandidate[]; generatedAt: string }
