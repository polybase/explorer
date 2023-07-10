/* eslint-disable testing-library/prefer-screen-queries */
import { test, Page, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { collection, enterCode } from '../../selectors/collections.selectors'
import { Auth, createUser, emailLogin } from '../../utils/auth'
import { openAppSchema, openStudio, saveSchema } from '../../selectors/collections.selectors'

test.describe('studio collections', async () => {
  let page: Page
  let auth: Auth

  test.beforeEach(async ({ context, request }) => {
    const email = `polybase${faker.word.noun()}@mailto.plus`
    auth = await emailLogin({ email, context, request })
    await createUser(auth)
    page = await context.newPage()
    await page.goto('/')
  })


  test('when app created, expected app to be added to the list', async () => {
    // Arrange
    const appName = faker.person.firstName()
    await openAppSchema({ page, publicKey: auth.authState.publicKey!, appName })

    // Act
    await saveSchema(page)

    // Assert
    await openStudio(page)
    expect(page.locator(`[aria-label='app-name']:text("${appName}")`)).toBeVisible()
  })

  test('when save changes, expected schema to be edited', async () => {
    // Arrange
    await openAppSchema({ page, publicKey: auth.authState.publicKey! })

    // Act
    await enterCode(page)
    await saveSchema(page)

    // Assert
    expect(collection.saveAppBtn(page)).toBeDisabled()
  })
})