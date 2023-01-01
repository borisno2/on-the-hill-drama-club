import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { type } from '../../__generated__/ts-gql/GET_AUTH_SESSION'

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
  }
  interface Session {
    adminUIAccess?: boolean
    data: {
      id: string
      firstName?: string | null
      surname?: string | null
      email: string | null
      role: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string
    email: string | null
    role: string | null
    allowAdminUI: boolean | null
    account: {
      id: string
      firstName: string | null
      surname: string | null
    } | null
  }
}
