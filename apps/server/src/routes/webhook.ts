import { Router, Request, Response } from 'express'
import { validateWebhookSignature } from '../middleware/ValidateWebhook'
import { GitHubPushPayload } from '@pulseboard/shared'

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

    // Always return 200 immediately — heavy processing goes to Kafka later
    res.status(200).json({ received: true })
  }
)

const handlePushEvent = async (payload: GitHubPushPayload) => {
  console.log(`Push event received for repo: ${payload.repository.full_name}`)
  console.log(`Commits: ${payload.commits.length}`)
  // Kafka producer will go here in the next step
}

export default router