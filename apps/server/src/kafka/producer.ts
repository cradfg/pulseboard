import { Kafka, Producer } from 'kafkajs'
import { KafkaEvent } from '@pulseboard/shared'

const kafka = new Kafka({
  clientId: 'pulseboard-producer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
})

let producer: Producer

export const connectProducer = async () => {
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