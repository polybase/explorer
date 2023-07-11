/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { getCodeForSignIn } from '../../utils/auth/email'
import { fillCodeInput, fillEmailInput, login, openCodeEnteringStep, openLoginEmailModal, registerUI } from '../../selectors/login.selectors'
import { checkErrorToast, common, waitForPageLoaded } from '../../utils/commmon'

test.describe.only('email login', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageLoaded(page)
  })

  test.afterEach(async ({ context }) => {
    await context.clearCookies()
  })

  test('renders the email & submit button input field', async ({ page }) => {
    // Arrange
    const iframe = await openLoginEmailModal(page)
    const emailInput = iframe!.locator('input[name="email-input"]')
    const submitButton = iframe!.locator('button[type="submit"]')

    // Assert
    expect(emailInput).not.toBeNull()
    expect(submitButton).not.toBeNull()
  })

  test('when enter email, expected input state to be updated', async ({ page }) => {
    // Arrange
    const iframe = await openLoginEmailModal(page)
    const emailInput = iframe!.locator('input[type="email"]')

    // Act
    await emailInput.fill('test@example.com')

    // Assert
    expect(await emailInput!.getAttribute('value')).toBe('test@example.com')
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

    // Assert
    expect(iframe!.locator('h2:text("Enter email")')).toBeVisible()
    expect(await iframe!.locator('[type="email"]').getAttribute('value')).toEqual('12345')
  })

  test('when submit the form with the entered email, expected request to be sent with correct data', async ({ page }) => {
    // Arrange
    const email = 'random@test.com'
    let interceptedRequest

    await page.route('**/email/code', async (route, request) => {
      interceptedRequest = request
      await route.continue()
    })
    const iframe = await openLoginEmailModal(page)

    // Act
    await iframe!.fill('input[type="email"]', email)
    await iframe!.click('button[type="submit"]')
    const requestBody = JSON.parse(await interceptedRequest.postData())

    // Assert
    expect(interceptedRequest.method()).toBe('POST')
    expect(requestBody.email).toEqual(email)
  })

  test('when submitting form, expected loading state to be displayed', async ({ page }) => {
    // Arrange
    await page.route('**/email/code', (route) => {
      route.continue().then(() => {
        page.pause()
      })
    })
    const iframe = await openLoginEmailModal(page)

    // Act
    await iframe!.fill('input[type="email"]', 'test@example.com')
    await iframe!.click('button[type="submit"]')
    const loadingButton = iframe!.locator('button')

    // Assert
    expect(loadingButton).toBeDisabled()
    expect(await loadingButton.textContent()).toEqual('Loading...Continue')
  })

  test('when enter login and receive error from be, expected error to be correctly handled', async ({ page }) => {
    // Arrange
    await page.route('**/email/code', (route) => {
      route.abort()
    })
    const iframe = await openLoginEmailModal(page)

    // Act
    await iframe!.fill('input[type="email"]', 'test@example.com')
    await iframe!.click('button[type="submit"]')
    await iframe!.waitForSelector('[id^="toast"]')

    // Assert
    await checkErrorToast(iframe!, 'Network Error')
  })

  test('when enter code, expected input state to be updated', async ({ page }) => {
    // Arrange
    const code = '12345'
    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await openCodeEnteringStep(iframe!, fakeEmail)

    // Act
    await iframe!.fill('input', code)

    // Assert
    expect(await iframe!.locator('input').inputValue()).toEqual(code)
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

  test('when login with email & code, expected request with corrrect data to be sent', async ({ page, request }) => {
    // Arrange
    let interceptedRequest
    await page.route('**/email/verify', async (route, request) => {
      interceptedRequest = request
      await route.continue()
    })

    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await fillEmailInput(iframe!, fakeEmail)
    await iframe!.waitForSelector(`:text("Enter the code sent to ${fakeEmail}")`)
    await common.wait(4000)
    const code = await getCodeForSignIn(request, fakeEmail)

    // Act
    await fillCodeInput(iframe!, code)
    const requestBody = JSON.parse(await interceptedRequest.postData())

    expect(interceptedRequest.method()).toBe('POST')
    expect(requestBody.email).toEqual(fakeEmail)
    expect(requestBody.code).toEqual(code.replaceAll(' ', ''))
  })

  test('when login with email & code and receive error from be, expected error to be correclty handled', async ({ page, request }) => {
    // Arrange
    await page.route('**/email/verify', async (route) => {
      await route.abort()
    })

    const fakeEmail = faker.internet.userName() + '@mailto.plus'
    const iframe = await openLoginEmailModal(page)
    await fillEmailInput(iframe!, fakeEmail)
    await iframe!.waitForSelector(`:text("Enter the code sent to ${fakeEmail}")`)
    await common.wait(4000)
    const code = await getCodeForSignIn(request, fakeEmail)

    // Act
    await fillCodeInput(iframe!, code)
    await iframe!.waitForSelector('[id^="toast"]')

    // Assert
    await checkErrorToast(iframe!, 'Network Error')
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
