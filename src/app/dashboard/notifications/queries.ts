import { graphql } from 'gql.tada'

export const GET_MESSAGE_TO_SEND = graphql(`
  query GET_MESSAGE_TO_SEND($id: ID!) {
    message(where: { id: $id }) {
      id
      name
      content
      status
      lessonTerms {
        id
        name
        enrolments(where: { status: { notIn: ["PENDING", "CANCELLED"] } }) {
          id
          student {
            id
            name
            account {
              id
              name
              user {
                id
                email
              }
            }
          }
        }
      }
    }
  }
`)
