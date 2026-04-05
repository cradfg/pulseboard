import { Router, Request, Response } from 'express'
import { getUserStats, getRepoStats } from '../db/queries/stats'
import { getCache, setCache } from '../redis/cache'
import { query } from '../db'

const router = Router()

router.get('/user/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string }
  const cacheKey = `stats:user:${userId}`

  try {
    const cached = await getCache(cacheKey)
    if (cached) {
      res.json({ stats: cached, source: 'cache' })
      return
    }

    // Resolve githubId to internal UUID
    const userResult = await query(
      `SELECT id FROM users WHERE github_id = $1`,
      [userId]
    )

    if (!userResult.rows[0]) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const stats = await getUserStats(userResult.rows[0].id)
    await setCache(cacheKey, stats, 120)
    res.json({ stats, source: 'db' })
  } catch (err) {
    console.error('Stats fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

router.get('/repo/:repoId', async (req: Request, res: Response) => {
  const { repoId } = req.params
  const cacheKey = `stats:repo:${repoId as string}`

  try {
    const cached = await getCache(cacheKey)
    if (cached) {
      res.json({ stats: cached, source: 'cache' })
      return
    }

    const stats = await getRepoStats(repoId as string)
    await setCache(cacheKey, stats, 120)
    res.json({ stats, source: 'db' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch repo stats' })
  }
})

export default router