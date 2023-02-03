import { Lists } from '.keystone/types'
import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { relationship, select, timestamp } from '@keystone-6/core/fields'
import { Inngest } from 'inngest'
import { Events } from '../../types/inngest'
import { enrolmentStatusOptions } from '../../types/selectOptions'
import { enrolmentFilter, isAdmin, isLoggedIn } from '../helpers'

const Enrollment: Lists.Enrolment = list({
  access: {
    operation: {
      ...allOperations(isLoggedIn),
      delete: isAdmin,
    },
    filter: {
      query: enrolmentFilter,
      update: enrolmentFilter,
    },
  },
  hooks: {
    afterOperation: async ({
      operation,
      resolvedData,
      originalItem,
      item,
      context,
    }) => {
      if (
        operation === 'update' &&
        resolvedData &&
        resolvedData.status === 'ENROLED' &&
        originalItem.status === 'PENDING'
      ) {
        const inngest = new Inngest<Events>({ name: 'Emily Calder ARTS' })
        await inngest.send({
          name: 'app/enrolment.enroled',
          data: {
            item,
            session: context.session,
          },
        })
      }
    },
  },
  fields: {
    lessonTerm: relationship({ ref: 'LessonTerm.enrolments', many: false }),
    student: relationship({ ref: 'Student.enrolments', many: false }),
    status: select({
      validation: { isRequired: true },
      options: enrolmentStatusOptions,
      access: {
        create: ({ session, inputData }) => {
          if (inputData.status === 'PENDING') {
            return true
          }
          return isAdmin(session)
        },
        update: isAdmin,
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
})

export default Enrollment
