'use client'

interface LeaderboardEntry {
  username: string
  avatarUrl: string | null
  score: number
}

interface Props {
  repoId: string
  entries: LeaderboardEntry[]
}

export default function LeaderboardTable({ repoId, entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-8">
        No contributors yet for this repo
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry, i) => (
        <div
          key={entry.username}
          className="flex items-center justify-between bg-gray-900 rounded-lg px-4 py-3 border border-gray-800"
        >
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm w-5">{i + 1}</span>
            {entry.avatarUrl && (
              <img
                src={entry.avatarUrl}
                alt={entry.username}
                className="w-7 h-7 rounded-full"
              />
            )}
            <span className="text-white text-sm font-medium">{entry.username}</span>
          </div>
          <span className="text-green-400 font-mono text-sm">{entry.score} pushes</span>
        </div>
      ))}
    </div>
  )
}