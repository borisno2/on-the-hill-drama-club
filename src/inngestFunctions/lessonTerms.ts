import { gql } from '@ts-gql/tag/no-transform'
import { keystoneContext } from 'keystone/context'
import { inngest } from 'lib/inngest/client'

const GET_LESSON_TERMS_TO_COPY = gql`
  query GET_LESSON_TERMS_TO_COPY($id: ID!) {
    term(where: { id: $id }) {
      id
      copyFrom {
        id
      }
      lessonTerms {
        id
        lesson {
          id
        }
      }
    }
  }
` as import('../../__generated__/ts-gql/GET_LESSON_TERMS_TO_COPY').type

const GET_ENROLMENTS_TO_COPY = gql`
  query GET_ENROLMENTS_TO_COPY($id: ID!) {
    lessonTerm(where: { id: $id }) {
      id
      term {
        id
        copyFrom {
          id
          lessonTerms(where: {}) {
            id
            enrolments {
              id
              student {
                id
              }
            }
          }
        }
      }
    }
  }
` as import('../../__generated__/ts-gql/GET_ENROLMENTS_TO_COPY').type

export const copyTermFunction = inngest.createFunction(
  'Start a new term from an existing term',
  'app/copyterm.confirmed',
  async ({ event }) => {
    try {
      const { item, session } = event.data
      if (!item.copyFromId)
        throw new Error('No copyFromId provided', { cause: item })
      const context = keystoneContext.withSession(session)
      const { term } = await context.graphql.run({
        query: GET_LESSON_TERMS_TO_COPY,
        variables: { id: item.copyFromId },
      })
      if (!term) throw new Error('Could not find term', { cause: item })
      if (!term.lessonTerms || term.lessonTerms.length === 0)
        throw new Error('No lesson terms found', { cause: term })

      const standardLessonTerm = {
        numberOfLessons: item.quantity,
        status: 'PENDING',
      }
      const lessonTerms = term.lessonTerms.map((lessonTerm) => {
        if (lessonTerm.lesson === null) return standardLessonTerm
        return {
          ...standardLessonTerm,
          lesson: {
            connect: {
              id: lessonTerm.lesson.id,
            },
          },
        }
      })
      await context.query.Term.updateOne({
        where: { id: item.id },
        data: {
          lessonTerms: {
            create: lessonTerms,
          },
        },
      })
    } catch (error) {
      throw new Error('Error copying term', { cause: error })
    }
  }
)

export const copyEnrolmentsFunction = inngest.createFunction(
  'Copy enrolments from one term to another',
  'app/lessonTerm.confirmed',
  async ({ event }) => {
    try {
      const { item, session } = event.data
      const context = keystoneContext.withSession(session)
      // get the term with copyFrom Term and lesson for this lessonTerm
      // get the lessonTerm for the copyFrom Term and lesson
      // get the enrolments for the lessonTerm
      // create the enrolments for this lessonTerm
    } catch (error) {
      throw new Error('Error copying enrolments', { cause: error })
    }
  }
)
