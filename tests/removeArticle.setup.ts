import { test as setup, expect, request } from '@playwright/test';

setup('delete article', async ({request}) => {

    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`)
    // expect (deleteArticleResponse.status).toEqual(204)
})