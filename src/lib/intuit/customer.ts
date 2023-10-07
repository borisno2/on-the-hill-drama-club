import QuickBooks from 'node-quickbooks'
import { CreateQBCustomer, ReturnQBCustomer } from 'types/qbo'

export async function createCustomer(
  customer: CreateQBCustomer,
  qbo: QuickBooks,
): Promise<ReturnQBCustomer> {
  return new Promise((resolve, reject) => {
    qbo?.createCustomer(customer, (err, customer) => {
      if (err) {
        console.error(JSON.stringify(err))
        reject(err)
      }
      resolve(customer)
    })
  })
}
