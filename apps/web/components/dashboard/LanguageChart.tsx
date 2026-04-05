'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d']

interface Props {
  data: { language: string; count: number }[]
}

export default function LanguageChart({ data }: Props) {
  if (data.length === 0) {
    return <div className="text-gray-500 text-sm text-center py-8">No language data yet</div>
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="language"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ language }) => language}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#111', border: '1px solid #333' }}
          labelStyle={{ color: '#fff' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}