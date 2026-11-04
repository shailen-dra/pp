import { test, expect } from '@playwright/test';

test('favicon is the site monogram, not the Astro default', async ({ request }) => {
  const svg = await (await request.get('/favicon.svg')).text();
  expect(svg).toContain('data-monogram');
});

test('unknown pages show a styled 404 with a way home', async ({ page }) => {
  const response = await page.goto('/no-such-page');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText(/not found/i);
  await expect(page.locator('main a[href="/"]')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
