import { test, expect } from '@playwright/test';

test.describe('Navigating away from the document composer page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await expect(
      page.locator('button:has-text("Create your first document")')
    ).toBeVisible();
    await page.locator('button:has-text("Create your first document")').click();
    await page.waitForURL('**/compose/**');
  });

  test('should delete the document if there is no content', async ({
    page,
  }) => {
    await page.getByText('Dashboard').click();
    await expect(
      page.locator('button:has-text("Create your first document")')
    ).toBeVisible();
  });
});

test.describe('Unloading the document composer page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await expect(
      page.locator('button:has-text("Create your first document")')
    ).toBeVisible();
    await page.locator('button:has-text("Create your first document")').click();
    await page.waitForURL('**/compose/**');
  });

  test('should delete the document if there is no content', async ({
    page,
  }) => {
    const context = page.context();
    await page.close({ runBeforeUnload: true });
    const newPage = await context.newPage();
    await newPage.goto(`/dashboard`);
    await expect(
      newPage.locator('button:has-text("Create your first document")')
    ).toBeVisible();
  });
});
