import {
  EnrolmentUpdateInput,
  EnrolmentWhereUniqueInput,
} from '.keystone/types'
import { gql } from '@ts-gql/tag/no-transform'
import Decimal from 'decimal.js'
import { getSessionContext } from 'keystone/context'
import { getQBO } from 'lib/intuit'
import { createCustomer } from 'lib/intuit/customer'
import { createInvoice, sendInvoicePdf } from 'lib/intuit/invoice'
import { NextApiRequest, NextApiResponse } from 'next'
import { QBLineItemCreate } from 'types/qbo'

const GET_ACCOUNTS_FOR_INVOICE = gql`
  query GET_ACCOUNTS_FOR_INVOICE($termId: ID!) {
    accounts(
      where: {
        students: {
          some: {
            enrolments: {
              some: {
                AND: [
                  { lessonTerm: { term: { id: { equals: $termId } } } }
                  { status: { equals: "ENROLED" } }
                ]
              }
            }
          }
        }
      }
    ) {
      id
      name
      qboId
      firstName
      surname
      students(
        where: {
          enrolments: {
            some: { lessonTerm: { term: { id: { equals: $termId } } } }
          }
        }
      ) {
        id
        name
        firstName
        surname
        enrolments(
          where: {
            AND: [
              { lessonTerm: { term: { id: { equals: $termId } } } }
              { status: { equals: "ENROLED" } }
            ]
          }
        ) {
          id
          lessonTerm {
            id
            name
            numberOfLessons
            lesson {
              id
              cost
              lessonCategory {
                id
                qboItemId
              }
            }
          }
        }
      }
      user {
        id
        email
      }
    }
  }
` as import('../../../../__generated__/ts-gql/GET_ACCOUNTS_FOR_INVOICE').type

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const context = await getSessionContext({ req, res })
  // Only admins can generate invoices
  if (!context.session || context.session?.data.role !== 'ADMIN') {
    return res.status(403).send('Not authorized')
  }

  const { method, body } = req
  // Only POST requests are allowed
  if (method !== 'POST') {
    return res.status(405).send('Method not allowed')
  }
  const { termId } = body
  // Make sure the term exists
  const term = await context.sudo().db.Term.findOne({ where: { id: termId } })
  if (!term) {
    return res.status(404).send('Term not found')
  }
  // Get the accounts for the term
  const { accounts } = await context.graphql.run({
    query: GET_ACCOUNTS_FOR_INVOICE,
    variables: { termId },
  })
  if (accounts === null || accounts.length === 0) {
    return res.status(404).send('No accounts found')
  }
  // Get the QBO client
  const qbo = await getQBO({ context })
  if (qbo === null) {
    return res.status(500).send('QBO client not found')
  }
  const errors: { message: string; error: any }[] = []
  // Create the invoices for each account
  const invoicesSent: { accountId: string; qboId: number }[] = []
  for await (const account of accounts) {
    const { qboId, students } = account
    if (students === null || students.length === 0) {
      continue
    }
    let customerId = account.qboId
    if (qboId === null) {
      // create the customer in QBO and update the account
      try {
        const customer = await createCustomer(
          {
            DisplayName: account.name!,
            GivenName: account.firstName!,
            FamilyName: account.surname!,
            PrimaryEmailAddr: {
              Address: account.user?.email!,
            },
          },
          qbo
        )

        if (customer === null) {
          errors.push({
            message: `Customer ${account.name} with id ${account.id} returned null`,
            error: null,
          })
          continue
        }

        customerId = parseInt(customer.Id)

        await context.db.Account.updateOne({
          where: { id: account.id },
          data: {
            qboId: customerId,
            qboSyncToken: parseInt(customer.SyncToken),
          },
        })
      } catch (error) {
        console.error(error)
        errors.push({
          message: `Error creating customer ${account.name} with id ${account.id}`,
          error,
        })
        continue
      }
    }
    if (!customerId) {
      errors.push({
        message: `Customer ${account.name} with id ${account.id} has no QBO id`,
        error: null,
      })
      continue
    }
    const enrolmentUpdates: {
      where: EnrolmentWhereUniqueInput
      data: EnrolmentUpdateInput
    }[] = []
    const lineItems: QBLineItemCreate[] = []
    for await (const student of students) {
      const { enrolments } = student
      if (enrolments === null || enrolments.length === 0) {
        continue
      }
      for await (const enrolment of enrolments) {
        if (enrolment === null || enrolment.lessonTerm === null) {
          continue
        }
        const { lessonTerm } = enrolment
        const { lesson } = lessonTerm
        if (
          lesson === null ||
          lesson.cost === null ||
          lesson.lessonCategory === null ||
          !lesson.lessonCategory.qboItemId ||
          lessonTerm.numberOfLessons === null
        ) {
          errors.push({
            message: `Lesson with id ${lesson?.id} has no cost or category or number of lessons`,
            error: null,
          })
          continue
        }
        lineItems.push({
          Amount: new Decimal(lesson.cost)
            .dividedBy(100)
            .mul(lessonTerm.numberOfLessons)
            .toDecimalPlaces(2),
          DetailType: 'SalesItemLineDetail',
          Description: `${student.name} - ${lessonTerm.name}`,
          SalesItemLineDetail: {
            Qty: new Decimal(lessonTerm.numberOfLessons),
            UnitPrice: new Decimal(lesson.cost)
              .dividedBy(100)
              .toDecimalPlaces(2),
            ItemRef: {
              value: lesson.lessonCategory.qboItemId.toString(),
            },
          },
        })
        enrolmentUpdates.push({
          where: { id: enrolment.id },
          data: { status: 'INVOICED' },
        })
      }
    }
    if (lineItems.length === 0) {
      continue
    }
    const invoice = {
      CustomerRef: {
        value: customerId.toString(),
      },
      Line: lineItems,
    }

    try {
      const newInvoice = await createInvoice(invoice, qbo)
      if (newInvoice === null) {
        errors.push({
          message: `Invoice for account ${account.name} with id ${account.id} returned null`,
          error: null,
        })
        continue
      }
      //const sentInvoice = await sendInvoicePdf(
      //  newInvoice.Id,
      //  account.user?.email!,
      //  qbo
      //)
      //if (sentInvoice === null || !sentInvoice.Id) {
      //  continue
      //}
      invoicesSent.push({
        accountId: account.id,
        qboId: parseInt(newInvoice.Id),
      })
      await context.db.Enrolment.updateMany({ data: enrolmentUpdates })
    } catch (error) {
      console.error(error)
      errors.push({
        message: `Error creating invoice for account ${account.name} with id ${account.id}`,
        error,
      })
      continue
    }
  }
  return res.status(200).json({ invoicesSent, accounts, errors })
}
