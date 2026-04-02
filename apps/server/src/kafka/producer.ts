import { Kafka, Producer } from 'kafkajs'
import { KafkaEvent } from '@pulseboard/shared'

const kafka = new Kafka({
  clientId: 'pulseboard-producer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
})

let producer: Producer

export const connectProducer = async () => {
  // Create topic first
  const admin = kafka.admin()
  await admin.connect()
  await admin.createTopics({
    topics: [
      {
        topic: 'raw_github_events',
        numPartitions: 1,
        replicationFactor: 1
      }
    ],
    waitForLeaders: true
  })
  await admin.disconnect()

  producer = kafka.producer()
  await producer.connect()
  console.log('Kafka producer connected')
}

export const publishEvent = async (event: KafkaEvent) => {
  await producer.send({
    topic: 'raw_github_events',
    messages: [
      {
        key: event.userId,
        value: JSON.stringify(event)
      }
    ]
  })
  console.log(`Event published to Kafka: ${event.eventType}`)
}

export default kafka