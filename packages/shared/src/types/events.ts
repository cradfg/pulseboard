export type KafkaEventType =
  | 'github.push'
  | 'github.pull_request'
  | 'github.star'

export interface KafkaEvent {
  eventType: KafkaEventType
  userId: string
  repoId: string
  payload: Record<string, unknown>
  receivedAt: string
}