import { defineConfig, devices } from '@playwright/test';
import { BASE_URL, PORT } from './tests/e2e/base-url';

export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: BASE_URL },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run preview -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
});
