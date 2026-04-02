import { Kafka } from 'kafkajs'
import { KafkaEvent } from '@pulseboard/shared'
import { query } from '../../db'

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

      await query(
        `INSERT INTO events (user_id, repo_id, event_type, payload, received_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [
          event.userId,
          event.repoId,
          event.eventType,
          JSON.stringify(event.payload),
          event.receivedAt
        ]
      )

      console.log(`Event persisted to DB: ${event.eventType}`)
    }
  })
}