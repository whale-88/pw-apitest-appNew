import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach(async ({page}) => {
  //When you want to mock an API you need to do it before you call to the server
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })

  await page.goto('https://conduit.bondaracademy.com/')

})

test('has title', async ({ page }) => {
  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = "New Mock Title"
    responseBody.articles[0].description = "New Mock Description"

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })

  await page.getByText('Global Feed').click()
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
  await expect(page.locator('app-article-list h1').first()).toContainText("New Mock Title")
  await expect(page.locator('app-article-list p').first()).toContainText("New Mock Description")
})

test('delete article', async ({page, request}) => {
  
  const addArcticle = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "test title",
        "description": "test description",
        "body": "test body",
        "tagList": []
      }}
  })

expect(addArcticle.status()).toEqual(201)

await page.getByText('Global Feed').click()
await page.getByText('test title').click()
await page.getByRole('button', {name: "Delete Article"}).first().click()
await page.getByText('Global Feed').click()

await expect(page.locator('app-article-list h1').first()).not.toContainText('test title')

})

test('create article and delete', async({page, request}) => {
  await page.getByText('New Article').click()
  await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright is awesome')
  await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('I love Playwright')
  await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('I love to use Playwright for automation')
  await page.getByRole('button', {name: 'Publish Article'}).click()
  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
  const articleResponseBody = await articleResponse.json()
  const slugId = articleResponseBody.article.slug

  await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome')
  await page.getByText('Home').click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')

  // const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  //   data: {
  //     "user": {
  //       "email": "mrtest@test.com",
  //       "password": "Welcome1"
  //     }
  //   }
  // })
  // const responseBody = await response.json()
  // const token = responseBody.user.token

  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`
  //   , {
  //   headers: {
  //     Authorization: `Token ${token}`
  //   }
  // }
  )

})
