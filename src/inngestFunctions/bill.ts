import { Context } from '.keystone/types'
import { keystoneContext } from 'keystone/context'
import { inngest } from 'lib/inngest/client'
import { getXeroClient } from 'lib/xero'

import { graphql } from 'gql'
import Decimal from 'decimal.js'
import { NonRetriableError, slugify } from 'inngest'
import { Invoice, LineAmountTypes, RequestEmpty } from 'xero-node'
import { upsertXeroCustomerFunction } from './account'

const UPDATE_BILL_XERO_ID = graphql(`
  mutation UPDATE_BILL_XERO_ID($id: ID!, $xeroId: String!) {
    updateBill(
      where: { id: $id }
      data: { xeroId: $xeroId, status: "PENDING" }
    ) {
      id
      xeroId
    }
  }
`)

const GET_BILL_BY_ID = graphql(`
  query GET_BILL_BY_ID($id: ID!) {
    bill(where: { id: $id }) {
      id
      name
      xeroId
      items {
        id
        name
        xeroId
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
                xeroAccountCode
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
        xeroId
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
`)

export const createXeroInvoiceFunction = inngest.createFunction(
  {
    id: slugify('Create Xero Invoice Hook'),
    name: 'Create Xero Invoice Hook',
  },
  { event: 'app/bill.approved' },
  async ({ event, step }) => {
    const { item, session } = event.data
    const context: Context = keystoneContext.withSession(session)
    const { xeroClient, xeroTenantId } = await getXeroClient({ context })

    const { bill } = await context.graphql.run({
      query: GET_BILL_BY_ID,
      variables: { id: item.id },
    })

    if (!xeroClient || !xeroTenantId)
      throw new NonRetriableError('Could not get Xero client')
    if (!bill) throw new NonRetriableError('Could not get bill')
    if (!bill.account) throw new NonRetriableError('Could not get bill account')
    if (!bill.account.user) throw new NonRetriableError('Could not get user')
    if (!bill.account.user.email)
      throw new NonRetriableError('Could not get bill email')

    const accountItem = await context.db.Account.findOne({
      where: { id: bill.account.id },
    })
    if (!accountItem) throw new NonRetriableError('Could not get account item')

    const account = await step.invoke('xero/customer.upsert', {
      function: upsertXeroCustomerFunction,
      data: { item: accountItem, session },
    })

    if (!account.xeroId)
      throw new NonRetriableError('Could not get account xeroId')
    if (!bill.items || bill.items.length === 0) {
      throw new NonRetriableError('Bill has no items')
    }
    if (bill.xeroId !== null) {
      return `Bill ${bill.name} already has a Xero invoice with id ${bill.xeroId}`
    } else {
      const invoice = await step.run('xero/create-invoice', async () => {
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 14)
        const dueDateString = dueDate.toISOString().split('T')[0]
        const { body } = await xeroClient.accountingApi.createInvoices(
          xeroTenantId,
          {
            invoices: [
              {
                contact: {
                  contactID: account.xeroId!.toString(),
                },
                status: Invoice.StatusEnum.AUTHORISED,
                dueDate: dueDateString,
                type: Invoice.TypeEnum.ACCREC,
                lineAmountTypes: LineAmountTypes.Inclusive,
                lineItems: bill.items!.map((billItem) => ({
                  unitAmount: new Decimal(billItem.amount!)
                    .dividedBy(100)
                    .toDecimalPlaces(2)
                    .toNumber(),
                  quantity: billItem.quantity || 1,
                  accountCode:
                    billItem.enrolment?.lessonTerm?.lesson?.lessonCategory
                      ?.xeroAccountCode || '200',
                  description:
                    billItem.name ??
                    `${billItem.enrolment?.student?.name} - ${billItem.enrolment?.lessonTerm?.name}`,
                })),
              },
            ],
          },
        )
        if (body.invoices === undefined || body.invoices.length === 0) {
          throw new Error(`Bill ${bill.name} could not be created in Xero`, {
            cause: body,
          })
        } else {
          if (body.invoices[0] === null || !body.invoices[0].invoiceID) {
            throw new Error(`Bill ${bill.name} could not be created in Xero`, {
              cause: body,
            })
          }
          return body.invoices[0]
        }
      })
      await step.run('xero/email-invoice', async () => {
        const requestEmpty: RequestEmpty = {}
        const sentInvoice = await xeroClient.accountingApi.emailInvoice(
          xeroTenantId,
          invoice.invoiceID!,
          requestEmpty,
        )

        if (
          !sentInvoice.response?.status ||
          sentInvoice.response?.status > 299
        ) {
          throw new Error(`Bill ${bill.name} could not be emailed in Xero`, {
            cause: sentInvoice,
          })
        }
      })
      await step.run('app/bill.update', async () => {
        await context.graphql.run({
          query: UPDATE_BILL_XERO_ID,
          variables: { id: bill.id, xeroId: invoice.invoiceID! },
        })
      })
      return `Bill ${bill.name} created in Xero with id ${invoice.invoiceID}`
    }
  },
)
