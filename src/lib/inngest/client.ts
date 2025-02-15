import { EventSchemas, Inngest, slugify } from 'inngest'
import { Lists } from '.keystone/types'
import { Session } from 'next-auth'

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

export type AccountCreatedEvent = {
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
  'app/account.created': AccountCreatedEvent
  'app/term.completed': TermCompletedEvent
}

export const inngest = new Inngest({
  id: slugify('On the Hll Drama Club'),
  schemas: new EventSchemas().fromRecord<Events>(),
})
