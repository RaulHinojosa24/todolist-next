import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnTasks = nextUrl.pathname.startsWith("/tasks")
      const isOnLogin = nextUrl.pathname.startsWith("/login")
      if (isOnTasks) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL("/tasks", nextUrl))
      }
      // else if (isLoggedIn) {
      //   return Response.redirect(new URL('/tasks', nextUrl));
      // }
      return true
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
