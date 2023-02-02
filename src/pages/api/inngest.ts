import { createFunction } from 'inngest'
import { serve } from 'inngest/next'
import { messageAfterUpdateOperation } from 'inngestFunctions/message'
import { AfterMessageSaved } from 'types/inngest'

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
