import { test, expect } from '@playwright/test';

test('Amazon fashion search and add to cart', async ({ page }) => {
  await page.goto('https://www.amazon.in/');

  // Select 'Fashion' department from the dropdown
  await page.locator('select#searchDropdownBox').selectOption('search-alias=fashion');

  // Fill search box and submit
  await page.locator('input#twotabsearchtextbox').fill('shirts for men');
  await page.locator('input#nav-search-submit-button').click();

  // Sort by 'Price: High to Low'
  await page.locator('span.a-dropdown-label').click();
  await page.getByRole('option', { name: 'Price: High to Low' }).click();

  // Optionally, apply 'Get It by Tomorrow' filter if available
  const getItBy = page.getByRole('link', { name: /Get It by/i });
  if (await getItBy.count()) {
    await getItBy.first().click();
  }

  // Click on the first product
  const firstProduct = page.locator('div.s-main-slot div[data-component-type="s-search-result"]').first();
  await firstProduct.click();

  // Handle new tab if product opens in a new page
  const [productPage] = await Promise.all([
    page.context().waitForEvent('page'),
    // Sometimes Amazon opens product in a new tab
  ]);
  const product = productPage || page;

  // Select size if available
  const sizeOption = product.locator('span', { hasText: /^3XL$/ });
  if (await sizeOption.count()) {
    await sizeOption.first().click();
  }

  // Add to cart
  const addToCart = product.locator('input#add-to-cart-button');
  if (await addToCart.count()) {
    await addToCart.click();
  }

  // Go to cart
  await product.goto('https://www.amazon.in/gp/cart/view.html');

  // Proceed to buy
  const proceedToBuy = product.locator('input[name="proceedToRetailCheckout"]');
  if (await proceedToBuy.count()) {
    await proceedToBuy.click();
  }
});