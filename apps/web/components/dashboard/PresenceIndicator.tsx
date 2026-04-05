'use client'

interface Props {
  isLive: boolean
}

export default function PresenceIndicator({ isLive }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
      <span className="text-sm text-gray-400">
        {isLive ? 'Live' : 'Offline'}
      </span>
    </div>
  )
}