'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-white">Pulseboard</h1>
        <p className="text-gray-400">Real-time developer activity analytics</p>
        <button
          onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          className="flex items-center gap-3 rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200 transition"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  )
}