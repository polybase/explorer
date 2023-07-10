/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { getCodeForSignIn } from '../../utils/auth/email'
import { fillCodeInput, fillEmailInput, login, openCodeEnteringStep, openLoginEmailModal, registerUI } from '../../selectors/login.selectors'
import { checkErrorToast, common, waitForPageLoaded } from '../../utils/commmon'

test.describe('email login', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageLoaded(page)
  })

  test('when login with empty email field, expected validation to be displayed', async ({ page }) => {
    // Arrange
    const iframe = await openLoginEmailModal(page)

    // Act
    await login.continueModalBtn(iframe!).click()
    await iframe!.waitForSelector('[id^="toast"]')

    // Assert
    await checkErrorToast(iframe!, 'Invalid email address')
  })

  test('when login with invalid format of email, expected validation to be displayed', async ({ page }) => {
    // Arrange
    const iframe = await openLoginEmailModal(page)

    // Act
    await fillEmailInput(iframe!, '12345')
    await iframe!.waitForSelector('[id^="toast"]')

    // Assert
    await checkErrorToast(iframe!, 'Invalid email address')
  })

  test('when login with empty code input, expected validation to be displayed', async ({ page }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await openCodeEnteringStep(iframe!, fakeEmail)

    // Act
    await login.continueModalBtn(iframe!).click()

    // Assert
    await checkErrorToast(iframe!, 'Invalid code, must be 6 numbers')
  })

  test('when login with invalid format of the verification code (less than 6 digits), expected validation to be displayed', async ({ page }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await openCodeEnteringStep(iframe!, fakeEmail)

    // Act
    await fillCodeInput(iframe!, '12345')

    // Assert
    await checkErrorToast(iframe!, 'Invalid code, must be 6 numbers')
  })

  test('when login with invalid format of the verification code (more than 6 digits), expected validation to be displayed', async ({ page }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await openCodeEnteringStep(iframe!, fakeEmail)

    // Act
    await fillCodeInput(iframe!, '1234567')

    // Assert
    await checkErrorToast(iframe!, 'Invalid code, must be 6 numbers')
  })

  test('when login with invalid format of the verification code (letters), expected validation to be displayed', async ({ page }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await openCodeEnteringStep(iframe!, fakeEmail)

    // Act
    await fillCodeInput(iframe!, 'abcdef')

    // Assert
    await checkErrorToast(iframe!, 'Invalid code, must be 6 numbers')
  })

  test('when login with invalid verification code, expected error to be displayed', async ({ page }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await openCodeEnteringStep(iframe!, fakeEmail)

    // Act
    await fillCodeInput(iframe!, '123456')

    // Assert
    await checkErrorToast(iframe!, 'Email code is invalid or has expired')
  })

  test('when login with email, expected to be logged in', async ({ page, request }) => {
    // Arrange
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)

    // Act & Assert
    await fillEmailInput(iframe!, fakeEmail)
    await iframe!.waitForSelector(`:text("Enter the code sent to ${fakeEmail}")`)
    await common.wait(4000)
    const code = await getCodeForSignIn(request, fakeEmail)
    await fillCodeInput(iframe!, code)
    await common.wait(2000)

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
