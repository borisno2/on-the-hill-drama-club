import {
  schoolOptions,
  dayOptions,
  lessonTypeOptions,
  lessonStatusOptions,
  billStatusOptions,
  messageStatusOptions,
} from '../types/selectOptions'
import { graphql, list } from '@keystone-6/core'
import Enrolment from './lists/enrolment'
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
import type { Lists, Context } from '.keystone/types'
import {
  accountFilter,
  billFilter,
  billItemFilter,
  GET_BILL_ITEMS_TOTAL,
  isAdmin,
  isLoggedIn,
  messageFilter,
  studentFilter,
  userFilter,
} from './helpers'
import { Decimal } from 'decimal.js'
import { Inngest } from 'inngest'
import { Events } from 'types/inngest'

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
      qboSyncToken: integer(),
      qboId: integer(),
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

  LessonCategory: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: allowAll,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      cost: text({
        ui: { description: 'Cost per lesson - to show on website' },
      }),
      type: select({
        validation: { isRequired: true },
        options: lessonTypeOptions,
      }),
      length: text({
        ui: { description: 'Length of lesson - to show on website' },
      }),
      description: text({
        ui: { displayMode: 'textarea' },
        db: {
          nativeType: 'Text',
          isNullable: true,
        },
      }),
      qboItemId: integer(),
      lessons: relationship({ ref: 'Lesson.lessonCategory', many: true }),
    },
  }),

  ImportantDate: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: allowAll,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      date: calendarDay({ validation: { isRequired: true } }),
      brief: text({ validation: { isRequired: true } }),
      description: text({
        ui: { displayMode: 'textarea' },
        db: {
          nativeType: 'Text',
          isNullable: true,
        },
      }),
    },
  }),

  Term: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: allowAll,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      quantity: integer({ validation: { isRequired: true } }),
      year: integer({ validation: { isRequired: true } }),
      startDate: calendarDay({ validation: { isRequired: true } }),
      endDate: calendarDay({ validation: { isRequired: true } }),
      lessonTerms: relationship({ ref: 'LessonTerm.term', many: true }),
    },
  }),

  LessonTerm: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: allowAll,
      },
    },
    fields: {
      name: virtual({
        field: graphql.field({
          type: graphql.String,
          resolve: async (item, args, context) => {
            const lessonTerm = await context.query.LessonTerm.findOne({
              where: { id: item.id },
              query: 'term { id name }, lesson { id name }',
            })
            return `${lessonTerm.lesson.name} - ${lessonTerm.term.name}`
          },
        }),
      }),
      status: select({
        validation: { isRequired: true },
        options: lessonStatusOptions,
      }),
      term: relationship({ ref: 'Term.lessonTerms', many: false }),
      lesson: relationship({ ref: 'Lesson.lessonTerms', many: false }),
      enrolments: relationship({ ref: 'Enrolment.lessonTerm', many: true }),
      messages: relationship({ ref: 'Message.lessonTerms', many: true }),
      numberOfLessons: integer({
        validation: { isRequired: true },
        defaultValue: 0,
        ui: {
          description: 'Number of lessons in this term',
        },
      }),
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
      lessonCategory: relationship({
        ref: 'LessonCategory.lessons',
        many: false,
      }),
      description: text({
        ui: { displayMode: 'textarea' },
        db: {
          nativeType: 'Text',
          isNullable: true,
        },
      }),
      cost: integer({
        validation: { isRequired: true },
        ui: {
          description: 'Cost per lesson in cents - to be used for billing',
        },
      }),
      time: text({ validation: { isRequired: true } }),
      lengthMin: integer({
        validation: { isRequired: true },
        ui: {
          description: 'Length of lesson in minutes - to show on timetable',
        },
      }),
      day: select({
        validation: { isRequired: true },
        options: dayOptions,
      }),
      minYear: integer({ validation: { isRequired: true } }),
      maxYear: integer({ validation: { isRequired: true } }),
      location: text({ validation: { isRequired: true } }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      lessonTerms: relationship({ ref: 'LessonTerm.lesson', many: true }),
    },
  }),
  EmailSettings: list({
    access: isAdmin,
    isSingleton: true,
    graphql: {
      plural: 'ManyEmailSettings',
    },
    fields: {
      fromEmail: text({ validation: { isRequired: true } }),
      enrolmentConfirmationTemplate: text({
        validation: { isRequired: true },
      }),
      lessonTermMessageTemplate: text(),
    },
  }),

  QuickBooksSettings: list({
    access: isAdmin,
    isSingleton: true,
    graphql: {
      plural: 'ManyQuickBooksSettings',
    },
    fields: {
      realmId: text({ validation: { isRequired: true } }),
      accessToken: text({
        ui: { displayMode: 'textarea' },
        db: {
          nativeType: 'Text',
          isNullable: true,
        },
        validation: { isRequired: true },
      }),
      refreshToken: text({ validation: { isRequired: true } }),
    },
  }),
  Enrolment,
  Message: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: isLoggedIn,
      },
      filter: {
        query: messageFilter,
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
          resolvedData.status === 'QUEUED' &&
          originalItem.status === 'DRAFT'
        ) {
          const inngest = new Inngest<Events>({ name: 'Emily Calder ARTS' })
          await inngest.send({
            name: 'app/message.saved',
            data: {
              item,
              session: context.session,
            },
          })
        }
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      status: select({
        validation: { isRequired: true },
        defaultValue: 'DRAFT',
        options: messageStatusOptions,
      }),
      content: text({
        validation: { isRequired: true },
        ui: { displayMode: 'textarea' },
        db: {
          nativeType: 'Text',
          isNullable: true,
        },
      }),
      lessonTerms: relationship({ ref: 'LessonTerm.messages', many: true }),
      sentAt: timestamp(),
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
