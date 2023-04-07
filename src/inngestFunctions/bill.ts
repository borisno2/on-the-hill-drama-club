import { createInvoice, sendInvoicePdf } from 'lib/intuit/invoice'
import { Context } from '.keystone/types'
import { keystoneContext } from 'keystone/context'
import { inngest } from 'lib/inngest/client'
import { getQBO } from 'lib/intuit'

import { gql } from '@ts-gql/tag/no-transform'
import Decimal from 'decimal.js'

const UPDATE_BILL_QBO_ID = gql`
  mutation UPDATE_BILL_QBO_ID($id: ID!, $qboId: Int!) {
    updateBill(where: { id: $id }, data: { qboId: $qboId, status: "PENDING" }) {
      id
      qboId
    }
  }
` as import('../../__generated__/ts-gql/UPDATE_BILL_QBO_ID').type

const GET_BILL_BY_ID = gql`
  query GET_BILL_BY_ID($id: ID!) {
    bill(where: { id: $id }) {
      id
      name
      qboId
      items {
        id
        name
        qboId
        amount
        quantity
        enrolment {
          id
          lessonTerm {
            id
            name
          }
          student {
            id
            name
          }
        }
      }
      account {
        id
        qboId
        user {
          id
          email
        }
      }
    }
  }
` as import('../../__generated__/ts-gql/GET_BILL_BY_ID').type

export const createQuickBooksInvoiceFunction = inngest.createFunction(
  'Create QuickBooks Invoice Hook',
  'app/bill.approved',
  async ({ event }) => {
    const { item, session } = event.data
    const context: Context = keystoneContext.withSession(session)
    const qbo = await getQBO({ context }).catch((error) => {
      throw new Error('Error getting QBO', { cause: error })
    })
    const { bill } = await context.graphql
      .run({
        query: GET_BILL_BY_ID,
        variables: { id: item.id },
      })
      .catch((error) => {
        throw new Error('Error getting bill', { cause: error })
      })
    if (!qbo) throw new Error('Could not get QBO client')
    if (!bill) throw new Error('Could not get bill')
    if (!bill.account) throw new Error('Could not get bill account')
    if (!bill.account.qboId) throw new Error('Account does not have a QBO id')
    // TODO: create the Account if it doesn't exist
    if (!bill.account.user?.email) throw new Error('Could not get bill email')
    if (!bill.items || bill.items.length === 0)
      throw new Error('Bill has no items')
    if (bill.qboId !== null) {
      return `Bill ${bill.name} already has a QB invoice with id ${bill.qboId}`
    } else {
      // create the invoice in QBO and update the bill
      try {
        const invoice = await createInvoice(
          {
            CustomerRef: {
              value: bill.account.qboId!.toString(),
            },
            Line: bill.items.map((item) => ({
              Amount: new Decimal(item.amount!)
                .dividedBy(100)
                .mul(item.quantity!)
                .toDecimalPlaces(2),
              DetailType: 'SalesItemLineDetail',
              Description: `${item.enrolment?.student?.name} - ${item.enrolment?.lessonTerm?.name}`,
              SalesItemLineDetail: {
                Qty: new Decimal(item.quantity!),
                UnitPrice: new Decimal(item.amount!)
                  .dividedBy(100)
                  .toDecimalPlaces(2),
                ItemRef: {
                  value: item.qboId!.toString(),
                },
              },
            })),
          },
          qbo
        )

        if (invoice === null) {
          throw new Error(`Bill ${bill.name} could not be created in QBO`, {
            cause: invoice,
          })
        } else {
          const sentInvoice = await sendInvoicePdf(
            invoice.Id,
            bill.account.user?.email!,
            qbo
          )
          if (sentInvoice === null || !sentInvoice.Id) {
            throw new Error(`Bill ${bill.name} could not be created in QBO`, {
              cause: sentInvoice,
            })
          }
          await context.graphql.run({
            query: UPDATE_BILL_QBO_ID,
            variables: { id: bill.id, qboId: parseInt(invoice.Id) },
          })
          return `Bill ${bill.name} created in QBO with id ${invoice.Id}`
        }
      } catch (error) {
        throw new Error('Error creating invoice', { cause: error })
      }
    }
  }
)
