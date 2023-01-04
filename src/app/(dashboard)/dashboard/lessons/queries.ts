import { gql } from '@ts-gql/tag/no-transform'

export const GET_LESSONS = gql`
  query GET_LESSONS($where: LessonTermWhereInput) {
    lessonTerms(where: $where) {
      id
      name
      term {
        id
        startDate
        endDate
        quantity
      }
      lesson {
        description
        id
        maxYear
        minYear
        day
        time
        lessonCategory {
          id
          cost
          type
        }
      }
      status
      location
    }
  }
` as import('../../../../../__generated__/ts-gql/GET_LESSONS').type

export const GET_LESSON_BY_ID = gql`
  query GET_LESSON_BY_ID($id: ID!) {
    lessonTerm(where: { id: $id }) {
      id
      name
      status
      lesson {
        name
        id
        description
        maxYear
        minYear
        day
        time
        lessonCategory {
          id
          type
          cost
        }
      }
      term {
        id
        startDate
        endDate
        quantity
      }
      location
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
