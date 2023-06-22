import { APIRequestContext, BrowserContext } from '@playwright/test'
import { auth } from './api/auth'
import { common } from './commmon'
import { getCodeForSignIn } from './email'
import { baseENV } from '../config/config'
import { AuthState } from '@polybase/auth/src/Auth'

interface APILogin {
  request: APIRequestContext;
  email: string;
  context: BrowserContext;
}

export type AuthData = Pick<AuthState, 'publicKey' | 'userId'> & { token: string }

export const apiLogin = async({ request, email, context }: APILogin) => {
  await request.post(auth.code, {
    data: {
      email,
    },
  })

  await common.wait(4000)
  const code = await getCodeForSignIn(request, email)
  const verifyCode = await request.post(auth.verify, {
    data: {
      code: code.replace(/ /g, ''),
      email,
    },
  })
  const verifyCookies: AuthData = await verifyCode.json()
  const value = encodeURI(
    JSON.stringify({
      type: 'email',
      userId: verifyCookies.userId,
      email: email,
      publicKey: verifyCookies.publicKey,
    }),
  )

  await context.addCookies([
    {
      name: 'polybase.auth.auth',
      url: 'https://auth.testnet.polybase.xyz/',
      secure: false,
      sameSite: 'None',
      value: value,
    },
    {
      name: 'polybase.auth.token',
      url: 'https://auth.testnet.polybase.xyz/',
      secure: false,
      sameSite: 'None',
      value: verifyCookies.token,
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
  ])

  return verifyCookies
}