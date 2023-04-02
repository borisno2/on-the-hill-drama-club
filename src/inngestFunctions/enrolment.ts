import { Context } from '.keystone/types'
import sendEmail from 'lib/sendEmail'
import { GET_ENROLMENT_BY_ID } from 'app/dashboard/students/queries'
import { formatDate } from 'lib/formatDate'
import labelHelper from 'lib/labelHelper'
import { dayOptions } from 'types/selectOptions'
import { inngest } from 'lib/inngest/client'
import { keystoneContext } from 'keystone/context'

export const createBillItemFunction = inngest.createFunction(
  'Create Bill Hook',
  'app/enrolment.enroled',
  async ({ event }) => {
    try {
      const { item, session } = event.data
      const context: Context = keystoneContext.withSession(session)

      const { enrolment } = await context.graphql.run({
        query: GET_ENROLMENT_BY_ID,
        variables: { id: item.id },
      })

      // check if the enrolment has all the data we need
      if (
        !enrolment ||
        !enrolment.student ||
        !enrolment.student.account ||
        !enrolment.lessonTerm ||
        !enrolment.lessonTerm.lesson ||
        !enrolment.lessonTerm.lesson.cost ||
        !enrolment.lessonTerm.numberOfLessons ||
        !enrolment.lessonTerm.term
      ) {
        throw new Error('Enrolment data is missing', { cause: enrolment })
      }

      // check if the enrolment is a billable enrolment
      if (
        enrolment.lessonTerm.lesson.cost <= 0 ||
        enrolment.lessonTerm.numberOfLessons <= 0
      )
        return 'Not a billable enrolment'

      // if it is, check if there is a bill for the account /term
      const bill = await context.sudo().db.Bill.findMany({
        where: {
          account: { id: { equals: enrolment.student.account.id } },
          term: { id: { equals: enrolment.lessonTerm.term.id } },
        },
      })
      // if there is, add the enrolment to the bill
      const billItemData = {
        name: `${enrolment.lessonTerm.name} - ${enrolment.lessonTerm.term.name}`,
        enrolment: { connect: { id: enrolment.id } },
        amount: enrolment.lessonTerm.lesson.cost,
        quantity: enrolment.lessonTerm.numberOfLessons,
      }
      if (bill.length > 1) {
        throw new Error('More than one bill found', { cause: bill })
      } else if (bill.length === 1) {
        const billItem = await context.sudo().query.BillItem.createOne({
          data: {
            bill: { connect: { id: bill[0].id } },
            ...billItemData,
          },
        })
        await context.sudo().db.Enrolment.updateOne({
          where: { id: enrolment.id },
          data: { status: 'INVOICED' },
        })

        return { status: 'Bill item created', billItem }
      } else {
        // if there isn't, create a new bill for the account / term
        const newBill = await context.sudo().query.Bill.createOne({
          query: 'id items { id }',
          data: {
            name: `${enrolment.student.account.name} - ${enrolment.lessonTerm.term.name}`,
            account: { connect: { id: enrolment.student.account.id } },
            term: { connect: { id: enrolment.lessonTerm.term.id } },
            status: 'DRAFT',
            items: {
              create: billItemData,
            },
          },
        })

        await context.sudo().db.Enrolment.updateOne({
          where: { id: enrolment.id },
          data: { status: 'INVOICED' },
        })

        return { status: 'Bill created', newBill }
      }
    } catch (error) {
      throw new Error('Error creating bill', { cause: error })
    }
  }
)

export const sendEnrolmentConfirmationFunction = inngest.createFunction(
  'Enrolment Confirmation Hook',
  'app/enrolment.enroled',
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
        throw new Error('Missing Data', { cause: enrolment })
      }
      const emailSettings = await context.sudo().db.EmailSettings.findOne({})

      if (
        !emailSettings ||
        !emailSettings.enrolmentConfirmationTemplate ||
        !emailSettings.fromEmail
      ) {
        throw new Error('Missing Email Settings', { cause: emailSettings })
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
        throw new Error('Email Failed to Send', { cause: emailReturn })
      }
      return emailReturn
    } catch (error) {
      throw new Error('Error sending email', { cause: error })
    }
  }
)
