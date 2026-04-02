import { Server as HttpServer } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'
import { getUserPresence } from '../redis/presence'

let io: SocketServer

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.WEB_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`)

    // Client joins their personal room using their userId
    socket.on('join', async (userId: string) => {
      socket.join(`user:${userId}`)
      console.log(`User ${userId} joined their room`)

      // Send current presence status on join
      const isActive = await getUserPresence(userId)
      socket.emit('presence', { userId, active: isActive })
    })

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })

  return io
}

export const emitToUser = (userId: string, event: string, data: unknown) => {
  if (!io) return
  io.to(`user:${userId}`).emit(event, data)
}

export const getIO = () => io