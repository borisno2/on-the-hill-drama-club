import QuickBooks from 'node-quickbooks'

export async function getAccounts(qbo: QuickBooks): Promise<any> {
  return new Promise((resolve, reject) => {
    qbo?.findAccounts({}, (err, accounts) => {
      if (err) {
        console.error(JSON.stringify(err))
        reject(err)
      }
      resolve(accounts)
    })
  })
}
