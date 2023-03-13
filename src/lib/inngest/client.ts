import { Inngest } from 'inngest'
import { Lists } from '.keystone/types'
import { Session } from 'next-auth'

export type BillApprovedHook = {
  item: Lists.Bill.TypeInfo['item']
  session: Session
}

export type SendMessageHook = {
  item: Lists.Message.TypeInfo['item']
  session: Session
}

export type EnrolmentConfirmationHook = {
  item: Lists.Enrolment.TypeInfo['item']
  session: Session
}

export type AccountCreatedHook = {
  item: Lists.Account.TypeInfo['item']
  session: Session
}

export type BillApprovedEvent = {
  name: 'app/bill.approved'
  data: BillApprovedHook
}

export type SendMessageEvent = {
  name: 'app/message.queued'
  data: SendMessageHook
}

export type SendEnrolmentConfirmationEvent = {
  name: 'app/enrolment.enroled'
  data: EnrolmentConfirmationHook
}

export type CreateQuickBooksCustomerEvent = {
  name: 'app/account.created'
  data: AccountCreatedHook
}

export type Events = {
  'app/message.queued': SendMessageEvent
  'app/enrolment.enroled': SendEnrolmentConfirmationEvent
  'app/account.created': CreateQuickBooksCustomerEvent
  'app/bill.approved': BillApprovedEvent
}

export const inngest = new Inngest<Events>({ name: 'Emily Calder ARTS' })
