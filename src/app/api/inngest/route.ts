import { serve } from 'inngest/next'
import { inngest } from 'lib/inngest/client'
import { sendMessageFunction } from 'inngestFunctions/message'
import {
  createBillItemFunction,
  sendEnrolmentConfirmationFunction,
} from 'inngestFunctions/enrolment'
import { createQuickBooksCustomerFunction } from 'inngestFunctions/account'
import { createQuickBooksInvoiceFunction } from 'inngestFunctions/bill'
import {
  copyTermFunction,
  copyEnrolmentsFunction,
} from 'inngestFunctions/lessonTerms'

export const { GET, POST, PUT } = serve(inngest, [
  sendMessageFunction,
  sendEnrolmentConfirmationFunction,
  createQuickBooksCustomerFunction,
  createQuickBooksInvoiceFunction,
  createBillItemFunction,
  copyTermFunction,
  copyEnrolmentsFunction,
])
