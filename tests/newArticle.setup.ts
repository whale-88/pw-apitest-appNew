import { test as setup, expect, request } from '@playwright/test';

setup('create new article', async ({page, request}) => {
    const addArcticle = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
          "article": {
            "title": "like counter",
            "description": "test description",
            "body": "test body",
            "tagList": []
          }}
      })
      
    expect(addArcticle.status()).toEqual(201)
    const responseBody = await addArcticle.json()
    const slugId = responseBody.article.slug
    process.env['SLUGID'] = slugId
    
    
})