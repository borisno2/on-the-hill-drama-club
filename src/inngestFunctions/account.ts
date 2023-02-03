import { Context } from '.keystone/types'
import sendEmail from 'lib/sendEmail'
import { createFunction } from 'inngest'
import { CreateQuickBooksCustomerEvent } from 'types/inngest'
import { keystoneContext } from 'keystone/context'
import { createCustomer } from 'lib/intuit/customer'
import { getQBO } from 'lib/intuit'
import { gql } from '@ts-gql/tag/no-transform'

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

export const createQuickBooksCustomerFunction =
  createFunction<CreateQuickBooksCustomerEvent>(
    'Create QuickBooks Customer Hook',
    'app/account.created',
    async ({ event }) => {
      const { item, session } = event.data
      const context: Context = keystoneContext.withSession(session)
      const qbo = await getQBO({ context })
      const { account } = await context.graphql.run({
        query: GET_ACCOUNT_BY_ID,
        variables: { id: item.id },
      })
      if (account && account.qboId !== null && qbo) {
        // create the customer in QBO and update the account
        try {
          const customer = await createCustomer(
            {
              DisplayName: account.name!,
              GivenName: account.firstName!,
              FamilyName: account.surname!,
              PrimaryEmailAddr: {
                Address: account.user?.email!,
              },
            },
            qbo
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
        } catch (error) {
          throw new Error('Errpr creating customer', { cause: error })
        }
      }
    }
  )
