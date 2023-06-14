import { APIRequestContext, Frame, Page } from '@playwright/test'
import { common, waitForPageLoaded } from '../utils/commmon'
import { getCodeForSignIn } from '../utils/email'

interface RegisterUI {
  page: Page,
  fakeEmail: string,
  request: APIRequestContext
}

export const login = {
  loginBtn(page: Page) {
    return page.getByRole('button', { name: 'Login' })
  },
  async getLoginModalContent(page: Page) {
    const modal = await page.waitForSelector('#polybase-auth-modal-iframe')
    const iframe = await modal.contentFrame()
    return iframe
  },
  logoutBtn(page: Page) {
    return page.locator('button:text("Logout")')
  },
  continueModalBtn(iframe: Frame) {
    return iframe.getByRole('button', { name: 'Continue' })
  },
  signModalBtn(iframe: Frame) {
    return iframe.getByRole('button', { name: 'Sign' })
  },
}

export const fillEmailInput = async(iframe: Frame, email: string) => {
  await iframe!.locator('input').fill(email)
  await iframe!.getByRole('button', { name: 'Continue' }).click()
  waitForPageLoaded(iframe)
  console.log('New Email: ' + email)
}

export const openLoginEmailModal = async(page: Page) => {
  await login.loginBtn(page).click()
  const iframe = await login.getLoginModalContent(page)

  if (iframe) {
    await iframe!.getByRole('link' , { name: 'Email' }).click()
    return iframe
  }
}

export const fillCodeInput = async(iframe: Frame, code: string) => {
  await iframe.locator('input').fill(code)
  await login.continueModalBtn(iframe).click()
  await waitForPageLoaded(iframe)
}

export const openCodeEnteringStep = async(iframe: Frame, email: string) => {
  await fillEmailInput(iframe, email)
  await iframe!.waitForSelector(':text("Enter email code")')
}

export const registerUI = async({ page, fakeEmail, request }: RegisterUI) => {
  const iframe = await openLoginEmailModal(page)
  await fillEmailInput(iframe!, fakeEmail)
  await common.wait(4000)

  const code = await getCodeForSignIn(request, fakeEmail)
  await iframe!.locator('input').fill(code)
  await iframe!.getByRole('button', { name: 'Continue' }).click()
  waitForPageLoaded(page)
  await iframe!.getByRole('button', { name: 'Sign' }).click()
  waitForPageLoaded(page)
}