import { Router, Request, Response } from 'express'
import { validateWebhookSignature } from '../middleware/ValidateWebhook'
import { GitHubPushPayload, KafkaEvent } from '@pulseboard/shared'
import { publishEvent } from '../kafka/producer'

const router = Router()

router.post(
  '/github',
  validateWebhookSignature,
  async (req: Request, res: Response) => {
    const event = req.headers['x-github-event'] as string
    const payload = req.body

    console.log(`Received GitHub event: ${event}`)

    switch (event) {
      case 'push':
        await handlePushEvent(payload as GitHubPushPayload)
        break
      case 'ping':
        console.log('Webhook ping received — connection established')
        break
      default:
        console.log(`Unhandled event type: ${event}`)
    }

    res.status(200).json({ received: true })
  }
)

const handlePushEvent = async (payload: GitHubPushPayload) => {
  const kafkaEvent: KafkaEvent = {
    eventType: 'github.push',
    userId: payload.pusher.name,
    repoId: payload.repository.id.toString(),
    payload: payload as unknown as Record<string, unknown>,
    receivedAt: new Date().toISOString()
  }
  await publishEvent(kafkaEvent)
}

export default router