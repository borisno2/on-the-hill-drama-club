// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id?: string
    email?: string | null
    role?: string | null
    name?: string | null
    failMessage?: string | null
    subjectId?: string
  }
  interface Session {
    allowAdminUI: boolean
    userId: string
    data: {
      firstName?: string | null
      surname?: string | null
      accountId?: string | null
      email: string | null
      role: string | null
      emailVerified?: boolean | null
    }
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string
    email: string | null
    role: string | null
    allowAdminUI: boolean
    emailVerified: boolean
    account: {
      id: string
      firstName: string | null
      surname: string | null
    } | null
  }
}
