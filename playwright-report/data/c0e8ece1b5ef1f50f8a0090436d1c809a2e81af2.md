# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: amazon-advanced.test.js >> Amazon.com Advanced E2E Tests >> 03. NAVIGATE TO PRODUCT & ADD TO CART
- Location: src\tests\amazon-advanced.test.js:164:3

# Error details

```
Error: locator.textContent: Target page, context or browser has been closed
Call log:
  - waiting for locator('[data-component-type="s-search-result"]').first().locator('h2 a')

```

# Test source

```ts
  82  |         { selector: 'span:has-text("Best Sellers")', name: 'Best Sellers' },
  83  |       ];
  84  | 
  85  |       for (const element of navElements) {
  86  |         await verifyElement(page, element.selector, element.name);
  87  |       }
  88  | 
  89  |       log.success('✓ Home page load and UI elements verified');
  90  | 
  91  |     } catch (error) {
  92  |       log.error(`Home page verification failed: ${error.message}`);
  93  |       throw error;
  94  |     }
  95  |   });
  96  | 
  97  |   /**
  98  |    * Test 2: Search Functionality
  99  |    */
  100 |   test('02. SEARCH FOR PRODUCT & VERIFY RESULTS', async ({ page }) => {
  101 |     const searchTerm = 'PlayStation 5 Console';
  102 |     log.step(`Searching for: "${searchTerm}"`);
  103 | 
  104 |     try {
  105 |       // Navigate to home
  106 |       await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
  107 |       log.success('Amazon home page loaded');
  108 | 
  109 |       // Locate and fill search box
  110 |       const searchBox = page.locator('input[placeholder*="Search"]').first();
  111 |       await searchBox.waitFor({ state: 'visible', timeout: 5000 });
  112 |       log.info('Search box found and visible');
  113 | 
  114 |       await searchBox.fill(searchTerm);
  115 |       log.assert(`Entered search term: "${searchTerm}"`);
  116 | 
  117 |       // Press Enter to search
  118 |       await searchBox.press('Enter');
  119 |       log.info('Search submitted');
  120 | 
  121 |       // Wait for results
  122 |       await page.waitForLoadState('domcontentloaded');
  123 |       await page.waitForTimeout(2000);
  124 | 
  125 |       // Verify search results page
  126 |       const currentUrl = page.url();
  127 |       log.assert(`Search results URL: ${currentUrl}`);
  128 |       expect(currentUrl).toContain('s?k=');
  129 |       log.success('Search results page loaded');
  130 | 
  131 |       // Verify results are displayed
  132 |       const resultItems = page.locator('[data-component-type="s-search-result"]');
  133 |       const resultCount = await resultItems.count();
  134 |       log.assert(`Found ${resultCount} search results`);
  135 |       expect(resultCount).toBeGreaterThan(0);
  136 |       log.success(`Search results verified - ${resultCount} items found`);
  137 | 
  138 |       // Check for PlayStation in results
  139 |       const pageText = await page.locator('body').textContent();
  140 |       const hasRelevantResults = pageText.toLowerCase().includes('playstation') || 
  141 |                                  pageText.toLowerCase().includes('console');
  142 |       expect(hasRelevantResults).toBeTruthy();
  143 |       log.success('Relevant search results confirmed');
  144 | 
  145 |       // Verify pagination/load more options
  146 |       try {
  147 |         const pagination = await page.locator('.s-pagination').isVisible().catch(() => false);
  148 |         if (pagination) {
  149 |           log.assert('Pagination controls visible');
  150 |         }
  151 |       } catch (e) {
  152 |         log.info('No pagination visible on current results');
  153 |       }
  154 | 
  155 |     } catch (error) {
  156 |       log.error(`Search test failed: ${error.message}`);
  157 |       throw error;
  158 |     }
  159 |   });
  160 | 
  161 |   /**
  162 |    * Test 3: Product Details & Add to Cart
  163 |    */
  164 |   test('03. NAVIGATE TO PRODUCT & ADD TO CART', async ({ page }) => {
  165 |     const searchTerm = 'Laptop';
  166 |     log.step(`Searching for product: "${searchTerm}"`);
  167 | 
  168 |     try {
  169 |       // Search for product
  170 |       await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
  171 |       const searchBox = page.locator('input[placeholder*="Search"]').first();
  172 |       await searchBox.fill(searchTerm);
  173 |       await searchBox.press('Enter');
  174 |       await page.waitForLoadState('domcontentloaded');
  175 |       log.success('Search completed');
  176 | 
  177 |       // Get first product
  178 |       const firstProduct = page.locator('[data-component-type="s-search-result"]').first();
  179 |       await firstProduct.waitFor({ state: 'visible', timeout: 5000 });
  180 |       
  181 |       // Get product title before clicking
> 182 |       const productTitle = await firstProduct.locator('h2 a').textContent();
      |                                                               ^ Error: locator.textContent: Target page, context or browser has been closed
  183 |       log.assert(`First product title: ${productTitle?.trim().substring(0, 80)}...`);
  184 | 
  185 |       // Click on product
  186 |       await firstProduct.locator('h2 a').click();
  187 |       log.info('Clicked on product');
  188 | 
  189 |       // Wait for product page
  190 |       await page.waitForLoadState('domcontentloaded');
  191 |       await page.waitForTimeout(2000);
  192 | 
  193 |       // Verify product page URL
  194 |       const productUrl = page.url();
  195 |       log.assert(`Product page URL: ${productUrl}`);
  196 |       expect(productUrl).toContain('/dp/');
  197 |       log.success('Product details page loaded');
  198 | 
  199 |       // Verify product information
  200 |       try {
  201 |         const productName = page.locator('#productTitle');
  202 |         await productName.waitFor({ state: 'visible', timeout: 5000 });
  203 |         const title = await productName.textContent();
  204 |         log.assert(`Product Name: ${title?.trim().substring(0, 80)}...`);
  205 |       } catch (e) {
  206 |         log.warn('Product title element not found');
  207 |       }
  208 | 
  209 |       // Look for Add to Cart button
  210 |       const addToCartBtn = page.locator('#add-to-cart-button, #add-to-cart-button-ubb, [aria-label*="Add to Cart"]').first();
  211 |       const cartBtnVisible = await addToCartBtn.isVisible().catch(() => false);
  212 | 
  213 |       if (cartBtnVisible) {
  214 |         log.info('Add to Cart button found and visible');
  215 |         
  216 |         // Click Add to Cart
  217 |         await addToCartBtn.click();
  218 |         log.info('Clicked Add to Cart button');
  219 | 
  220 |         // Wait for confirmation
  221 |         await page.waitForTimeout(2000);
  222 | 
  223 |         // Verify success message
  224 |         try {
  225 |           const successMsg = page.locator('[data-feature-id="cart-success"]');
  226 |           const isVisible = await successMsg.isVisible().catch(() => false);
  227 |           
  228 |           if (isVisible) {
  229 |             log.success('✓ Item successfully added to cart - Success message displayed');
  230 |           } else {
  231 |             log.info('Add to Cart action completed');
  232 |           }
  233 |         } catch (e) {
  234 |           log.info('Checking cart notification...');
  235 |         }
  236 | 
  237 |       } else {
  238 |         log.warn('Add to Cart button not available (may require login or out of stock)');
  239 |       }
  240 | 
  241 |       // Check cart icon for item count
  242 |       try {
  243 |         const cartCount = page.locator('#nav-cart-count');
  244 |         const count = await cartCount.textContent().catch(() => '0');
  245 |         log.assert(`Items in cart: ${count}`);
  246 |       } catch (e) {
  247 |         log.info('Cart count badge not accessible');
  248 |       }
  249 | 
  250 |       log.success('✓ Product details page and add to cart verified');
  251 | 
  252 |     } catch (error) {
  253 |       log.error(`Product and cart test failed: ${error.message}`);
  254 |       throw error;
  255 |     }
  256 |   });
  257 | 
  258 |   /**
  259 |    * Test 4: Navigate to Cart Page
  260 |    */
  261 |   test('04. NAVIGATE TO SHOPPING CART', async ({ page }) => {
  262 |     log.step('Navigating to shopping cart');
  263 | 
  264 |     try {
  265 |       await page.goto(AMAZON_URL, { waitUntil: 'domcontentloaded' });
  266 |       log.info('Home page loaded');
  267 | 
  268 |       // Navigate to cart
  269 |       try {
  270 |         const cartLink = page.locator('#nav-cart, a[href*="cart"]').first();
  271 |         await cartLink.click();
  272 |         log.info('Clicked cart button');
  273 |       } catch (e) {
  274 |         log.info('Using direct cart URL navigation');
  275 |         await page.goto(`${AMAZON_URL}/gp/cart/view.html`);
  276 |       }
  277 | 
  278 |       // Wait for cart page
  279 |       await page.waitForLoadState('domcontentloaded');
  280 |       await page.waitForTimeout(1500);
  281 | 
  282 |       // Verify cart page URL
```