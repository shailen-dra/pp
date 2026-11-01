import { test, expect } from '@playwright/test';

test.describe('desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('nav links in order', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('[data-testid="desktop-nav"] a');
    await expect(links).toHaveText(['About', 'Skills', 'Journey', 'Contact']);
    const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    expect(hrefs).toEqual(['#about', '#skills', '#journey', '#contact']);
    await expect(links.last()).toHaveAttribute('data-variant', 'cta');
  });

  test('header stays visible after scroll', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const box = await page.locator('header[data-testid="site-header"]').boundingBox();
    expect(box?.y).toBe(0);
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test('mobile menu opens and closes on link tap', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('button[aria-controls="mobile-menu"]');
    const menu = page.locator('#mobile-menu');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Skills' }).click();
    await expect(menu).toBeHidden();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(new URL(page.url()).hash).toBe('#skills');
  });

  test('Escape closes mobile menu', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('button[aria-controls="mobile-menu"]');
    await button.click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
  });
});

test.describe('theme', () => {
  test('theme follows system', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await page.goto('http://localhost:4321/');
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await context.close();
  });

  test('theme toggle persists without flash', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'light' });
    const page = await context.newPage();
    await page.goto('http://localhost:4321/');
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    const toggle = page.locator('button[data-testid="theme-toggle"]');
    await expect(toggle).toHaveAttribute('aria-label', /.+/);
    await toggle.click();
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');

    await page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        (window as unknown as { __darkAtDCL: boolean }).__darkAtDCL =
          document.documentElement.classList.contains('dark');
      });
    });
    await page.reload();
    expect(await page.evaluate(() => (window as unknown as { __darkAtDCL: boolean }).__darkAtDCL)).toBe(true);
    await context.close();
  });
});
