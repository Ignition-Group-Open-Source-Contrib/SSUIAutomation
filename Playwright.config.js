import { defineConfig, devices } from '@playwright/test';
// playwright.config.js
export default defineConfig({
    testDir: './tests', // Folder where your test files will be located
    timeout: 120000, // Set a global timeout (e.g., 30 seconds)
    use: {
      headless: false, // Run tests in headless mode by default
      browserName: 'chromium', // The default browser for tests
    },
  });
  