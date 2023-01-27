import { ListHooks } from '@keystone-6/core/types'
import { Lists } from '.keystone/types'
import sendEmail from '../../lib/sendEmail'
import { GET_ENROLMENT_BY_ID } from '../../app/(dashboard)/dashboard/students/queries'
import { formatDate } from '../../lib/formatDate'
import labelHelper from '../../lib/labelHelper'
import { dayOptions } from '../../types/selectOptions'

export const enrolAfterOperation: ListHooks<Lists.Enrolment.TypeInfo>['afterOperation'] =
  async ({ originalItem, operation, item, resolvedData, context }) => {
    if (
      operation === 'update' &&
      resolvedData &&
      resolvedData.status === 'ENROLED' &&
      originalItem.status === 'PENDING'
    ) {
      const { enrolment } = await context.graphql.run({
        query: GET_ENROLMENT_BY_ID,
        variables: { id: item.id },
      })

      if (
        !enrolment ||
        !enrolment.student ||
        !enrolment.student.account ||
        !enrolment.lessonTerm ||
        !enrolment.lessonTerm.lesson ||
        !enrolment.lessonTerm.term ||
        !enrolment.lessonTerm.lesson.day ||
        !enrolment.student.account.user ||
        !enrolment.student.account.user.email ||
        !process.env.SENDGRID_API_KEY
      ) {
        console.log('Missing Data')

        return
      }
      const emailSettings = await context.sudo().db.EmailSettings.findOne({})

      if (
        !emailSettings ||
        !emailSettings.enrolmentConfirmationTemplate ||
        !emailSettings.fromEmail
      ) {
        console.log('Missing Email Settings')
        return
      }
      const dynamicData = {
        firstName: enrolment.student.account.firstName,
        studentFirstName: enrolment.student.firstName,
        lessonName: enrolment.lessonTerm.lesson.name,
        termName: enrolment.lessonTerm.term.name,
        startDate: formatDate(enrolment.lessonTerm.term.startDate),
        weekDay: labelHelper(dayOptions, enrolment.lessonTerm.lesson.day),
        startTime: enrolment.lessonTerm.lesson.time,
      }
      const emailData = {
        to: enrolment.student.account.user.email,
        templateId: emailSettings.enrolmentConfirmationTemplate,
        dynamicTemplateData: dynamicData,
        from: {
          email: emailSettings.fromEmail,
        },
      }
      console.log('Sending Email')
      await sendEmail(emailData)
    }
  }
