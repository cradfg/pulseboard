import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

export const validateWebhookSignature = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const signature = req.headers['x-hub-signature-256'] as string

  if (!signature) {
    res.status(401).json({ error: 'Missing webhook signature' })
    return
  }

  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (!secret) {
    res.status(500).json({ error: 'Webhook secret not configured' })
    return
  }

  const hmac = crypto.createHmac('sha256', secret)
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex')

  const signatureBuffer = Buffer.from(signature)
  const digestBuffer = Buffer.from(digest)

  if (signatureBuffer.length !== digestBuffer.length) {
    res.status(401).json({ error: 'Invalid webhook signature' })
    return
  }

  const isValid = crypto.timingSafeEqual(signatureBuffer, digestBuffer)

  if (!isValid) {
    res.status(401).json({ error: 'Invalid webhook signature' })
    return
  }

  next()
}