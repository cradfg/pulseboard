import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import pool from './db'
import { connectProducer } from './kafka/producer'
import { startDbConsumer } from './kafka/consumers/db.consumer'
import { initSocket } from './socket'
import { rateLimiter } from './middleware/rateLimit'
import usersRouter from './routes/users'
import webhookRouter from './routes/webhook'
import statsRouter from './routes/stats'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

app.get('/health', async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('SELECT NOW()')
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected' })
  } finally {
    client.release()
  }
})

app.use('/api/users', usersRouter)
app.use('/api/webhook', rateLimiter(100, 60))
app.use('/api/webhook', webhookRouter)
app.use('/api/stats', statsRouter)

httpServer.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
  initSocket(httpServer)
  await connectProducer()
  await startDbConsumer()
})

export default app