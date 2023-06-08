import { Frame, Page } from '@playwright/test'
import { waitForPageLoaded } from '../utils/commmon'

export const login = {
  loginBtn(page: Page) {
    return page.getByRole('button', { name: 'Login' })
  },
  async getLoginModalContent(page: Page) {
    const modal = await page.waitForSelector('#polybase-auth-modal-iframe')
    const iframe = await modal.contentFrame()
    return iframe
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

export const openCodeEnteringStep = async(iframe: Frame, email: string) => {
  await fillEmailInput(iframe, email)
  await iframe!.waitForSelector(':text("Enter email code")')
}