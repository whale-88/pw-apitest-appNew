import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach(async ({page}) => {
  //When you want to mock an API you need to do it before you call to the server
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })

  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = "New Test Title"
    responseBody.articles[0].description = "New Test Description"

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })

  await page.goto('https://conduit.bondaracademy.com/')
})

test('has title', async ({ page }) => {
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
  await expect(page.locator('app-article-list h1').first()).toContainText("New Test Title")
  await expect(page.locator('app-article-list p').first()).toContainText("New Test Description")
})
