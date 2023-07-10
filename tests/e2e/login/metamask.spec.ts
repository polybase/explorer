/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test'
import { login } from '../../selectors/login.selectors'
import { waitForPageLoaded } from '../../utils/commmon'

test.describe('metamask login', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageLoaded(page)
  })

  test('when open login modal, expect metamask link is displayed', async ({ page }) => {
    // Arrange
    await login.loginBtn(page).click()
    const iframe = await login.getLoginModalContent(page)
    const link = await iframe!.getByRole('link', { name: 'Install Metamask' }).getAttribute('href')

    // Assert
    expect(link).toContain('https://chrome.google.com/webstore/detail/metamask')
  })

  test('when metamask is installed, expect matamask buttton to be displayed', async ({ page }) => {
    // Arrange
    await page.addInitScript(() => {
      (window as any).ethereum = {
        enable: () => Promise.resolve(),
        selectedAddress: '0x67ccdac3ef693a24b67db9d5303253023de358d6',
      }
    })
    await page.reload({ waitUntil: 'load' })
    await login.loginBtn(page).click()

    // Act
    const iframe = await login.getLoginModalContent(page)

    // Assert
    expect(iframe!.getByRole('link', { name: 'Metamask' })).toBeVisible()
    expect(iframe!.getByRole('link', { name: 'Metamask' })).toBeEnabled()
  })
})
