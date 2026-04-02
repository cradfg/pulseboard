import { query } from '../index'
import { User } from '@pulseboard/shared'

export const upsertUser = async (params: {
  githubId: string
  username: string
  email: string | null
  avatarUrl: string
}): Promise<User> => {
  const result = await query(
    `INSERT INTO users (github_id, username, email, avatar_url)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (github_id) DO UPDATE SET
       username = EXCLUDED.username,
       email = EXCLUDED.email,
       avatar_url = EXCLUDED.avatar_url,
       last_active_at = NOW()
     RETURNING *`,
    [params.githubId, params.username, params.email, params.avatarUrl]
  )
  return result.rows[0]
}

export const getUserByGithubId = async (githubId: string): Promise<User | null> => {
  const result = await query(
    `SELECT * FROM users WHERE github_id = $1`,
    [githubId]
  )
  return result.rows[0] || null
}

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const result = await query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  )
  return result.rows[0] || null
}