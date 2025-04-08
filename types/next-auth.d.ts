import { DefaultSession, DefaultUser } from "next-auth"

// Extender los tipos de sesión y usuario
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      name: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    username: string
  }
}

// Extender los tipos del token JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
  }
}
