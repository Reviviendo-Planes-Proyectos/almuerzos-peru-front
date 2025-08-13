import { expect, test } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const title = await page.title();
  const expectedTitles = [
    'Playwright',
    'Fast and reliable end-to-end testing for modern web apps | Playwright',
  ];
  expect(expectedTitles).toContain(title);
});
