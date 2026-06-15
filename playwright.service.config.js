const { defineConfig } = require('@playwright/test');
const { getServiceConfig, ServiceOS } = require('@azure/microsoft-playwright-testing');
const baseConfig = require('./playwright.config');

module.exports = defineConfig(
  baseConfig,
  getServiceConfig(baseConfig, {
    exposeNetwork: '<loopback>',
    timeout: 30000,
    os: ServiceOS.LINUX,
    useCloudHostedBrowsers: true // false = use only reporting, no hosted browsers
  }),
  {
    reporter: [
      ['list'],
      ['@azure/microsoft-playwright-testing/reporter']
    ]
  }
);
