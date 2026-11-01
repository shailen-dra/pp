import { test, expect, type Page } from '@playwright/test';
import { BASE_URL } from './base-url';

const ENDPOINT = 'https://api.web3forms.com/submit';
const EMAIL = 'shailendra.matat@gmail.com';
const MESSAGE = 'Hello, I would like to talk about a Shopify project.';

async function useTestKey(page: Page) {
  await page.locator('#contact-form input[name="access_key"]').evaluate((el) => {
    (el as HTMLInputElement).value = 'test-key';
  });
}

async function fillForm(page: Page) {
  const form = page.locator('#contact-form');
  await form.getByLabel('Name').fill('Test Visitor');
  await form.getByLabel('Email').fill('visitor@example.com');
  await form.getByLabel('Message').fill(MESSAGE);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('channels', async ({ page }) => {
  const contact = page.locator('section#contact');
  await expect(contact.locator('a[href="tel:+9779843679155"]')).toHaveCount(1);
  const whatsapp = contact.locator('a[href="https://wa.me/9779843679155"]');
  await expect(whatsapp).toHaveAttribute('target', '_blank');
  await expect(whatsapp).toHaveAttribute('rel', /noopener/);
  await expect(contact.locator(`a[href="mailto:${EMAIL}"]`)).toHaveCount(1);
});

test('success', async ({ page }) => {
  await page.route(ENDPOINT, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }),
  );
  await useTestKey(page);
  await fillForm(page);
  await page.locator('#contact-form button[type="submit"]').click();
  await expect(page.locator('[data-testid="form-status"]')).toHaveText("Thanks — I'll get back to you soon.");
  await expect(page.locator('#contact-form').getByLabel('Message')).toHaveValue('');
});

test('server error keeps input', async ({ page }) => {
  await page.route(ENDPOINT, (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{"success":false}' }),
  );
  await useTestKey(page);
  await fillForm(page);
  await page.locator('#contact-form button[type="submit"]').click();
  await expect(page.locator('[data-testid="form-status"]')).toContainText(EMAIL);
  await expect(page.locator('#contact-form').getByLabel('Message')).toHaveValue(MESSAGE);
});

test('network failure keeps input', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.abort());
  await useTestKey(page);
  await fillForm(page);
  await page.locator('#contact-form button[type="submit"]').click();
  await expect(page.locator('[data-testid="form-status"]')).toContainText(EMAIL);
  await expect(page.locator('#contact-form').getByLabel('Message')).toHaveValue(MESSAGE);
});

test('missing key', async ({ page }) => {
  let calls = 0;
  await page.route(ENDPOINT, (route) => {
    calls++;
    return route.fulfill({ status: 200, body: '{"success":true}' });
  });
  await fillForm(page);
  await page.locator('#contact-form button[type="submit"]').click();
  await expect(page.locator('[data-testid="form-status"]')).toContainText(EMAIL);
  await expect(page.locator('#contact-form').getByLabel('Message')).toHaveValue(MESSAGE);
  expect(calls).toBe(0);
});

test('double submit sends once', async ({ page }) => {
  let calls = 0;
  await page.route(ENDPOINT, async (route) => {
    calls++;
    await new Promise((resolve) => setTimeout(resolve, 300));
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
  });
  await useTestKey(page);
  await fillForm(page);
  await page.locator('#contact-form button[type="submit"]').evaluate((button) => {
    (button as HTMLButtonElement).click();
    (button as HTMLButtonElement).click();
  });
  await expect(page.locator('[data-testid="form-status"]')).toHaveText("Thanks — I'll get back to you soon.");
  expect(calls).toBe(1);
});

test('validation', async ({ page }) => {
  let calls = 0;
  await page.route(ENDPOINT, (route) => {
    calls++;
    return route.fulfill({ status: 200, body: '{"success":true}' });
  });
  await useTestKey(page);
  const form = page.locator('#contact-form');
  const submit = form.locator('button[type="submit"]');

  await submit.click();
  expect(await form.evaluate((f) => (f as HTMLFormElement).checkValidity())).toBe(false);

  await fillForm(page);
  await form.getByLabel('Email').fill('not-an-email');
  await submit.click();
  expect(await form.getByLabel('Email').evaluate((el) => (el as HTMLInputElement).validity.typeMismatch)).toBe(true);
  expect(calls).toBe(0);
});

test('no-JS submit posts natively', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  let body = '';
  await page.route(ENDPOINT, (route) => {
    body = route.request().postData() ?? '';
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<p>ok</p>' });
  });
  await page.goto(`${BASE_URL}/`);
  await fillForm(page);
  await page.locator('#contact-form button[type="submit"]').click();
  await expect.poll(() => body).toContain('access_key=');
  expect(body).toContain('message=');
  await context.close();
});

test('/thanks page', async ({ page }) => {
  await page.goto('/thanks');
  await expect(page.locator('main a[href="/"]')).toHaveCount(1);
});
