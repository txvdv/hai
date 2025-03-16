import { test, expect } from '@playwright/test';

test('should show a create document button', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(
    page.locator('button:has-text("Create your first document")')
  ).toBeVisible();
});

test('starting a new document', async ({ page }) => {
  await page.goto('/dashboard');
  const createButton = page.locator(
    'button:has-text("Create your first document")'
  );
  await expect(createButton).toBeVisible();
  await createButton.click();
  await page.waitForURL('**/compose/**');
  await expect(page.locator('textarea')).toBeVisible();
});

test('listing the documents', async ({ page }) => {
  // Given I composed 3 documents
  await page.goto('/dashboard');
  const titles = ['Document 1', 'Document 2', 'Document 3'];
  const createButton = page.locator('button:has-text("Create")');

  for (const title of titles) {
    await expect(createButton).toBeVisible();
    await createButton.click();
    await page.waitForURL('**/compose/**');
    await page.locator('textarea').fill(title);
    await page.waitForTimeout(501);
    await page.getByText('Dashboard').click();
  }

  // Then I should see a list of the composed documents
  for (const title of titles) {
    await expect(page.getByText(title)).toBeVisible();
  }
});
