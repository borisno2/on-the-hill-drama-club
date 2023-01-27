import Decimal from 'decimal.js'

export type MetaData = {
  CreateTime: string
  LastUpdatedTime: string
}
export type ReturnQBCustomer = {
  domain: string
  Id: string
  SyncToken: string
  CurrencyRef: {
    name: string
    value: string
  }
  DefaultTaxCodeRef: {
    value: string
  }
  Active: boolean
  sparse: boolean
  BillAddr: CreateQBCustomer['BillAddr'] & { Id: string }
  MetaData: MetaData
} & CreateQBCustomer

export type CreateQBCustomer = {
  FullyQualifiedName?: string
  PrimaryEmailAddr?: {
    Address?: string
  }
  DisplayName: string
  Suffix?: string
  Title?: string
  MiddleName?: string
  Notes?: string
  FamilyName?: string
  PrimaryPhone?: {
    FreeFormNumber?: string
  }
  CompanyName?: string
  BillAddr?: {
    CountrySubDivisionCode?: string
    City?: string
    PostalCode?: string
    Line1?: string
    Country?: string
  }
  GivenName?: string
}

export type QBLineItemCreate = {
  DetailType: 'SalesItemLineDetail'
  Amount: Decimal
  Description?: string
  LineNum?: Decimal
  SalesItemLineDetail: {
    TaxInclusiveAmt?: Decimal
    Qty?: Decimal
    UnitPrice?: Decimal
    ItemRef: {
      name?: string
      value: string
    }
  }
}
export type CreateQBInvoice = {
  Line: QBLineItemCreate[]
  CustomerRef: {
    value: string
  }
}

export type ReturnQBInvoice = {
  domain: string
  Id: string
  SyncToken: string
  CurrencyRef: {
    name: string
    value: string
  }
  CustomerRef: {
    name: string
    value: string
  }
  TxnDate: string
  Line: CreateQBInvoice['Line']
  MetaData: MetaData
}
