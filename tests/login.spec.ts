/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { checkErrorToast, common, waitForPageLoaded } from './utils/commmon'
import { getCodeForSignIn } from './utils/email'
import { fillEmailInput, login, openCodeEnteringStep, openLoginEmailModal } from './selectors/login.selectors'

test.describe('home page + login screen', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
    page.waitForLoadState('load')
  })

  test('home page with all necessary elements opened', async ({ page }) => {
    await expect(page.locator('h2[test-id="root-hash"]')).toBeVisible()
    await expect(page.locator('h2[test-id="collection-amount"]')).toBeVisible()
    page.waitForSelector('a[href="https://docs.polybase.xyz"]')
    page.waitForSelector('a[href="https://polybase.xyz/whitepaper"]')
    page.waitForSelector('a[href="https://social.testnet.polybase.xyz"]')
  })

  test('when change the theme, expected colors to be updated', async ({ page }) => {
    const attribute = async() => await page.locator('html').getAttribute('data-theme')
    expect(await attribute()).toEqual('light')

    await page.locator('[aria-label="Switch to dark mode"]').click()
    expect(await attribute()).toEqual('dark')

    await page.locator('[aria-label="Switch to light mode"]').click()
    expect(await attribute()).toEqual('light')
  })

  test('check the metamask link', async ({ page }) => {
    await login.loginBtn(page).click()
    const iframe = await login.getLoginModalContent(page)
    const link = await iframe!.getByRole('link' , { name: 'Install Metamask' }).getAttribute('href')
    expect(link).toContain('https://chrome.google.com/webstore/detail/metamask')
  })

  test('login with empty email field', async ({ page }) => {
    const iframe = await openLoginEmailModal(page)
    await iframe!.getByRole('button', { name: 'Continue' }).click()
    await iframe!.waitForSelector('[id^="toast"]')

    checkErrorToast(iframe!, 'Invalid email address')
  })

  test('login with invalid format of email', async ({ page }) => {
    const iframe = await openLoginEmailModal(page)
    await fillEmailInput(iframe!, '12345')
    await iframe!.waitForSelector('[id^="toast"]')

    checkErrorToast(iframe!, 'Invalid email address')
  })

  test('login with empty code input', async ({ page }) => {
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await openCodeEnteringStep(iframe!, fakeEmail)
    await iframe!.getByRole('button', { name: 'Continue' }).click()

    checkErrorToast(iframe!, 'Invalid code, must be 6 numbers')
  })

  test('login with invalid format of the verification code (less than 6 digits)', async ({ page }) => {
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await openCodeEnteringStep(iframe!, fakeEmail)
    await iframe!.locator('input').fill('12345')
    await iframe!.getByRole('button', { name: 'Continue' }).click()

    checkErrorToast(iframe!, 'Invalid code, must be 6 numbers')
  })

  test('login with invalid format of the verification code (more than 6 digits)', async ({ page }) => {
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await openCodeEnteringStep(iframe!, fakeEmail)
    await iframe!.locator('input').fill('1234567')
    await iframe!.getByRole('button', { name: 'Continue' }).click()

    checkErrorToast(iframe!, 'Invalid code, must be 6 numbers')
  })

  test('login with invalid format of the verification code (letters)', async ({ page }) => {
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await openCodeEnteringStep(iframe!, fakeEmail)
    await iframe!.locator('input').fill('abcdef')
    await iframe!.getByRole('button', { name: 'Continue' }).click()

    checkErrorToast(iframe!, 'Invalid code, must be 6 numbers')
  })

  test('login with invalid verification code', async ({ page }) => {
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await openCodeEnteringStep(iframe!, fakeEmail)
    await iframe!.locator('input').fill('123456')
    await iframe!.getByRole('button', { name: 'Continue' }).click()

    checkErrorToast(iframe!, 'Email code is invalid or has expired')
  })

  test('successful login with email', async ({ page, request }) => {
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await fillEmailInput(iframe!, fakeEmail)

    await iframe!.waitForSelector(`:text("Enter the code sent to ${fakeEmail}")`)
    await common.wait(4000)

    const code = await getCodeForSignIn(request, fakeEmail)
    await iframe!.locator('input').fill(code)
    await iframe!.getByRole('button', { name: 'Continue' }).click()
    waitForPageLoaded(page)
    await iframe!.waitForSelector(':text("The app is requesting for you to sign the following request.")')
    await iframe!.getByRole('button', { name: 'Sign' }).click()
    waitForPageLoaded(page)
    await page.waitForSelector('button:text("Logout")')
  })
})
