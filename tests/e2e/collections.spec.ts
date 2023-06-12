/* eslint-disable testing-library/prefer-screen-queries */
import { test, Page, chromium } from '@playwright/test'
import { common } from '../utils/commmon'
import { auth } from '../utils/api/auth'
import { getCodeForSignIn } from '../utils/email'
import { config } from '../config/config'

test.describe.only('collections', async () => {
  let page: Page

  test.beforeEach(async ({ baseURL, request }) => {
    const email = 'polybase2@mailto.plus'
    const browser = await chromium.launch()
    const context = await browser.newContext()

    page = await context.newPage()
    await page.goto(`${config.prenet}`)
    await common.wait(1000)

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
    const verifyCookies = await verifyCode.json()
    const value = `"type":"email","userId":"${verifyCookies.userId}","email":"${email}","publicKey":"${verifyCookies.publicKey}"`
    await context.addCookies([{ name: 'polybase.auth.auth', url: 'https://auth.testnet.polybase.xyz', value: `{${encodeURI(value).replace(/,/g, '%2C')}}` },
      { name: 'polybase.auth.token', url: 'https://auth.testnet.polybase.xyz', value: encodeURI(verifyCookies.token) }, { name: 'polybase.auth.domains', url: 'https://auth.testnet.polybase.xyz', value: '%2Cexplorer.testnet.polybase.xyz' }])
    await common.wait(2000)

    // await waitForPageLoaded(page)
    console.log(await context.cookies())
  })

  test('when click create collection, expected sign in modal shouls be displayed', async () => {
    // Act
    await page.getByRole('button', { name: 'Login' }).click()
    await common.wait(400000)
    await page.pause()
    // const iframe = await login.getLoginModalContent(page)

    // // Assert
    // expect(iframe!.getByText('Sign in')).toBeVisible()
  })
})
