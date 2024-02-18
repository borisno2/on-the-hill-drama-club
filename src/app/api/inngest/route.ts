import { serve } from 'inngest/next'
import { inngest } from 'lib/inngest/client'
import { sendMessageFunction } from 'inngestFunctions/message'
import {
  createBillItemFunction,
  sendEnrolmentConfirmationFunction,
} from 'inngestFunctions/enrolment'
import {
  createXeroCustomerFunction,
  upsertXeroCustomerFunction,
} from 'inngestFunctions/account'
import { createXeroInvoiceFunction } from 'inngestFunctions/bill'
import {
  copyTermFunction,
  copyEnrolmentsFunction,
  completeTermFunction,
} from 'inngestFunctions/lessonTerms'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    sendMessageFunction,
    sendEnrolmentConfirmationFunction,
    createXeroCustomerFunction,
    createXeroInvoiceFunction,
    createBillItemFunction,
    copyTermFunction,
    copyEnrolmentsFunction,
    completeTermFunction,
    upsertXeroCustomerFunction,
  ],
})
