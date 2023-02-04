import { Lists } from '.keystone/types'
import { list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import { relationship, select, text, timestamp } from '@keystone-6/core/fields'
import { Inngest } from 'inngest'
import { messageStatusOptions } from '../../types/selectOptions'
import { Events } from '../../types/inngest'
import { messageFilter, isAdmin, isLoggedIn } from '../helpers'

const Message: Lists.Message = list({
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
    sentAt: timestamp(),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
})

export default Message
