import { Page } from '@playwright/test'

export const collection = {
  createCollectionBtn(page: Page) {
    return page.getByRole('button', { name: 'Create Collection' })
  },
}
