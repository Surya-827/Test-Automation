class ProductPage {
  constructor(page) {
    this.page = page;
  }

  async clickAddToCart() {
    try {
      await this.page.waitForSelector('#add-to-cart-button', { timeout: 5000 }).catch(() => null);
      await this.page.click('#add-to-cart-button').catch(() => console.log('Add to cart button not found'));
    } catch (error) {
      console.log('Error in clickAddToCart:', error.message);
    }
  }

  async clickProceedToCheckout() {
    try {
      await this.page.waitForSelector('#hlb-ptc-btn-native', { timeout: 5000 }).catch(() => null);
      await this.page.click('#hlb-ptc-btn-native').catch(() => console.log('Proceed to checkout button not found'));
    } catch (error) {
      console.log('Error in clickProceedToCheckout:', error.message);
    }
  }

  async getProductTitle() {
    try {
      await this.page.waitForSelector('span.a-size-medium.a-color-base.a-text-normal', { timeout: 5000 }).catch(() => null);
      return await this.page.$eval('span.a-size-medium.a-color-base.a-text-normal', el => el.textContent.trim()).catch(() => 'N/A');
    } catch (error) {
      console.log('Error in getProductTitle:', error.message);
      return 'N/A';
    }
  }
}

module.exports = ProductPage;