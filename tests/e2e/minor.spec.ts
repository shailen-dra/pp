import { test, expect } from '@playwright/test';
import { BASE_URL } from './base-url';
import { contact } from '../../src/data/profile';

test('thanks page is not indexed', async ({ page, request }) => {
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  expect(sitemap).not.toContain('/thanks');
  await page.goto('/thanks');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('home page is indexable', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
});

test('no-JS visitors see an email fallback while the form key is a placeholder', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`);
  const notice = page.locator('[data-testid="form-nojs-notice"]');
  await expect(notice).toBeVisible();
  await expect(notice).toContainText(contact.email);
  await context.close();
});

test('JS visitors do not see the no-JS notice', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-testid="form-nojs-notice"]')).toBeHidden();
});

test.describe('phone width timeline', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test('timeline badges sit inside the side gutter', async ({ page }) => {
    await page.goto('/');
    const lefts = await page
      .locator('[data-testid="journey-item"] > span[aria-hidden="true"]')
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().left));
    expect(lefts.length).toBeGreaterThan(0);
    for (const left of lefts) expect(left).toBeGreaterThanOrEqual(16);
  });
});

test('form errors are announced as alerts, success as status', async ({ page }) => {
  await page.goto('/');
  const form = page.locator('#contact-form');
  await form.getByLabel('Name').fill('Test Visitor');
  await form.getByLabel('Email').fill('visitor@example.com');
  await form.getByLabel('Message').fill('Hello');
  await form.locator('button[type="submit"]').click();
  const status = page.locator('[data-testid="form-status"]');
  await expect(status).toContainText(contact.email);
  await expect(status).toHaveAttribute('role', 'alert');

  await page.route('https://api.web3forms.com/submit', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }),
  );
  await form.locator('input[name="access_key"]').evaluate((el) => {
    (el as HTMLInputElement).value = 'test-key';
  });
  await form.getByLabel('Name').fill('Test Visitor');
  await form.getByLabel('Email').fill('visitor@example.com');
  await form.getByLabel('Message').fill('Hello');
  await form.locator('button[type="submit"]').click();
  await expect(status).toHaveText("Thanks — I'll get back to you soon.");
  await expect(status).toHaveAttribute('role', 'status');
});
