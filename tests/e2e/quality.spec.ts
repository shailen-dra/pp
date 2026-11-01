import { test, expect } from '@playwright/test';
import { BASE_URL } from './base-url';
import AxeBuilder from '@axe-core/playwright';

for (const colorScheme of ['light', 'dark'] as const) {
  test(`no axe violations (${colorScheme})`, async ({ browser }) => {
    const context = await browser.newContext({ colorScheme, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
    await context.close();
  });
}

test.describe('phone width', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test('no horizontal scroll at 360px', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  });
});

test('copy rules', async ({ page }) => {
  await page.goto('/');
  const text = await page.evaluate(() => document.body.innerText);
  expect(text).not.toMatch(/hire|available for|open to work|freelance/i);
  expect(text).toContain('Get in touch');
});

test('no project gallery', async ({ page }) => {
  await page.goto('/');
  const matches = await page.evaluate(() =>
    [...document.querySelectorAll('[id], h1, h2, h3, h4, h5, h6')]
      .filter((el) => /projects|portfolio|work samples/i.test(`${el.id} ${el.matches('h1,h2,h3,h4,h5,h6') ? el.textContent : ''}`))
      .map((el) => el.outerHTML.slice(0, 80)),
  );
  expect(matches).toEqual([]);
});

test.describe('keyboard', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('keyboard reaches form', async ({ page }) => {
    await page.goto('/');
    const unstyled: string[] = [];
    let reached = false;
    for (let i = 0; i < 60 && !reached; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const style = getComputedStyle(el);
        return {
          label: el.outerHTML.slice(0, 80),
          isNameField: el.matches('#contact-form [name="name"]'),
          visible: style.outlineStyle !== 'none' || style.boxShadow !== 'none',
        };
      });
      if (!info) continue;
      if (!info.visible) unstyled.push(info.label);
      reached = info.isNameField;
    }
    expect(reached).toBe(true);
    expect(unstyled).toEqual([]);
  });
});
