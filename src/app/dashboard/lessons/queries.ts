import { graphql } from 'gql'

export const GET_LESSONS = graphql(`
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
        teachers {
          id
          name
        }
        lessonCategory {
          id
          cost
          type
        }
      }
      status
    }
  }
`)

export const GET_LESSON_BY_ID = graphql(`
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
        teachers {
          id
          name
        }
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
`)
