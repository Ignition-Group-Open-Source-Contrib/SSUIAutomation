import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  use: {
    headless: true,
    browserName: 'chromium',
    baseURL: process.env.BASE_URL || 'http://t2.silversurfer.ignitiongroup.co.za/',
  },
  projects: [
    {
      name: 'uat',
      use: { 
        baseURL: process.env.UAT_URL,
      },
    },
    {
      name: 'prod',
      use: { 
        baseURL: process.env.PROD_URL,
      },
    },
  ],
});