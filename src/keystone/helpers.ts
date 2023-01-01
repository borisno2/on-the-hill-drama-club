import { gql } from '@ts-gql/tag/no-transform'
import { Session } from 'next-auth'

export const GET_BILL_ITEMS_TOTAL = gql`
  query GET_BILL_ITEMS_TOTAL($id: ID!) {
    billItems(where: { bill: { id: { equals: $id } } }) {
      id
      amount
    }
  }
` as import('../../__generated__/ts-gql/GET_BILL_ITEMS_TOTAL').type

export function isAdmin({ session }: { session: Session }) {
  return session.data.role === 'ADMIN'
}

export function isLoggedIn({ session }: { session: Session }) {
  return !!session.userId
}

export function accountFilter({ session }: { session: Session }) {
  if (session.data.role === 'ADMIN') return true
  return { user: { id: { equals: session.userId } } }
}

export function studentFilter({ session }: { session: Session }) {
  if (session.data.role === 'ADMIN') return true
  return {
    account: {
      user: {
        id: { equals: session.userId },
      },
    },
  }
}

export function enrolmentFilter({ session }: { session: Session }) {
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

export function billFilter({ session }: { session: Session }) {
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

export function billItemFilter({ session }: { session: Session }) {
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
export function userFilter({ session }: { session: Session }) {
  if (session.data.role === 'ADMIN') return true
  return { id: { equals: session.userId } }
}
