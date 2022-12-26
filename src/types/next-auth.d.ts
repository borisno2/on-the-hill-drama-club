import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { type } from '../../__generated__/ts-gql/GET_AUTH_SESSION'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
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
    account: {
      id: string
      firstName: string | null
      surname: string | null
    } | null
  }
}
