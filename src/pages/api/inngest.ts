import { createQuickBooksInvoiceFunction } from 'inngestFunctions/bill'
import {
  createBillItemFunction,
  sendEnrolmentConfirmationFunction,
} from 'inngestFunctions/enrolment'
import { serve } from 'inngest/next'
import { sendMessageFunction } from 'inngestFunctions/message'
import { createQuickBooksCustomerFunction } from 'inngestFunctions/account'

export default serve('Emily Calder ARTS', [
  sendMessageFunction,
  sendEnrolmentConfirmationFunction,
  createQuickBooksCustomerFunction,
  createQuickBooksInvoiceFunction,
  createBillItemFunction,
])
