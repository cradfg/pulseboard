import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const githubId = (session.user as any).githubId as string

  const statsRes = await fetch(
    `http://localhost:5000/api/stats/user/${githubId}`,
    { cache: 'no-store' }
  ).catch(() => null)

  const stats = statsRes?.ok ? (await statsRes.json()).stats : null

  return <DashboardClient session={session} initialStats={stats} githubId={githubId} />
}