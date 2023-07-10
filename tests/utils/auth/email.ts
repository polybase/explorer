import { APIRequestContext, BrowserContext } from '@playwright/test'
import { AuthState } from '@polybase/auth/src/Auth'
import { Polybase, Signer } from '@polybase/client'
import { common } from '../commmon'
import { setAuthCookies } from './cookies'
import { Auth } from './types'
// import { baseENV } from '../../config/config'

const CODE_URL = 'https://auth.testnet.polybase.xyz/api/email/code'
const VERIFY_URL = 'https://auth.testnet.polybase.xyz/api/email/verify'
const SIGNER_URL = 'https://auth.testnet.polybase.xyz/api/ethPersonalSign'

export interface EmailAuthResponse {
  userId: string
  publicKey: string
  token: string
}

export interface EmailLogin {
  email: string
  request: APIRequestContext
  context: BrowserContext
}

export async function emailLogin({ request, email, context }: EmailLogin): Promise<Auth> {
  await request.post(CODE_URL, {
    data: {
      email,
    },
  })

  // Wait for email to be sent
  await common.wait(4000)

  // Obtain code from email
  const code = await getCodeForSignIn(request, email)

  // Send code to be verified
  const verifyCode = await request.post(VERIFY_URL, {
    data: {
      code: code.replace(/ /g, ''),
      email,
    },
  })

  // Parse response as JSON
  const verifyResponse: EmailAuthResponse = await verifyCode.json()
  const authState: AuthState = {
    type: 'email',
    userId: verifyResponse.userId,
    email: email,
    publicKey: verifyResponse.publicKey,
  }

  // Save the cookies, so user remains logged in
  await setAuthCookies(context, {
    auth: authState,
    token: verifyResponse.token,
  })

  const signer: Signer = async (data: string) => {
    const res = await request.post(SIGNER_URL, {
      data: {
        msg: data,
      },
      headers: {
        Authorization: `Bearer ${verifyResponse.token}`,
      },
    })
    const json = await res.json()
    return {
      h: 'eth-personal-sign',
      sig: json.sig,
    }
  }

  return {
    authState,
    signer,
    client: new Polybase({
      baseURL: 'http://127.0.0.1:8080/v0',
      signer,
    }),
  }
}

export async function getCodeForSignIn(request: APIRequestContext, fakeEmail: string) {
  const emailRawResponse = await request.get(`https://tempmail.plus/api/mails?email=${encodeURIComponent(fakeEmail)}&limit=15&epin=`)
  const emailResponseJson = await emailRawResponse.json()
  const emailInfo = emailResponseJson.mail_list[0]
  const emailContent = await request.get(`https://tempmail.plus/api/mails/${emailInfo.mail_id}?email=${encodeURIComponent(fakeEmail)}`)
  const emailContentJson = await emailContent.json()
  const code = emailContentJson.html.split('Login with Polybase code:')[1].trim().slice(0, 7)
  return code
}