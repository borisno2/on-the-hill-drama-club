import { UserCreateInput } from '../../../../../__generated__/ts-gql/@schema'
import { isCuid } from 'cuid'
import { gql } from '@ts-gql/tag/no-transform'
import NextAuth, { AuthOptions } from 'next-auth'
import Google, { GoogleProfile } from 'next-auth/providers/google'
import Apple, { AppleProfile } from 'next-auth/providers/apple'

import Credentials from 'next-auth/providers/credentials'
import { keystoneContext } from '../../../../keystone/context'

import { assertObjectType } from 'graphql'

const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || 'Turnstile'

const GET_AUTH_SESSION = gql`
  query GET_AUTH_SESSION($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      email
      emailVerified
      role
      account {
        id
        firstName
        surname
      }
    }
  }
` as import('../../../../../__generated__/ts-gql/GET_AUTH_SESSION').type
type SecretFieldImpl = {
  generateHash: (secret: string) => Promise<string>
  compare: (secret: string, hash: string) => Promise<string>
}

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
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
      if (!user.id || !user.email) {
        return false
      }
      // if account type is not credentials then check if user exists in keystone
      const keyUser = await keystoneContext.sudo().db.User.findOne({
        where: { subjectId: user.id },
      })
      if (keyUser) {
        if (keyUser.provider !== account?.provider) {
          console.log(
            `User provider mismatch for ${user.email} - ${account?.provider}`,
          )
          return '/auth/signin?error=UserProviderMismatch'
        }
        return true
      }

      if (!keyUser) {
        let newUserData: UserCreateInput
        if (account?.provider === 'google') {
          const googleProfile = profile as GoogleProfile
          newUserData = {
            subjectId: user.id,
            provider: account?.provider,
            email: googleProfile?.email,
            emailVerified: googleProfile?.email_verified,
            account: {
              create: {
                firstName: googleProfile?.given_name || 'PLEASE_UPDATE',
                surname: googleProfile?.family_name || 'PLEASE_UPDATE',
                phone: googleProfile?.phone_number || 'PLEASE_UPDATE',
                streetAddress:
                  googleProfile?.address?.street_address || 'PLEASE_UPDATE',
                suburb: googleProfile?.address?.locality || 'PLEASE_UPDATE',
                postcode: parseInt(googleProfile?.address?.postal_code) || 3550,
              },
            },
          }
        } else if (account?.provider === 'apple') {
          const appleProfile = profile as AppleProfile
          newUserData = {
            subjectId: user.id,
            provider: account?.provider,
            email: user.email,
            emailVerified: !!appleProfile?.email_verified,
            account: {
              create: {
                firstName: appleProfile?.given_name || 'PLEASE_UPDATE',
                surname: appleProfile?.family_name || 'PLEASE_UPDATE',
                phone: appleProfile?.phone_number || 'PLEASE_UPDATE',
                streetAddress:
                  appleProfile?.address?.street_address || 'PLEASE_UPDATE',
                suburb: appleProfile?.address?.locality || 'PLEASE_UPDATE',
                postcode: parseInt(appleProfile?.address?.postal_code) || 3550,
              },
            },
          }
        } else {
          return '/auth/signin?error=UnknownProvider'
        }
        try {
          const newUser = await keystoneContext.sudo().db.User.createOne({
            data: newUserData,
          })
          return newUser.id ? true : '/auth/signin?error=ErrorCreatingUser'
        } catch (error) {
          console.log('error :', error)
          return '/auth/signin?error=ErrorCreatingUser'
        }
      }
      return '/auth/signin?error=GenericError'
    },
    async session({ session, token }) {
      const { id, email, role, account, allowAdminUI } = token
      return {
        ...session,
        user: {
          ...session.user,
          name: account?.firstName + ' ' + account?.surname,
        },
        allowAdminUI,
        userId: id,
        data: {
          firstName: account?.firstName,
          surname: account?.surname,
          emailVerified: token.emailVerified,
          accountId: account?.id,
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
        token = {
          ...token,
          ...userInDb,
          allowAdminUI: userInDb.role === 'ADMIN',
        }
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
        const secretFieldImpl = assertObjectType(
          keystoneContext.sudo().graphql.schema.getType('User'),
        ).getFields()?.password.extensions
          ?.keystoneSecretField as SecretFieldImpl

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
            'simulated-password-to-counter-timing-attack',
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
    Apple({
      clientId: process.env.APPLE_CLIENT_ID || 'AppleClientID',
      clientSecret: process.env.APPLE_CLIENT_SECRET || 'AppleClientSecret',
    }),
  ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
