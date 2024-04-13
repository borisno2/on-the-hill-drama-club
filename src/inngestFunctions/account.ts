import { Context } from '.keystone/types'
import sendEmail from 'lib/sendEmail'
import { inngest } from 'lib/inngest/client'
import { keystoneContext } from 'keystone/context'
import { getXeroClient } from 'lib/xero'
import { graphql } from 'gql'
import { NonRetriableError, slugify } from 'inngest'

const GET_ACCOUNT_BY_ID = graphql(`
  query GET_ACCOUNT_BY_ID($id: ID!) {
    account(where: { id: $id }) {
      id
      name
      firstName
      surname
      xeroId
      user {
        id
        email
      }
    }
  }
`)

export const upsertXeroCustomerFunction = inngest.createFunction(
  {
    id: slugify('Upsert Xero Customer'),
    name: 'Upsert Xero Customer',
  },
  { event: 'xero/customer.upsert' },
  async ({ event, step }) => {
    const context: Context = keystoneContext.sudo()
    const { item } = event.data
    // Get the account from the event
    const { account } = await step.run('app/account.get', async () => {
      return await context.graphql
        .run({
          query: GET_ACCOUNT_BY_ID,
          variables: { id: item.id },
        })
        .catch((error) => {
          throw new Error('Error getting account', { cause: error })
        })
    })

    // Account Checks
    if (!account) throw new NonRetriableError('Could not get account')
    if (!account.user?.email)
      throw new NonRetriableError('Could not get account email')
    if (account.xeroId !== null) return account

    // Get the Xero client
    const { xeroClient, xeroTenantId } = await getXeroClient({ context }).catch(
      (error) => {
        throw new Error('Error getting Xero Client', { cause: error })
      },
    )
    if (!xeroClient || !xeroTenantId)
      throw new Error('Could not get Xero client')

    // create the customer in Xero and update the account
    const customer = await step.run('app/xero.createContact', async () => {
      //Check if the customer exists in Xero
      const {
        body: { contacts: getContacts },
      } = await xeroClient.accountingApi.getContacts(
        xeroTenantId,
        undefined,
        'Name="' + account.name + '"',
      )
      if (getContacts && getContacts && getContacts.length > 0) {
        return getContacts[0]
      }
      // Create the customer if it doesn't exist
      const {
        body: { contacts },
      } = await xeroClient.accountingApi.createContacts(xeroTenantId, {
        contacts: [
          {
            name: account.name!,
            emailAddress: account.user?.email!,
            firstName: account.firstName!,
            lastName: account.surname!,
          },
        ],
      })
      if (contacts === undefined) {
        throw new Error('Error creating customer', {
          cause: 'Create customer returned null',
        })
      }
      if (contacts.length === 0) {
        throw new Error('Error creating customer', {
          cause: 'Create customer returned empty array',
        })
      }
      if (contacts.length > 1) {
        throw new Error('Error creating customer', {
          cause: 'Create customer returned multiple customers',
        })
      }
      return contacts[0]
    })
    await step.run('app/account.update', async () => {
      await context.db.Account.updateOne({
        where: { id: account.id },
        data: {
          xeroId: customer.contactID,
        },
      })
    })
    return { ...account, xeroId: customer.contactID }
  },
)

export const createXeroCustomerFunction = inngest.createFunction(
  {
    id: slugify('Create Xero Customer Hook'),
    name: 'Create Xero Customer Hook',
  },
  { event: 'app/account.created' },
  async ({ event, step }) => {
    const account = await step.invoke('xero/customer.upsert', {
      function: upsertXeroCustomerFunction,
      data: event.data,
    })
    return `Created Xero customer ${account.name} with id ${account.xeroId}`
  },
)
