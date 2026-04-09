import { Router, Request, Response } from 'express'
import { getLeaderboard } from '../redis/leaderboard'
import { getCache, setCache } from '../redis/cache'
import { query } from '../db'

const router = Router()

router.get('/:repoId', async (req: Request, res: Response) => {
  const repoId = req.params.repoId as string
  const cacheKey = `leaderboard:api:${repoId}`

  try {
    const cached = await getCache(cacheKey)
    if (cached) {
      res.json({ leaderboard: cached, source: 'cache' })
      return
    }

    // Get scores from Redis sorted set
    const scores = await getLeaderboard(repoId)

    // Enrich with user details from PostgreSQL
    const enriched = await Promise.all(
      scores.map(async (entry) => {
        const result = await query(
          `SELECT username, avatar_url FROM users WHERE username = $1`,
          [entry.userId]
        )
        return {
          username: result.rows[0]?.username || entry.userId,
          avatarUrl: result.rows[0]?.avatar_url || null,
          score: entry.score
        }
      })
    )

    await setCache(cacheKey, enriched, 60)
    res.json({ leaderboard: enriched, source: 'db' })
  } catch (err) {
    console.error('Leaderboard fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
})

export default router