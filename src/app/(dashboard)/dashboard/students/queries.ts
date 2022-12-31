import { gql } from '@ts-gql/tag/no-transform'

export const GET_STUDENTS = gql`
  query GET_STUDENTS {
    students {
      id
      firstName
      surname
      dateOfBirth
      yearLevel
      enrolmentsCount
    }
  }
` as import('../../../../../__generated__/ts-gql/GET_STUDENTS').type

export const GET_STUDENT_BY_ID = gql`
  query GET_STUDENT_BY_ID($id: ID!) {
    student(where: { id: $id }) {
      id
      firstName
      surname
      dateOfBirth
      school
      yearLevel
      medical
    }
  }
` as import('../../../../../__generated__/ts-gql/GET_STUDENT_BY_ID').type
