import { createFunction } from 'inngest'
import { serve } from 'inngest/next'
import {
  messageAfterUpdateOperation,
  MessageHook,
} from 'keystone/hooks/message'

type AfterMessageSaved = {
  name: 'app/message.saved'
  data: MessageHook
  user: {
    id: string
  }
}

type Events = {
  'app/message.saved': AfterMessageSaved
}

const myFn = createFunction(
  'My BG Fn',
  'your.event.name',
  async ({ event }) => {
    return 'hello!'
  }
)
const messageAfterOperationFunction = createFunction<AfterMessageSaved>(
  'Message Saved Hook',
  'app/message.saved',
  async ({ event }) => {
    if (!event.data) return
    await messageAfterUpdateOperation(event?.data)
  }
)

export default serve('Emily Calder ARTS', [myFn, messageAfterOperationFunction])
