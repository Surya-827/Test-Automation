import { test } from '@playwright/test';

test('Sauce Demo Add Cart Feature Check', async ({ page , context}) => {

  await context.tracing.start({
    screenshots: true,  // Capture screenshots during the trace   
    snapshots: true,    // Capture DOM snapshots during the trace
  })

  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill('error_user');
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();

  await context.tracing.stop({ path: 'trace_screenshots.zip' }); // Save the trace to a file
  console.log('Trace file created: trace_screenshots.zip');
  await page.close();
  await context.close();
});
