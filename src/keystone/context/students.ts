'use server'
import { gql } from '@ts-gql/tag/no-transform'
import { StudentCreateInput } from '.keystone/types'
import { getServerActionContext } from './nextAuthFix'

const UPDATE_STUDENT = gql`
  mutation UPDATE_STUDENT($id: ID!, $data: StudentUpdateInput!) {
    updateStudent(where: { id: $id }, data: $data) {
      id
      firstName
      surname
      dateOfBirth
      school
      yearLevel
      medical
    }
  }
` as import('../../../__generated__/ts-gql/UPDATE_STUDENT').type

const ADD_STUDENT = gql`
  mutation ADD_STUDENT($data: StudentCreateInput!) {
    createStudent(data: $data) {
      id
      firstName
      surname
      dateOfBirth
      school
      yearLevel
      medical
    }
  }
` as import('../../../__generated__/ts-gql/ADD_STUDENT').type

export async function createStudent({ data }: { data: StudentCreateInput }) {
  const context = await getServerActionContext()
 const student = await context.graphql.run({ query: ADD_STUDENT, variables: { data } })
  return JSON.parse(JSON.stringify(student))
}

export async function updateStudent({
  id,
  data,
}: {
  id: string
  data: StudentCreateInput
}) {
  const context = await getServerActionContext()
  const student = await context.graphql.run({
    query: UPDATE_STUDENT,
    variables: { id, data },
  })
  return JSON.parse(JSON.stringify(student))
}
