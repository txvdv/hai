import { test, expect } from '@playwright/test';

test.describe('composing documents', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('creating the first document', async ({ page }) => {
    await expect(
      page.locator('button:has-text("Create your first document")')
    ).toBeVisible();
    await page.locator('button:has-text("Create your first document")').click();
    await page.waitForURL('**/compose/**');
    const textarea = page.locator('textarea');
    await textarea.fill('This is a new document.');
    await page.waitForTimeout(501);
    await page.goto('/dashboard');
    await expect(page.getByText('This is a new document.')).toBeVisible();
  });

  test('editing the document', async ({ page }) => {
    await expect(
      page.locator('button:has-text("Create your first document")')
    ).toBeVisible();
    await page.locator('button:has-text("Create your first document")').click();
    await page.waitForURL('**/compose/**');
    const textarea = page.locator('textarea');
    await textarea.fill('This is a new document.');
    await page.waitForTimeout(501);
    await page.goto('/dashboard');
    await expect(page.getByText('This is a new document.')).toBeVisible();
    const viewButton = page.getByRole('button', { name: 'view' }).first();
    await viewButton.click();
    await page.waitForURL('**/compose/**');
    await expect(textarea).toHaveValue('This is a new document.');
    await textarea.fill('This is an updated document.');
    await page.waitForTimeout(501);
    await page.goto('/dashboard');
    await expect(page.getByText('This is an updated document.')).toBeVisible();
  });
});
