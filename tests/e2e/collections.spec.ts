/* eslint-disable testing-library/prefer-screen-queries */
import { test, Page, expect } from '@playwright/test'
import { elements, pathNameShouldMatchRoute, scrollUntilElementFound, waitForPageLoaded } from '../utils/commmon'
import { collection, openCollections } from '../selectors/collections.selectors'
import { faker } from '@faker-js/faker'
import { AuthData, apiLogin } from '../utils/auth'
import { createCollection } from '../utils/collections'

test.describe('studio collections', async () => {
  let page: Page
  let authData: AuthData
  const email = `polybase${faker.word.noun()}@mailto.plus`
  const name = faker.lorem.word()
  const fullName = `newCollection/${name}`

  test.beforeEach(async ({ context, request }) => {
    authData = await apiLogin({ context, request, email })
    page = await context.newPage()
    await createCollection(request, authData, name)
    await page.goto('/')
  })

  test('when click colections, expected to be navigated to collections list', async () => {
    // Act
    await elements.menu(page, 'Collections').click()

    // Assert
    await pathNameShouldMatchRoute(page, '/collections')
  })

  test('collections page with all necessary elements opened', async () => {
    // Act
    await openCollections(page)

    // Assert
    expect(page.locator('h2:text("Collections")')).toBeVisible()
    await scrollUntilElementFound(`[testid="collection-list-item"]:text("${fullName}")`, page)
    expect(page.locator(`[testid="collection-list-item"]:text("${fullName}")`)).toBeVisible()
  })

  test('when select collection, expected collection details to be opened', async () => {
    // Arrange
    await openCollections(page)

    // Act
    await scrollUntilElementFound(`[testid="collection-list-item"]:text("${fullName}")`, page)
    page.locator(`[testid="collection-list-item"]:text("${fullName}")`).click()
    await waitForPageLoaded(page)

    // Assert
    await expect(page.getByRole('tab', { name: 'Data' })).toBeVisible()
    await expect(page.locator('[role="columnheader"]:text("id")')).toBeVisible() // headers are set in
    await expect(page.locator('[role="columnheader"]:text("name")')).toBeVisible() // created collection
    await pathNameShouldMatchRoute(page, `/collections/newCollection%2F${name}`)
    await expect(page.getByRole('tab', { name: 'Schema' })).toBeVisible()
    await page.getByRole('tab', { name: 'Schema' }).click()
    expect(collection.codeEditor(page)).toBeVisible()
    await pathNameShouldMatchRoute(page, `/collections/newCollection%2F${name}/schema`)
  })

  test('when click create collection, expected to be navigated to the app creation', async () => {
    // Arrange
    const text = '12345'
    await page.goto(`/collections/newCollection%2F${name}/schema`)
    await waitForPageLoaded(page)

    // Act
    await collection.codeEditor(page).fill(text)

    // Assert
    expect(await collection.activeLine(page).textContent()).not.toContain(text)
  })
})