import { Frame, Page } from '@playwright/test'
import {
  common,
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
}

export const openStudio = async (page: Page) => {
  await page.goto(`${baseENV}/studio`)
  await waitForElementHidden(
    page.locator('[testId="studio-app-list-loader"]'),
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
  await common.wait(1000)
}

export const saveSchema = async (page: Page) => {
  await collection.saveAppBtn(page).click()
  await common.wait(2000)
  const iframe = await login.getLoginModalContent(page)
  await iframe!.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await collection.signBtn(iframe!).click()
  await page.waitForResponse(/\/collections\/Collection\/records/)
}

export const enterCode = async (page: Page) => {
  await collection.activeLine(page).fill(schemaExample)
  await common.wait(1500)
}
