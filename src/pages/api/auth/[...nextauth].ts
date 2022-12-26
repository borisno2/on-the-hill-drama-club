import { isCuid } from 'lib/isCuid'
import { gql } from '@ts-gql/tag/no-transform'
import NextAuth, { AuthOptions } from 'next-auth'
import Auth0 from 'next-auth/providers/auth0'
import Credentials from 'next-auth/providers/credentials'
import { keystoneContext } from '../../../keystone/context'

import { assertObjectType, GraphQLSchema } from 'graphql'

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
  callbacks: {
    async signIn(signInProps) {
      console.log('signInProps', signInProps)

      const { user, account } = signInProps
      if (account?.provider === 'credentials') {
        return true
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
      console.log('jwt', token)
      console.log('user', user)
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
      if (user) {
        token = { ...token, ...user }
      }

      return token
    },
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'jsmith@email.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }
        const { email, password } = credentials
        const secretFieldImpl = getSecretFieldImpl(
          keystoneContext.sudo().graphql.schema,
          'User',
          'password'
        )
        const item = await keystoneContext
          .sudo()
          .db.User.findOne({ where: { email } })
        console.log('item', item)

        if (!item || !item.password) {
          await secretFieldImpl.generateHash(
            'simulated-password-to-counter-timing-attack'
          )
          return null
        } else if (await secretFieldImpl.compare(password, item.password)) {
          // Authenticated!
          return item
        } else {
          return null
        }
      },
    }),
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
