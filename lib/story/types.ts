import type { ContentFormat, TopicCandidate } from "@/lib/research/types"

export type StoryRequest = { format: ContentFormat; topic: TopicCandidate }
export type Scene = { number: number; durationSeconds: number; narration: string; imagePrompt: string; videoPrompt: string }
export type PostingRecommendation = { platform: "YouTube Shorts" | "YouTube"; day: string; time: string; timezone: string; urgency: "ASAP" | "Within 24h" | "This week" | "Evergreen"; reason: string }
export type StoryOutput = { hook: string; script: string; scenes: Scene[]; scenePrompts: string[]; title: string; description: string; hashtags: string[]; postingRecommendation: PostingRecommendation }
