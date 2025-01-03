import { serve } from 'inngest/next'
import { inngest } from 'lib/inngest/client'
import { sendMessageFunction } from 'inngestFunctions/message'
import { sendEnrolmentConfirmationFunction } from 'inngestFunctions/enrolment'
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
    copyTermFunction,
    copyEnrolmentsFunction,
    completeTermFunction,
  ],
})
