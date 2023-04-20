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

const GET_THIS_LESSON_TERM = gql`
  query GET_THIS_LESSON_TERM($id: ID!) {
    lessonTerm(where: { id: $id }) {
      id
      lesson {
        id
      }
      term {
        id
        copyFrom {
          id
        }
      }
      enrolments {
        id
      }
    }
  }
` as import('../../__generated__/ts-gql/GET_THIS_LESSON_TERM').type

const GET_COPY_FROM_LESSON_TERM = gql`
  query GET_COPY_FROM_LESSON_TERM($termId: ID!, $lessonId: ID!) {
    lessonTerms(
      where: {
        AND: [
          { term: { id: { equals: $termId } } }
          { lesson: { id: { equals: $lessonId } } }
        ]
      }
    ) {
      id
      enrolments {
        id
        student {
          id
        }
      }
    }
  }
` as import('../../__generated__/ts-gql/GET_COPY_FROM_LESSON_TERM').type

export const copyEnrolmentsFunction = inngest.createFunction(
  'Copy enrolments from one term to another',
  'app/lessonTerm.confirmed',
  async ({ event }) => {
    try {
      const { item, session } = event.data
      const context = keystoneContext.withSession(session)
      // get the term with copyFrom Term and lesson for this lessonTerm
      const newLessonTerm = await context.graphql.run({
        query: GET_THIS_LESSON_TERM,
        variables: { id: item.id },
      })
      if (!newLessonTerm || !newLessonTerm.lessonTerm)
        throw new Error('Could not find lessonTerm', { cause: item })
      if (
        !newLessonTerm.lessonTerm.term?.copyFrom ||
        !newLessonTerm.lessonTerm.lesson
      )
        throw new Error('No copyFrom term found', { cause: newLessonTerm })
      if (
        newLessonTerm.lessonTerm.enrolments &&
        newLessonTerm.lessonTerm.enrolments.length > 0
      )
        throw new Error('Enrolments already exist', { cause: newLessonTerm })
      // get the lessonTerm for the copyFrom Term and lesson
      const previousLessonTerm = await context.graphql.run({
        query: GET_COPY_FROM_LESSON_TERM,
        variables: {
          termId: newLessonTerm.lessonTerm.term.copyFrom.id,
          lessonId: newLessonTerm.lessonTerm.lesson.id,
        },
      })
      if (!previousLessonTerm || !previousLessonTerm.lessonTerms)
        throw new Error('Could not find previous lessonTerm', {
          cause: newLessonTerm,
        })
      if (previousLessonTerm.lessonTerms.length === 0)
        throw new Error('No previous lessonTerms found', {
          cause: previousLessonTerm,
        })
      if (previousLessonTerm.lessonTerms.length > 1)
        throw new Error('Too many previous lessonTerms found', {
          cause: previousLessonTerm,
        })
      if (!previousLessonTerm.lessonTerms[0].enrolments)
        throw new Error('No previous enrolments found', {
          cause: previousLessonTerm,
        })
      if (previousLessonTerm.lessonTerms[0].enrolments.length === 0)
        throw new Error('No previous enrolments found', {
          cause: previousLessonTerm,
        })
      const enrolments = previousLessonTerm.lessonTerms[0].enrolments.map(
        (enrolment) => ({
          status: 'ENROLED',
          student: {
            connect: {
              id: enrolment.student?.id,
            },
          },
        })
      )
      const updated = await context.query.LessonTerm.updateOne({
        where: { id: item.id },
        data: {
          enrolments: {
            create: enrolments,
          },
        },
      })
      if (!updated)
        throw new Error('Could not update lessonTerm', { cause: item })
      return updated
    } catch (error) {
      throw new Error('Error copying enrolments', { cause: error })
    }
  }
)
