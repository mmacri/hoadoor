import NextAuth from "next-auth"
import { authOptions } from "@/server/auth/config"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      roles: string[]
    }
  }

  interface User {
    roles: string[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
