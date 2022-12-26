import { gql } from '@ts-gql/tag/no-transform'
import NextAuth, { AuthOptions } from 'next-auth'
import Auth0 from 'next-auth/providers/auth0'
import { keystoneContext } from '../../../keystone/context'

const GET_AUTH_SESSION = gql`
  query GET_AUTH_SESSION($subjectId: String!) {
    user(where: { subjectId: $subjectId }) {
      id
      email
      role
      account {
        id
        firstName
        surname
      }
    }
  }
` as import('../../../../__generated__/ts-gql/GET_AUTH_SESSION').type

export const authOptions: AuthOptions = {
  callbacks: {
    async signIn(signInProps) {
      const { user } = signInProps
      const keyUser = await keystoneContext.sudo().db.User.findOne({
        where: { subjectId: user.id },
      })

      if (!keyUser) {
        console.log('user not found, creating one')
        await keystoneContext.sudo().db.User.createOne({
          data: {
            subjectId: user.id,
            email: user.email,
            name: user.name,
            account: {
              create: {
                firstName: user.name,
              },
            },
          },
        })
      }
      return true
    },
    async session({ session, token }) {
      const { id, email, role, account } = token
      return {
        ...session,
        user: {
          ...session.user,
          name: account?.firstName + ' ' + account?.surname,
        },
        data: {
          id,
          firstName: account?.firstName,
          surname: account?.surname,
          email,
          role,
        },
      }
    },
    async jwt({ token, user }) {
      if (!token?.sub) {
        return token
      }
      const { user: userInDb } = await keystoneContext.sudo().graphql.run({
        variables: { subjectId: token.sub },
        query: GET_AUTH_SESSION,
      })
      if (userInDb) {
        token = { ...token, ...userInDb }
      }
      if (user) {
        token = { ...token, ...user }
      }

      return token
    },
  },
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID || 'Auth0ClientID',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || 'Auth0ClientSecret',
      issuer:
        process.env.AUTH0_ISSUER_BASE_URL || 'https://opensaas.au.auth0.com',
    }),
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)
