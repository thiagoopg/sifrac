import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

//Definição do diretório de testes para o Playwright BDD
const testDir = defineBddConfig({
  features: './tests-playwright/features/**/*.feature',
  steps: './tests-playwright/steps/**/*.ts',
});

export default defineConfig({
  testDir,

  timeout: 60_000,

  expect: {
    timeout: 10_000,
  },

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 1 : 0,

  workers: 1,

  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',

    navigationTimeout: 15_000,
    actionTimeout: 15_000,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 20_000,
  },
});