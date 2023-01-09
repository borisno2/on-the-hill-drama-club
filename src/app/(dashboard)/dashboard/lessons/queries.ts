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
        location
        lessonCategory {
          id
          cost
          type
        }
      }
      status
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
        location
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
