'use server'
import { StudentCreateInput } from '.keystone/types'
import { getServerActionContext } from './nextAuthFix'
import { VariablesOf, graphql } from 'gql.tada'

const UPDATE_STUDENT = graphql(`
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
`)

const ADD_STUDENT = graphql(`
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
`)

export async function createStudent({
  data,
}: {
  data: VariablesOf<typeof ADD_STUDENT>['data']
}) {
  const context = await getServerActionContext()
  const student = await context.graphql.run({
    query: ADD_STUDENT,
    variables: { data },
  })
  return JSON.parse(JSON.stringify(student))
}

export async function updateStudent({
  id,
  data,
}: {
  id: string
  data: VariablesOf<typeof UPDATE_STUDENT>['data']
}) {
  const context = await getServerActionContext()
  const student = await context.graphql.run({
    query: UPDATE_STUDENT,
    variables: { id, data },
  })
  return JSON.parse(JSON.stringify(student))
}
