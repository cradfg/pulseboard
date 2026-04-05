'use client'

import { ActivityEvent } from '@/hooks/useActivity'

interface Props {
  activities: ActivityEvent[]
}

export default function ActivityFeed({ activities }: Props) {
  if (activities.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-8">
        No activity yet — push a commit to see it appear here live
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {activities.map((activity, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-gray-900 rounded-lg px-4 py-3 border border-gray-800"
        >
          <div className="flex items-center gap-3">
            <span className="text-green-400 text-xs font-mono bg-green-400/10 px-2 py-1 rounded">
              {activity.eventType}
            </span>
            <span className="text-gray-400 text-sm">
              repo: {activity.repoId}
            </span>
          </div>
          <span className="text-gray-600 text-xs">
            {new Date(activity.receivedAt).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  )
}