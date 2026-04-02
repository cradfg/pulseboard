export interface User {
  id: string
  githubId: string
  username: string
  email: string
  avatarUrl: string
  createdAt: Date
  lastActiveAt: Date
  notificationsEnabled: boolean
  inactivityThresholdDays: number
}