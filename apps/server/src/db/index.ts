import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('connect', () => {
  console.log('PostgreSQL connected')
})

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err)
  process.exit(-1)
})

export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('query executed', { text, duration, rows: res.rowCount })
  return res
}

export default pool