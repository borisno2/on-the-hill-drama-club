import { Context } from '.keystone/types'
import sendEmail from 'lib/sendEmail'
import { inngest } from 'lib/inngest/client'
import { keystoneContext } from 'keystone/context'
import { getXeroClient } from 'lib/xero'
import { gql } from '@ts-gql/tag/no-transform'
import { slugify } from 'inngest'

const GET_ACCOUNT_BY_ID = gql`
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
` as import('../../__generated__/ts-gql/GET_ACCOUNT_BY_ID').type

export const createXeroCustomerFunction = inngest.createFunction(
  {
    id: slugify('Create Xero Customer Hook'),
    name: 'Create Xero Customer Hook',
  },
  { event: 'app/account.created' },
  async ({ event }) => {
    const { item } = event.data
    const context: Context = keystoneContext.sudo()
    const { xeroClient, xeroTenantId } = await getXeroClient({ context }).catch(
      (error) => {
        throw new Error('Error getting Xero Client', { cause: error })
      },
    )
    const { account } = await context.graphql
      .run({
        query: GET_ACCOUNT_BY_ID,
        variables: { id: item.id },
      })
      .catch((error) => {
        throw new Error('Error getting account', { cause: error })
      })
    if (!xeroClient || !xeroTenantId)
      throw new Error('Could not get Xero client')
    if (!account) throw new Error('Could not get account')
    if (!account.user?.email) throw new Error('Could not get account email')
    if (account.xeroId !== null) {
      return `Account ${account.name} already has a QB customer with id ${account.xeroId}`
    } else {
      // create the customer in Xero and update the account
      try {
        const {
          body: { contacts },
        } = await xeroClient.accountingApi.createContacts(xeroTenantId, {
          contacts: [
            {
              name: account.name!,
              emailAddress: account.user.email!,
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
        const customer = contacts[0]
        await context.db.Account.updateOne({
          where: { id: account.id },
          data: {
            xeroId: customer.contactID,
          },
        })
        return `Created Xero customer ${account.name} with id ${customer.contactID}`
      } catch (error) {
        throw new Error('Error creating customer', { cause: error })
      }
    }
  },
)
