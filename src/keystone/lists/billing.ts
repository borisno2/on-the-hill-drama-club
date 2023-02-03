import { Lists } from '.keystone/types'
import { graphql, list } from '@keystone-6/core'
import { allOperations } from '@keystone-6/core/access'
import {
  calendarDay,
  decimal,
  integer,
  relationship,
  select,
  text,
  timestamp,
  virtual,
} from '@keystone-6/core/fields'
import Decimal from 'decimal.js'
import { billStatusOptions } from '../../types/selectOptions'
import {
  billFilter,
  billItemFilter,
  GET_BILL_ITEMS_TOTAL,
  isAdmin,
  isLoggedIn,
} from '../helpers'

const decimalScale = 2

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
})
