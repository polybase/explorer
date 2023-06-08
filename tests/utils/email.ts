import { APIRequestContext } from '@playwright/test'

export const getCodeForSignIn = async(request: APIRequestContext, fakeEmail: string) => {
  const emailRawResponse = await request.get(`https://tempmail.plus/api/mails?email=${encodeURIComponent(fakeEmail)}&limit=15&epin=`)
  const emailResponseJson = await emailRawResponse.json()
  const emailInfo = emailResponseJson.mail_list[0]
  const emailContent = await request.get(`https://tempmail.plus/api/mails/${emailInfo.mail_id}?email=${encodeURIComponent(fakeEmail)}`)
  const emailContentJson = await emailContent.json()
  const code = emailContentJson.html.split('Login with Polybase code:')[1].trim().slice(0, 7)
  return code
}