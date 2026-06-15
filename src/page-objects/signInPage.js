class SignInPage {
  constructor(page) {
    this.page = page;
  }

  async enterEmail(email) {
    try {
      await this.page.waitForSelector('#ap_email', { timeout: 5000 }).catch(() => null);
      await this.page.fill('#ap_email', email).catch(() => console.log('Email field not found'));
      await this.page.click('#continue').catch(() => console.log('Continue button not found'));
    } catch (error) {
      console.log('Error in enterEmail:', error.message);
    }
  }

  async enterPassword(password) {
    try {
      await this.page.waitForSelector('#ap_password', { timeout: 5000 }).catch(() => null);
      await this.page.fill('#ap_password', password).catch(() => console.log('Password field not found'));
      await this.page.click('#signInSubmit').catch(() => console.log('Sign in button not found'));
    } catch (error) {
      console.log('Error in enterPassword:', error.message);
    }
  }
}

module.exports = SignInPage;
