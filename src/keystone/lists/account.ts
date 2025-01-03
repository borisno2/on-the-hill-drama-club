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
import { inngest } from '../../lib/inngest/client'
import { accountFilter, isAdmin, isLoggedIn } from '../helpers'
import { Session } from 'next-auth'

const Account: Lists.Account<Session> = list({
  access: {
    operation: {
      ...allOperations(isLoggedIn),
      create: isAdmin,
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
        ((operation === 'create' &&
          resolvedData.secondContactName !== 'PLEASE_UPDATE') ||
          (operation === 'update' &&
            resolvedData.secondContactName !== originalItem.secondContactName &&
            originalItem.secondContactName === 'PLEASE_UPDATE')) &&
        context.session &&
        item
      ) {
        await inngest.send({
          name: 'app/account.created',
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
        resolve: async (item) => {
          return `${item.firstName} ${item.surname}`
        },
      }),
    }),
    user: relationship({
      ref: 'User.account',
      many: false,
      access: {
        update: isAdmin,
      },
    }),
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
    students: relationship({
      ref: 'Student.account',
      many: true,
      access: {
        update: isAdmin,
      },
    }),
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
})

export default Account
