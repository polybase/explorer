/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { login, registerUI } from '../../selectors/login.selectors'
import { waitForPageLoaded } from '../../utils/commmon'

test.describe('email login', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageLoaded(page)
  })

  test.afterEach(async ({ context }) => {
    await context.clearCookies()
  })

  test('when login with email, expected to be logged in', async ({ page, request }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'

    // Act
    await registerUI({ page, fakeEmail, request })
    await page.waitForSelector('iframe', { state: 'hidden' })

    // Assert
    expect(login.logoutBtn(page)).toBeVisible()
  })

  test('when logout and allow access to the account, expect to be logged in', async ({ page, request }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    await registerUI({ page, fakeEmail, request })
    await login.logoutBtn(page).click()
    await login.loginBtn(page).click()

    // Act
    const newIframe = await login.getLoginModalContent(page)
    await newIframe!.waitForSelector(':text("You are logged in using email as:")')
    await newIframe!.waitForSelector(`:text("${fakeEmail}")`)
    await newIframe!.getByRole('button', { name: 'Allow Access' }).click()
    await waitForPageLoaded(page)

    // Assert
    await page.waitForSelector('button:text("Logout")')
  })
})
