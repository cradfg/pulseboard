import { Kafka } from 'kafkajs'
import { KafkaEvent } from '@pulseboard/shared'
import { query } from '../../db'
import { setUserPresence } from '../../redis/presence'
import { updateLeaderboard } from '../../redis/leaderboard'

const kafka = new Kafka({
  clientId: 'pulseboard-db-consumer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
})

export const startDbConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'db-consumer-group' })
  await consumer.connect()
  await consumer.subscribe({ topic: 'raw_github_events', fromBeginning: false })

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return

      const event: KafkaEvent = JSON.parse(message.value.toString())
      console.log(`DB Consumer processing: ${event.eventType}`)

      // Look up real UUID from github username
      const userResult = await query(
        `SELECT id FROM users WHERE username = $1`,
        [event.userId]
      )

      if (!userResult.rows[0]) {
        console.warn(`User not found for username: ${event.userId}, skipping event`)
        return
      }

      const userUUID = userResult.rows[0].id

      await query(
        `INSERT INTO events (user_id, repo_id, event_type, payload, received_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          userUUID,
          null,
          event.eventType,
          JSON.stringify(event.payload),
          event.receivedAt
        ]
      )

      console.log(`Event persisted to DB: ${event.eventType}`)
      await setUserPresence(event.userId)
      await updateLeaderboard(event.repoId, event.userId)
      console.log(`Presence and leaderboard updated for: ${event.userId}`)
    }
  })
}