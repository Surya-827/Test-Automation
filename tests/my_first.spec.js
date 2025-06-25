// tests/my_first.spec.js
const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  const title = await page.title();
  expect(title).toBe('Example Domain');
});

test('Checking specific text in Title', async ({page}) =>{
    await page.goto('https://google.com');
    await expect(page).toHaveTitle('Google');
});