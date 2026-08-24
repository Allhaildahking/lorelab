import type { ContentFormat, TopicCandidate } from "@/lib/research/types"

export type StoryRequest = {
  format: ContentFormat
  topic: TopicCandidate
}

export type StoryOutput = {
  hook: string
  script: string
  scenePrompts: string[]
  title: string
  description: string
  hashtags: string[]
}
