/* eslint-disable testing-library/prefer-screen-queries */
import { test, Page, chromium } from '@playwright/test'
import { common, pathNameShouldMatchRoute } from '../utils/commmon'
import { auth } from '../utils/api/auth'
import { getCodeForSignIn } from '../utils/email'
import { collection } from '../selectors/collections.selectors'

test.describe('collections', async () => {
  let page: Page

  test.beforeEach(async ({ baseURL, request }) => {
    const email = 'polybase2@mailto.plus'
    const browser = await chromium.launch()
    const context = await browser.newContext()

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
        // Value should be different depending on where you are running
        // localhost:3000 or explorer.prenet.polybase.xyz or explorer.testnet.polybase.xyz
        name: 'polybase.auth.domains',
        url: 'https://auth.testnet.polybase.xyz/',
        secure: false,
        sameSite: 'None',
        value: baseURL!.split('://')[1],
      },
    ])

    page = await context.newPage()
    await page.goto(`${baseURL}`)
    await common.wait(2000)
  })

  test('when click create collection, expected to be navigated to the app creation', async () => {
    // Act
    await collection.createCollectionBtn(page).click()

    // Assert
    await pathNameShouldMatchRoute(page, '/studio/create')
  })
})
