import { Lists } from '.keystone/types'
import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { relationship, select, timestamp } from '@keystone-6/core/fields'
import { inngest } from '../../lib/inngest/client'
import { enrolmentStatusOptions } from '../../types/selectOptions'
import { enrolmentFilter, isAdmin, isLoggedIn } from '../helpers'
import { Session } from 'next-auth'

const Enrollment: Lists.Enrolment<Session> = list({
  ui: {
    listView: {
      initialColumns: ['id', 'lessonTerm', 'student', 'status'],
    },
  },
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
        originalItem.status === 'PENDING' &&
        context.session
      ) {
        await inngest.send({
          name: 'app/enrolment.enroled',
          data: {
            item,
            session: context.session,
          },
        })
      }
      if (
        operation === 'create' &&
        resolvedData &&
        resolvedData.status === 'ENROLED' &&
        context.session &&
        item
      ) {
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
    lessonTerm: relationship({
      ref: 'LessonTerm.enrolments',
      many: false,
      access: {
        update: isAdmin,
      },
    }),
    student: relationship({
      ref: 'Student.enrolments',
      many: false,
      access: {
        create: async ({ inputData, session, context }) => {
          if (!session) return false
          if (session.data?.role === 'ADMIN') {
            return true
          }
          // Check if the logged in use has access to the student
          const student = await context.query.Student.findOne({
            where: {
              id: inputData.student?.connect?.id,
            },
            query: 'id account { id }',
          })
          // If the student's account id matches the logged in user's account id
          return student.account.id === session.data.accountId
        },
        // Only admins can update the student relationship
        update: isAdmin,
      },
    }),
    status: select({
      validation: { isRequired: true },
      options: enrolmentStatusOptions,
      access: {
        create: ({ session, inputData }) => {
          if (inputData.status === 'PENDING') {
            return true
          }
          return isAdmin({ session })
        },
        update: isAdmin,
      },
    }),
    billItem: relationship({
      ref: 'BillItem.enrolment',
      many: false,
      access: {
        create: isAdmin,
        update: isAdmin,
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
})

export default Enrollment
