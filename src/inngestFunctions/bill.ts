import { Context } from '.keystone/types'
import { keystoneContext } from 'keystone/context'
import { inngest } from 'lib/inngest/client'
import { getXeroClient } from 'lib/xero'

import { gql } from '@ts-gql/tag/no-transform'
import Decimal from 'decimal.js'
import { slugify } from 'inngest'
import { Invoice, LineAmountTypes, RequestEmpty } from 'xero-node'

const UPDATE_BILL_XERO_ID = gql`
  mutation UPDATE_BILL_XERO_ID($id: ID!, $xeroId: String!) {
    updateBill(
      where: { id: $id }
      data: { xeroId: $xeroId, status: "PENDING" }
    ) {
      id
      xeroId
    }
  }
` as import('../../__generated__/ts-gql/UPDATE_BILL_XERO_ID').type

const GET_BILL_BY_ID = gql`
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
` as import('../../__generated__/ts-gql/GET_BILL_BY_ID').type

export const createXeroInvoiceFunction = inngest.createFunction(
  {
    id: slugify('Create Xero Invoice Hook'),
    name: 'Create Xero Invoice Hook',
  },
  { event: 'app/bill.approved' },
  async ({ event }) => {
    const { item, session } = event.data
    const context: Context = keystoneContext.withSession(session)
    const { xeroClient, xeroTenantId } = await getXeroClient({ context })

    const { bill } = await context.graphql.run({
      query: GET_BILL_BY_ID,
      variables: { id: item.id },
    })

    if (!xeroClient || !xeroTenantId)
      throw new Error('Could not get Xero client')
    if (!bill) throw new Error('Could not get bill')
    if (!bill.account) throw new Error('Could not get bill account')
    if (!bill.account.user) throw new Error('Could not get user')
    if (!bill.account.user.email) throw new Error('Could not get bill email')
    let { xeroId } = bill.account
    if (!xeroId) {
      try {
        const { body: contacts } = await xeroClient.accountingApi.getContacts(
          xeroTenantId,
          undefined,
          'Name="' + bill.account.name + '"',
        )
        if (contacts && contacts.contacts && contacts.contacts.length > 0) {
          xeroId = contacts.contacts[0].contactID!
          await context.db.Account.updateOne({
            where: { id: bill.account.id },
            data: {
              xeroId: contacts.contacts[0].contactID!,
            },
          })
        } else {
          const { body } = await xeroClient.accountingApi.createContacts(
            xeroTenantId,
            {
              contacts: [
                {
                  name: bill.account.name!,
                  firstName: bill.account.firstName!,
                  lastName: bill.account.surname!,
                  emailAddress: bill.account.user.email,
                },
              ],
            },
          )
          if (!body.contacts || body.contacts.length === 0) {
            throw new Error('Error creating customer', {
              cause: 'Create customer returned null',
            })
          }

          const customer = body.contacts[0]
          if (customer === null) {
            throw new Error('Error creating customer', {
              cause: 'Create customer returned null',
            })
          }

          await context.db.Account.updateOne({
            where: { id: bill.account.id },
            data: {
              xeroId: customer.contactID,
            },
          })

          xeroId = customer.contactID!
        }
      } catch (error) {
        throw new Error('Error creating customer', { cause: error })
      }
    }
    if (!bill.items || bill.items.length === 0) {
      throw new Error('Bill has no items')
    }
    if (bill.xeroId !== null) {
      return `Bill ${bill.name} already has a Xero invoice with id ${bill.xeroId}`
    } else {
      // create the invoice in Xero and update the bill
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14)
      const dueDateString = dueDate.toISOString().split('T')[0]
      const { body } = await xeroClient.accountingApi.createInvoices(
        xeroTenantId,
        {
          invoices: [
            {
              contact: {
                contactID: xeroId.toString(),
              },
              status: Invoice.StatusEnum.AUTHORISED,
              dueDate: dueDateString,
              type: Invoice.TypeEnum.ACCREC,
              lineAmountTypes: LineAmountTypes.Inclusive,
              lineItems: bill.items.map((billItem) => ({
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
        const invoice = body.invoices[0]
        if (invoice === null || !invoice.invoiceID) {
          throw new Error(`Bill ${bill.name} could not be created in Xero`, {
            cause: body,
          })
        }

        const requestEmpty: RequestEmpty = {}
        const sentInvoice = await xeroClient.accountingApi.emailInvoice(
          xeroTenantId,
          invoice.invoiceID!,
          requestEmpty,
        )

        if (
          !sentInvoice.response?.statusCode ||
          sentInvoice.response?.statusCode > 299
        ) {
          throw new Error(`Bill ${bill.name} could not be emailed in Xero`, {
            cause: sentInvoice,
          })
        }
        await context.graphql.run({
          query: UPDATE_BILL_XERO_ID,
          variables: { id: bill.id, xeroId: invoice.invoiceID },
        })
        return `Bill ${bill.name} created in Xero with id ${invoice.invoiceID}`
      }
    }
  },
)
