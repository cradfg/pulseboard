import redis from './index'

const DEFAULT_TTL = 120 // 2 minutes

export const setCache = async (key: string, value: unknown, ttl = DEFAULT_TTL) => {
  await redis.setex(key, ttl, JSON.stringify(value))
}

export const getCache = async <T>(key: string): Promise<T | null> => {
  const data = await redis.get(key)
  return data ? JSON.parse(data) : null
}

export const invalidateCache = async (key: string) => {
  await redis.del(key)
}