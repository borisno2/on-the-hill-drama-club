'use server'
import { gql } from '@ts-gql/tag/no-transform'
import { getSessionContext } from '.'
import { StudentCreateInput } from '.keystone/types'

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

export async function createStudent(data: StudentCreateInput) {
  const context = await getSessionContext()
  return await context.graphql.run({ query: ADD_STUDENT, variables: { data } })
}
