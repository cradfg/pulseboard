import redis from './index'

const PRESENCE_TTL = 30 * 60 // 30 minutes

export const setUserPresence = async (userId: string) => {
  await redis.setex(`presence:${userId}`, PRESENCE_TTL, '1')
}

export const getUserPresence = async (userId: string): Promise<boolean> => {
  const result = await redis.get(`presence:${userId}`)
  return result === '1'
}