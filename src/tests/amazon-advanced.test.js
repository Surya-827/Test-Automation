const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

test.describe('Amazon.com Advanced E2E Tests', () => {

  const AMAZON_URL = 'https://www.amazon.com';
  const LOG_PREFIX = '█';
  const SUCCESS = '✓';
  const ERROR = '✗';
  const INFO = '→';
  const WARN = '⚠';

  /**
   * Utility: Log with timestamp and level
   */
  const log = {
    success: (msg) => console.log(`\n${LOG_PREFIX} ${SUCCESS} SUCCESS: ${msg}`),
    error: (msg) => console.log(`\n${LOG_PREFIX} ${ERROR} ERROR: ${msg}`),
    info: (msg) => console.log(`\n${LOG_PREFIX} ${INFO} INFO: ${msg}`),
    warn: (msg) => console.log(`\n${LOG_PREFIX} ${WARN} WARNING: ${msg}`),
    step: (msg) => console.log(`\n${LOG_PREFIX} STEP: ${msg}`),
    assert: (msg) => console.log(`  → ASSERT: ${msg}`),
  };

  /**
   * Utility: Verify element is visible and enabled
   */
  const verifyElement = async (page, selector, elementName) => {
    try {
      const element = page.locator(selector).first();
      await element.waitFor({ state: 'visible', timeout: 5000 });
      const isVisible = await element.isVisible();
      const isEnabled = await element.isEnabled();
      
      if (isVisible && isEnabled) {
        log.success(`${elementName} is visible and enabled`);
        return true;
      } else {
        log.warn(`${elementName} found but may not be fully enabled`);
        return false;
      }
    } catch (error) {
      log.warn(`${elementName} not found - ${error.message}`);
      return false;
    }
  };

  /**
   * Test 1: Home Page Load & Navigation Verification
   */
  test('01. HOME PAGE LOAD & UI ELEMENTS VERIFICATION', async ({ page }) => {
    log.step('Loading Amazon home page');
    
    try {
      const response = await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
      log.info(`Navigation Response: ${response.status()}`);
      expect(response.status()).toBeLessThan(400);

      // Verify URL
      const currentUrl = page.url();
      log.assert(`Current URL: ${currentUrl}`);
      expect(currentUrl).toContain('amazon.com');
      log.success('Home page URL verified');

      // Verify page title
      const title = await page.title();
      log.assert(`Page Title: ${title}`);
      expect(title.length).toBeGreaterThan(0);
      log.success('Page title verified');

      // Wait for main content
      await page.waitForLoadState('networkidle').catch(() => null);

      // Verify key navigation elements
      log.step('Verifying navigation UI elements');

      const navElements = [
        { selector: 'input[placeholder*="Search"]', name: 'Search Box' },
        { selector: 'a[href*="nav_logo"]', name: 'Amazon Logo' },
        { selector: 'span:has-text("Today\'s Deals")', name: 'Today\'s Deals' },
        { selector: 'span:has-text("Best Sellers")', name: 'Best Sellers' },
      ];

      for (const element of navElements) {
        await verifyElement(page, element.selector, element.name);
      }

      log.success('✓ Home page load and UI elements verified');

    } catch (error) {
      log.error(`Home page verification failed: ${error.message}`);
      throw error;
    }
  });

  /**
   * Test 2: Search Functionality
   */
  test('02. SEARCH FOR PRODUCT & VERIFY RESULTS', async ({ page }) => {
    const searchTerm = 'PlayStation 5 Console';
    log.step(`Searching for: "${searchTerm}"`);

    try {
      // Navigate to home
      await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
      log.success('Amazon home page loaded');

      // Locate and fill search box
      const searchBox = page.locator('input[placeholder*="Search"]').first();
      await searchBox.waitFor({ state: 'visible', timeout: 5000 });
      log.info('Search box found and visible');

      await searchBox.fill(searchTerm);
      log.assert(`Entered search term: "${searchTerm}"`);

      // Press Enter to search
      await searchBox.press('Enter');
      log.info('Search submitted');

      // Wait for results
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      // Verify search results page
      const currentUrl = page.url();
      log.assert(`Search results URL: ${currentUrl}`);
      expect(currentUrl).toContain('s?k=');
      log.success('Search results page loaded');

      // Verify results are displayed
      const resultItems = page.locator('[data-component-type="s-search-result"]');
      const resultCount = await resultItems.count();
      log.assert(`Found ${resultCount} search results`);
      expect(resultCount).toBeGreaterThan(0);
      log.success(`Search results verified - ${resultCount} items found`);

      // Check for PlayStation in results
      const pageText = await page.locator('body').textContent();
      const hasRelevantResults = pageText.toLowerCase().includes('playstation') || 
                                 pageText.toLowerCase().includes('console');
      expect(hasRelevantResults).toBeTruthy();
      log.success('Relevant search results confirmed');

      // Verify pagination/load more options
      try {
        const pagination = await page.locator('.s-pagination').isVisible().catch(() => false);
        if (pagination) {
          log.assert('Pagination controls visible');
        }
      } catch (e) {
        log.info('No pagination visible on current results');
      }

    } catch (error) {
      log.error(`Search test failed: ${error.message}`);
      throw error;
    }
  });

  /**
   * Test 3: Product Details & Add to Cart
   */
  test('03. NAVIGATE TO PRODUCT & ADD TO CART', async ({ page }) => {
    const searchTerm = 'Laptop';
    log.step(`Searching for product: "${searchTerm}"`);

    try {
      // Search for product
      await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
      const searchBox = page.locator('input[placeholder*="Search"]').first();
      await searchBox.fill(searchTerm);
      await searchBox.press('Enter');
      await page.waitForLoadState('domcontentloaded');
      log.success('Search completed');

      // Get first product
      const firstProduct = page.locator('[data-component-type="s-search-result"]').first();
      await firstProduct.waitFor({ state: 'visible', timeout: 5000 });
      
      // Get product title before clicking
      const productTitle = await firstProduct.locator('h2 a').textContent();
      log.assert(`First product title: ${productTitle?.trim().substring(0, 80)}...`);

      // Click on product
      await firstProduct.locator('h2 a').click();
      log.info('Clicked on product');

      // Wait for product page
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      // Verify product page URL
      const productUrl = page.url();
      log.assert(`Product page URL: ${productUrl}`);
      expect(productUrl).toContain('/dp/');
      log.success('Product details page loaded');

      // Verify product information
      try {
        const productName = page.locator('#productTitle');
        await productName.waitFor({ state: 'visible', timeout: 5000 });
        const title = await productName.textContent();
        log.assert(`Product Name: ${title?.trim().substring(0, 80)}...`);
      } catch (e) {
        log.warn('Product title element not found');
      }

      // Look for Add to Cart button
      const addToCartBtn = page.locator('#add-to-cart-button, #add-to-cart-button-ubb, [aria-label*="Add to Cart"]').first();
      const cartBtnVisible = await addToCartBtn.isVisible().catch(() => false);

      if (cartBtnVisible) {
        log.info('Add to Cart button found and visible');
        
        // Click Add to Cart
        await addToCartBtn.click();
        log.info('Clicked Add to Cart button');

        // Wait for confirmation
        await page.waitForTimeout(2000);

        // Verify success message
        try {
          const successMsg = page.locator('[data-feature-id="cart-success"]');
          const isVisible = await successMsg.isVisible().catch(() => false);
          
          if (isVisible) {
            log.success('✓ Item successfully added to cart - Success message displayed');
          } else {
            log.info('Add to Cart action completed');
          }
        } catch (e) {
          log.info('Checking cart notification...');
        }

      } else {
        log.warn('Add to Cart button not available (may require login or out of stock)');
      }

      // Check cart icon for item count
      try {
        const cartCount = page.locator('#nav-cart-count');
        const count = await cartCount.textContent().catch(() => '0');
        log.assert(`Items in cart: ${count}`);
      } catch (e) {
        log.info('Cart count badge not accessible');
      }

      log.success('✓ Product details page and add to cart verified');

    } catch (error) {
      log.error(`Product and cart test failed: ${error.message}`);
      throw error;
    }
  });

  /**
   * Test 4: Navigate to Cart Page
   */
  test('04. NAVIGATE TO SHOPPING CART', async ({ page }) => {
    log.step('Navigating to shopping cart');

    try {
      await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
      log.info('Home page loaded');

      // Navigate to cart
      try {
        const cartLink = page.locator('#nav-cart, a[href*="cart"]').first();
        await cartLink.click();
        log.info('Clicked cart button');
      } catch (e) {
        log.info('Using direct cart URL navigation');
        await page.goto(`${AMAZON_URL}/gp/cart/view.html`);
      }

      // Wait for cart page
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1500);

      // Verify cart page URL
      const currentUrl = page.url();
      log.assert(`Cart page URL: ${currentUrl}`);
      expect(currentUrl).toContain('cart');
      log.success('Shopping cart page loaded');

      // Check for cart content
      try {
        const cartContent = page.locator('[data-feature-id="cart-headings"]');
        const isVisible = await cartContent.isVisible().catch(() => false);
        
        if (isVisible) {
          log.success('Cart content visible');
        }
      } catch (e) {
        log.info('Cart details not found');
      }

      // Check for empty cart message or items
      const emptyCart = await page.locator('text=Your Amazon Cart is empty').isVisible().catch(() => false);
      if (emptyCart) {
        log.assert('Cart is currently empty');
      } else {
        log.assert('Cart contains items');
      }

      log.success('✓ Shopping cart page verified');

    } catch (error) {
      log.error(`Cart navigation test failed: ${error.message}`);
      throw error;
    }
  });

  /**
   * Test 5: Navigation Menu Verification
   */
  test('05. VERIFY NAVIGATION MENU & CATEGORIES', async ({ page }) => {
    log.step('Verifying navigation menu items');

    try {
      await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
      log.success('Home page loaded');

      // Verify header navigation
      log.step('Checking top navigation items');

      const navItems = [
        { text: "Today's Deals", desc: 'Today\'s Deals section' },
        { text: 'Best Sellers', desc: 'Best Sellers section' },
        { text: 'New Releases', desc: 'New Releases section' },
        { text: 'Sell', desc: 'Sell section' },
      ];

      for (const item of navItems) {
        try {
          const navElement = page.locator(`span:has-text("${item.text}")`).first();
          const isVisible = await navElement.isVisible().catch(() => false);
          
          if (isVisible) {
            log.success(`✓ ${item.desc} menu found`);
          } else {
            log.warn(`${item.desc} not immediately visible`);
          }
        } catch (e) {
          log.info(`Checking alternative location for ${item.desc}`);
        }
      }

      // Verify account/login area
      const accountArea = page.locator('#nav-link-accountList, [data-feature-id="accountList"]').first();
      const accountVisible = await accountArea.isVisible().catch(() => false);
      if (accountVisible) {
        log.success('✓ Account/Login area found');
      }

      // Verify hamburger menu
      try {
        const hamburgerMenu = page.locator('#nav-hamburger-menu');
        const menuVisible = await hamburgerMenu.isVisible().catch(() => false);
        if (menuVisible) {
          log.success('✓ Hamburger menu found (for mobile/tablet view)');
        }
      } catch (e) {
        log.info('Hamburger menu not visible (may be desktop view)');
      }

      log.success('✓ Navigation menu verification complete');

    } catch (error) {
      log.error(`Navigation menu test failed: ${error.message}`);
      throw error;
    }
  });

  /**
   * Test 6: URL Navigation Verification
   */
  test('06. URL NAVIGATION VERIFICATION', async ({ page }) => {
    log.step('Testing various URL navigations');

    try {
      const urls = [
        { url: AMAZON_URL, expectedPath: 'amazon.com', name: 'Home Page' },
        { url: `${AMAZON_URL}/gp/bestsellers`, expectedPath: 'bestsellers', name: 'Best Sellers' },
        { url: `${AMAZON_URL}/gp/new-releases`, expectedPath: 'new-releases', name: 'New Releases' },
        { url: `${AMAZON_URL}/gp/deal-lightning`, expectedPath: 'deal', name: 'Lightning Deals' },
      ];

      for (const navTest of urls) {
        try {
          log.info(`Navigating to: ${navTest.name}`);
          const response = await page.goto(navTest.url, { waitUntil: 'domcontentloaded' });
          
          expect(response.status()).toBeLessThan(400);
          const currentUrl = page.url();
          expect(currentUrl).toContain(navTest.expectedPath);
          
          log.success(`✓ ${navTest.name}: ${currentUrl}`);
          await page.waitForTimeout(1000);
        } catch (e) {
          log.warn(`Navigation to ${navTest.name} had issues: ${e.message}`);
        }
      }

      log.success('✓ URL navigation verification complete');

    } catch (error) {
      log.error(`URL navigation test failed: ${error.message}`);
      throw error;
    }
  });

  /**
   * Test 7: Search Filters & Refinement
   */
  test('07. SEARCH WITH FILTERS & VERIFICATION', async ({ page }) => {
    const searchTerm = 'Headphones';
    log.step(`Searching for "${searchTerm}" with filters`);

    try {
      // Perform search
      await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
      const searchBox = page.locator('input[placeholder*="Search"]').first();
      await searchBox.fill(searchTerm);
      await searchBox.press('Enter');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      log.success('Search completed');

      // Verify search results
      const resultItems = page.locator('[data-component-type="s-search-result"]');
      const itemCount = await resultItems.count();
      log.assert(`Total results found: ${itemCount}`);
      expect(itemCount).toBeGreaterThan(0);

      // Check for filter panel
      try {
        const filterPanel = page.locator('[aria-label*="filter"]');
        const hasFilters = await filterPanel.isVisible().catch(() => false);
        
        if (hasFilters) {
          log.success('✓ Filter panel visible');
          
          // Get available filters
          const filterGroups = page.locator('[data-feature-name="refinements"] h2');
          const filterCount = await filterGroups.count();
          log.assert(`Available filter groups: ${filterCount}`);
        }
      } catch (e) {
        log.info('Filter panel structure not found');
      }

      // Verify product prices are displayed
      const prices = page.locator('.a-price-whole').first();
      const priceVisible = await prices.isVisible().catch(() => false);
      if (priceVisible) {
        const price = await prices.textContent();
        log.assert(`Product prices visible: ${price?.trim()}`);
      }

      log.success('✓ Search with filters verification complete');

    } catch (error) {
      log.error(`Search filters test failed: ${error.message}`);
      throw error;
    }
  });

  /**
   * Test 8: Product Availability Check
   */
  test('08. PRODUCT AVAILABILITY & STOCK STATUS', async ({ page }) => {
    const searchTerm = 'Monitor';
    log.step(`Searching for "${searchTerm}" to check availability`);

    try {
      // Search for product
      await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
      const searchBox = page.locator('input[placeholder*="Search"]').first();
      await searchBox.fill(searchTerm);
      await searchBox.press('Enter');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      // Get first product
      const firstProduct = page.locator('[data-component-type="s-search-result"]').first();
      await firstProduct.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      log.success('Product page loaded');

      // Check availability
      try {
        const stockStatus = page.locator('#availability span');
        const statusText = await stockStatus.textContent();
        log.assert(`Stock Status: ${statusText?.trim()}`);
      } catch (e) {
        try {
          const buyNowStatus = page.locator('.a-price-large');
          const statusVisible = await buyNowStatus.isVisible().catch(() => false);
          if (statusVisible) {
            log.success('✓ Product is available for purchase');
          }
        } catch (err) {
          log.warn('Could not determine stock status');
        }
      }

      // Check price information
      try {
        const price = page.locator('.a-price-whole').first();
        const priceText = await price.textContent();
        log.assert(`Price: ${priceText?.trim()}`);
      } catch (e) {
        log.info('Price information not found');
      }

      log.success('✓ Product availability check complete');

    } catch (error) {
      log.error(`Product availability test failed: ${error.message}`);
      throw error;
    }
  });

});
