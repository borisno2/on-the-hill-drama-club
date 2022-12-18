import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  calendarDay,
  integer,
} from '@keystone-6/core/fields'
import { document } from '@keystone-6/fields-document'
import type { Lists } from '.keystone/types'

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
    },
  }),

  Student: list({
    access: allowAll,
    fields: {
      name: text(),
      dateOfBirth: calendarDay(),
      account: relationship({ ref: 'Account.students', many: false }),
    },
  }),

  Class: list({
    access: allowAll,
    fields: {
      name: text(),
      time: text(),
      minimumAge: integer(),
      maximumAge: integer(),
      cost: integer(),
      quantity: integer(),
      startDate: calendarDay(),
      endDate: calendarDay(),
      frequency: text(),
      location: text(),
    },
  }),

  Enrolment: list({
    access: allowAll,
    fields: {
      class: relationship({ ref: 'Class', many: false }),
      student: relationship({ ref: 'Student', many: false }),
    },
  }),

  Bill: list({
    access: allowAll,
    fields: {
      name: text(),
      account: relationship({ ref: 'Account.bills', many: false }),
      date: calendarDay(),
      dueDate: calendarDay(),
      amount: integer(),
      status: text(),
      items: relationship({ ref: 'BillItem.bill', many: true }),
    },
  }),

  BillItem: list({
    access: allowAll,
    fields: {
      name: text(),
      bill: relationship({ ref: 'Bill.items', many: false }),
    },
  }),
}
