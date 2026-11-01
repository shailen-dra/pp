import { test, expect, type Page } from '@playwright/test';

async function revealOpacities(page: Page) {
  const reveals = page.locator('[data-reveal]');
  expect(await reveals.count()).toBeGreaterThan(0);
  return reveals.evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
}

test('footer has copyright year and back to top', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer).toContainText(String(new Date().getFullYear()));
  await expect(footer.locator('a[href="#top"]')).toHaveCount(1);
  await expect(page.locator('header#top')).toHaveCount(1);
});

test('reduced motion shows content immediately', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('http://localhost:4321/');
  for (const opacity of await revealOpacities(page)) expect(opacity).toBe('1');
  await context.close();
});

test('content visible without JS', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://localhost:4321/');
  for (const opacity of await revealOpacities(page)) expect(opacity).toBe('1');
  await context.close();
});

test('sitemap and og image exist', async ({ request }) => {
  expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
  const og = await request.get('/og.png');
  expect(og.status()).toBe(200);
  expect(og.headers()['content-type']).toContain('image/png');
});

test('reveal elements become visible when scrolled into view', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto('http://localhost:4321/');
  const heading = page.locator('#contact-heading');
  await expect(heading).not.toHaveClass(/is-visible/);
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toHaveClass(/is-visible/);
  await expect.poll(() => heading.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await context.close();
});
