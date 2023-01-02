import {
  schoolOptions,
  dayOptions,
  lessonTypeOptions,
  lessonStatusOptions,
  enrolmentStatusOptions,
  billStatusOptions,
} from '../types/selectOptions'
import { graphql, list } from '@keystone-6/core'
import { allOperations, allowAll } from '@keystone-6/core/access'
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  calendarDay,
  integer,
  virtual,
  decimal,
  checkbox,
} from '@keystone-6/core/fields'
import { document } from '@keystone-6/fields-document'
import type { Lists, Context } from '.keystone/types'
import {
  accountFilter,
  billFilter,
  billItemFilter,
  enrolmentFilter,
  GET_BILL_ITEMS_TOTAL,
  isAdmin,
  isLoggedIn,
  studentFilter,
  userFilter,
} from './helpers'
import { Decimal } from 'decimal.js'

const decimalScale = 2
export const lists: Lists = {
  User: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: isLoggedIn,
      },
      filter: {
        query: userFilter,
      },
    },
    fields: {
      name: virtual({
        field: graphql.field({
          type: graphql.String,
          resolve: async (item, args, context: Context) => {
            const user = await context.query.User.findOne({
              where: { id: item.id },
              query: 'id account { firstName surname } provider',
            })
            return `${user.account?.firstName} ${user.account?.surname} - ${item.provider}`
          },
        }),
      }),
      email: text({
        validation: { isRequired: true },
      }),
      emailVerified: checkbox({ defaultValue: false }),
      emailVerificationToken: text(),
      emailVerificationTokenExpiry: timestamp(),
      provider: select({
        options: [
          { label: 'Credentials', value: 'credentials' },
          { label: 'Google', value: 'google' },
          { label: 'Apple', value: 'apple' },
        ],
        validation: { isRequired: true },
      }),
      password: password(),
      subjectId: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      account: relationship({ ref: 'Account.user', many: false }),
      role: text({ defaultValue: 'ACCOUNT' }),
    },
  }),

  Account: list({
    access: {
      operation: {
        ...allOperations(isLoggedIn),
        delete: isAdmin,
      },
      filter: {
        query: accountFilter,
        update: accountFilter,
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
      user: relationship({ ref: 'User.account', many: false }),
      firstName: text({
        validation: { isRequired: true },
        defaultValue: 'PLEASE_UPDATE',
      }),
      surname: text({
        validation: { isRequired: true },
        defaultValue: 'PLEASE_UPDATE',
      }),
      phone: text({
        validation: { isRequired: true },
        defaultValue: 'PLEASE_UPDATE',
      }),
      secondContactName: text({
        validation: { isRequired: true },
        defaultValue: 'PLEASE_UPDATE',
      }),
      secondContactPhone: text({
        validation: { isRequired: true },
        defaultValue: 'PLEASE_UPDATE',
      }),
      students: relationship({ ref: 'Student.account', many: true }),
      bills: relationship({ ref: 'Bill.account', many: true }),
      streetAddress: text({
        validation: { isRequired: true },
        defaultValue: 'PLEASE_UPDATE',
      }),
      suburb: text({
        validation: { isRequired: true },
        defaultValue: 'PLEASE_UPDATE',
      }),
      postcode: integer({
        validation: { isRequired: true },
        defaultValue: 3550,
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Student: list({
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
      account: relationship({ ref: 'Account.students', many: false }),
      enrolments: relationship({ ref: 'Enrolment.student', many: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Lesson: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: allowAll,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      time: text({ validation: { isRequired: true } }),
      day: select({
        validation: { isRequired: true },
        options: dayOptions,
      }),
      minYear: integer({ validation: { isRequired: true } }),
      maxYear: integer({ validation: { isRequired: true } }),
      cost: decimal({ scale: decimalScale }),
      quantity: integer(),
      startDate: calendarDay(),
      endDate: calendarDay(),
      type: select({
        validation: { isRequired: true },
        options: lessonTypeOptions,
      }),
      location: text({ validation: { isRequired: true } }),
      status: select({
        validation: { isRequired: true },
        options: lessonStatusOptions,
      }),
      description: text({
        ui: { displayMode: 'textarea' },
        db: {
          nativeType: 'Text',
          isNullable: true,
        },
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      enrolments: relationship({ ref: 'Enrolment.lesson', many: true }),
    },
  }),

  Enrolment: list({
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
    fields: {
      lesson: relationship({ ref: 'Lesson.enrolments', many: false }),
      student: relationship({ ref: 'Student.enrolments', many: false }),
      status: select({
        validation: { isRequired: true },
        options: enrolmentStatusOptions,
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Bill: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: isLoggedIn,
      },
      filter: {
        query: billFilter,
      },
    },
    fields: {
      name: text(),
      account: relationship({ ref: 'Account.bills', many: false }),
      date: calendarDay(),
      dueDate: calendarDay(),
      total: virtual({
        field: graphql.field({
          type: graphql.Decimal,
          resolve: async (item, args, context) => {
            const data = await context.graphql.run({
              query: GET_BILL_ITEMS_TOTAL,
              variables: { id: item.id },
            })
            const billItems = data.billItems
            let val: Decimal & { scaleToPrint?: number } = new Decimal(0)
            if (billItems && billItems.length) {
              val = billItems.reduce(
                (acc, billItem) => acc.add(billItem.amount),
                new Decimal(0)
              )
            }
            val.scaleToPrint = decimalScale
            return val
          },
        }),
      }),
      status: select({
        validation: { isRequired: true },
        options: billStatusOptions,
      }),
      items: relationship({ ref: 'BillItem.bill', many: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  BillItem: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: isLoggedIn,
      },
      filter: {
        query: billItemFilter,
      },
    },
    fields: {
      name: text(),
      bill: relationship({ ref: 'Bill.items', many: false }),
      quantity: integer(),
      amount: decimal({ scale: decimalScale }),
      total: virtual({
        field: graphql.field({
          type: graphql.Decimal,
          resolve: (item) => {
            let val: Decimal & { scaleToPrint?: number } = new Decimal(0.0)
            if (item.amount && item.quantity)
              val = new Decimal(item.amount).mul(item.quantity)
            val.scaleToPrint = decimalScale
            return val
          },
        }),
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
}
