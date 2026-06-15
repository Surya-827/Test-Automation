class CartPage {
  constructor(page) {
    this.page = page;
  }

  async clickCheckout() {
    try {
      await this.page.waitForSelector('#sc-buy-box-ptc-button', { timeout: 5000 }).catch(() => null);
      await this.page.click('#sc-buy-box-ptc-button').catch(() => console.log('Checkout button not found'));
    } catch (error) {
      console.log('Error in clickCheckout:', error.message);
    }
  }
}

module.exports = CartPage;