import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Welcome to Pulseboard</h1>
        <p className="text-gray-400">Signed in as {session.user?.name}</p>
      </div>
    </div>
  )
}