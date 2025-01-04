'use server'
import { signOut as rawSignOut, signIn } from './auth'

export async function signOut() {
  await rawSignOut()
}

export async function socialSignIn(
  provider: 'google' | 'apple',
  { callbackUrl }: { callbackUrl: string },
) {
  await signIn(provider, { redirectTo: callbackUrl, redirect: true })
}
