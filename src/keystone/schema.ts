import {
  dayOptions,
  lessonTypeOptions,
  lessonStatusOptions,
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
  checkbox,
} from '@keystone-6/core/fields'
import type { Lists, Context } from '.keystone/types'
import { isAdmin, isLoggedIn, userFilter } from './helpers'
import Account from './lists/account'
import Message from './lists/message'
import Student from './lists/student'
import { inngest } from '../lib/inngest/client'
import { Session } from 'next-auth'
import { image } from '../components/keystone/image'

export const lists: Lists<Session> = {
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
          resolve: async (item, args, _context) => {
            const context = _context as Context<Session>
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
      account: relationship({
        ref: 'Account.user',
        many: false,
      }),
      role: text({ defaultValue: 'ACCOUNT' }),
    },
  }),

  Account,

  Student,

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
    hooks: {
      afterOperation: async ({ operation, context, originalItem, item }) => {
        if (
          operation === 'update' &&
          item.copyFromId &&
          item.termStatus === 'ENROL' &&
          (originalItem.termStatus === 'DRAFT' ||
            originalItem.termStatus === 'UPCOMING') &&
          context.session
        ) {
          await inngest.send({
            name: 'app/copyterm.confirmed',
            data: {
              item,
              session: context.session,
            },
          })
        }
        if (
          operation === 'update' &&
          item.termStatus === 'PREVIOUS' &&
          originalItem.termStatus === 'ENROL' &&
          context.session
        ) {
          await inngest.send({
            name: 'app/term.completed',
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
      quantity: integer({ validation: { isRequired: true } }),
      year: integer({ validation: { isRequired: true } }),
      startDate: calendarDay({ validation: { isRequired: true } }),
      endDate: calendarDay({ validation: { isRequired: true } }),
      lessonTerms: relationship({ ref: 'LessonTerm.term', many: true }),
      termStatus: select({
        options: lessonStatusOptions,
      }),
      copyFrom: relationship({
        ref: 'Term',
        many: false,
        label: 'Copy Enrolments from Term',
        db: {
          extendPrismaSchema: (schema) =>
            schema.replace(
              '[id])',
              '[id], onDelete: NoAction, onUpdate: NoAction)',
            ),
        },
        ui: {
          description:
            'Enrolments from this term will be copied to current term',
        },
      }),
    },
  }),

  LessonTerm: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: allowAll,
      },
    },
    hooks: {
      afterOperation: async ({ operation, context, originalItem, item }) => {
        if (
          operation === 'update' &&
          item.status === 'ENROL' &&
          (originalItem.status === 'DRAFT' ||
            originalItem.status === 'UPCOMING') &&
          context.session
        ) {
          await inngest.send({
            name: 'app/lessonTerm.confirmed',
            data: {
              item,
              session: context.session,
            },
          })
        }
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
      teachers: relationship({ ref: 'Teacher.lessons', many: true }),
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

  Teacher: list({
    access: {
      operation: {
        ...allOperations(isAdmin),
        query: allowAll,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      bio: text({
        ui: { displayMode: 'textarea' },
        db: {
          nativeType: 'Text',
          isNullable: true,
        },
      }),
      position: text({ validation: { isRequired: true } }),
      image: image({}),
      lessons: relationship({
        ref: 'Lesson.teachers',
        many: true,
      }),
    },
  }),
  Enrolment,
  Message,
}
