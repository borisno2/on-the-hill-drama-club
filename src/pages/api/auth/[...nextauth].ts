import { isCuid } from 'cuid'
import { gql } from '@ts-gql/tag/no-transform'
import NextAuth, { AuthOptions } from 'next-auth'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import Apple from 'next-auth/providers/apple'
import { headers } from 'next/headers'

import Credentials from 'next-auth/providers/credentials'
import { keystoneContext } from '../../../keystone/context'

import { assertObjectType, GraphQLSchema } from 'graphql'

const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || 'Turnstile'

const GET_AUTH_SESSION = gql`
  query GET_AUTH_SESSION($where: UserWhereUniqueInput!) {
    user(where: $where) {
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
type SecretFieldImpl = {
  generateHash: (secret: string) => Promise<string>
  compare: (secret: string, hash: string) => Promise<string>
}
function getSecretFieldImpl(
  schema: GraphQLSchema,
  listKey: string,
  fieldKey: string
): SecretFieldImpl {
  const gqlOutputType = assertObjectType(schema.getType(listKey))
  const secretFieldImpl =
    gqlOutputType.getFields()?.[fieldKey].extensions?.keystoneSecretField
  return secretFieldImpl as SecretFieldImpl
}

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account }) {
      // if account type is cretentials then authorise the user
      if (account?.provider === 'credentials') {
        if (user.failMessage) {
          if (user.failMessage === 'InvalidCredentials') {
            return '/auth/signin?error=InvalidCredentials'
          } else if (user.failMessage === 'TurnstileFailed') {
            return '/auth/signin?error=UserNotVerified'
          } else {
            return '/auth/signin?error=UnknownError'
          }
        }
        if (user.id) return true
        return false
      }

      const keyUser = await keystoneContext.sudo().db.User.findOne({
        where: { subjectId: user.id },
      })

      if (!keyUser) {
        console.log('user not found, creating one')
        await keystoneContext.sudo().db.User.createOne({
          data: {
            subjectId: user.id,
            email: user.email,
            provider: account?.provider,
            account: {
              create: {
                firstName: user.name,
              },
            },
          },
        })
      }
      if (keyUser?.provider !== account?.provider) {
        console.log(
          `User provider mismatch for ${user.email} - ${account?.provider}`
        )
        return false
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
    async jwt({ token }) {
      if (!token?.sub) {
        return token
      }
      const where = isCuid(token.sub)
        ? { id: token.sub }
        : { subjectId: token.sub }
      const { user: userInDb } = await keystoneContext.sudo().graphql.run({
        variables: { where },
        query: GET_AUTH_SESSION,
      })
      if (userInDb) {
        token = { ...token, ...userInDb }
      }
      return token
    },
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'jsmith@email.com',
        },
        password: { label: 'Password', type: 'password' },
        turnstileRes: { label: 'TurnstileRes', type: 'text' },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null
        }
        const { email, password, turnstileRes } = credentials
        const form = new URLSearchParams()

        form.append('secret', SECRET_KEY)
        form.append('response', turnstileRes)
        form.append('remoteip', req?.headers?.['x-forwarded-for'] as string)
        const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
        const result = await fetch(url, {
          body: form,
          method: 'POST',
        })
        const outcome = await result.json()
        if (!outcome.success) {
          return { failMessage: 'TurnstileFailed' }
        }
        const secretFieldImpl = getSecretFieldImpl(
          keystoneContext.sudo().graphql.schema,
          'User',
          'password'
        )
        const item = await keystoneContext.sudo().db.User.findMany({
          where: {
            AND: [
              { email: { equals: email } },
              { provider: { equals: 'credentials' } },
            ],
          },
        })
        // simulate a password hash to counter timing attacks
        // https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#implement-proper-password-strength-controls
        // Deny if there is more than one user found (this should not happen)
        if (
          !item ||
          item.length > 1 ||
          item.length === 0 ||
          !item[0].password
        ) {
          await secretFieldImpl.generateHash(
            'simulated-password-to-counter-timing-attack'
          )
          return { failMessage: 'InvalidCredentials' }
        } else if (await secretFieldImpl.compare(password, item[0].password)) {
          // Authenticated!
          return { id: item[0].id, email: item[0].email, role: item[0].role }
        } else {
          return { failMessage: 'InvalidCredentials' }
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || 'GoogleClientID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GoogleClientSecret',
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID || 'FacebookClientID',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'Facebook',
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID || 'AppleClientID',
      clientSecret: process.env.APPLE_CLIENT_SECRET || 'AppleClientSecret',
    }),
  ],
}

export default NextAuth(authOptions)
