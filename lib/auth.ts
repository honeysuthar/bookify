import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import prisma from "./prisma"

import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        if (!user || !user.passwordHash) {
          return null
        }
        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!isValid) {
          return null
        }
        return user
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false

        let dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        })

        if (!dbUser) {
          // Generate unique username from email
          const baseUsername = (user.email.split("@")[0] || "reader")
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "")
            .slice(0, 15)
          let username = baseUsername || "reader"
          let counter = 1
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${counter++}`
          }

          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "Reader",
              username,
              avatarUrl: user.image || null,
              authProvider: "GOOGLE",
              emailVerified: true
            }
          })
        }

        user.id = dbUser.id
        return true
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  }
})

export const getSessionUserId = async () => {
  const session = await auth()
  return session?.user?.id
}

export const getCurrentUser = async () => {
  const session = await auth()
  if (!session?.user) return null
  return session.user
}
