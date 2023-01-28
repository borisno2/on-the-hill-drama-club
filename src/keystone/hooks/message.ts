import { ListHooks } from '@keystone-6/core/types'
import { Lists } from '.keystone/types'
import sendEmail from '../../lib/sendEmail'
import { GET_MESSAGE_TO_SEND } from '../../app/(dashboard)/dashboard/notifications/queries'

export const messageAfterOperation: ListHooks<Lists.Message.TypeInfo>['afterOperation'] =
  async ({ originalItem, operation, item, resolvedData, context }) => {
    if (
      operation === 'update' &&
      resolvedData &&
      resolvedData.status === 'QUEUED' &&
      originalItem.status === 'DRAFT'
    ) {
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
        console.log('Missing Data')

        return
      }
      const emailSettings = await context.sudo().db.EmailSettings.findOne({})

      if (
        !emailSettings ||
        !emailSettings.lessonTermMessageTemplate ||
        !emailSettings.fromEmail
      ) {
        console.log('Missing Email Settings')
        return
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
  }
