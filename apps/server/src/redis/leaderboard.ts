import redis from './index'

export const updateLeaderboard = async (
  repoId: string,
  userId: string,
  incrementBy = 1
) => {
  await redis.zincrby(`leaderboard:${repoId}`, incrementBy, userId)
}

export const getLeaderboard = async (repoId: string, limit = 10) => {
  const results = await redis.zrevrange(
    `leaderboard:${repoId}`,
    0,
    limit - 1,
    'WITHSCORES'
  )

  const leaderboard = []
  for (let i = 0; i < results.length; i += 2) {
    leaderboard.push({
      userId: results[i],
      score: parseInt(results[i + 1])
    })
  }
  return leaderboard
}