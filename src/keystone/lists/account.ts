import { Lists } from '.keystone/types'
import { graphql, list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import {
  relationship,
  virtual,
  timestamp,
  text,
  integer,
} from '@keystone-6/core/fields'
import { Inngest } from 'inngest'
import { Events } from '../../types/inngest'
import { accountFilter, isAdmin, isLoggedIn } from '../helpers'

const Account: Lists.Account = list({
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
  hooks: {
    afterOperation: async ({
      operation,
      resolvedData,
      originalItem,
      item,
      context,
    }) => {
      if (
        (operation === 'create' &&
          resolvedData.secondContactName !== 'PLEASE_UPDATE') ||
        (operation === 'update' &&
          resolvedData.secondContactName !== originalItem.secondContactName &&
          originalItem.secondContactName === 'PLEASE_UPDATE')
      ) {
        const inngest = new Inngest<Events>({ name: 'Emily Calder ARTS' })
        await inngest.send({
          name: 'app/account.created',
          data: {
            item,
          },
        })
      }
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
})

export default Account
