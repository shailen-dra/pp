import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('has title, description and Open Graph tags', async ({ page }) => {
  await expect(page).toHaveTitle(/Shailendra/);
  for (const selector of [
    'meta[name="description"]',
    'meta[property="og:title"]',
    'meta[property="og:image"]',
    'meta[name="twitter:card"]',
  ]) {
    await expect(page.locator(selector)).toHaveCount(1);
  }
});

test('has Person JSON-LD', async ({ page }) => {
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(raw ?? '{}');
  expect(data['@type']).toBe('Person');
  expect(data.email).toBe('mailto:shailendra.matat@gmail.com');
});

test('has skip link', async ({ page }) => {
  await page.keyboard.press('Tab');
  const href = await page.evaluate(() => document.activeElement?.getAttribute('href'));
  expect(href).toBe('#main');
});
