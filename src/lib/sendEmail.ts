import sgMail from '@sendgrid/mail'

type emailData = {
  to: string | string[]
  from: {
    email: string
    name?: string
  }
  templateId: string
  dynamicTemplateData: Record<string, string | undefined | null>
  isMultiple?: boolean
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export default async function sendEmail(data: emailData) {
  const email = { ...data }
  if (email.to.includes('@test.com')) {
    email.to = process.env.TEST_EMAIL || 'no-reply@openaas.com.au'
  }
  if (!email.from.name) {
    email.from.name = 'On the Hill Drama Club'
  }

  const msg = { ...email }
  try {
    return await sgMail.send(msg)
  } catch (error: unknown) {
    throw new Error(error as string)
  }
}
