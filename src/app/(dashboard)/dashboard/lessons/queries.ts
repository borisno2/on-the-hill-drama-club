import { gql } from '@ts-gql/tag/no-transform'

export const GET_LESSONS = gql`
  query GET_LESSONS($where: LessonWhereInput) {
    lessons(where: $where) {
      id
      name
      maxYear
      minYear
      status
      startDate
      endDate
      day
      time
      cost
      type
      location
      quantity
    }
  }
` as import('../../../../../__generated__/ts-gql/GET_LESSONS').type

export const GET_LESSON_BY_ID = gql`
  query GET_LESSON_BY_ID($id: ID!) {
    lesson(where: { id: $id }) {
      id
      name
      description
      maxYear
      minYear
      status
      startDate
      endDate
      day
      time
      cost
      type
      location
      quantity
      enrolments {
        id
        student {
          id
          firstName
          surname
        }
      }
    }
  }
` as import('../../../../../__generated__/ts-gql/GET_LESSON_BY_ID').type
