import { Context } from '.keystone/types'
import sendEmail from 'lib/sendEmail'
import { inngest } from 'lib/inngest/client'
import { keystoneContext } from 'keystone/context'
import { createCustomer } from 'lib/intuit/customer'
import { getQBO } from 'lib/intuit'
import { gql } from '@ts-gql/tag/no-transform'
import { slugify } from 'inngest'

const GET_ACCOUNT_BY_ID = gql`
  query GET_ACCOUNT_BY_ID($id: ID!) {
    account(where: { id: $id }) {
      id
      name
      firstName
      surname
      qboId
      user {
        id
        email
      }
    }
  }
` as import('../../__generated__/ts-gql/GET_ACCOUNT_BY_ID').type

export const createQuickBooksCustomerFunction = inngest.createFunction(
  {
    id: slugify('Create QuickBooks Customer Hook'),
    name: 'Create QuickBooks Customer Hook',
  },
  { event: 'app/account.created' },
  async ({ event }) => {
    const { item } = event.data
    const context: Context = keystoneContext.sudo()
    const qbo = await getQBO({ context }).catch((error) => {
      throw new Error('Error getting QBO', { cause: error })
    })
    const { account } = await context.graphql
      .run({
        query: GET_ACCOUNT_BY_ID,
        variables: { id: item.id },
      })
      .catch((error) => {
        throw new Error('Error getting account', { cause: error })
      })
    if (!qbo) throw new Error('Could not get QBO client')
    if (!account) throw new Error('Could not get account')
    if (!account.user?.email) throw new Error('Could not get account email')
    if (account.qboId !== null) {
      return `Account ${account.name} already has a QB customer with id ${account.qboId}`
    } else {
      // create the customer in QBO and update the account
      try {
        const customer = await createCustomer(
          {
            DisplayName: account.name!,
            GivenName: account.firstName!,
            FamilyName: account.surname!,
            PrimaryEmailAddr: {
              Address: account.user.email!,
            },
          },
          qbo,
        )

        if (customer === null) {
          throw new Error('Error creating customer', {
            cause: 'Create customer returned null',
          })
        }

        await context.db.Account.updateOne({
          where: { id: account.id },
          data: {
            qboId: parseInt(customer.Id),
            qboSyncToken: parseInt(customer.SyncToken),
          },
        })
        return `Created QB customer ${account.name} with id ${customer.Id}`
      } catch (error) {
        throw new Error('Errpr creating customer', { cause: error })
      }
    }
  },
)
