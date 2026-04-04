import { Router, Request, Response } from 'express'
import { getUserStats, getRepoStats } from '../db/queries/stats'
import { getCache, setCache } from '../redis/cache'

const router = Router()

router.get('/user/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params
  const cacheKey = `stats:user:${userId as string}`

  try {
    const cached = await getCache(cacheKey)
    if (cached) {
      res.json({ stats: cached, source: 'cache' })
      return
    }

    const stats = await getUserStats(userId as string)
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