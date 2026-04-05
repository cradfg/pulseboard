'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const useSocket = (userId: string | undefined) => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!userId) return

    socket = io(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000')
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected')
      socket?.emit('join', userId)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    return () => {
      socket?.disconnect()
    }
  }, [userId])

  return socketRef.current
}