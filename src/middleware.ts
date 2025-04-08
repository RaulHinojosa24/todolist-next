import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default NextAuth(authConfig).auth

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|otf|css|js|json)$|manifest\\.json$|favicon\\.ico$|robots\\.txt$|sitemap\\.xml$).*)",
  ],
}
