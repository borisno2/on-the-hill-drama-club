import { graphql } from 'gql'
import { Session } from 'next-auth'
import type { StudentWhereInput, MessageWhereInput } from '.keystone/types'

export const GET_BILL_ITEMS_TOTAL = graphql(`
  query GET_BILL_ITEMS_TOTAL($id: ID!) {
    billItems(where: { bill: { id: { equals: $id } } }) {
      id
      total
    }
  }
`)

export function isAdmin({ session }: { session?: Session }) {
  return session?.data.role === 'ADMIN'
}

export function isLoggedIn({ session }: { session?: Session }) {
  return !!session?.userId
}

export function accountFilter({ session }: { session?: Session }) {
  if (!session) return false
  if (session.data.role === 'ADMIN') return true
  return { user: { id: { equals: session.userId } } }
}

export function studentFilter({
  session,
}: {
  session?: Session
}): StudentWhereInput | boolean {
  if (!session) return false
  if (session.data.role === 'ADMIN') return true
  return {
    account: {
      user: {
        id: { equals: session.userId },
      },
    },
  }
}

export function enrolmentFilter({ session }: { session?: Session }) {
  if (!session) return false
  if (session.data.role === 'ADMIN') return true
  return {
    student: {
      account: {
        user: {
          id: {
            equals: session.userId,
          },
        },
      },
    },
  }
}

export function billFilter({ session }: { session?: Session }) {
  if (!session) return false
  if (session.data.role === 'ADMIN') return true
  return {
    account: {
      user: {
        id: {
          equals: session.userId,
        },
      },
    },
  }
}

export function billItemFilter({ session }: { session?: Session }) {
  if (!session) return false
  if (session.data.role === 'ADMIN') return true
  return {
    bill: {
      account: {
        user: {
          id: {
            equals: session.userId,
          },
        },
      },
    },
  }
}
export function userFilter({ session }: { session?: Session }) {
  if (!session) return false
  if (session.data.role === 'ADMIN') return true
  return { id: { equals: session.userId } }
}

export function messageFilter({
  session,
}: {
  session?: Session
}): MessageWhereInput | boolean {
  if (!session) return false
  if (session.data.role === 'ADMIN') return true
  return {
    lessonTerms: {
      some: {
        enrolments: {
          some: {
            student: {
              account: {
                user: {
                  id: {
                    equals: session.userId,
                  },
                },
              },
            },
          },
        },
      },
    },
  }
}
