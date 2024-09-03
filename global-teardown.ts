import { request } from "@playwright/test"

async function globalTeardown() {

  console.log('GLOBAL TEARDOWN');
    const context = await request.newContext()

    const deleteArticleResponse = await context.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`, { headers: {
        Authorization: `Token ${process.env.TOKEN}`
      }})

      
    
}

export default globalTeardown;