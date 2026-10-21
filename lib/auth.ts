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
  pages: {
    signIn: "/login",
    error: "/login",
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
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          const rawEmail = user?.email || (profile as any)?.email
          if (!rawEmail) {
            console.error("[auth] Google sign-in failed: no email found in profile", { user, profile })
            return false
          }
          const email = rawEmail.toLowerCase().trim()

          let dbUser = await prisma.user.findFirst({
            where: {
              email: { equals: email, mode: "insensitive" }
            }
          })

          if (!dbUser) {
            // Generate unique username from email
            const baseUsername = (email.split("@")[0] || "reader")
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
                email,
                name: user?.name || (profile as any)?.name || "Reader",
                username,
                avatarUrl: user?.image || (profile as any)?.picture || null,
                authProvider: "GOOGLE",
                emailVerified: true
              }
            })
          }

          user.id = dbUser.id
          return true
        }
        return true
      } catch (error) {
        console.error("[auth] Error in signIn callback:", error)
        return false
      }
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user?.id) {
        token.sub = user.id
      }
      if (token.email && (!token.sub || account?.provider === "google")) {
        try {
          const dbUser = await prisma.user.findFirst({
            where: { email: { equals: token.email.toLowerCase().trim(), mode: "insensitive" } }
          })
          if (dbUser) {
            token.sub = dbUser.id
          }
        } catch (e) {
          console.error("[auth] Error resolving user in jwt callback:", e)
        }
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
