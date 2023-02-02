import { Lists, Context } from '.keystone/types'
export type MessageHook = {
  item: Lists.Message.TypeInfo['item']
  session: Context['session']
}

export type AfterMessageSaved = {
  name: 'app/message.saved'
  data: MessageHook
}

export type Events = {
  'app/message.saved': AfterMessageSaved
}
