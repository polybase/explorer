/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test'
import { elements, pathNameShouldMatchRoute, waitForPageLoaded } from '../utils/commmon'

test.describe('home page tests', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageLoaded(page)
  })

  test('home page with all necessary elements opened', async ({ page }) => {
    // Assert
    expect(page.locator('h2[test-id="root-hash"]')).toBeVisible()
    expect(page.locator('h2[test-id="collection-amount"]')).toBeVisible()
    expect(page.locator('[aria-label="View source on Github"]')).toBeVisible()
  })

  test('when click on collections section, expected to be navigated to collections', async ({ page }) => {
    // Act
    await page.locator('h2[test-id="collection-amount"]').click()

    // Assert
    await pathNameShouldMatchRoute(page, '/collections')
  })

  test('when change the theme, expected colors to be updated', async ({ page }) => {
    // Arrange
    const attribute = async () => await page.locator('html').getAttribute('data-theme')

    // Act & Assert
    expect(await attribute()).toEqual('light')

    await page.locator('[aria-label="Switch to dark mode"]').click()
    expect(await attribute()).toEqual('dark')

    await page.locator('[aria-label="Switch to light mode"]').click()
    expect(await attribute()).toEqual('light')
  })

  test('when click on github icon, expected to be navigated to repo in new tab', async ({ page, context }) => {
    // Act
    await page.locator('[aria-label="View source on Github"]').click()
    const newPage = await context.waitForEvent('page')

    // Assert
    expect(newPage.url()).toEqual('https://github.com/polybase/explorer')
  })

  test('when click on docs in menu, expected to be navigated docs in new tab', async ({ page, context }) => {
    // Act
    await elements.menu(page, 'Docs').click()
    const newPage = await context.waitForEvent('page', { timeout: 10000 })

    // Assert
    expect(newPage.url()).toEqual('https://polybase.xyz/docs/introduction')
  })
})

