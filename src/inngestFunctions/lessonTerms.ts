import { graphql } from 'gql'
import { slugify } from 'inngest'
import { keystoneContext } from 'keystone/context'
import { inngest } from 'lib/inngest/client'

const GET_LESSON_TERMS_TO_COPY = graphql(`
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
`)

// const GET_ENROLMENTS_TO_COPY = graphql(`
//   query GET_ENROLMENTS_TO_COPY($id: ID!) {
//     lessonTerm(where: { id: $id }) {
//       id
//       term {
//         id
//         copyFrom {
//           id
//           lessonTerms(where: {}) {
//             id
//             enrolments {
//               id
//               student {
//                 id
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `)

export const copyTermFunction = inngest.createFunction(
  {
    id: slugify('Start a new term from an existing term'),
    name: 'Start a new term from an existing term',
  },
  { event: 'app/copyterm.confirmed' },
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
        status: 'DRAFT',
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
  },
)

const GET_THIS_LESSON_TERM = graphql(`
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
`)

const GET_COPY_FROM_LESSON_TERM = graphql(`
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
      enrolments(where: { status: { notIn: ["CANCELLED", "PENDING"] } }) {
        id
        student {
          id
        }
      }
    }
  }
`)

export const copyEnrolmentsFunction = inngest.createFunction(
  {
    id: slugify('Copy enrolments from one term to another'),
    name: 'Copy enrolments from one term to another',
  },
  { event: 'app/lessonTerm.confirmed' },
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
        }),
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
  },
)

export const completeTermFunction = inngest.createFunction(
  { id: slugify('Complete a term'), name: 'Complete a term' },
  { event: 'app/term.completed' },
  async ({ event }) => {
    try {
      const { item, session } = event.data
      const context = keystoneContext.withSession(session)

      const lessonTerms = await context.db.LessonTerm.findMany({
        where: { term: { id: { equals: item.id } } },
      })
      if (!lessonTerms || lessonTerms.length === 0)
        throw new Error('No lessonTerms found', { cause: item })
      const lessonTermsData = lessonTerms.map((lessonTerm) => ({
        where: { id: lessonTerm.id },
        data: { status: 'PREVIOUS' },
      }))
      const updatedLessonTerms = await context.db.LessonTerm.updateMany({
        data: lessonTermsData,
      })
      if (!updatedLessonTerms)
        throw new Error('Could not update lessonTerms', { cause: item })
      return updatedLessonTerms
    } catch (error) {
      throw new Error('Error completing term', { cause: error })
    }
  },
)
