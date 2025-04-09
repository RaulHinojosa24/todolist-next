import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user

      // Public routes
      const publicRoutes = ["/", "/about"]

      // Allow access to public routes
      if (publicRoutes.includes(nextUrl.pathname)) return true

      // Refirect unauthenticated users to the login page
      if (!isLoggedIn) return false

      // Redirect authenticated users to the tasks page if they try to access the login page
      if (nextUrl.pathname.startsWith("/login")) {
        return Response.redirect(new URL("/tasks", nextUrl))
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
