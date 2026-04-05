import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email repo'
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const p = profile as any

        token.githubId = p.id?.toString()
        token.username = p.login
        token.avatarUrl = p.avatar_url
        token.accessToken = account.access_token

        try {
          await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              githubId: p.id?.toString(),
              username: p.login,
              email: p.email ?? null,
              avatarUrl: p.avatar_url
            })
          })
        } catch (err) {
          console.error('User sync failed:', err)
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.githubId = token.githubId as string
      session.user.username = token.username as string
      session.user.avatarUrl = token.avatarUrl as string
      session.user.accessToken = token.accessToken as string
      return session
    }
  },
  pages: {
    signIn: '/login'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }