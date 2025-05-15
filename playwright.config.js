import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

console.log("Playwright config loaded!");

export default defineConfig({
  testDir: './tests',
  timeout: 360000,
  maxFailures: 1, // it allow us to stop the entire execution after the 1 test failure..
  expect: {
    timeout: 30000 // Global expect timeout
  },
  reporter: [
  ['list'],
  ['html', { outputFolder: 'playwright-report' }], // Single HTML reporter
  ['./custom-reporter.js', { outputFile: 'test-stats.json' }]
],

  projects: [
    {
      name: 'uat', // Must match --project=uat
      use: {
        headless: true, // Or false for debugging
        browserName: 'chromium',
        baseURL: process.env.UAT_URL || 'http://t2.silversurfer.ignitiongroup.co.za',
        RUN_CANCEL: process.env.RUN_CANCEL === 'true' // Default false
      },
    },
    {
      name: 'prod',
      use: {
        headless: true,
        browserName: 'chromium',
        baseURL: process.env.PROD_URL || 'https://silversurfer.ignitiongroup.co.za/Auth',
        RUN_CANCEL: process.env.RUN_CANCEL === 'true' // Default false
      },
    }
  ]
});