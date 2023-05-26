import { ListFilterAccessControl } from '@keystone-6/core/types'
import { Lists } from '.keystone/types'
import { gql } from '@ts-gql/tag/no-transform'
import { Session } from 'next-auth'
import {
  MessageWhereInput,
  StudentWhereInput,
} from '../../__generated__/ts-gql/@schema'

export const GET_BILL_ITEMS_TOTAL = gql`
  query GET_BILL_ITEMS_TOTAL($id: ID!) {
    billItems(where: { bill: { id: { equals: $id } } }) {
      id
      total
    }
  }
` as import('../../__generated__/ts-gql/GET_BILL_ITEMS_TOTAL').type

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
