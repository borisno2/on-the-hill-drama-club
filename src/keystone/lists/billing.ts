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
import Decimal from 'decimal.js'
import { inngest } from 'lib/inngest/client'
import { billStatusOptions } from '../../types/selectOptions'
import {
  billFilter,
  billItemFilter,
  GET_BILL_ITEMS_TOTAL,
  isAdmin,
  isLoggedIn,
} from '../helpers'

export const Bill: Lists.Bill = list({
  access: {
    operation: {
      ...allOperations(isAdmin),
      query: isLoggedIn,
    },
    filter: {
      query: billFilter,
    },
  },
  hooks: {
    afterOperation: async ({ operation, item, resolvedData, context }) => {
      if (
        operation === 'update' &&
        resolvedData.status === 'APPROVED' &&
        item.status === 'DRAFT'
      ) {
        await inngest.send({
          name: 'app/bill.approved',
          data: {
            item,
            session: context.session,
          },
        })
      }
    },
  },
  fields: {
    name: text(),
    account: relationship({ ref: 'Account.bills', many: false }),
    date: calendarDay(),
    dueDate: calendarDay(),
    total: virtual({
      ui: {
        description: 'Total of all bill items in Dollars',
      },
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
              (acc, billItem) => acc.add(billItem.total),
              new Decimal(0)
            )
          }
          val.scaleToPrint = 2
          return val
        },
      }),
    }),
    status: select({
      validation: { isRequired: true },
      options: billStatusOptions,
    }),
    term: relationship({ ref: 'Term', many: false }),
    items: relationship({ ref: 'BillItem.bill', many: true }),
    qboSyncToken: integer(),
    qboId: integer(),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
})

export const BillItem: Lists.BillItem = list({
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
    quantity: integer({ validation: { isRequired: true }, defaultValue: 1 }),
    amount: integer({
      validation: { isRequired: true },
      ui: { description: 'Amount in Cents' },
    }),
    total: virtual({
      ui: {
        description: 'Total Dollars',
      },
      field: graphql.field({
        type: graphql.nonNull(graphql.Decimal),
        resolve: (item) => {
          let val: Decimal & { scaleToPrint?: number } = new Decimal(0.0)
          if (item.amount && item.quantity)
            val = new Decimal(item.amount).mul(item.quantity).dividedBy(100)
          val.scaleToPrint = 2
          return val
        },
      }),
    }),
    enrolment: relationship({ ref: 'Enrolment.billItem', many: false }),
    qboSyncToken: integer(),
    qboId: integer(),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
})
