import { gql } from '@ts-gql/tag/no-transform'

export const GET_MESSAGE_TO_SEND = gql`
  query GET_MESSAGE_TO_SEND($id: ID!) {
    message(where: { id: $id }) {
      id
      name
      content
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
` as import('../../../../../__generated__/ts-gql/GET_MESSAGE_TO_SEND').type
