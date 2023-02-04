import { Lists, Context } from '.keystone/types'
export type SendMessageHook = {
  item: Lists.Message.TypeInfo['item']
  session: Context['session']
}

export type EnrolmentConfirmationHook = {
  item: Lists.Enrolment.TypeInfo['item']
  session: Context['session']
}

export type AccountCreatedHook = {
  item: Lists.Account.TypeInfo['item']
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
}
