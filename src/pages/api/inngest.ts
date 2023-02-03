import { sendEnrolmentConfirmationFunction } from './../../inngestFunctions/enrolment'
import { serve } from 'inngest/next'
import { sendMessageFunction } from 'inngestFunctions/message'

export default serve('Emily Calder ARTS', [
  sendMessageFunction,
  sendEnrolmentConfirmationFunction,
])
