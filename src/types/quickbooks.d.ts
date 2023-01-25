// declare the types for intuit-oauth and node-quickbooks in src/types/intuit.d.ts:
declare module 'intuit-oauth' {
  export default class OAuthClient {
    constructor(options: {
      clientId: string
      clientSecret: string
      environment: 'sandbox' | 'production'
      redirectUri: string
    })
    static scopes: {
      Accounting: string
      OpenId: string
    }
    public authorizeUri(options: { scope: string[]; state: string }): string
    public createToken(authCode: string): Promise<{
      getJson(): {
        access_token: string
        refresh_token: string
      }
    }>
    public setToken(accessToken: string, refreshToken: string): void
    public isAccessTokenValid(): boolean
    public refreshUsingToken(refreshToken: string): Promise<{
      getJson(): {
        access_token: string
        refresh_token: string
      }
    }>
    public getToken(): {
      access_token: string
      refresh_token: string
    }
  }
}
declare module 'node-quickbooks' {
  export default class QuickBooks {
    constructor(
      consumerKey: string,
      consumerSecret: string,
      token: string,
      tokenSecret: string | boolean,
      realmId: string,
      useSandbox: boolean,
      debug: boolean,
      minorVersion?: number,
      oauthVersion?: string,
      refreshToken?: string
    )
    public findAccounts(
      query: Record<string, any>,
      callback: (
        error: Error,
        accounts: { QueryResponse: { Account: any[] } }
      ) => void
    ): void
  }
}
