import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

console.log("Playwright config loaded!");

export default defineConfig({
  testDir: './tests',
  timeout: 360000,
  expect: {
    timeout: 30000 // Global expect timeout
  },
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  projects: [
    {
      name: 'uat', // Must match --project=uat
      use: {
        headless: false, // Or false for debugging
        browserName: 'chromium',
        baseURL: process.env.UAT_URL || 'http://t2.silversurfer.ignitiongroup.co.za',
      },
    },
    {
      name: 'prod',
      use: {
        headless: false,
        browserName: 'chromium',
        baseURL: process.env.PROD_URL || 'https://silversurfer.ignitiongroup.co.za/Auth',
      },
    }
  ]
});