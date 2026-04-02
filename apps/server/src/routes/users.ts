import { Router, Request, Response } from 'express'
import { upsertUser, getUserByGithubId } from '../db/queries/users'

const router = Router()

router.post('/sync', async (req: Request, res: Response) => {
  const { githubId, username, email, avatarUrl } = req.body

  if (!githubId || !username) {
    res.status(400).json({ error: 'githubId and username are required' })
    return
  }

  try {
    const user = await upsertUser({ githubId, username, email, avatarUrl })
    res.json({ user })
  } catch (err) {
    console.error('User sync error:', err)
    res.status(500).json({ error: 'Failed to sync user' })
  }
})

router.get('/:githubId', async (req: Request, res: Response) => {
  try {
    const user = await getUserByGithubId(req.params.githubId as string)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

export default router