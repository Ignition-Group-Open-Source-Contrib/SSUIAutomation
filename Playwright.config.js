import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

console.log("Playwright config loaded!");

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  projects: [
    {
      name: 'uat', // Must match --project=uat
      use: {
        headless: true, // Or false for debugging
        browserName: 'chromium',
        baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://t2.silversurfer.ignitiongroup.co.za',
      },
    },
    {
      name: 'prod',
      use: {
        headless: true,
        browserName: 'chromium',
        baseURL: process.env.PROD_URL || 'https://silversurfer.ignitiongroup.co.za/Auth',
      },
    }
  ]
});