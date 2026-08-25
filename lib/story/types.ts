import type { ContentFormat, TopicCandidate } from "@/lib/research/types"

export type StoryRequest = {
  format: ContentFormat
  topic: TopicCandidate
}

export type Scene = {
  number: number
  durationSeconds: number
  narration: string
  imagePrompt: string
  videoPrompt: string
}

export type StoryOutput = {
  hook: string
  script: string
  scenes: Scene[]
  scenePrompts: string[]
  title: string
  description: string
  hashtags: string[]
}
