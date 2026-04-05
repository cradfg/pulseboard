'use client'

interface HeatMapEntry {
  day: string
  count: number
}

interface Props {
  data: HeatMapEntry[]
}

export default function HeatMap({ data }: Props) {
  const max = Math.max(...data.map(d => d.count), 1)

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-800'
    const intensity = count / max
    if (intensity < 0.25) return 'bg-green-900'
    if (intensity < 0.5) return 'bg-green-700'
    if (intensity < 0.75) return 'bg-green-500'
    return 'bg-green-400'
  }

  return (
    <div className="flex flex-wrap gap-1">
      {data.map((entry, i) => (
        <div
          key={i}
          title={`${entry.day}: ${entry.count} events`}
          className={`w-3 h-3 rounded-sm ${getColor(entry.count)} cursor-pointer transition-opacity hover:opacity-75`}
        />
      ))}
    </div>
  )
}