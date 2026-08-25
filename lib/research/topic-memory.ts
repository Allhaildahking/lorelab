import type { TopicCandidate } from "./types"

export type UsedTopic = Pick<TopicCandidate, "id" | "title" | "angle" | "summary" | "sources"> & { usedAt: string }

const KEY = "lorelab.used-topics"

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()
}

function tokens(value: string) { return new Set(normalize(value).split(" ").filter(word => word.length > 3)) }

export function getUsedTopics(): UsedTopic[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as UsedTopic[] } catch { return [] }
}

export function rememberTopic(topic: TopicCandidate) {
  if (typeof window === "undefined") return
  const used = getUsedTopics().filter(item => item.id !== topic.id)
  const next: UsedTopic[] = [{ id: topic.id, title: topic.title, angle: topic.angle, summary: topic.summary, sources: topic.sources, usedAt: new Date().toISOString() }, ...used]
  localStorage.setItem(KEY, JSON.stringify(next.slice(0, 500)))
}

export function isDuplicate(candidate: TopicCandidate, used: UsedTopic[]) {
  const candidateTitle = normalize(candidate.title)
  const candidateTokens = tokens(`${candidate.title} ${candidate.summary} ${candidate.angle}`)
  return used.some(item => {
    const title = normalize(item.title)
    if (title === candidateTitle) return true
    const previousTokens = tokens(`${item.title} ${item.summary} ${item.angle}`)
    const intersection = [...candidateTokens].filter(token => previousTokens.has(token)).length
    const union = new Set([...candidateTokens, ...previousTokens]).size
    return union > 0 && intersection / union >= 0.62
  })
}

export function filterUsedTopics(topics: TopicCandidate[], used: UsedTopic[]) {
  return topics.filter(topic => !isDuplicate(topic, used))
}
