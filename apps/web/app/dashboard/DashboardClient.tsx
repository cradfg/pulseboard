'use client'

import { useState } from 'react'
import { Session } from 'next-auth'
import { useActivity } from '@/hooks/useActivity'
import PresenceIndicator from '@/components/dashboard/PresenceIndicator'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import HeatMap from '@/components/dashboard/HeatMap'
import LanguageChart from '@/components/dashboard/LanguageChart'

interface Stats {
  totalCommits: number
  currentStreak: number
  languages: { language: string; count: number }[]
  activityHeatmap: { day: string; count: number }[]
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

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src={session.user?.image || ''}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">{session.user?.name}</h1>
            <p className="text-gray-400 text-sm">@{session.user?.username}</p>
          </div>
        </div>
        <PresenceIndicator isLive={isLive} />
      </div>

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

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
        <h2 className="text-sm font-semibold text-gray-400 mb-4">Activity — Last 90 Days</h2>
        <HeatMap data={initialStats?.activityHeatmap ?? []} />
      </div>

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
    </div>
  )
}