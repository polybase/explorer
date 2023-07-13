import { Frame, Page } from '@playwright/test'
import {
  waitForElementHidden,
  waitForPageLoaded,
} from '../utils/commmon'
import { login } from './login.selectors'
import { schemaExample } from '../fixture/schema'
import { baseENV } from '../config/config'

interface OpenCollection {
  publicKey: string;
  page: Page;
  appName?: string;
}

export const collection = {
  createCollectionBtn(page: Page) {
    return page.getByRole('button', { name: 'Create Collection' })
  },
  appNameInput(page: Page) {
    return page.locator('[aria-label="app-name-input"]')
  },
  createAppBtn(page: Page) {
    return page.getByRole('button', { name: 'Create App' })
  },
  schema(page: Page) {
    return page.locator('[aria-label="Schema"]')
  },
  collections(page: Page) {
    return page.locator('[aria-label="Collections"]')
  },
  settings(page: Page) {
    return page.locator('[aria-label="Settings"]')
  },
  codeEditor(page: Page) {
    return page.locator('[data-language="typescript"][role="textbox"]')
  },
  activeLine(page: Page) {
    return collection.codeEditor(page).locator('[class*="activeLine"]')
  },
  saveAppBtn(page: Page) {
    return page.getByRole('button', { name: 'Save' })
  },
  signBtn(page: Page | Frame) {
    return page.getByRole('button', { name: 'Sign' })
  },
  appName(page: Page) {
    return page.locator('[aria-label="nav-name"]')
  },
  collectionItem(page: Page) {
    return page.locator('[testid="collection-list-item"]')
  },
}

export const openStudio = async (page: Page) => {
  await page.goto(`${baseENV}/studio`)
  await waitForElementHidden(
    page.locator('[testId="studio-app-list-loader"]'),
  )
}

export const openCollections = async (page: Page) => {
  await page.goto(`${baseENV}/collections`)
  await waitForElementHidden(
    page.locator('[testId="collections-list-loader"]'),
  )
}

export const openStudioCreation = async (page: Page) => {
  await page.goto(`${baseENV}/studio/create`)
  await waitForPageLoaded(page)
}

export const openAppSchema = async ({
  page,
  publicKey,
  appName,
}: OpenCollection) => {
  await page.goto(
    `${baseENV}/studio/${encodeURIComponent(`pk/${publicKey}/${appName ?? 'Test'}`)}`,
  )
  await waitForPageLoaded(page)
}

export const saveSchema = async (page: Page) => {
  await collection.saveAppBtn(page).click()
  await page.waitForSelector('iframe', { state: 'visible' })
  const iframe = await login.getLoginModalContent(page)
  await iframe!.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await collection.signBtn(iframe!).click()
  await page.waitForResponse(/\/collections\/Collection\/records/)
  await page.waitForSelector('iframe', { state: 'hidden' })
}

export const enterCode = async (page: Page) => {
  await collection.activeLine(page).fill(schemaExample)
  await page.waitForSelector(':text("function setAge (age: number) {")', { state: 'visible' })
}
