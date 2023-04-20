import { Inngest } from 'inngest'
import { Lists } from '.keystone/types'
import { Session } from 'next-auth'

export type BillApprovedEvent = {
  name: 'app/bill.approved'
  data: {
    item: Lists.Bill.TypeInfo['item']
    session: Session
  }
}

export type SendMessageEvent = {
  name: 'app/message.queued'
  data: {
    item: Lists.Message.TypeInfo['item']
    session: Session
  }
}

export type EnrolmentConfirmedEvent = {
  name: 'app/enrolment.enroled'
  data: {
    item: Lists.Enrolment.TypeInfo['item']
    session: Session
  }
}

export type CreateQuickBooksCustomerEvent = {
  name: 'app/account.created'
  data: {
    item: Lists.Account.TypeInfo['item']
    session: Session
  }
}

export type CopyTermConfirmedEvent = {
  name: 'app/copyterm.confirmed'
  data: {
    item: Lists.Term.TypeInfo['item']
    session: Session
  }
}

export type LessonTermConfirmedEvent = {
  name: 'app/lessonTerm.confirmed'
  data: {
    item: Lists.LessonTerm.TypeInfo['item']
    session: Session
  }
}

export type Events = {
  'app/lessonTerm.confirmed': LessonTermConfirmedEvent
  'app/copyterm.confirmed': CopyTermConfirmedEvent
  'app/message.queued': SendMessageEvent
  'app/enrolment.enroled': EnrolmentConfirmedEvent
  'app/account.created': CreateQuickBooksCustomerEvent
  'app/bill.approved': BillApprovedEvent
}

export const inngest = new Inngest<Events>({ name: 'Emily Calder ARTS' })
