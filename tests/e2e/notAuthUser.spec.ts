/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test'
import { login } from '../selectors/login.selectors'
import { elements, pathNameShouldMatchRoute, waitForPageLoaded } from '../utils/commmon'
import { collection } from '../selectors/collections.selectors'

test.describe('not auth user actions', async () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}`)
    await waitForPageLoaded(page)
  })

  test('when click create collection, expected sign in modal to be displayed', async ({ page }) => {
    // Act
    await collection.createCollectionBtn(page).click()
    const iframe = await login.getLoginModalContent(page)

    // Assert
    expect(iframe!.getByText('Sign in')).toBeVisible()
  })

  test('when open collections and click create collection, expected sign in modal to be displayed', async ({ page }) => {
    // Arrange
    await elements.menu(page, 'Collections').click()
    await pathNameShouldMatchRoute(page, '/collections')

    // Act
    await collection.createCollectionBtn(page).click()
    const iframe = await login.getLoginModalContent(page)

    // Assert
    expect(iframe!.getByText('Sign in')).toBeVisible()
  })
})

