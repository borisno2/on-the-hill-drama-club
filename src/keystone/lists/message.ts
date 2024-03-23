import { Lists } from '.keystone/types'
import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { relationship, select, text, timestamp } from '@keystone-6/core/fields'
import { messageStatusOptions } from '../../types/selectOptions'
import { inngest } from '../../lib/inngest/client'
import { messageFilter, isAdmin, isLoggedIn } from '../helpers'
import { Session } from 'next-auth'

const Message: Lists.Message<Session> = list({
  db: { map: 'message'},
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
        originalItem.status === 'DRAFT' &&
        context.session
      ) {
        await inngest.send({
          name: 'app/message.queued',
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
    sentAt: timestamp({
      db: { map: 'sentat'},}),
    createdAt: timestamp({
      db: { map: 'crreatedat'},
      defaultValue: { kind: 'now' },
    }),
  },
})

export default Message
