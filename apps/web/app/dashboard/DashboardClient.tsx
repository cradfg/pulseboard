'use client'

import { useEffect, useState } from 'react'
import { Session } from 'next-auth'
import { useActivity } from '@/hooks/useActivity'
import PresenceIndicator from '@/components/dashboard/PresenceIndicator'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import HeatMap from '@/components/dashboard/HeatMap'
import LanguageChart from '@/components/dashboard/LanguageChart'
import LeaderboardTable from '@/components/leaderboard/leaderboardTable'

interface Stats {
  totalCommits: number
  currentStreak: number
  languages: { language: string; count: number }[]
  activityHeatmap: { day: string; count: number }[]
}

interface LeaderboardEntry {
  username: string
  avatarUrl: string | null
  score: number
}

export default function DashboardClient({
  session,
  initialStats,
  githubId
}: {
  session: Session
  initialStats: Stats | null
  githubId: string
}) {
  const { activities, isLive } = useActivity((session.user as any).username)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/leaderboard/123456')
        const data = await res.json()
        setLeaderboard(data.leaderboard || [])
      } catch (err) {
        console.error('Leaderboard fetch error:', err)
      }
    }
    fetchLeaderboard()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src={session.user?.image || ''}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">{session.user?.name}</h1>
            <p className="text-gray-400 text-sm">@{(session.user as any).username}</p>
          </div>
        </div>
        <PresenceIndicator isLive={isLive} />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Total Commits</p>
          <p className="text-3xl font-bold text-green-400">{initialStats?.totalCommits ?? 0}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Current Streak</p>
          <p className="text-3xl font-bold text-green-400">{initialStats?.currentStreak ?? 0} days</p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
        <h2 className="text-sm font-semibold text-gray-400 mb-4">Activity — Last 90 Days</h2>
        <HeatMap data={initialStats?.activityHeatmap ?? []} />
      </div>

      {/* Language + Feed */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">Languages</h2>
          <LanguageChart data={initialStats?.languages ?? []} />
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">Live Activity Feed</h2>
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-4">
        <h2 className="text-sm font-semibold text-gray-400 mb-4">Repo Leaderboard</h2>
        <LeaderboardTable repoId="123456" entries={leaderboard} />
      </div>
    </div>
  )
}