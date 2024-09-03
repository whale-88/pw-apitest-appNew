import { test, expect } from "@playwright/test";

test('likes counter global', async ({page}) => {

    await page.goto('https://conduit.bondaracademy.com/');
    await page.getByText('Global Feed').click()
    const firstArticleLikeButton = page.locator('app-article-preview button').first()
    await expect(firstArticleLikeButton).toContainText('0')
    await firstArticleLikeButton.click()
    await expect(firstArticleLikeButton).toContainText('1')
    
})