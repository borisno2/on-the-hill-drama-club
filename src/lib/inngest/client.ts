import { EventSchemas, Inngest } from 'inngest'
import { Lists } from '.keystone/types'
import { Session } from 'next-auth'

export type BillApprovedEvent = {
  data: {
    item: Lists.Bill.TypeInfo['item']
    session: Session
  }
}

export type SendMessageEvent = {
  data: {
    item: Lists.Message.TypeInfo['item']
    session: Session
  }
}

export type EnrolmentConfirmedEvent = {
  data: {
    item: Lists.Enrolment.TypeInfo['item']
    session: Session
  }
}

export type CreateQuickBooksCustomerEvent = {
  data: {
    item: Lists.Account.TypeInfo['item']
    session: Session
  }
}

export type CopyTermConfirmedEvent = {
  data: {
    item: Lists.Term.TypeInfo['item']
    session: Session
  }
}

export type LessonTermConfirmedEvent = {
  data: {
    item: Lists.LessonTerm.TypeInfo['item']
    session: Session
  }
}

export type TermCompletedEvent = {
  data: {
    item: Lists.Term.TypeInfo['item']
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
  'app/term.completed': TermCompletedEvent
}

export const inngest = new Inngest({
  name: 'Emily Calder ARTS',
  schemas: new EventSchemas().fromRecord<Events>(),
})
