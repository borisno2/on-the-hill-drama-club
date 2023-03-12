import { Context } from '.keystone/types'
import sendEmail from 'lib/sendEmail'
import { GET_MESSAGE_TO_SEND } from 'app/dashboard/notifications/queries'
import { keystoneContext } from 'keystone/context'
import { inngest, SendMessageHook } from 'lib/inngest/client'

export const sendMessageFunction = inngest.createFunction(
  'Message Saved Hook',
  'app/message.queued',
  async ({ event }) => {
    await sendMessage(event?.data)
  }
)

const sendMessage = async ({ item, session }: SendMessageHook) => {
  const context: Context = keystoneContext.withSession(session)

  const { message } = await context.graphql.run({
    query: GET_MESSAGE_TO_SEND,
    variables: { id: item.id },
  })

  if (
    !message ||
    !message.lessonTerms ||
    message.lessonTerms.length === 0 ||
    !message.content ||
    !process.env.SENDGRID_API_KEY
  ) {
    throw new Error('Missing Data', { cause: message })
  }
  const emailSettings = await context.sudo().db.EmailSettings.findOne({})

  if (
    !emailSettings ||
    !emailSettings.lessonTermMessageTemplate ||
    !emailSettings.fromEmail
  ) {
    throw new Error('Missing Email Settings', { cause: emailSettings })
  }
  const dynamicData = {
    subject: message.name,
    content: message.content,
  }
  // Get all the email addresses for the users
  const emailAddresses: string[] = message.lessonTerms
    .map((term) => {
      if (!term.enrolments) {
        return []
      }
      return term.enrolments.map((enrolment) => {
        if (
          !enrolment.student ||
          !enrolment.student.account ||
          !enrolment.student.account.user ||
          !enrolment.student.account.user.email
        ) {
          return ''
        }
        return enrolment.student.account.user.email
      })
    })
    .flat()
    .filter((email) => email !== '')
    // Remove duplicates
    .filter((email, index, self) => self.indexOf(email) === index)
  // Send the email
  const emailData = {
    to: emailAddresses,
    templateId: emailSettings.lessonTermMessageTemplate,
    dynamicTemplateData: dynamicData,
    from: {
      email: emailSettings.fromEmail,
    },
  }
  console.log('Sending Email')
  await sendEmail(emailData)
  await context.sudo().db.Message.updateOne({
    where: { id: item.id },
    data: {
      status: 'SENT',
      sentAt: new Date().toISOString(),
    },
  })
}
