import { BrowserContext } from '@playwright/test'
import { AuthState } from '@polybase/auth/src/Auth'
import { baseENV } from '../../config/config'

export interface AuthCookies {
  token?: string
  auth: AuthState
}

export interface Cookie {
  name: string;
  value: string;
  url: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export async function setAuthCookies(context: BrowserContext, auth: AuthCookies) {
  const cookies: Cookie[] = [
    {
      name: 'polybase.auth.auth',
      url: 'https://auth.testnet.polybase.xyz/',
      secure: false,
      sameSite: 'None',
      value: encodeURI(
        JSON.stringify(auth.auth),
      ),
    },
    {
      // Value should be different depending on where you are running
      // localhost:3000 or explorer.prenet.polybase.xyz or explorer.testnet.polybase.xyz
      name: 'polybase.auth.domains',
      url: 'https://auth.testnet.polybase.xyz/',
      secure: false,
      sameSite: 'None',
      value: baseENV!.split('://')[1],
    },
  ]

  // Only used for email login
  if (auth.token) {
    cookies.push({
      name: 'polybase.auth.token',
      url: 'https://auth.testnet.polybase.xyz/',
      secure: false,
      sameSite: 'None',
      value: auth.token,
    })
  }

  await context.addCookies(cookies)
}