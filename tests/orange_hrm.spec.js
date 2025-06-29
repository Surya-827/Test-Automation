import { test, expect } from '@playwright/test';

test('Organe HRM Login Demo', async ({ page }) => {
    // Navigate to Orange HRM Website 
    await page.goto("https://opensource-demo.orangehrmlive.com/");
    await page.waitForTimeout(1000); // Wait for 1 second to ensure the page is fully loaded
    await page.locator("//input[@name='username']").fill("Admin");
    await page.locator("//input[@name='password']").fill("admin123");
    await page.waitForSelector("//button[@type='submit']", { timeout: 5000 }); // Correct usage
    await page.locator("//button[@type='submit']").click();
});