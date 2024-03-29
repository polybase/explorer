/* eslint-disable testing-library/prefer-screen-queries */
import { test, Page, expect } from '@playwright/test'
import { checkValidationMessage, elements, pathNameShouldMatchRoute, waitForPageLoaded } from '../../utils/commmon'
import { collection, enterCode, openAppSchema, openStudio, openStudioCreation } from '../../selectors/collections.selectors'
import { Auth, walletLogin, createUser } from '../../utils/auth'

test.describe('studio collections', async () => {
  let page: Page
  let auth: Auth

  test.beforeEach(async ({ context }) => {
    auth = await walletLogin(context)
    await createUser(auth)
    page = await context.newPage()
    await page.goto('/')
  })

  test('when click studio, expected to be navigated to apps page', async () => {
    // Act
    await elements.menu(page, 'Studio').click()
    await waitForPageLoaded(page)

    // Assert
    await pathNameShouldMatchRoute(page, '/studio')
  })

  test('studio page with all necessary elements opened', async () => {
    // Arrange
    await openStudio(page)

    // Assert
    expect(page.locator(`:text("PublicKey: ${auth.authState.publicKey}")`)).toBeVisible()
    expect(page.getByRole('link', { name: 'Create App' })).toBeVisible()
    expect(elements.menu(page, 'Explorer')).toBeVisible()
    expect(elements.menu(page, 'Docs')).toBeVisible()
  })

  test('when click create collection, expected to be navigated to the app creation', async () => {
    // Act
    await collection.createCollectionBtn(page).click()

    // Assert
    await pathNameShouldMatchRoute(page, '/studio/create')
  })

  test('when create app with empty name, expected validation should be displayed', async () => {
    // Arrange
    await openStudioCreation(page)

    // Act
    await collection.createAppBtn(page).click()

    // Assert
    // smth should be displayed
  })

  test('when invalid app name with spaces, expected to validation message to be displayed', async () => {
    // Arrange
    const appName = ' '
    await openStudioCreation(page)

    // Act
    await collection.appNameInput(page).fill(appName)

    // Assert
    await checkValidationMessage(page, 'Spaces are not allowed')
  })

  test('when invalid app name with slash, expected to validation message to be displayed', async () => {
    // Arrange
    const appName = '/'
    await openStudioCreation(page)

    // Act
    await collection.appNameInput(page).fill(appName)

    // Assert
    await checkValidationMessage(page, 'Slash `/` is not allowed')
  })

  test('when enter valid app name, expected to be navigated to the schema creation', async () => {
    // Arrange
    const appName = 'testName'
    await openStudioCreation(page)

    // Act
    await collection.appNameInput(page).fill(appName)
    await collection.createAppBtn(page).click()

    // Assert
    await pathNameShouldMatchRoute(page, `/studio/${encodeURIComponent(`pk/${auth.authState.publicKey}/${appName}`)}`)
  })

  test('when open app creation page, expected all necessary elements to be displayed', async () => {
    // Arrange
    const appName = 'Test'
    await openAppSchema({ page, publicKey: auth.authState.publicKey!, appName })

    // Assert
    expect(collection.appName(page)).toBeVisible()
    expect(await collection.appName(page).textContent()).toEqual(appName)
    expect(collection.schema(page)).toBeVisible()
    expect(collection.collections(page)).toBeVisible()
    expect(collection.settings(page)).toBeVisible()
    expect(collection.saveAppBtn(page)).toBeVisible()
    expect(collection.codeEditor(page)).toBeVisible()
  })

  test('when change code, expected schema to be edited', async () => {
    // Arrange
    await openAppSchema({ page, publicKey: auth.authState.publicKey! })

    // Act
    await enterCode(page)

    // Assert
    await page.waitForSelector(':text("NewUsers")') // name of the new added collection
  })

  test.skip('when open collection preview, expected the structure to be displayed', async () => {
    // Arrange
    await openAppSchema({ page, publicKey: auth.authState.publicKey! })
    await enterCode(page)

    // Act
    await collection.collections(page).click()

    // Assert
    expect(page.locator(':text("User")')).toBeVisible()
    expect(page.locator(':text("NewUsers")')).toBeVisible()
  })
})