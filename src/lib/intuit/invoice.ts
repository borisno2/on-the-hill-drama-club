import QuickBooks from 'node-quickbooks'
import { CreateQBInvoice, ReturnQBInvoice } from 'types/qbo'

export async function createInvoice(
  invoice: CreateQBInvoice,
  qbo: QuickBooks,
): Promise<ReturnQBInvoice> {
  return new Promise((resolve, reject) => {
    qbo?.createInvoice(invoice, (err, invoice) => {
      if (err) {
        console.error(JSON.stringify(err))
        reject(err)
      }
      resolve(invoice)
    })
  })
}

export async function sendInvoicePdf(
  invoiceId: string,
  email: string,
  qbo: QuickBooks,
): Promise<ReturnQBInvoice> {
  return new Promise((resolve, reject) => {
    qbo?.sendInvoicePdf(invoiceId, email, (err, invoice) => {
      if (err) {
        console.error(JSON.stringify(err))
        reject(err)
      }
      resolve(invoice)
    })
  })
}
