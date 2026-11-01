import { test, expect } from '@playwright/test';
import { profile } from '../../src/data/profile';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('hero shows name, three roles and headline', async ({ page }) => {
  await expect(page.locator('h1')).toContainText(profile.name);
  await expect(page.locator('[data-testid="hero-roles"] li')).toHaveCount(3);
  await expect(page.getByText(profile.headline)).toBeVisible();
});

test('hero CTAs', async ({ page }) => {
  const contactCta = page.locator('a[data-testid="cta-contact"]');
  await expect(contactCta).toHaveAttribute('href', '#contact');
  await expect(contactCta).toHaveText('Get in touch');

  const cvCta = page.locator('a[data-testid="cta-cv"]');
  await expect(cvCta).toHaveAttribute('href', '/cv.pdf');
  await expect(cvCta).toHaveAttribute('download', /.*/);
});

test('photo has alt and dimensions', async ({ page }) => {
  const img = page.locator('[data-testid="hero"] img');
  await expect(img).toHaveAttribute('alt', /.+/);
  await expect(img).toHaveAttribute('width', /^\d+$/);
  await expect(img).toHaveAttribute('height', /^\d+$/);
});

test('about has Off the clock line mentioning music and sports', async ({ page }) => {
  const about = page.locator('section#about');
  await expect(about).toContainText(/music/i);
  await expect(about).toContainText(/sports/i);
});
