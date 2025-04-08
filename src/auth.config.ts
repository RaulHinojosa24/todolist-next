import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnHome = nextUrl.pathname === "/"
      const isOnLogin = nextUrl.pathname.startsWith("/login")
      if (isOnHome) return true // Allow access to the home page for all users
      if (!isLoggedIn) return false // Redirect unauthenticated users to login page
      if (isOnLogin) {
        return Response.redirect(new URL("/tasks", nextUrl))
      }
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
