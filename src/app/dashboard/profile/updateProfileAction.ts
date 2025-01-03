'use server'

import { ZodError } from 'zod'
import { profileSchema, Values } from './profileSchema'
import { graphql } from 'gql'
import { getSessionContext } from 'keystone/context'

export type FormState = {
  message: string
  fields?: Values
  issues?: ZodError<Values>['issues']
}

const UPDATE_ACCOUNT = graphql(`
  mutation UPDATE_ACCOUNT($id: ID!, $data: AccountUpdateInput!) {
    updateAccount(where: { id: $id }, data: $data) {
      id
      phone
    }
  }
`)
export async function updateProfileAction(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const formData = Object.fromEntries(data)
  const parsed = profileSchema.safeParse(formData)
  if (!parsed.success) {
    const fields = Object.fromEntries(
      Object.keys(formData).map((key) => [key, formData[key]]),
    ) as Values
    return {
      message: 'There was an issue with your submission',
      issues: parsed.error.issues,
      fields,
    }
  }
  const context = await getSessionContext()
  if (!context.session || !context.session.data.accountId) {
    return {
      message: 'You must be logged in to update your profile',
    }
  }
  // Update the user's profile
  const user = await context.graphql.run({
    query: UPDATE_ACCOUNT,
    variables: { id: context.session.data.accountId, data: parsed.data },
  })
  if (!user) {
    const fields = Object.fromEntries(
      Object.keys(formData).map((key) => [key, formData[key]]),
    ) as Values
    return {
      message: 'There was an issue with your submission',
      fields,
    }
  }
  return {
    message: 'Success',
  }
}
