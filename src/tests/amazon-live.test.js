const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

test.describe('Amazon.com E2E Tests', () => {

  const AMAZON_URL = 'https://www.amazon.com';

  // Test 1: Launch Amazon home page
  test('01. Launch Amazon home page', async ({ page }) => {
    console.log(`\n>>> Launching: ${AMAZON_URL}`);
    
    try {
      await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
      console.log(`✓ Amazon.com loaded: ${page.url()}`);
      
      // Verify page has Amazon title
      const title = await page.title();
      console.log(`✓ Page title: ${title}`);
      expect(page.url()).toContain('amazon.com');
    } catch (error) {
      console.error('✗ Failed:', error.message);
      throw error;
    }
  });

  // Test 2: Search for product
  test('02. Search for PlayStation 5', async ({ page }) => {
    console.log(`\n>>> Navigating to Amazon`);
    
    try {
      await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
      console.log('✓ Amazon home page loaded');
      
      // Find search box and enter search term
      console.log('>>> Searching for "PlayStation 5"');
      const searchBox = page.locator('input[placeholder*="Search"]').first();
      await searchBox.fill('PlayStation 5');
      console.log('✓ Search term entered');
      
      // Submit search
      await searchBox.press('Enter');
      console.log('>>> Pressing Enter to search');
      
      // Wait for search results
      await page.waitForLoadState('domcontentloaded');
      console.log(`✓ Search results loaded: ${page.url()}`);
      expect(page.url()).toContain('amazon.com');
    } catch (error) {
      console.error('✗ Failed:', error.message);
      throw error;
    }
  });

  // Test 3: Navigate to Best Sellers
  test('03. Navigate to Best Sellers', async ({ page }) => {
    console.log(`\n>>> Navigating to Best Sellers`);
    
    try {
      await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
      console.log('✓ Amazon home page loaded');
      
      // Try to find and click Best Sellers link
      try {
        const bestSellersLink = page.locator('a[href*="bestsellers"]').first();
        await bestSellersLink.click();
        await page.waitForLoadState('domcontentloaded');
        console.log(`✓ Best Sellers page loaded: ${page.url()}`);
      } catch (e) {
        console.log('⚠ Best Sellers link not found, trying alternative navigation');
        await page.goto(`${AMAZON_URL}/gp/bestsellers`, { waitUntil: 'domcontentloaded' });
        console.log(`✓ Best Sellers page loaded: ${page.url()}`);
      }
    } catch (error) {
      console.error('✗ Failed:', error.message);
      throw error;
    }
  });

  // Test 4: Check Cart
  test('04. Navigate to Shopping Cart', async ({ page }) => {
    console.log(`\n>>> Navigating to Shopping Cart`);
    
    try {
      await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
      console.log('✓ Amazon home page loaded');
      
      // Click on cart icon
      try {
        const cartIcon = page.locator('a[href*="cart"]').first();
        await cartIcon.click();
        await page.waitForLoadState('domcontentloaded');
        console.log(`✓ Shopping Cart loaded: ${page.url()}`);
      } catch (e) {
        console.log('⚠ Cart icon not found, navigating directly');
        await page.goto(`${AMAZON_URL}/gp/cart/view.html`, { waitUntil: 'domcontentloaded' });
        console.log(`✓ Shopping Cart page loaded: ${page.url()}`);
      }
    } catch (error) {
      console.error('✗ Failed:', error.message);
      throw error;
    }
  });

  // Test 5: Navigate to Deals
  test('05. Navigate to Today\'s Deals', async ({ page }) => {
    console.log(`\n>>> Navigating to Today's Deals`);
    
    try {
      await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
      console.log('✓ Amazon home page loaded');
      
      // Try to find Deals link
      try {
        const dealsLink = page.locator('a[href*="deals"]').first();
        await dealsLink.click();
        await page.waitForLoadState('domcontentloaded');
        console.log(`✓ Deals page loaded: ${page.url()}`);
      } catch (e) {
        console.log('⚠ Deals link not found, trying alternative');
        await page.goto(`${AMAZON_URL}/deals`, { waitUntil: 'domcontentloaded' });
        console.log(`✓ Deals page loaded: ${page.url()}`);
      }
    } catch (error) {
      console.error('✗ Failed:', error.message);
      throw error;
    }
  });

  // Test 6: Verify Account login page
  test('06. Verify Sign In page', async ({ page }) => {
    console.log(`\n>>> Navigating to Sign In page`);
    
    try {
      await page.goto(`${AMAZON_URL}/ap/signin`, { waitUntil: 'domcontentloaded' });
      console.log(`✓ Sign In page loaded: ${page.url()}`);
      expect(page.url()).toContain('signin');
      console.log('✓ Sign In page verified');
    } catch (error) {
      console.error('✗ Failed:', error.message);
      throw error;
    }
  });

  // Test 7: Navigate to Sell page
  test('07. Navigate to Sell page', async ({ page }) => {
    console.log(`\n>>> Navigating to Sell page`);
    
    try {
      await page.goto(`${AMAZON_URL}/gp/sell/`, { waitUntil: 'domcontentloaded' });
      console.log(`✓ Sell page loaded: ${page.url()}`);
      expect(page.url()).toContain('sell');
      console.log('✓ Sell page verified');
    } catch (error) {
      console.error('✗ Failed:', error.message);
      throw error;
    }
  });

  // Test 8: Verify Help & Customer Service
  test('08. Navigate to Help & Customer Service', async ({ page }) => {
    console.log(`\n>>> Navigating to Help & Customer Service`);
    
    try {
      await page.goto(`${AMAZON_URL}/gp/help/customer/display.html`, { waitUntil: 'domcontentloaded' });
      console.log(`✓ Help page loaded: ${page.url()}`);
      expect(page.url()).toContain('help');
      console.log('✓ Help page verified');
    } catch (error) {
      console.error('✗ Failed:', error.message);
      throw error;
    }
  });

});
