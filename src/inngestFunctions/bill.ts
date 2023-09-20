import { createInvoice, sendInvoicePdf } from 'lib/intuit/invoice'
import { Context } from '.keystone/types'
import { keystoneContext } from 'keystone/context'
import { inngest } from 'lib/inngest/client'
import { getQBO } from 'lib/intuit'

import { gql } from '@ts-gql/tag/no-transform'
import Decimal from 'decimal.js'
import { createCustomer } from 'lib/intuit/customer'

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
            lesson {
              id
              lessonCategory {
                id
                qboItemId
              }
            }
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
        name
        firstName
        surname
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
    const qbo = await getQBO({ context })

    const { bill } = await context.graphql.run({
      query: GET_BILL_BY_ID,
      variables: { id: item.id },
    })

    if (!qbo) throw new Error('Could not get QBO client')
    if (!bill) throw new Error('Could not get bill')
    if (!bill.account) throw new Error('Could not get bill account')
    if (!bill.account.user) throw new Error('Could not get user')
    if (!bill.account.user.email) throw new Error('Could not get bill email')
    let { qboId } = bill.account
    if (!qboId) {
      try {
        const customer = await createCustomer(
          {
            DisplayName: bill.account.name!,
            GivenName: bill.account.firstName!,
            FamilyName: bill.account.surname!,
            PrimaryEmailAddr: {
              Address: bill.account.user.email,
            },
          },
          qbo
        )

        if (customer === null) {
          throw new Error('Error creating customer', {
            cause: 'Create customer returned null',
          })
        }

        await context.db.Account.updateOne({
          where: { id: bill.account.id },
          data: {
            qboId: parseInt(customer.Id),
            qboSyncToken: parseInt(customer.SyncToken),
          },
        })
        qboId = parseInt(customer.Id)
      } catch (error) {
        throw new Error('Error creating customer', { cause: error })
      }
    }
    if (!bill.items || bill.items.length === 0) {
      throw new Error('Bill has no items')
    }
    if (bill.qboId !== null) {
      return `Bill ${bill.name} already has a QB invoice with id ${bill.qboId}`
    } else {
      // create the invoice in QBO and update the bill
      const invoice = await createInvoice(
        {
          CustomerRef: {
            value: qboId.toString(),
          },
          Line: bill.items.map((billItem) => ({
            Amount: new Decimal(billItem.amount!)
              .dividedBy(100)
              .mul(billItem.quantity!)
              .toDecimalPlaces(2),
            DetailType: 'SalesItemLineDetail',
            Description:
              billItem.name ??
              `${billItem.enrolment?.student?.name} - ${billItem.enrolment?.lessonTerm?.name}`,
            SalesItemLineDetail: {
              Qty: new Decimal(billItem.quantity!),
              UnitPrice: new Decimal(billItem.amount!)
                .dividedBy(100)
                .toDecimalPlaces(2),
              ItemRef: {
                value:
                  billItem.enrolment?.lessonTerm?.lesson?.lessonCategory?.qboItemId?.toString() ||
                  '1',
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
    }
  }
)
