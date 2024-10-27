import { Context } from '.keystone/types'
import sendEmail from 'lib/sendEmail'
import { GET_MESSAGE_TO_SEND } from 'app/dashboard/notifications/queries'
import { keystoneContext } from 'keystone/context'
import { inngest } from 'lib/inngest/client'
import { NonRetriableError, slugify } from 'inngest'

export const sendMessageFunction = inngest.createFunction(
  { id: slugify('Message Saved Hook'), name: 'Message Saved Hook' },
  { event: 'app/message.queued' },
  async ({ event }) => {
    const { item, session } = event.data
    try {
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
        throw new NonRetriableError('Missing Data', { cause: message })
      }
      if (message.status !== 'QUEUED') {
        throw new NonRetriableError('Message is not in the correct state', {
          cause: message,
        })
      }
      const emailSettings = await context.sudo().db.EmailSettings.findOne({})

      if (
        !emailSettings ||
        !emailSettings.lessonTermMessageTemplate ||
        !emailSettings.fromEmail
      ) {
        throw new NonRetriableError('Missing Email Settings', {
          cause: emailSettings,
        })
      }
      const dynamicData = {
        subject: message.name,
        content: message.content,
      }
      // Get all the email addresses for the users
      const emailAddressesSet = new Set<string>()
      message.lessonTerms.forEach((lessonTerm) => {
        if (lessonTerm.enrolments) {
          lessonTerm.enrolments.forEach((enrolment) => {
            if (enrolment.student?.account?.user?.email)
              emailAddressesSet.add(enrolment.student.account.user.email)
          })
        }
      })
      const emailAddresses = Array.from(emailAddressesSet)
      // Send the email
      const emailData = {
        to: emailAddresses,
        templateId: emailSettings.lessonTermMessageTemplate,
        dynamicTemplateData: dynamicData,
        isMultiple: true,
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
    } catch (error) {
      await keystoneContext.sudo().db.Message.updateOne({
        where: { id: item.id },
        data: {
          status: 'FAILED',
          sentAt: new Date().toISOString(),
        },
      })
      throw new NonRetriableError('Error sending email', { cause: error })
    }
  },
)
