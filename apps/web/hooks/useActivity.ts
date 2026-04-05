'use client'

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export interface ActivityEvent {
  eventType: string
  repoId: string
  receivedAt: string
}

export const useActivity = (username: string | undefined) => {
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    if (!username) return

    const socket = io('http://localhost:5000')

    socket.on('connect', () => {
      socket.emit('join', username)
      setIsLive(true)
    })

    socket.on('activity', (event: ActivityEvent) => {
      setActivities(prev => [event, ...prev].slice(0, 20))
    })

    socket.on('disconnect', () => setIsLive(false))

    return () => { socket.disconnect() }
  }, [username])

  return { activities, isLive }
}