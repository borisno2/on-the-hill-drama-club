import { graphql, list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  calendarDay,
  integer,
  virtual,
} from '@keystone-6/core/fields'
import { document } from '@keystone-6/fields-document'
import type { Lists, Context } from '.keystone/types'

export const lists: Lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      subjectId: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      account: relationship({ ref: 'Account.user', many: false }),
      role: text(),
    },
  }),

  Account: list({
    access: allowAll,
    fields: {
      user: relationship({ ref: 'User.account', many: false }),
      firstName: text(),
      surname: text(),
      phone: text(),
      students: relationship({ ref: 'Student.account', many: true }),
      bills: relationship({ ref: 'Bill.account', many: true }),
      streetAddress: text(),
      suburb: text(),
      postcode: text(),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Student: list({
    access: allowAll,
    fields: {
      firstName: text(),
      surname: text(),
      dateOfBirth: calendarDay(),
      account: relationship({ ref: 'Account.students', many: false }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Class: list({
    access: allowAll,
    fields: {
      name: text(),
      time: text(),
      day: select({
        options: [
          { label: 'Monday', value: 'MONDAY' },
          { label: 'Tuesday', value: 'TUESDAY' },
          { label: 'Wednesday', value: 'WEDNESDAY' },
          { label: 'Thursday', value: 'THURSDAY' },
          { label: 'Friday', value: 'FRIDAY' },
          { label: 'Saturday', value: 'SATURDAY' },
          { label: 'Sunday', value: 'SUNDAY' },
        ],
      }),
      minimumAge: integer(),
      maximumAge: integer(),
      cost: integer(),
      quantity: integer(),
      startDate: calendarDay(),
      endDate: calendarDay(),
      type: select({
        options: [
          { label: 'Term', value: 'TERM' },
          { label: 'Holiday', value: 'HOLIDAY' },
          { label: 'Trial', value: 'TRIAL' },
          { label: 'Once Off', value: 'ONCE' },
          { label: 'Other', value: 'OTHER' },
        ],
      }),
      location: text(),
      status: select({
        options: [
          { label: 'Upcoming', value: 'UPCOMING' },
          { label: 'Current', value: 'CURRENT' },
          { label: 'Enrolments Open', value: 'ENROL' },
          { label: 'Previous', value: 'PREVIOUS' },
        ],
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Enrolment: list({
    access: allowAll,
    fields: {
      class: relationship({ ref: 'Class', many: false }),
      student: relationship({ ref: 'Student', many: false }),
      status: select({
        options: [
          { label: 'Enrolled', value: 'ENROLLED' },
          { label: 'Pending', value: 'PENDING' },
          { label: 'Cancelled', value: 'CANCELLED' },
          { label: 'Paid', value: 'PAID' },
        ],
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Bill: list({
    access: allowAll,
    fields: {
      name: text(),
      account: relationship({ ref: 'Account.bills', many: false }),
      date: calendarDay(),
      dueDate: calendarDay(),
      total: virtual({
        field: graphql.field({
          type: graphql.Int,
          resolve: async (item, args, context) => {
            const billItems = await context.query.BillItem.findMany({
              where: { bill: { id: item.id } },
              query: ' id amount',
            })
            return billItems.reduce((acc, billItem) => acc + billItem.amount, 0)
          },
        }),
      }),
      status: select({
        options: [
          { label: 'Pending', value: 'PENDING' },
          { label: 'Overdue', value: 'OVERDUE' },
          { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
          { label: 'Paid', value: 'PAID' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ],
      }),
      items: relationship({ ref: 'BillItem.bill', many: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  BillItem: list({
    access: allowAll,
    fields: {
      name: text(),
      bill: relationship({ ref: 'Bill.items', many: false }),
      quantity: integer(),
      amount: integer(),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
}
