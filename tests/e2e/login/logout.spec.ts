/* eslint-disable testing-library/prefer-screen-queries */
import { test } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { login, registerUI } from '../../selectors/login.selectors'
import { waitForPageLoaded } from '../../utils/commmon'

test.describe('logout', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageLoaded(page)
  })

  test('when logout and swap account, expected to be logged out', async ({ page, request }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    await registerUI({ page, fakeEmail, request })
    await login.logoutBtn(page).click()
    await login.loginBtn(page).click()
    const newIframe = await login.getLoginModalContent(page)
    await newIframe!.waitForSelector(`:text("${fakeEmail}")`)

    // Act
    await newIframe!.getByRole('link', { name: 'Swap Account' }).click()

    // Assert
    await newIframe!.waitForSelector('a:text("Email")')
  })
})
