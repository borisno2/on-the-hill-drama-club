import { Context } from '.keystone/types'
import sendEmail from 'lib/sendEmail'
import { GET_ENROLMENT_BY_ID } from 'app/dashboard/students/queries'
import { formatDate } from 'lib/formatDate'
import labelHelper from 'lib/labelHelper'
import { dayOptions } from 'types/selectOptions'
import { inngest } from 'lib/inngest/client'
import { keystoneContext } from 'keystone/context'
import { NonRetriableError, slugify } from 'inngest'

export const sendEnrolmentConfirmationFunction = inngest.createFunction(
  {
    id: slugify('Enrolment Confirmation Hook'),
    name: 'Enrolment Confirmation Hook',
  },
  { event: 'app/enrolment.enroled' },
  async ({ event }) => {
    const { item, session } = event.data
    try {
      const context: Context = keystoneContext.withSession(session)
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
        throw new NonRetriableError('Missing Data', { cause: enrolment })
      }
      const emailSettings = await context.sudo().db.EmailSettings.findOne({})

      if (
        !emailSettings ||
        !emailSettings.enrolmentConfirmationTemplate ||
        !emailSettings.fromEmail
      ) {
        throw new NonRetriableError('Missing Email Settings', {
          cause: emailSettings,
        })
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
      const [emailReturn] = await sendEmail(emailData)
      if (emailReturn.statusCode > 399) {
        throw new NonRetriableError('Email Failed to Send', {
          cause: emailReturn,
        })
      }
      return emailReturn
    } catch (error) {
      throw new NonRetriableError('Error sending email', { cause: error })
    }
  },
)
