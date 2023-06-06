import { test, expect } from '@playwright/test'

test.describe('test', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('home page with all necessary elements opened', async ({ page }) => {
    await expect(page.locator('h2[test-id="root-hash"]')).toBeVisible()
    await expect(page.locator('h2[test-id="collection-amount"]')).toBeVisible()

    expect(
      page.locator('a[href="https://docs.polybase.xyz"]'),
    ).toBeTruthy()
    expect(
      page.locator('a[href="https://polybase.xyz/whitepaper"]'),
    ).toBeTruthy()
    expect(
      page.locator('a[href="https://social.testnet.polybase.xyz"]'),
    ).toBeTruthy()
  })
})
