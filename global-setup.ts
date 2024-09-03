import { request, expect } from "@playwright/test"
import user from '../pw-apitest-app/.auth/user.json'
import fs from 'fs'

async function globalSetup() {
    const authFile = '.auth/user.json'

    const context = await request.newContext()
    
    const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
          "user": {
            "email": "mrtest@test.com",
            "password": "Welcome1"
          }
        }
      })
      const responseBody = await responseToken.json()
      const token = responseBody.user.token
      user.origins[0].localStorage[0].value = token
      fs.writeFileSync(authFile, JSON.stringify(user))
    
      process.env['TOKEN'] = token


    const addArcticle = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
          "article": {
            "title": "Global like counter",
            "description": "test description",
            "body": "test body",
            "tagList": []
          }},
          headers: {
            Authorization: `Token ${process.env.TOKEN}`
          }
      })
      
    expect(addArcticle.status()).toEqual(201)
    const articleResponse = await addArcticle.json()
    const slugId = articleResponse.article.slug
    process.env['SLUGID'] = slugId
}

export default globalSetup;