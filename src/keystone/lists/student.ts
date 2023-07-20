import { Lists } from '.keystone/types'
import { graphql, list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import {
  calendarDay,
  integer,
  relationship,
  select,
  text,
  timestamp,
  virtual,
} from '@keystone-6/core/fields'
import { schoolOptions } from '../../types/selectOptions'

import { isAdmin, isLoggedIn, studentFilter } from '../helpers'
import { Session } from 'next-auth'

const Student: Lists.Student<Session> = list({
  access: {
    operation: {
      ...allOperations(isLoggedIn),
      delete: isAdmin,
    },
    filter: {
      query: studentFilter,
      update: studentFilter,
    },
  },
  fields: {
    name: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve: async (item) => {
          return `${item.firstName} ${item.surname}`
        },
      }),
    }),
    firstName: text({ validation: { isRequired: true } }),
    surname: text({ validation: { isRequired: true } }),
    dateOfBirth: calendarDay({ validation: { isRequired: true } }),
    school: select({
      validation: { isRequired: true },
      options: schoolOptions,
    }),
    yearLevel: integer({ validation: { isRequired: true } }),
    medical: text({
      ui: { displayMode: 'textarea' },
      db: {
        nativeType: 'Text',
        isNullable: true,
      },
    }),
    account: relationship({
      ref: 'Account.students',
      many: false,
      access: {
        update: isAdmin,
        create: ({ inputData, session }) => {
          if (session?.data?.role === 'ADMIN') {
            return true
          }
          return inputData.account?.connect?.id === session?.data?.accountId
        },
      },
    }),
    enrolments: relationship({
      ref: 'Enrolment.student',
      many: true,
      access: {
        create: isAdmin,
        update: ({ inputData, session }) => {
          if (session?.data?.role === 'ADMIN') {
            return true
          }
          // A user can only create a new enrollment
          return !!inputData.enrolments?.create
        },
      },
    }),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
})

export default Student
