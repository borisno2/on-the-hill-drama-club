import { graphql } from 'gql'
import { getSessionContext } from 'keystone/context'
import ProfileForm from './ProfileForm'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
  ...getMetadata('Profile - Student Portal'),
}

const GET_ACCOUNT = graphql(`
  query GET_ACCOUNT($id: ID!) {
    user(where: { id: $id }) {
      id
      name
      email
      account {
        id
        firstName
        surname
        phone
        streetAddress
        suburb
        postcode
        secondContactName
        secondContactPhone
      }
    }
  }
`)

export default async function Profile(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  let redirectOnSave: boolean = false
  if (searchParams?.incomplete === 'true') {
    redirectOnSave = true
  }
  const context = await getSessionContext()
  const { session } = context
  if (!session) {
    redirect('/auth/signin')
  }
  const { userId } = session
  const { user } = await context.graphql.run({
    query: GET_ACCOUNT,
    variables: { id: userId },
  })
  if (!user || !user.account) {
    redirect('/dashboard/new-account')
  }

  const profile = {
    email: user.email,
    ...user.account,
  }

  return (
    <div className="py-4">
      <ProfileForm user={profile} redirectOnSave={redirectOnSave} />
    </div>
  )
}
