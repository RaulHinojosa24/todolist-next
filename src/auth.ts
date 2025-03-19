import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { z } from "zod"
import type { User } from "@/lib/definitions"
import { sql } from "@vercel/postgres"
import bcrypt from "bcrypt"
import { JWT } from "next-auth/jwt"

async function getCustomer(username: string): Promise<User | undefined> {
  try {
    const customer =
      await sql<User>`SELECT * FROM customer WHERE username=${username}`
    return customer.rows[0]
  } catch (error) {
    console.error("Failed to fetch user:", error)
    throw new Error("Failed to fetch user.")
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            username: z.string(),
            password: z.string(),
          })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data
          const customer = await getCustomer(username)

          if (!customer) return null
          const passwordsMatch = await bcrypt.compare(
            password,
            customer.password
          )

          if (passwordsMatch) return customer
        }

        console.error("Invalid credentials")
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.id = user.id as string
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.username = token.username
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET,
})
