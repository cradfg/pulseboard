import { Request, Response, NextFunction } from 'express'
import redis from '../redis'

export const rateLimiter = (maxRequests: number, windowSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown'
    const key = `ratelimit:${ip}:${req.path}`

    const current = await redis.incr(key)

    if (current === 1) {
      await redis.expire(key, windowSeconds)
    }

    if (current > maxRequests) {
      res.status(429).json({ error: 'Too many requests, slow down' })
      return
    }

    next()
  }
}